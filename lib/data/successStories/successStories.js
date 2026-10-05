import { sql } from "@/lib/db.js";


// =====================================================
// GET ALL ACTIVE SUCCESS STORIES
// =====================================================

export async function getActiveSuccessStories() {
    try {
        const result = await sql`
            SELECT
                id,
                title,
                summary,
                content,
                image_url,
                patient_name,
                patient_age,
                category,
                story_date,
                is_featured,
                is_active,
                created_at,
                updated_at
            FROM success_stories
            WHERE is_active = TRUE
            ORDER BY
                story_date DESC NULLS LAST,
                id DESC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching active success stories:",
            error
        );

        throw error;
    }
}


// =====================================================
// GET ACTIVE SUCCESS STORY BY ID
// =====================================================

export async function getActiveSuccessStoryById(id) {
    try {
        const result = await sql`
            SELECT
                id,
                title,
                summary,
                content,
                image_url,
                patient_name,
                patient_age,
                category,
                story_date,
                is_featured,
                is_active,
                created_at,
                updated_at
            FROM success_stories
            WHERE id = ${id}
              AND is_active = TRUE
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error(
            "Error fetching active success story by ID:",
            error
        );

        throw error;
    }
}


// =====================================================
// GET TOP 3 ACTIVE FEATURED SUCCESS STORIES
// =====================================================

export async function getFeaturedSuccessStories() {
    try {
        const result = await sql`
            SELECT
                id,
                title,
                summary,
                content,
                image_url,
                patient_name,
                patient_age,
                category,
                story_date,
                is_featured,
                is_active,
                created_at,
                updated_at
            FROM success_stories
            WHERE is_active = TRUE
              AND is_featured = TRUE
            ORDER BY
                story_date DESC NULLS LAST,
                id DESC
            LIMIT 3
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching featured success stories:",
            error
        );

        throw error;
    }
}