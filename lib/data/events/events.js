import { sql } from "@/lib/db.js";

// =====================================================
// GET TOP 3 ACTIVE EVENTS
// =====================================================

export async function getTopThreeActiveEvents() {
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

        return result;
    } catch (error) {
        console.error(
            "Error fetching top 3 active events:",
            error
        );

        throw error;
    }
}

export async function getEvents() {
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
            ORDER BY
                event_date DESC NULLS LAST,
                id DESC
        `;

        return result;
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
}

export async function getActiveEvents() {
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
        `;

        return result;
    } catch (error) {
        console.error("Error fetching active events:", error);
        throw error;
    }
}

export async function getEventById(id) {
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
            WHERE id = ${id}
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error("Error fetching event by ID:", error);
        throw error;
    }
}

export async function getActiveEventById(id) {
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
            WHERE id = ${id}
              AND is_active = TRUE
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error("Error fetching active event by ID:", error);
        throw error;
    }
}