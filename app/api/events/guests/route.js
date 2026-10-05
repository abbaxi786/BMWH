import { NextResponse } from "next/server";
import { sql } from "@/lib/db.js";
import { requireAdmin } from "@/lib/auth";
import {
    getEventGuests,
} from "@/lib/data/events/eventGuests";

import {
    uploadFileToCloudinary,
} from "@/lib/uploadToCloudinary";

// =====================================================
// GET ALL EVENT GUESTS
// =====================================================

export async function GET() {
    try {
        const guests = await getEventGuests();

        return NextResponse.json({
            success: true,
            data: guests,
        });
    } catch (error) {
        console.error(
            "Error fetching event guests:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch event guests",
            },
            {
                status: 500,
            }
        );
    }
}

// =====================================================
// POST CREATE EVENT GUEST
// =====================================================

export async function POST(request) {
    try {
        await requireAdmin();

        const formData = await request.formData();

        const event_id = formData.get("event_id");
        const name = formData.get("name");
        const designation = formData.get("designation");
        const organization = formData.get("organization");
        const description = formData.get("description");
        const photo = formData.get("photo");

        if (!event_id || !name) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Event ID and guest name are required",
                },
                {
                    status: 400,
                }
            );
        }

        // Check event exists
        const event = await sql`
            SELECT id
            FROM events
            WHERE id = ${event_id}
            LIMIT 1
        `;

        if (event.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event not found",
                },
                {
                    status: 404,
                }
            );
        }

        let photo_url = null;

        if (
            photo &&
            photo instanceof File &&
            photo.size > 0
        ) {
            const uploaded =
                await uploadFileToCloudinary(
                    photo,
                    "bmwh/event-guests"
                );

            photo_url = uploaded.secure_url;
        }

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
            RETURNING
                id,
                event_id,
                name,
                designation,
                organization,
                photo_url,
                description,
                created_at,
                updated_at
        `;

        return NextResponse.json(
            {
                success: true,
                data: result[0],
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(
            "Error creating event guest:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create event guest",
            },
            {
                status: 500,
            }
        );
    }
}