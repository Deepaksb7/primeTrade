import dbConnect from "@/lib/dbConnection";
import userModel from "@/model/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(){
    const session =await getServerSession(authOptions)

    if(!session){
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect()

    const user = await userModel.findOne({email: session.user?.email })

    return NextResponse.json({
        name: user?.name,
        email:user?.email,
    })

}