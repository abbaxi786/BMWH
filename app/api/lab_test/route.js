import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";


/*
|--------------------------------------------------------------------------
| GET - Get Lab Tests
|--------------------------------------------------------------------------
|
| Public website:
|   GET /api/lab-tests
|   -> Returns only active lab tests
|
| Admin:
|   GET /api/lab-tests?admin=true
|   -> Returns all lab tests, including inactive ones
|
| Optional:
|   GET /api/lab-tests?category=Haematology
|   GET /api/lab-tests?search=CBC
|
|--------------------------------------------------------------------------
*/

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const admin = searchParams.get("admin") === "true";
        const category = searchParams.get("category");
        const search = searchParams.get("search");

        let result;

        /*
        |--------------------------------------------------------------------------
        | ADMIN REQUEST
        |--------------------------------------------------------------------------
        | Admin can see both active and inactive tests.
        |--------------------------------------------------------------------------
        */

        if (admin) {
            if (category && search) {
                result = await sql`
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
                    AND test_name ILIKE ${"%" + search + "%"}
                    ORDER BY test_name ASC
                `;
            } else if (category) {
                result = await sql`
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
            } else if (search) {
                result = await sql`
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
                    WHERE test_name ILIKE ${"%" + search + "%"}
                    ORDER BY test_name ASC
                `;
            } else {
                result = await sql`
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
            }
        }

        /*
        |--------------------------------------------------------------------------
        | PUBLIC WEBSITE REQUEST
        |--------------------------------------------------------------------------
        | Public users only receive active lab tests.
        |--------------------------------------------------------------------------
        */

        else {
            if (category && search) {
                result = await sql`
                    SELECT
                        id,
                        test_name,
                        category,
                        reporting_time,
                        specimen_source,
                        processing
                    FROM lab_tests
                    WHERE is_active = TRUE
                    AND category = ${category}
                    AND test_name ILIKE ${"%" + search + "%"}
                    ORDER BY test_name ASC
                `;
            } else if (category) {
                result = await sql`
                    SELECT
                        id,
                        test_name,
                        category,
                        reporting_time,
                        specimen_source,
                        processing
                    FROM lab_tests
                    WHERE is_active = TRUE
                    AND category = ${category}
                    ORDER BY test_name ASC
                `;
            } else if (search) {
                result = await sql`
                    SELECT
                        id,
                        test_name,
                        category,
                        reporting_time,
                        specimen_source,
                        processing
                    FROM lab_tests
                    WHERE is_active = TRUE
                    AND test_name ILIKE ${"%" + search + "%"}
                    ORDER BY test_name ASC
                `;
            } else {
                result = await sql`
                    SELECT
                        id,
                        test_name,
                        category,
                        reporting_time,
                        specimen_source,
                        processing
                    FROM lab_tests
                    WHERE is_active = TRUE
                    ORDER BY test_name ASC
                `;
            }
        }

        return NextResponse.json(
            {
                success: true,
                labTests: result,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("GET LAB TESTS ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch lab tests",
                error: error.message,
            },
            { status: 500 }
        );
    }
}


/*
|--------------------------------------------------------------------------
| POST - Create Lab Test
|--------------------------------------------------------------------------
|
| Used by:
|   Admin panel only
|
| Body:
| {
|   "test_name": "Albumin",
|   "category": "Routine Chemistry",
|   "reporting_time": "24 Hrs",
|   "specimen_source": "Serum (clotted vial)",
|   "processing": "In-house",
|   "is_active": true
| }
|
|--------------------------------------------------------------------------
*/

