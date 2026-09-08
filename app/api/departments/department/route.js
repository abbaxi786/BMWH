import { NextResponse } from "next/server";
import { sql } from "@/lib/db";


export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const slug = searchParams.get("slug");

        // Validate slug
        if (!slug) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Department slug is required"
                },
                {
                    status: 400
                }
            );
        }

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
                    json_agg(
                        DISTINCT jsonb_build_object(
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
                    ) FILTER (WHERE doc.id IS NOT NULL),
                    '[]'::json
                ) AS doctors,

                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'id', ds.id,
                            'name', ds.name,
                            'description', ds.description,
                            'image_url', ds.image_url,
                            'is_active', ds.is_active
                        )
                    ) FILTER (WHERE ds.id IS NOT NULL),
                    '[]'::json
                ) AS services

            FROM departments d

            LEFT JOIN doctors doc
                ON doc.department_id = d.id

            LEFT JOIN department_services ds
                ON ds.department_id = d.id

            WHERE d.slug = ${slug}
              AND d.is_active = true

            GROUP BY
                d.id,
                d.name,
                d.category,
                d.description,
                d.slug,
                d.image_url,
                d.is_active;
        `;

        // Department not found
        if (result.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Department not found"
                },
                {
                    status: 404
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: result[0]
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.error("Failed to fetch department:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch department"
            },
            {
                status: 500
            }
        );
    }
}