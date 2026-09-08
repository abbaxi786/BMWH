import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";

// GET - Get top 3 active events
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
            LIMIT 3
        `;

        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching top 3 events:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch events",
            },
            { status: 500 }
        );
    }
}


// POST - Create a new event
export async function POST(request) {
    try {
        const formData = await request.formData();

        const title = formData.get("title");
        const description = formData.get("description");
        const event_date = formData.get("event_date");
        const start_time = formData.get("start_time");
        const end_time = formData.get("end_time");
        const location = formData.get("location");
        const is_featured = formData.get("is_featured");
        const cover_image = formData.get("cover_image");

        // Required field validation
        if (!title || !event_date) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title and event date are required",
                },
                { status: 400 }
            );
        }

        let cover_image_url = null;

        // Upload cover image to Cloudinary
        if (
            cover_image &&
            cover_image instanceof File &&
            cover_image.size > 0
        ) {
            cover_image_url = await uploadFileToCloudinary(
                cover_image,
                "bmwh/events"
            );
        }

        // Convert is_featured string to boolean
        const featured =
            is_featured === "true" ||
            is_featured === "1" ||
            is_featured === "on";

        // Insert event into database
        const result = await sql`
            INSERT INTO events (
                title,
                description,
                event_date,
                start_time,
                end_time,
                location,
                cover_image_url,
                is_featured
            )
            VALUES (
                ${title},
                ${description || null},
                ${event_date},
                ${start_time || null},
                ${end_time || null},
                ${location || null},
                ${cover_image_url ? cover_image_url.secure_url : null},
                ${featured}
            )
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Event created successfully",
                data: result[0],
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating event:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create event",
            },
            { status: 500 }
        );
    }
}