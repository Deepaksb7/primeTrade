import dbConnect from "@/lib/dbConnection";
import userModel from "@/model/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await userModel.findOne({ email: session.user.email }).populate("notes");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ notes: user.notes }, { status: 200 });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}