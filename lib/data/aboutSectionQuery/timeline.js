
import { sql } from "@/lib/db";

// Get timeline records
export async function getTimelineHistory(activeOnly = false) {
    if (activeOnly) {
        return await sql`
            SELECT id, year, title, description, sort_order, is_active,
                   created_at, updated_at
            FROM timeline_history
            WHERE is_active = TRUE
            ORDER BY sort_order ASC, id ASC
        `;
    }

    return await sql`
        SELECT id, year, title, description, sort_order, is_active,
               created_at, updated_at
        FROM timeline_history
        ORDER BY sort_order ASC, id ASC
    `;
}

// Get one timeline record
export async function getTimelineHistoryById(id) {
    const result = await sql`
        SELECT id, year, title, description, sort_order, is_active,
               created_at, updated_at
        FROM timeline_history
        WHERE id = ${id}
        LIMIT 1
    `;

    return result[0] ?? null;
}

// Add timeline record
export async function createTimelineHistory(data) {
    const result = await sql`
        INSERT INTO timeline_history (
            year,
            title,
            description,
            sort_order,
            is_active
        )
        VALUES (
            ${data.year},
            ${data.title},
            ${data.description},
            ${data.sort_order},
            ${data.is_active}
        )
        RETURNING *
    `;

    return result[0];
}

// Update timeline record
export async function updateTimelineHistory(id, data) {
    const result = await sql`
        UPDATE timeline_history
        SET
            year = ${data.year},
            title = ${data.title},
            description = ${data.description},
            sort_order = ${data.sort_order},
            is_active = ${data.is_active},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
    `;

    return result[0] ?? null;
}

// Delete timeline record
export async function deleteTimelineHistory(id) {
    const result = await sql`
        DELETE FROM timeline_history
        WHERE id = ${id}
        RETURNING id
    `;

    return result[0] ?? null;
}
