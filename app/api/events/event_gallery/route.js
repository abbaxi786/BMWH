import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";

// GET - Get gallery images for a specific event
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
                image_url,
                title,
                description,
                display_order,
                is_active,
                created_at,
                updated_at
            FROM event_gallery
            WHERE event_id = ${event_id}
              AND is_active = TRUE
            ORDER BY display_order ASC, id ASC
        `;

        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching event gallery:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch event gallery",
            },
            { status: 500 }
        );
    }
}


// POST - Add a gallery image to an event
export async function POST(request) {
    try {
        const formData = await request.formData();

        const event_id = formData.get("event_id");
        const title = formData.get("title");
        const description = formData.get("description");
        const display_order = formData.get("display_order");
        const image = formData.get("image");

        // Required field validation
        if (!event_id || !image) {
            return NextResponse.json(
                {
                    success: false,
                    message: "event_id and image are required",
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

        // Validate image
        if (!(image instanceof File) || image.size === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A valid image file is required",
                },
                { status: 400 }
            );
        }

        let image_url;

        // Upload image to Cloudinary
        let uploaded = await uploadFileToCloudinary(
            image,
            "bmwh/event-gallery"
        );

        image_url = uploaded.secure_url;

        // Convert display_order to integer
        const order = display_order
            ? parseInt(display_order, 10)
            : 0;

        if (Number.isNaN(order)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "display_order must be a valid number",
                },
                { status: 400 }
            );
        }

        // Insert gallery image
        const result = await sql`
            INSERT INTO event_gallery (
                event_id,
                image_url,
                title,
                description,
                display_order
            )
            VALUES (
                ${event_id},
                ${image_url},
                ${title || null},
                ${description || null},
                ${order}
            )
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Event gallery image added successfully",
                data: result[0],
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating event gallery image:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create event gallery image",
            },
            { status: 500 }
        );
    }
}