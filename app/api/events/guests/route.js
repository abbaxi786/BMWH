import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";

// GET - Get guests for a specific event
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const event_id = searchParams.get("event_id");

        // Validate event_id
        if (!event_id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "event_id is required",
                },
                { status: 400 }
            );
        }

        const result = await sql`
            SELECT
                id,
                event_id,
                name,
                designation,
                organization,
                photo_url,
                description,
                created_at,
                updated_at
            FROM event_guests
            WHERE event_id = ${event_id}
            ORDER BY id ASC
        `;

        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching event guests:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch event guests",
            },
            { status: 500 }
        );
    }
}


// POST - Create a new event guest
export async function POST(request) {
    try {
        const formData = await request.formData();

        const event_id = formData.get("event_id");
        const name = formData.get("name");
        const designation = formData.get("designation");
        const organization = formData.get("organization");
        const description = formData.get("description");
        const image = formData.get("image");

        // Required field validation
        if (!event_id || !name) {
            return NextResponse.json(
                {
                    success: false,
                    message: "event_id and name are required",
                },
                { status: 400 }
            );
        }

        // Check whether event exists
        const event = await sql`
            SELECT id
            FROM events
            WHERE id = ${event_id}
        `;

        if (event.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event not found",
                },
                { status: 404 }
            );
        }

        // Guest photo URL
        let photo_url = null;

        // Upload guest photo to Cloudinary if provided
        if (
            image &&
            image instanceof File &&
            image.size > 0
        ) {
            const uploaded = await uploadFileToCloudinary(
                image,
                "bmwh/event-guests"
            );

            photo_url = uploaded.secure_url;
        }

        // Insert guest
        const result = await sql`
            INSERT INTO event_guests (
                event_id,
                name,
                designation,
                organization,
                photo_url,
                description
            )
            VALUES (
                ${event_id},
                ${name},
                ${designation || null},
                ${organization || null},
                ${photo_url},
                ${description || null}
            )
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Event guest created successfully",
                data: result[0],
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating event guest:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create event guest",
            },
            { status: 500 }
        );
    }
}