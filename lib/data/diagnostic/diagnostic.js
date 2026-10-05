import { sql } from "@/lib/db.js";



/**
 * Get all diagnostic services
 */
export async function getDiagnosticServices() {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                category,
                image_url,
                description,
                is_active
            FROM diagnostic_services
            ORDER BY
                category ASC,
                name ASC
        `;

        return result;
    } catch (error) {
        console.error("Error fetching diagnostic services:", error);
        throw error;
    }
}

/**
 * Get all active diagnostic services
 */
export async function getActiveDiagnosticServices() {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                category,
                image_url,
                description,
                is_active
            FROM diagnostic_services
            WHERE is_active = TRUE
            ORDER BY
                category ASC,
                name ASC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching active diagnostic services:",
            error
        );
        throw error;
    }
}

/**
 * Get diagnostic service by ID
 */
export async function getDiagnosticServiceById(id) {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                category,
                image_url,
                description,
                is_active
            FROM diagnostic_services
            WHERE id = ${id}
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error(
            "Error fetching diagnostic service by ID:",
            error
        );
        throw error;
    }
}

/**
 * Get active diagnostic service by ID
 */
export async function getActiveDiagnosticServiceById(id) {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                category,
                image_url,
                description,
                is_active
            FROM diagnostic_services
            WHERE id = ${id}
              AND is_active = TRUE
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error(
            "Error fetching active diagnostic service by ID:",
            error
        );
        throw error;
    }
}

/**
 * Get diagnostic services by category
 */
export async function getDiagnosticServicesByCategory(category) {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                category,
                image_url,
                description,
                is_active
            FROM diagnostic_services
            WHERE category = ${category}
              AND is_active = TRUE
            ORDER BY name ASC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching diagnostic services by category:",
            error
        );
        throw error;
    }
}

/**
 * Get diagnostic services by category including inactive services.
 * Useful for admin pages.
 */
export async function getAllDiagnosticServicesByCategory(category) {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                category,
                image_url,
                description,
                is_active
            FROM diagnostic_services
            WHERE category = ${category}
            ORDER BY name ASC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching all diagnostic services by category:",
            error
        );
        throw error;
    }
}