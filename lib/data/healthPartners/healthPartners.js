import { sql } from "@/lib/db.js";

// =====================================================
// GET ALL HEALTH PARTNERS
// =====================================================

export async function getHealthPartners() {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                type,
                partnership_type,
                description,
                logo_url,
                website_url,
                is_active,
                created_at,
                updated_at
            FROM health_partners
            ORDER BY id DESC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching health partners:",
            error
        );

        throw error;
    }
}

// =====================================================
// GET ALL ACTIVE HEALTH PARTNERS
// =====================================================

export async function getActiveHealthPartners() {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                type,
                partnership_type,
                description,
                logo_url,
                website_url,
                is_active,
                created_at,
                updated_at
            FROM health_partners
            WHERE is_active = TRUE
            ORDER BY id DESC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching active health partners:",
            error
        );

        throw error;
    }
}

// =====================================================
// GET HEALTH PARTNER BY ID
// =====================================================

export async function getHealthPartnerById(id) {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                type,
                partnership_type,
                description,
                logo_url,
                website_url,
                is_active,
                created_at,
                updated_at
            FROM health_partners
            WHERE id = ${id}
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error(
            "Error fetching health partner by ID:",
            error
        );

        throw error;
    }
}

// =====================================================
// GET ACTIVE HEALTH PARTNER BY ID
// =====================================================

export async function getActiveHealthPartnerById(id) {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                type,
                partnership_type,
                description,
                logo_url,
                website_url,
                is_active,
                created_at,
                updated_at
            FROM health_partners
            WHERE id = ${id}
              AND is_active = TRUE
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error(
            "Error fetching active health partner by ID:",
            error
        );

        throw error;
    }
}