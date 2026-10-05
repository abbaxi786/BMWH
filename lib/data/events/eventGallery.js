import { sql } from "@/lib/db.js";

// =====================================================
// GET ALL EVENT GALLERY ITEMS
// =====================================================

export async function getEventGallery() {
    try {
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
            ORDER BY
                display_order ASC,
                id ASC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching event gallery:",
            error
        );

        throw error;
    }
}

// =====================================================
// GET ACTIVE EVENT GALLERY BY EVENT ID
// =====================================================

export async function getActiveEventGalleryByEventId(
    eventId
) {
    try {
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
            WHERE event_id = ${eventId}
              AND is_active = TRUE
            ORDER BY
                display_order ASC,
                id ASC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching active event gallery:",
            error
        );

        throw error;
    }
}

// =====================================================
// GET EVENT GALLERY ITEM BY ID
// =====================================================

export async function getEventGalleryById(id) {
    try {
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
            WHERE id = ${id}
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error(
            "Error fetching event gallery item by ID:",
            error
        );

        throw error;
    }
}