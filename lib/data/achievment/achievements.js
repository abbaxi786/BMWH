import { sql } from "@/lib/db.js";


export async function getAchievements() {
    try {
        const result = await sql`
        SELECT
        id,
                title,
                type,
                description,
                image_url,
                award_date,
                issuing_organization,
                website_url,
                is_active,
                created_at,
                updated_at
                FROM achievements_awards
                WHERE is_active = TRUE
                ORDER BY award_date DESC NULLS LAST, id DESC
                LIMIT 3
                `;

        return result;
    } catch (error) {
        console.error("Error fetching achievements:", error);
        throw error;
    }
}

export async function GetTopThree() {
    try {
        const result = await sql`
            SELECT
                id,
                title,
                type,
                description,
                image_url,
                award_date,
                issuing_organization,
                website_url,
                is_active,
                created_at,
                updated_at
            FROM achievements_awards
            WHERE is_active = TRUE
            ORDER BY award_date DESC NULLS LAST, id DESC
            LIMIT 3
        `;
        return result;

    } catch (error) {
        console.error("Error fetching top three achievements:", error);
        throw error;
    }
}

export async function getAchievementById(id) {
    try {
        const result = await sql`
            SELECT
                id,
                title,
                type,
                description,
                image_url,
                award_date,
                issuing_organization,
                website_url,
                is_active,
                created_at,
                updated_at
            FROM achievements_awards
            WHERE id = ${id}
            LIMIT 1
        `;
        return result[0] || null;
    } catch (error) {
        console.error("Error fetching achievement by ID:", error);
        throw error;
    }
}