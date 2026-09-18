import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";
import { requireAdmin } from "../../../../lib/auth";


// ============================================================
// GET - Get guests for a specific event
// ============================================================

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


// ============================================================
// POST - Create a new event guest
// ============================================================

export async function POST(request) {
    try {
        // Only admin can create guests
        await requireAdmin(request);

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

        // Validate event ID
        const eventId = Number(event_id);

        if (!Number.isInteger(eventId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid event_id",
                },
                { status: 400 }
            );
        }

        // Check whether event exists
        const event = await sql`
            SELECT id
            FROM events
            WHERE id = ${eventId}
            LIMIT 1
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

        // Upload guest photo if provided
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
                ${eventId},
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


// ============================================================
// PUT - Update an event guest
// ============================================================

export async function PUT(request) {
    try {
        // Only admin can update guests
        await requireAdmin(request);

        const formData = await request.formData();

        const id = formData.get("id");
        const event_id = formData.get("event_id");
        const name = formData.get("name");
        const designation = formData.get("designation");
        const organization = formData.get("organization");
        const description = formData.get("description");
        const image = formData.get("image");

        // Validate guest ID
        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Guest ID is required",
                },
                { status: 400 }
            );
        }

        const guestId = Number(id);

        if (!Number.isInteger(guestId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid guest ID",
                },
                { status: 400 }
            );
        }

        // Required fields
        if (!event_id || !name) {
            return NextResponse.json(
                {
                    success: false,
                    message: "event_id and name are required",
                },
                { status: 400 }
            );
        }

        const eventId = Number(event_id);

        if (!Number.isInteger(eventId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid event_id",
                },
                { status: 400 }
            );
        }

        // Check existing guest
        const existingGuest = await sql`
            SELECT *
            FROM event_guests
            WHERE id = ${guestId}
            LIMIT 1
        `;

        if (existingGuest.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event guest not found",
                },
                { status: 404 }
            );
        }

        // Check event exists
        const event = await sql`
            SELECT id
            FROM events
            WHERE id = ${eventId}
            LIMIT 1
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

        const existing = existingGuest[0];

        // Keep old photo if no new image is provided
        let photo_url = existing.photo_url;

        // Upload new photo if provided
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

        // Update guest
        const result = await sql`
            UPDATE event_guests
            SET
                event_id = ${eventId},
                name = ${name},
                designation = ${designation || null},
                organization = ${organization || null},
                photo_url = ${photo_url},
                description = ${description || null},
                updated_at = NOW()
            WHERE id = ${guestId}
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Event guest updated successfully",
                data: result[0],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating event guest:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update event guest",
            },
            { status: 500 }
        );
    }
}


// ============================================================
// DELETE - Delete an event guest
// ============================================================

export async function DELETE(request) {
    try {
        // Only admin can delete guests
        await requireAdmin(request);

        const body = await request.json();

        const id = body?.id;

        // Validate ID
        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Guest ID is required",
                },
                { status: 400 }
            );
        }

        const guestId = Number(id);

        if (!Number.isInteger(guestId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid guest ID",
                },
                { status: 400 }
            );
        }

        // Check guest exists
        const existingGuest = await sql`
            SELECT id
            FROM event_guests
            WHERE id = ${guestId}
            LIMIT 1
        `;

        if (existingGuest.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event guest not found",
                },
                { status: 404 }
            );
        }

        // Delete guest
        const result = await sql`
            DELETE FROM event_guests
            WHERE id = ${guestId}
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Event guest deleted successfully",
                data: result[0],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting event guest:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete event guest",
            },
            { status: 500 }
        );
    }
}