import { sql } from "@/lib/db.js";


// =====================================================
// Get all lab tests
// Includes active and inactive tests
// =====================================================

export async function getLabTests() {
    try {
        const result = await sql`
            SELECT
                id,
                test_name,
                category,
                reporting_time,
                specimen_source,
                processing,
                is_active,
                created_at,
                updated_at
            FROM lab_tests
            ORDER BY test_name ASC
        `;

        return result;
    } catch (error) {
        console.error("Error fetching lab tests:", error);
        throw error;
    }
}


// =====================================================
// Get active lab tests
// Public website
// =====================================================

export async function getActiveLabTests() {
    try {
        const result = await sql`
            SELECT
                id,
                test_name,
                category,
                reporting_time,
                specimen_source,
                processing,
                is_active,
                created_at,
                updated_at
            FROM lab_tests
            WHERE is_active = TRUE
            ORDER BY test_name ASC
        `;

        return result;
    } catch (error) {
        console.error("Error fetching active lab tests:", error);
        throw error;
    }
}


// =====================================================
// Get lab tests by category
// Includes active and inactive tests
// =====================================================

export async function getLabTestsByCategory(category) {
    try {
        const result = await sql`
            SELECT
                id,
                test_name,
                category,
                reporting_time,
                specimen_source,
                processing,
                is_active,
                created_at,
                updated_at
            FROM lab_tests
            WHERE category = ${category}
            ORDER BY test_name ASC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching lab tests by category:",
            error
        );

        throw error;
    }
}


// =====================================================
// Get active lab tests by category
// Public website
// =====================================================

export async function getActiveLabTestsByCategory(category) {
    try {
        const result = await sql`
            SELECT
                id,
                test_name,
                category,
                reporting_time,
                specimen_source,
                processing,
                is_active,
                created_at,
                updated_at
            FROM lab_tests
            WHERE is_active = TRUE
              AND category = ${category}
            ORDER BY test_name ASC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error fetching active lab tests by category:",
            error
        );

        throw error;
    }
}


// =====================================================
// Search lab tests
// Includes active and inactive tests
// =====================================================

export async function searchLabTests(search) {
    try {
        const result = await sql`
            SELECT
                id,
                test_name,
                category,
                reporting_time,
                specimen_source,
                processing,
                is_active,
                created_at,
                updated_at
            FROM lab_tests
            WHERE
                test_name ILIKE ${"%" + search + "%"}
                OR category ILIKE ${"%" + search + "%"}
                OR specimen_source ILIKE ${"%" + search + "%"}
                OR processing ILIKE ${"%" + search + "%"}
            ORDER BY test_name ASC
        `;

        return result;
    } catch (error) {
        console.error("Error searching lab tests:", error);
        throw error;
    }
}


// =====================================================
// Search active lab tests
// Public website
// =====================================================

export async function searchActiveLabTests(search) {
    try {
        const result = await sql`
            SELECT
                id,
                test_name,
                category,
                reporting_time,
                specimen_source,
                processing,
                is_active,
                created_at,
                updated_at
            FROM lab_tests
            WHERE is_active = TRUE
              AND (
                    test_name ILIKE ${"%" + search + "%"}
                    OR category ILIKE ${"%" + search + "%"}
                    OR specimen_source ILIKE ${"%" + search + "%"}
                    OR processing ILIKE ${"%" + search + "%"}
              )
            ORDER BY test_name ASC
        `;

        return result;
    } catch (error) {
        console.error(
            "Error searching active lab tests:",
            error
        );

        throw error;
    }
}


// =====================================================
// Get lab test by ID
// Includes active and inactive
// =====================================================

export async function getLabTestById(id) {
    try {
        const result = await sql`
            SELECT
                id,
                test_name,
                category,
                reporting_time,
                specimen_source,
                processing,
                is_active,
                created_at,
                updated_at
            FROM lab_tests
            WHERE id = ${id}
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error("Error fetching lab test by ID:", error);
        throw error;
    }
}


// =====================================================
// Get active lab test by ID
// Public website
// =====================================================

export async function getActiveLabTestById(id) {
    try {
        const result = await sql`
            SELECT
                id,
                test_name,
                category,
                reporting_time,
                specimen_source,
                processing,
                is_active,
                created_at,
                updated_at
            FROM lab_tests
            WHERE id = ${id}
              AND is_active = TRUE
            LIMIT 1
        `;

        return result[0] || null;
    } catch (error) {
        console.error(
            "Error fetching active lab test by ID:",
            error
        );

        throw error;
    }
}