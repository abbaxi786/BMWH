import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET - Get single event by ID
export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const eventId = Number(id);

        // Validate ID
        if (!id || Number.isNaN(eventId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid event ID",
                },
                { status: 400 }
            );
        }

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
            WHERE id = ${eventId}
              AND is_active = TRUE
            LIMIT 1
        `;

        // Event not found
        if (result.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: result[0],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching event:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch event",
            },
            { status: 500 }
        );
    }
}