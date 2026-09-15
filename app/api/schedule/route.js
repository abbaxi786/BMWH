import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "../../../lib/auth";



// ============================================================
// POST - CREATE DOCTOR SCHEDULE
// ============================================================

export async function POST(request) {
    try {
        // ----------------------------------------------------
        // Check admin authentication
        // ----------------------------------------------------

        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        // ----------------------------------------------------
        // Get request data
        // ----------------------------------------------------

        const {
            doctor_id,
            day_of_week,
            start_time,
            end_time,
            location,
            is_available,
        } = await request.json();

        // ----------------------------------------------------
        // Validate required fields
        // ----------------------------------------------------

        if (
            !doctor_id ||
            !day_of_week ||
            !start_time ||
            !end_time
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "doctor_id, day_of_week, start_time and end_time are required",
                },
                {
                    status: 400,
                }
            );
        }

        // ----------------------------------------------------
        // Insert schedule
        // ----------------------------------------------------

        const result = await sql`
            INSERT INTO doctor_schedules
            (
                doctor_id,
                day_of_week,
                start_time,
                end_time,
                location,
                is_available
            )
            VALUES
            (
                ${doctor_id},
                ${day_of_week},
                ${start_time},
                ${end_time},
                ${location},
                ${is_available}
            )
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message:
                    "Doctor schedule created successfully",
                data: result[0],
            },
            {
                status: 201,
            }
        );

    } catch (error) {
        console.error(
            "Create schedule error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to create doctor schedule",
            },
            {
                status: 500,
            }
        );
    }
}


// ============================================================
// GET - GET DOCTOR SCHEDULES
// ============================================================

export async function GET(request) {
    try {
        const { searchParams } =
            new URL(request.url);

        const doctor_id =
            searchParams.get("doctor_id");

        if (!doctor_id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "doctor_id is required",
                },
                {
                    status: 400,
                }
            );
        }

        const result = await sql`
            SELECT *
            FROM doctor_schedules
            WHERE doctor_id = ${doctor_id}
            ORDER BY day_of_week, start_time;
        `;

        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "Get schedules error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to fetch doctor schedules",
            },
            {
                status: 500,
            }
        );
    }
}


// ============================================================
// PUT - UPDATE DOCTOR SCHEDULE
// ============================================================

export async function PUT(request) {
    try {
        // ----------------------------------------------------
        // Check admin authentication
        // ----------------------------------------------------

        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        // ----------------------------------------------------
        // Get schedule ID
        // ----------------------------------------------------

        const { searchParams } =
            new URL(request.url);

        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Schedule ID is required",
                },
                {
                    status: 400,
                }
            );
        }

        // ----------------------------------------------------
        // Check if schedule exists
        // ----------------------------------------------------

        const existingSchedule = await sql`
            SELECT *
            FROM doctor_schedules
            WHERE id = ${id}
        `;

        if (existingSchedule.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Doctor schedule not found",
                },
                {
                    status: 404,
                }
            );
        }

        // ----------------------------------------------------
        // Get request data
        // ----------------------------------------------------

        const {
            doctor_id,
            day_of_week,
            start_time,
            end_time,
            location,
            is_available,
        } = await request.json();

        // ----------------------------------------------------
        // Validate required fields
        // ----------------------------------------------------

        if (
            !doctor_id ||
            !day_of_week ||
            !start_time ||
            !end_time
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "doctor_id, day_of_week, start_time and end_time are required",
                },
                {
                    status: 400,
                }
            );
        }

        // ----------------------------------------------------
        // Update schedule
        // ----------------------------------------------------

        const result = await sql`
            UPDATE doctor_schedules
            SET
                doctor_id = ${doctor_id},
                day_of_week = ${day_of_week},
                start_time = ${start_time},
                end_time = ${end_time},
                location = ${location},
                is_available = ${is_available}
            WHERE id = ${id}
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message:
                    "Doctor schedule updated successfully",
                data: result[0],
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "Update schedule error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to update doctor schedule",
            },
            {
                status: 500,
            }
        );
    }
}


// ============================================================
// DELETE - DELETE DOCTOR SCHEDULE
// ============================================================

export async function DELETE(request) {
    try {
        // ----------------------------------------------------
        // Check admin authentication
        // ----------------------------------------------------

        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        // ----------------------------------------------------
        // Get schedule ID
        // ----------------------------------------------------

        const { searchParams } =
            new URL(request.url);

        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Schedule ID is required",
                },
                {
                    status: 400,
                }
            );
        }

        // ----------------------------------------------------
        // Check if schedule exists
        // ----------------------------------------------------

        const existingSchedule = await sql`
            SELECT *
            FROM doctor_schedules
            WHERE id = ${id}
        `;

        if (existingSchedule.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Doctor schedule not found",
                },
                {
                    status: 404,
                }
            );
        }

        // ----------------------------------------------------
        // Delete schedule
        // ----------------------------------------------------

        await sql`
            DELETE FROM doctor_schedules
            WHERE id = ${id}
        `;

        return NextResponse.json(
            {
                success: true,
                message:
                    "Doctor schedule deleted successfully",
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "Delete schedule error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to delete doctor schedule",
            },
            {
                status: 500,
            }
        );
    }
}