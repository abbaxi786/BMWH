import { sql } from "@/lib/db.js";

export async function getHospitalFacilities() {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                category,
                description,
                image_url,
                is_active,
                created_at,
                updated_at
            FROM hospital_facilities
            ORDER BY id ASC
        `;

        return result;
    } catch (error) {
        console.error("Error fetching hospital facilities:", error);
        throw error;
    }
}

export async function getActiveHospitalFacilities() {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                category,
                description,
                image_url,
                is_active,
                created_at,
                updated_at
            FROM hospital_facilities
            WHERE is_active = TRUE
            ORDER BY id ASC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching active hospital facilities:",
            error
        );
        throw error;
    }
}

export async function getHospitalFacilityById(id) {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                category,
                description,
                image_url,
                is_active,
                created_at,
                updated_at
            FROM hospital_facilities
            WHERE id = ${id}
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error(
            "Error fetching hospital facility by ID:",
            error
        );
        throw error;
    }
}


export async function getTopHospitalFacilities() {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                category,
                description,
                image_url,
                is_active,
                created_at,
                updated_at
            FROM hospital_facilities
            WHERE is_active = TRUE
            ORDER BY id ASC
            LIMIT 3
        `;

        return result;
    } catch (error) {
        console.error("Error fetching top hospital facilities:", error);
        throw error;
    }
}

export async function getActiveHospitalFacilityById(id) {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                category,
                description,
                image_url,
                is_active,
                created_at,
                updated_at
            FROM hospital_facilities
            WHERE id = ${id}
              AND is_active = TRUE
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error(
            "Error fetching active hospital facility by ID:",
            error
        );
        throw error;
    }
}

