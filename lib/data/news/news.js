import { sql } from "@/lib/db.js";

/**
 * Get all published news and updates
 */
export async function getNews() {
    try {
        const result = await sql`
            SELECT
                id,
                title,
                slug,
                excerpt,
                content,
                image_url,
                category,
                author_name,
                is_featured,
                is_published,
                published_at,
                meta_title,
                meta_description,
                created_at,
                updated_at
            FROM news_updates
            WHERE is_published = TRUE
            ORDER BY
                published_at DESC NULLS LAST,
                created_at DESC
        `;

        return result;
    } catch (error) {
        console.error("Error fetching news:", error);
        throw error;
    }
}


/**
 * Get a single news article by ID
 */
export async function getNewsById(id) {
    try {
        const result = await sql`
            SELECT
                id,
                title,
                slug,
                excerpt,
                content,
                image_url,
                category,
                author_name,
                is_featured,
                is_published,
                published_at,
                meta_title,
                meta_description,
                created_at,
                updated_at
            FROM news_updates
            WHERE id = ${id}
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error(
            "Error fetching news by ID:",
            error
        );

        throw error;
    }
}


/**
 * Get a single published news article by slug
 */
export async function getNewsBySlug(slug) {
    try {
        const result = await sql`
            SELECT
                id,
                title,
                slug,
                excerpt,
                content,
                image_url,
                category,
                author_name,
                is_featured,
                is_published,
                published_at,
                meta_title,
                meta_description,
                created_at,
                updated_at
            FROM news_updates
            WHERE slug = ${slug}
            AND is_published = TRUE
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error(
            "Error fetching news by slug:",
            error
        );

        throw error;
    }
}


/**
 * Get news by category
 */
export async function getNewsByCategory(category) {
    try {
        const result = await sql`
            SELECT
                id,
                title,
                slug,
                excerpt,
                content,
                image_url,
                category,
                author_name,
                is_featured,
                is_published,
                published_at,
                meta_title,
                meta_description,
                created_at,
                updated_at
            FROM news_updates
            WHERE category = ${category}
            AND is_published = TRUE
            ORDER BY
                published_at DESC NULLS LAST,
                created_at DESC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching news by category:",
            error
        );

        throw error;
    }
}


/**
 * Get featured news
 */
export async function getFeaturedNews() {
    try {
        const result = await sql`
            SELECT
                id,
                title,
                slug,
                excerpt,
                content,
                image_url,
                category,
                author_name,
                is_featured,
                is_published,
                published_at,
                meta_title,
                meta_description,
                created_at,
                updated_at
            FROM news_updates
            WHERE is_featured = TRUE
            AND is_published = TRUE
            ORDER BY
                published_at DESC NULLS LAST,
                created_at DESC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching featured news:",
            error
        );

        throw error;
    }
}

/**
 * Get top 3 published news updates
 */
export async function getTopThreeNews() {
    try {
        const result = await sql`
            SELECT
                id,
                title,
                slug,
                excerpt,
                content,
                image_url,
                category,
                published_at,
                is_featured,
                is_published,
                created_at,
                updated_at
            FROM news_updates
            WHERE is_published = TRUE
            ORDER BY
                published_at DESC NULLS LAST,
                created_at DESC
            LIMIT 3
        `;

        return result;
    } catch (error) {
        console.error("Error fetching top three news:", error);
        throw error;
    }
}