import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
    try {
        // Get cookies
        const cookieStore = await cookies();

        // Get admin JWT
        const token = cookieStore.get("admin_token")?.value;

        // No token
        if (!token) {
            return NextResponse.json(
                {
                    message: "Not authenticated",
                    success: false,
                },
                { status: 401 }
            );
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Return authenticated admin
        return NextResponse.json(
            {
                message: "Authenticated",
                success: true,
                admin: {
                    email: decoded.email,
                    username: decoded.username
                },
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Invalid or expired token",
                success: false,
            },
            { status: 401 }
        );
    }
}