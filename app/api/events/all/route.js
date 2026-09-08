import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET - Get all active events
export async function GET() {
    try {
        const result = await sql`
            SELECT
                id,
                title,
                description,
                event_date,
                start_time,
                end_time,
                location,
                cover_image_url,
                is_featured,
                is_active,
                created_at,
                updated_at
            FROM events
            WHERE is_active = TRUE
            ORDER BY
                event_date DESC NULLS LAST,
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
        console.error("Error fetching all events:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch events",
            },
            { status: 500 }
        );
    }
}