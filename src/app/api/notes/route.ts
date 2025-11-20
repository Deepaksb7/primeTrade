import dbConnect from "@/lib/dbConnection";
import userModel from "@/model/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../auth/[...nextauth]/options";
import noteModel from "@/model/notes";
import { FilterQuery, SortOrder } from "mongoose";

export interface Note {
  _id?: string;
  title: string;
  content: string;
  createdAt?: string;
}


export async function GET(req: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(options);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await userModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const url = new URL(req.url, `http://${req.headers.get("host")}`)

    const search = url.searchParams.get("search") || "";
    const sort = url.searchParams.get("sort") || "newest";
      
    const query: FilterQuery<Note> = { owner: user._id };
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    
     
    const sortOrder: { [key in keyof Note]?: SortOrder } = {};
    if (sort === "newest") sortOrder.createdAt = -1;
    if (sort === "oldest") sortOrder.createdAt = 1;
    if (sort === "a-z") sortOrder.title = 1;
    if (sort === "z-a") sortOrder.title = -1;

    const notes = await noteModel.find(query).sort(sortOrder);

    return NextResponse.json({ notes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(options);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await userModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { title, content } = await req.json();

    const note = await noteModel.create({
      title: title,
      content: content,
      owner: user._id,
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
