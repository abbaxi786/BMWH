import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";
import { requireAdmin } from "../../../../lib/auth";


// ============================================================
// GET - Get gallery images for a specific event
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


// ============================================================
// POST - Add a gallery image to an event
// ============================================================

export async function POST(request) {
    try {
        // Only admin can add gallery images
        await requireAdmin(request);

        const formData = await request.formData();

        const event_id = formData.get("event_id");
        const title = formData.get("title");
        const description = formData.get("description");
        const display_order = formData.get("display_order");
        const is_active = formData.get("is_active");
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

        // Upload image to Cloudinary
        const uploaded = await uploadFileToCloudinary(
            image,
            "bmwh/event-gallery"
        );

        const image_url = uploaded.secure_url;

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

        // Convert is_active to boolean
        const active =
            is_active === null
                ? true
                : is_active === "true" ||
                  is_active === "1" ||
                  is_active === "on";

        // Insert gallery image
        const result = await sql`
            INSERT INTO event_gallery (
                event_id,
                image_url,
                title,
                description,
                display_order,
                is_active
            )
            VALUES (
                ${eventId},
                ${image_url},
                ${title || null},
                ${description || null},
                ${order},
                ${active}
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


// ============================================================
// PUT - Update an event gallery image
// ============================================================

export async function PUT(request) {
    try {
        // Only admin can update gallery images
        await requireAdmin(request);

        const formData = await request.formData();

        const id = formData.get("id");
        const event_id = formData.get("event_id");
        const title = formData.get("title");
        const description = formData.get("description");
        const display_order = formData.get("display_order");
        const is_active = formData.get("is_active");
        const image = formData.get("image");

        // Validate gallery ID
        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Gallery image ID is required",
                },
                { status: 400 }
            );
        }

        const galleryId = Number(id);

        if (!Number.isInteger(galleryId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid gallery image ID",
                },
                { status: 400 }
            );
        }

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

        // Check existing gallery image
        const existingResult = await sql`
            SELECT *
            FROM event_gallery
            WHERE id = ${galleryId}
            LIMIT 1
        `;

        if (existingResult.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Gallery image not found",
                },
                { status: 404 }
            );
        }

        const existingGallery = existingResult[0];

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

        // Keep existing image if no replacement is uploaded
        let image_url = existingGallery.image_url;

        // Upload replacement image
        if (
            image &&
            image instanceof File &&
            image.size > 0
        ) {
            const uploaded = await uploadFileToCloudinary(
                image,
                "bmwh/event-gallery"
            );

            image_url = uploaded.secure_url;
        }

        // Convert display_order
        let order = existingGallery.display_order;

        if (display_order !== null) {
            order = parseInt(display_order, 10);

            if (Number.isNaN(order)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "display_order must be a valid number",
                    },
                    { status: 400 }
                );
            }
        }

        // Convert is_active
        let active = existingGallery.is_active;

        if (is_active !== null) {
            active =
                is_active === "true" ||
                is_active === "1" ||
                is_active === "on";
        }

        // Update gallery image
        const result = await sql`
            UPDATE event_gallery
            SET
                event_id = ${eventId},
                image_url = ${image_url},
                title = ${title || null},
                description = ${description || null},
                display_order = ${order},
                is_active = ${active},
                updated_at = NOW()
            WHERE id = ${galleryId}
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Event gallery image updated successfully",
                data: result[0],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating event gallery image:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update event gallery image",
            },
            { status: 500 }
        );
    }
}


// ============================================================
// DELETE - Delete an event gallery image
// ============================================================

export async function DELETE(request) {
    try {
        // Only admin can delete gallery images
        await requireAdmin(request);

        const body = await request.json();

        const id = body?.id;

        // Validate ID
        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Gallery image ID is required",
                },
                { status: 400 }
            );
        }

        const galleryId = Number(id);

        if (!Number.isInteger(galleryId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid gallery image ID",
                },
                { status: 400 }
            );
        }

        // Check gallery image exists
        const existingResult = await sql`
            SELECT id
            FROM event_gallery
            WHERE id = ${galleryId}
            LIMIT 1
        `;

        if (existingResult.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Gallery image not found",
                },
                { status: 404 }
            );
        }

        // Delete gallery image
        const result = await sql`
            DELETE FROM event_gallery
            WHERE id = ${galleryId}
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Event gallery image deleted successfully",
                data: result[0],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting event gallery image:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete event gallery image",
            },
            { status: 500 }
        );
    }
}