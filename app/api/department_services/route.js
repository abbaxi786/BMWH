import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";

export async function POST(request) {
    try {
        const formData = await request.formData();

        const department_id = formData.get("department_id");
        const name = formData.get("name");
        const description = formData.get("description");
        const is_active = formData.get("is_active") === "true";
        const image = formData.get("image");

        if (!department_id || !name) {
            return NextResponse.json({
                success: false,
                message: "department_id and name are required"
            }, {
                status: 400
            });
        }

        let image_url = null;

        if (image && typeof image.arrayBuffer === "function") {
            const uploaded = await uploadFileToCloudinary(
                image,
                "bmh/department-services"
            );

            image_url = uploaded.secure_url;
        }

        const result = await sql`
            INSERT INTO department_services
                (
                    department_id,
                    name,
                    description,
                    image_url,
                    is_active
                )
            VALUES
                (
                    ${department_id},
                    ${name},
                    ${description},
                    ${image_url},
                    ${is_active}
                )
            RETURNING *;
        `;

        return NextResponse.json({
            success: true,
            message: "Department service created successfully",
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

        const department_id = searchParams.get("department_id");

        if (!department_id) {
            return NextResponse.json({
                success: false,
                message: "department_id is required"
            }, {
                status: 400
            });
        }

        const result = await sql`
            SELECT *
            FROM department_services
            WHERE department_id = ${department_id}
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
            message: error?.message
        }, {
            status: 500
        });
    }
}