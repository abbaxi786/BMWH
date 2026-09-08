import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
    try {
        const result = await sql`
            SELECT
                d.id,
                d.name,
                d.doctor_type,
                d.designation,
                d.specialty,
                d.qualifications,
                d.biography,
                d.expertise,
                d.photo_url,
                d.profile_link,
                d.is_active,
                d.created_at,
                d.updated_at,
                dept.name AS department_name
            FROM doctors d
            INNER JOIN departments dept
                ON d.department_id = dept.id
            WHERE d.is_active = true
            ORDER BY d.name ASC
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
        console.error("Failed to fetch doctors:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch doctors",
            },
            {
                status: 500,
            }
        );
    }
}