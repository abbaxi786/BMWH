import { sql } from "@/lib/db";

export  async function getAboutOverview() {
    try {
        const result = await sql`
            SELECT
                id,
                eyebrow,
                title,
                highlighted_title AS "highlightedTitle",
                subtitle,
                banner_image AS "bannerImage",
                image_alt AS "imageAlt",
                floating_title AS "floatingTitle",
                floating_subtitle AS "floatingSubtitle",
                contact_url AS "contactUrl",
                departments_url AS "departmentsUrl"
            FROM about_overview
            ORDER BY id ASC
            LIMIT 1
        `;

        return result[0] ?? null;
    } catch (error) {
        console.error("Error fetching About Overview:", error);
        throw error;
    }
}