import { sql } from "@/lib/db.js";

/**
 * Get all doctors with department name
 *
 * Used by:
 * - Doctors page
 * - Admin doctors listing
 * - API routes
 */
export async function getDoctors() {
    try {
        const result = await sql`
            SELECT
                doctors.id,
                doctors.department_id,
                doctors.name,
                doctors.doctor_type,
                doctors.designation,
                doctors.specialty,
                doctors.qualifications,
                doctors.biography,
                doctors.expertise,
                doctors.photo_url,
                doctors.profile_link,
                doctors.is_active,
                doctors.created_at,
                doctors.updated_at,
                departments.name AS department_name
            FROM doctors
            INNER JOIN departments
                ON doctors.department_id = departments.id
            ORDER BY
                departments.name ASC,
                doctors.name ASC
        `;

        return result;
    } catch (error) {
        console.error("Error fetching doctors:", error);
        throw error;
    }
}


/**
 * Get only active doctors
 *
 * Used by public-facing Doctors page.
 */
export async function getActiveDoctors() {
    try {
        const result = await sql`
            SELECT
                doctors.id,
                doctors.department_id,
                doctors.name,
                doctors.doctor_type,
                doctors.designation,
                doctors.specialty,
                doctors.qualifications,
                doctors.biography,
                doctors.expertise,
                doctors.photo_url,
                doctors.profile_link,
                doctors.is_active,
                doctors.created_at,
                doctors.updated_at,
                departments.name AS department_name
            FROM doctors
            INNER JOIN departments
                ON doctors.department_id = departments.id
            WHERE doctors.is_active = TRUE
            ORDER BY
                departments.name ASC,
                doctors.name ASC
        `;

        return result;
    } catch (error) {
        console.error("Error fetching active doctors:", error);
        throw error;
    }
}


/**
 * Get a single doctor by ID
 *
 * Used by:
 * - Doctor profile page
 * - API route
 * - Admin
 */
export async function getDoctorById(id) {
    try {
        const result = await sql`
            SELECT
                doctors.id,
                doctors.department_id,
                doctors.name,
                doctors.doctor_type,
                doctors.designation,
                doctors.specialty,
                doctors.qualifications,
                doctors.biography,
                doctors.expertise,
                doctors.photo_url,
                doctors.profile_link,
                doctors.is_active,
                doctors.created_at,
                doctors.updated_at,
                departments.name AS department_name
            FROM doctors
            INNER JOIN departments
                ON doctors.department_id = departments.id
            WHERE doctors.id = ${id}
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error("Error fetching doctor by ID:", error);
        throw error;
    }
}


/**
 * Get a single active doctor by ID
 *
 * Used by:
 * - Public doctor profile page
 */
export async function getActiveDoctorById(id) {
    try {
        const result = await sql`
            SELECT
                doctors.id,
                doctors.department_id,
                doctors.name,
                doctors.doctor_type,
                doctors.designation,
                doctors.specialty,
                doctors.qualifications,
                doctors.biography,
                doctors.expertise,
                doctors.photo_url,
                doctors.profile_link,
                doctors.is_active,
                doctors.created_at,
                doctors.updated_at,
                departments.name AS department_name
            FROM doctors
            INNER JOIN departments
                ON doctors.department_id = departments.id
            WHERE doctors.id = ${id}
              AND doctors.is_active = TRUE
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error("Error fetching active doctor by ID:", error);
        throw error;
    }
}


/**
 * Get doctors belonging to a specific department
 */
export async function getDoctorsByDepartment(departmentId) {
    try {
        const result = await sql`
            SELECT
                doctors.id,
                doctors.department_id,
                doctors.name,
                doctors.doctor_type,
                doctors.designation,
                doctors.specialty,
                doctors.qualifications,
                doctors.biography,
                doctors.expertise,
                doctors.photo_url,
                doctors.profile_link,
                doctors.is_active,
                doctors.created_at,
                doctors.updated_at,
                departments.name AS department_name
            FROM doctors
            INNER JOIN departments
                ON doctors.department_id = departments.id
            WHERE doctors.department_id = ${departmentId}
              AND doctors.is_active = TRUE
            ORDER BY doctors.name ASC
        `;

        return result;
    } catch (error) {
        console.error("Error fetching doctors by department:", error);
        throw error;
    }
}