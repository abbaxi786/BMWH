import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request) {
    try {
        const {
            doctor_id,
            day_of_week,
            start_time,
            end_time,
            location,
            is_available
        } = await request.json();

        if (!doctor_id || !day_of_week || !start_time || !end_time) {
            return NextResponse.json({
                success: false,
                message: "doctor_id, day_of_week, start_time and end_time are required"
            }, {
                status: 400
            });
        }

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

        return NextResponse.json({
            success: true,
            message: "Doctor schedule created successfully",
            data: result[0]
        }, {
            status: 201
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json({
            success: false,
            message: error?.message
        }, {
            status: 500
        });
    }
}


export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const doctor_id = searchParams.get("doctor_id");

        if (!doctor_id) {
            return NextResponse.json({
                success: false,
                message: "doctor_id is required"
            }, {
                status: 400
            });
        }

        const result = await sql`
            SELECT *
            FROM doctor_schedules
            WHERE doctor_id = ${doctor_id}
            ORDER BY day_of_week, start_time;
        `;

        return NextResponse.json({
            success: true,
            data: result
        }, {
            status: 200
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json({
            success: false,
            message: error?.message
        }, {
            status: 500
        });
    }
}