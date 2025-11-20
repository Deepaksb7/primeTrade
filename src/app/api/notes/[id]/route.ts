
import dbConnect from "@/lib/dbConnection";
import userModel from "@/model/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import noteModel from "@/model/notes";
import { options } from "../../auth/[...nextauth]/options";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const { id } = await params;
    try {
        const session = await getServerSession(options);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await userModel.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const { title, content } = await req.json()

        const updatedNote = await noteModel.findOneAndUpdate(
            { _id: id, owner: user._id },
            { title, content },
            { new: true }
        );

        if (!updatedNote) {
            return NextResponse.json({ error: "Note not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ updatedNote }, { status: 200 })
    } catch (error) {
        console.error("Error updating note:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const { id } = await params;
    try {
        const session = await getServerSession(options);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await userModel.findOne({ email: session.user.email })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const deletedNote = await noteModel.findOneAndDelete({
            _id: id,
            owner: user._id
        })

        if (!deletedNote) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 })
        }

        return NextResponse.json({ deletedNote }, { status: 200 })
    } catch (error) {
        console.error("Error deleting note:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}