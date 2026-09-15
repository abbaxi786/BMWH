import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                {
                    message: "The email or password is missing",
                    success: false,
                },
                { status: 400 }
            );
        }

        const pathname = path.join(
            process.cwd(),
            "auth",
            "auth.json"
        );

        const file = fs.readFileSync(pathname, "utf-8");
        const { admin } = JSON.parse(file);

        if (admin.email !== email) {
            return NextResponse.json(
                {
                    message: "Wrong email",
                    success: false,
                },
                { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isValid) {
            return NextResponse.json(
                {
                    message: "Wrong password",
                    success: false,
                },
                { status: 401 }
            );
        }

        // Create JWT containing only email
        const token = jwt.sign(
            {
                email: admin.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        // Create response
        const response = NextResponse.json(
            {
                message: "Login successful",
                success: true,
            },
            { status: 200 }
        );

        // Store JWT in httpOnly cookie
        response.cookies.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
        });

        return response;

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Something went wrong",
                success: false,
            },
            { status: 500 }
        );
    }
}