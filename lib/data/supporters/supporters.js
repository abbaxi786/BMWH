import { sql } from "@/lib/db.js";

export async function getSupporters() {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                type,
                support_type,
                description,
                logo_url,
                website_url,
                is_active,
                created_at,
                updated_at
            FROM supporters
            ORDER BY id DESC
        `;

        return result;
    } catch (error) {
        console.error("Error fetching supporters:", error);
        throw error;
    }
}

export async function getActiveSupporters() {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                type,
                support_type,
                description,
                logo_url,
                website_url,
                is_active,
                created_at,
                updated_at
            FROM supporters
            WHERE is_active = TRUE
            ORDER BY id DESC
        `;

        return result;
    } catch (error) {
        console.error("Error fetching active supporters:", error);
        throw error;
    }
}

export async function getSupporterById(id) {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                type,
                support_type,
                description,
                logo_url,
                website_url,
                is_active,
                created_at,
                updated_at
            FROM supporters
            WHERE id = ${id}
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error("Error fetching supporter by ID:", error);
        throw error;
    }
}

export async function getActiveSupporterById(id) {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                type,
                support_type,
                description,
                logo_url,
                website_url,
                is_active,
                created_at,
                updated_at
            FROM supporters
            WHERE id = ${id}
              AND is_active = TRUE
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error("Error fetching active supporter by ID:", error);
        throw error;
    }
}