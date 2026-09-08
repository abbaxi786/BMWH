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
                "bmh/diagnostic-services"
            );

            image_url = uploaded.secure_url;
        }

        const result = await sql`
            INSERT INTO diagnostic_services
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
            message: "Diagnostic service created successfully",
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
        // const { searchParams } = new URL(request.url);

        // const ds_id = searchParams.get("ds_id");

        // if (!ds_id) {
        //     return NextResponse.json({
        //         success: false,
        //         message: "ds_id is required"
        //     }, {
        //         status: 400
        //     });
        // }

        const result = await sql`
            SELECT id, name,category, image_url, description, is_active
            FROM diagnostic_services
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