import dbConnect from "@/lib/dbConnection";
import userModel from "@/model/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";

export async function PUT(req:Request){
    const session = await getServerSession(options)
    
    if (!session){
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    await dbConnect()

    const { name } = await req.json()
    
    const updatedUser = await userModel.findOneAndUpdate(
        {email:session.user?.email},
        {name},
        {new:true}
    )

    return NextResponse.json(
        { message: "User updated", user: updatedUser },
        { status: 200 }            
    );
}