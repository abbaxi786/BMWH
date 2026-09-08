import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";

export async function POST(request) {
    try {
        const formData = await request.formData();

        const name = formData.get("name");
        const category = formData.get("category");
        const description = formData.get("description");
        const is_active = formData.get("is_active") === "true";
        const image = formData.get("image");

        if (!name || !category) {
            return NextResponse.json({
                success: false,
                message: "name and category are required"
            }, {
                status: 400
            });
        }

        let image_url = null;

        if (image && typeof image.arrayBuffer === "function") {
            const uploaded = await uploadFileToCloudinary(
                image,
                "bmh/facilities"
            );

            image_url = uploaded.secure_url;
        }

        const result = await sql`
            INSERT INTO hospital_facilities
                (
                    name,
                    category,
                    description,
                    image_url,
                    is_active
                )
            VALUES
                (
                    ${name},
                    ${category},
                    ${description},
                    ${image_url},
                    ${is_active}
                )
            RETURNING *;
        `;

        return NextResponse.json({
            success: true,
            message: "Hospital facility created successfully",
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

        const facility_id = searchParams.get("facility_id");

        if (facility_id) {
            const result = await sql`
                SELECT *
                FROM hospital_facilities
                WHERE id = ${facility_id}
            `;

            return NextResponse.json({
                success: true,
                data: result
            }, {
                status: 200
            });
        }

        const result = await sql`
            SELECT *
            FROM hospital_facilities
            ORDER BY id ASC;
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
            message: "Failed to fetch hospital facilities"
        }, {
            status: 500
        });
    }
}