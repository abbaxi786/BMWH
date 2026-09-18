import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";
import { requireAdmin } from "../../../lib/auth";

// ============================================================
// GET - Get top 3 active events
// ============================================================

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


// ============================================================
// POST - Create a new event
// ============================================================

export async function POST(request) {
    try {
        // Protect admin creation
        await requireAdmin(request);

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

        // Convert is_featured to boolean
        const featured =
            is_featured === "true" ||
            is_featured === "1" ||
            is_featured === "on";

        // Insert event
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
                ${cover_image_url
                    ? cover_image_url.secure_url
                    : null},
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


// ============================================================
// PUT - Update an event
// ============================================================

export async function PUT(request) {
    try {
        // Protect admin update
        await requireAdmin(request);

        const formData = await request.formData();

        const id = formData.get("id");

        const title = formData.get("title");
        const description = formData.get("description");
        const event_date = formData.get("event_date");
        const start_time = formData.get("start_time");
        const end_time = formData.get("end_time");
        const location = formData.get("location");
        const is_featured = formData.get("is_featured");
        const is_active = formData.get("is_active");
        const cover_image = formData.get("cover_image");

        // Validate ID
        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event ID is required",
                },
                { status: 400 }
            );
        }

        // Validate numeric ID
        const eventId = Number(id);

        if (!Number.isInteger(eventId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid event ID",
                },
                { status: 400 }
            );
        }

        // Required fields
        if (!title || !event_date) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title and event date are required",
                },
                { status: 400 }
            );
        }

        // Get existing event
        const existingResult = await sql`
            SELECT *
            FROM events
            WHERE id = ${eventId}
            LIMIT 1
        `;

        if (existingResult.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event not found",
                },
                { status: 404 }
            );
        }

        const existingEvent = existingResult[0];

        // Keep existing image if no new image is uploaded
        let cover_image_url = existingEvent.cover_image_url;

        // Upload replacement image if provided
        if (
            cover_image &&
            cover_image instanceof File &&
            cover_image.size > 0
        ) {
            const uploadedImage = await uploadFileToCloudinary(
                cover_image,
                "bmwh/events"
            );

            cover_image_url = uploadedImage.secure_url;
        }

        // Convert is_featured
        let featured = existingEvent.is_featured;

        if (is_featured !== null) {
            featured =
                is_featured === "true" ||
                is_featured === "1" ||
                is_featured === "on";
        }

        // Convert is_active
        let active = existingEvent.is_active;

        if (is_active !== null) {
            active =
                is_active === "true" ||
                is_active === "1" ||
                is_active === "on";
        }

        // Update event
        const result = await sql`
            UPDATE events
            SET
                title = ${title},
                description = ${description || null},
                event_date = ${event_date},
                start_time = ${start_time || null},
                end_time = ${end_time || null},
                location = ${location || null},
                cover_image_url = ${cover_image_url},
                is_featured = ${featured},
                is_active = ${active},
                updated_at = NOW()
            WHERE id = ${eventId}
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Event updated successfully",
                data: result[0],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating event:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update event",
            },
            { status: 500 }
        );
    }
}


// ============================================================
// DELETE - Delete an event
// ============================================================

export async function DELETE(request) {
    try {
        // Protect admin deletion
        await requireAdmin(request);

        const body = await request.json();

        const id = body?.id;

        // Validate ID
        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event ID is required",
                },
                { status: 400 }
            );
        }

        const eventId = Number(id);

        if (!Number.isInteger(eventId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid event ID",
                },
                { status: 400 }
            );
        }

        // Check if event exists
        const existingResult = await sql`
            SELECT id
            FROM events
            WHERE id = ${eventId}
            LIMIT 1
        `;

        if (existingResult.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event not found",
                },
                { status: 404 }
            );
        }

        // Delete event
        const result = await sql`
            DELETE FROM events
            WHERE id = ${eventId}
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Event deleted successfully",
                data: result[0],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting event:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete event",
            },
            { status: 500 }
        );
    }
}