import dbConnect from "@/lib/dbConnection";
import userModel from "@/model/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import noteModel from "@/model/notes";

export async function GET(req:Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await userModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const url = new URL(req.url)
    const search = url.searchParams.get("search") || "";

    const query: any ={owner:user._id}

    if(search){
        query.title = {$regex:search,$options:"i"}
    }

    const notes = await noteModel.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ notes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(req:Request){
    await dbConnect();
    try{
        const session = await getServerSession(authOptions);
        if(!session || !session.user){
            return NextResponse.json({error:"Unauthorized"},{status:401})
        }

        const user = await userModel.findOne({email:session.user.email})
        if(!user){
            return NextResponse.json({error:"User not found"},{status:404})
        }

        const {title,content} = await req.json()

        const note = await noteModel.create({
            title: title,
            content: content,
            owner: user._id,
        })

        return NextResponse.json({note},{status:201})
    } catch (error) {
        console.error("Error creating note:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}