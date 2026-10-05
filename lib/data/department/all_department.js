import { sql } from "@/lib/db.js";

/**
 * Get all departments
 */
export async function getDepartments() {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                category,
                description,
                slug,
                image_url,
                is_active,
                created_at,
                updated_at
            FROM departments
            ORDER BY
                category ASC,
                name ASC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching departments:",
            error
        );

        throw error;
    }
}


/**
 * Get all active departments
 */
export async function getActiveDepartments() {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                category,
                description,
                slug,
                image_url,
                is_active,
                created_at,
                updated_at
            FROM departments
            WHERE is_active = TRUE
            ORDER BY
                category ASC,
                name ASC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching active departments:",
            error
        );

        throw error;
    }
}


/**
 * Get departments with a limit
 */
export async function getDepartmentsWithLimit(limit) {
    try {
        if (
            !Number.isInteger(limit) ||
            limit <= 0
        ) {
            throw new Error(
                "Limit must be a positive integer"
            );
        }

        const result = await sql`
            SELECT
                id,
                name,
                category,
                description,
                slug,
                image_url,
                is_active,
                created_at,
                updated_at
            FROM departments
            ORDER BY
                category ASC,
                name ASC
            LIMIT ${limit}
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching departments with limit:",
            error
        );

        throw error;
    }
}


/**
 * Get department by ID
 */
export async function getDepartmentById(id) {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                category,
                description,
                slug,
                image_url,
                is_active,
                created_at,
                updated_at
            FROM departments
            WHERE id = ${id}
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error(
            "Error fetching department by ID:",
            error
        );

        throw error;
    }
}


/**
 * Get active department by slug
 */
export async function getDepartmentBySlug(slug) {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                category,
                description,
                slug,
                image_url,
                is_active,
                created_at,
                updated_at
            FROM departments
            WHERE slug = ${slug}
              AND is_active = TRUE
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error(
            "Error fetching department by slug:",
            error
        );

        throw error;
    }
}


/**
 * Get department by slug
 * including doctors and services.
 *
 * Used by:
 * /api/departments/department?slug=...
 */
export async function getDepartmentDetailsBySlug(slug) {
    try {
        const result = await sql`
            SELECT
                d.id AS department_id,
                d.name AS department_name,
                d.category AS department_category,
                d.description AS department_description,
                d.slug AS department_slug,
                d.image_url AS department_image,
                d.is_active AS department_active,

                COALESCE(
                    (
                        SELECT json_agg(
                            jsonb_build_object(
                                'id', doc.id,
                                'name', doc.name,
                                'doctor_type', doc.doctor_type,
                                'designation', doc.designation,
                                'specialty', doc.specialty,
                                'qualifications', doc.qualifications,
                                'biography', doc.biography,
                                'expertise', doc.expertise,
                                'photo_url', doc.photo_url,
                                'profile_link', doc.profile_link,
                                'is_active', doc.is_active
                            )
                            ORDER BY doc.name ASC
                        )
                        FROM doctors doc
                        WHERE doc.department_id = d.id
                          AND doc.is_active = TRUE
                    ),
                    '[]'::json
                ) AS doctors,

                COALESCE(
                    (
                        SELECT json_agg(
                            jsonb_build_object(
                                'id', ds.id,
                                'name', ds.name,
                                'description', ds.description,
                                'image_url', ds.image_url,
                                'is_active', ds.is_active
                            )
                            ORDER BY ds.name ASC
                        )
                        FROM department_services ds
                        WHERE ds.department_id = d.id
                          AND ds.is_active = TRUE
                    ),
                    '[]'::json
                ) AS services

            FROM departments d

            WHERE d.slug = ${slug}
              AND d.is_active = TRUE

            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error(
            "Error fetching department details by slug:",
            error
        );

        throw error;
    }
}


/**
 * Get departments by category
 */
export async function getDepartmentsByCategory(
    category
) {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                category,
                description,
                slug,
                image_url,
                is_active,
                created_at,
                updated_at
            FROM departments
            WHERE category = ${category}
              AND is_active = TRUE
            ORDER BY name ASC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching departments by category:",
            error
        );

        throw error;
    }
}