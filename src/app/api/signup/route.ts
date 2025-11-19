import dbConnect from "@/lib/dbConnection";
import bcrypt from "bcryptjs";
import userModel from "@/model/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect()

    try {

        const body = await request.json()

        const { name, email, password } = body

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return NextResponse.json({ message: "User already exists with this email" }, { status:400 })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await userModel.create({
            name,
            email,
            password: hashPassword,
            notes: []
        })

        return NextResponse.json({
            message: "User Created Successfully", user: { name: newUser.name, email: newUser.email, notes: newUser.notes }
        }, { status: 201 })

    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: "Error registering user" },
            { status: 500 }
        )
    }
}