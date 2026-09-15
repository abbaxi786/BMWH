import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json(
            {
                message: "Logout successful",
                success: true,
            },
            { status: 200 }
        );

        response.cookies.set("admin_token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        return response;

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Logout failed",
                success: false,
            },
            { status: 500 }
        );
    }
}