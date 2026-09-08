import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
    try {
        const result = await sql`
            SELECT
                id,
                title,
                summary,
                content,
                image_url,
                patient_name,
                patient_age,
                category,
                story_date,
                is_featured,
                is_active,
                created_at,
                updated_at
            FROM success_stories
            WHERE is_active = TRUE
            ORDER BY
                story_date DESC NULLS LAST,
                id DESC
        `;

        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching all success stories:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch success stories",
            },
            { status: 500 }
        );
    }
}