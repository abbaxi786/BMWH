import { unstable_cache } from "next/cache";
import { sql } from "@/lib/db";

const SIX_HOURS = 60 * 60 * 6;

// 1. Impact Statistics
export const getImpactStats = unstable_cache(
    async () => {
        return await sql`
            SELECT
                id,
                target,
                suffix,
                title,
                description,
                display_order,
                is_active
            FROM impact_stats
            WHERE is_active = TRUE
            ORDER BY display_order ASC
        `;
    },
    ["impact-stats"],
    {
        revalidate: SIX_HOURS,
        tags: ["impact-stats"],
    }
);

// 2. Hero Section
export const getHeroSection = unstable_cache(
    async () => {
        const result = await sql`
            SELECT
                id,
                badge_text,
                heading,
                description,
                button_text,
                button_url
            FROM hero_section_content
            WHERE is_active = TRUE
            ORDER BY id DESC
            LIMIT 1
        `;

        return result[0] || null;
    },
    ["hero-section"],
    {
        revalidate: SIX_HOURS,
        tags: ["hero-section"],
    }
);

// 3. Banner Images
export const getBannerImages = unstable_cache(
    async () => {
        return await sql`
            SELECT id, alt, src
            FROM bannerImages
            ORDER BY id ASC
        `;
    },
    ["banner-images"],
    {
        revalidate: SIX_HOURS,
        tags: ["banner-images"],
    }
);