export async function POST(request) {

    const admin = await requireAdmin();

    if (!admin) {
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized",
            },
            { status: 401 }
        );
    }
    try {
        const body = await request.json();

        const {
            test_name,
            category,
            reporting_time,
            specimen_source,
            processing,
            is_active = true,
        } = body;

        /*
        |--------------------------------------------------------------------------
        | Validation
        |--------------------------------------------------------------------------
        */

        if (
            !test_name ||
            !category ||
            !reporting_time ||
            !specimen_source ||
            !processing
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Test name, category, reporting time, specimen source and processing are required",
                },
                { status: 400 }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Insert
        |--------------------------------------------------------------------------
        */

        const result = await sql`
            INSERT INTO lab_tests (
                test_name,
                category,
                reporting_time,
                specimen_source,
                processing,
                is_active
            )
            VALUES (
                ${test_name.trim()},
                ${category.trim()},
                ${reporting_time.trim()},
                ${specimen_source.trim()},
                ${processing.trim()},
                ${Boolean(is_active)}
            )
            RETURNING
                id,
                test_name,
                category,
                reporting_time,
                specimen_source,
                processing,
                is_active,
                created_at,
                updated_at
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Lab test created successfully",
                labTest: result[0],
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("POST LAB TEST ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create lab test",
                error: error.message,
            },
            { status: 500 }
        );
    }
}


/*
|--------------------------------------------------------------------------
| PUT - Update Lab Test
|--------------------------------------------------------------------------
|
| URL:
|   PUT /api/lab-tests?id=1
|
| Body:
| {
|   "test_name": "Albumin",
|   "category": "Routine Chemistry",
|   "reporting_time": "24 Hrs",
|   "specimen_source": "Serum (clotted vial)",
|   "processing": "In-house",
|   "is_active": true
| }
|
|--------------------------------------------------------------------------
*/

export async function PUT(request) {

    const admin = await requireAdmin();

    if (!admin) {
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized",
            },
            { status: 401 }
        );
    }
    try {
        const { searchParams } = new URL(request.url);

        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Lab test ID is required",
                },
                { status: 400 }
            );
        }

        const body = await request.json();

        const {
            test_name,
            category,
            reporting_time,
            specimen_source,
            processing,
            is_active,
        } = body;

        /*
        |--------------------------------------------------------------------------
        | Validation
        |--------------------------------------------------------------------------
        */

        if (
            !test_name ||
            !category ||
            !reporting_time ||
            !specimen_source ||
            !processing
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Test name, category, reporting time, specimen source and processing are required",
                },
                { status: 400 }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Update
        |--------------------------------------------------------------------------
        */

        const result = await sql`
            UPDATE lab_tests
            SET
                test_name = ${test_name.trim()},
                category = ${category.trim()},
                reporting_time = ${reporting_time.trim()},
                specimen_source = ${specimen_source.trim()},
                processing = ${processing.trim()},
                is_active = ${Boolean(is_active)},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${Number(id)}
            RETURNING
                id,
                test_name,
                category,
                reporting_time,
                specimen_source,
                processing,
                is_active,
                created_at,
                updated_at
        `;

        /*
        |--------------------------------------------------------------------------
        | Check if record exists
        |--------------------------------------------------------------------------
        */

        if (result.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Lab test not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Lab test updated successfully",
                labTest: result[0],
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("PUT LAB TEST ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update lab test",
                error: error.message,
            },
            { status: 500 }
        );
    }
}


/*
|--------------------------------------------------------------------------
| DELETE - Delete Lab Test
|--------------------------------------------------------------------------
|
| URL:
|   DELETE /api/lab-tests?id=1
|
|--------------------------------------------------------------------------
*/

export async function DELETE(request) {

    const admin = await requireAdmin();

    if (!admin) {
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized",
            },
            { status: 401 }
        );
    }
    try {
        const { searchParams } = new URL(request.url);

        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Lab test ID is required",
                },
                { status: 400 }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Delete
        |--------------------------------------------------------------------------
        */

        const result = await sql`
            DELETE FROM lab_tests
            WHERE id = ${Number(id)}
            RETURNING
                id,
                test_name
        `;

        /*
        |--------------------------------------------------------------------------
        | Check if record exists
        |--------------------------------------------------------------------------
        */

        if (result.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Lab test not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Lab test deleted successfully",
                labTest: result[0],
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("DELETE LAB TEST ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete lab test",
                error: error.message,
            },
            { status: 500 }
        );
    }
}


// ### How both sides use it

// **Public website:**

// ```javascript
// axios.get("/api/lab-tests");
// ```

// It gets only:

// ```text
// is_active = true
// ```

// **Admin panel:**

// ```javascript
// axios.get("/api/lab-tests?admin=true");
// ```

// It gets **all tests**, including inactive ones.

// **Add:**

// ```javascript
// axios.post("/api/lab-tests", {
//     test_name: "Albumin",
//     category: "Routine Chemistry",
//     reporting_time: "24 Hrs",
//     specimen_source: "Serum (clotted vial)",
//     processing: "In-house",
//     is_active: true
// });
// ```

// **Edit:**

// ```javascript
// axios.put("/api/lab-tests?id=1", {
//     test_name: "Albumin",
//     category: "Routine Chemistry",
//     reporting_time: "24 Hrs",
//     specimen_source: "Serum (clotted vial)",
//     processing: "In-house",
//     is_active: true
// });
// ```

// **Delete:**

// ```javascript
// axios.delete("/api/lab-tests?id=1");
// ```

// ### One security point

// The route above separates **what data is returned**, but it does **not yet authenticate POST/PUT/DELETE**.

// Because your project already has an admin authentication system, I recommend that we add your existing admin-session/auth check to **POST, PUT, and DELETE**, while leaving `GET` public.

// So the final structure becomes:

// ```text
// GET
//   ├── Website → active tests
//   └── Admin   → all tests

// POST
//   └── Admin authentication required

// PUT
//   └── Admin authentication required

// DELETE
//   └── Admin authentication required
// ```

// That is the safer setup for your CMS.
