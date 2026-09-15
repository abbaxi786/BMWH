import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
    try {
        const result = await sql`
            SELECT id, name
            FROM departments
            ORDER BY name ASC
        `;

        return NextResponse.json(
            {
                success: true,
                data: result,
                message: "Departments fetched successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Failed to fetch departments:", error);

        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Failed to fetch departments",
            },
            {
                status: 500,
            }
        );
    }
}