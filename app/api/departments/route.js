import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";

export async function POST(request) {
    try {
        const formData = await request.formData();

        const name = formData.get("name");
        const category = formData.get("category");
        const description = formData.get("description");
        const slug = formData.get("slug");
        const is_active = formData.get("is_active") === "true";
        const image = formData.get("image");

        if (!name || !category || !slug) {
            return NextResponse.json({
                success: false,
                message: "name, category and slug are required"
            }, {
                status: 400
            });
        }

        let image_url = null;

        if (image && typeof image.arrayBuffer === "function") {
            const uploaded = await uploadFileToCloudinary(
                image,
                "bmh/departments"
            );

            image_url = uploaded.secure_url;
        }

        const result = await sql`
            INSERT INTO departments
                (
                    name,
                    category,
                    description,
                    slug,
                    image_url,
                    is_active
                )
            VALUES
                (
                    ${name},
                    ${category},
                    ${description},
                    ${slug},
                    ${image_url},
                    ${is_active}
                )
            RETURNING *;
        `;

        return NextResponse.json({
            success: true,
            message: "Department created successfully",
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
        const limitParam = new URL(request.url).searchParams.get("limit");
        const limit = limitParam ? Number.parseInt(limitParam, 10) : null;

        if (limitParam && (!Number.isInteger(limit) || limit <= 0)) {
            return NextResponse.json({
                success: false,
                message: "limit must be a positive integer"
            }, {
                status: 400
            });
        }

        const result = limit
            ? await sql`
                SELECT *
                FROM departments
                LIMIT ${limit}
            `
            : await sql`
                SELECT *
                FROM departments
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
            message: "Failed to fetch departments"
        }, {
            status: 500
        });
    }
}



