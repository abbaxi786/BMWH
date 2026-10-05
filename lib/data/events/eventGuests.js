import { sql } from "@/lib/db.js";

// =====================================================
// GET ALL EVENT GUESTS
// =====================================================

export async function getEventGuests() {
    try {
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
            ORDER BY id ASC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching event guests:",
            error
        );

        throw error;
    }
}

// =====================================================
// GET EVENT GUESTS BY EVENT ID
// =====================================================

export async function getEventGuestsByEventId(eventId) {
    try {
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
            WHERE event_id = ${eventId}
            ORDER BY id ASC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching event guests by event ID:",
            error
        );

        throw error;
    }
}

// =====================================================
// GET EVENT GUEST BY ID
// =====================================================

export async function getEventGuestById(id) {
    try {
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
            WHERE id = ${id}
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error(
            "Error fetching event guest by ID:",
            error
        );

        throw error;
    }
}