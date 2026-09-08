import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";


// GET - Get all active supporters
export async function GET() {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                type,
                support_type,
                description,
                logo_url,
                website_url,
                is_active,
                created_at,
                updated_at
            FROM supporters
            WHERE is_active = TRUE
            ORDER BY id DESC
        `;

        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error fetching supporters:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch supporters",
            },
            { status: 500 }
        );
    }
}


// POST - Create a new supporter
export async function POST(request) {
    try {
        const formData = await request.formData();

        const name = formData.get("name");
        const type = formData.get("type");
        const support_type = formData.get("support_type");
        const description = formData.get("description");
        const website_url = formData.get("website_url");
        const logo = formData.get("logo");

        // Required field validation
        if (!name) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Name is required",
                },
                { status: 400 }
            );
        }

        let logo_url = null;

        // Upload logo to Cloudinary
        if (logo && logo instanceof File && logo.size > 0) {
            logo_url = await uploadFileToCloudinary(
                logo,
                "bmwh/supporters"
            );
        }

        // Insert into database
        const result = await sql`
            INSERT INTO supporters (
                name,
                type,
                support_type,
                description,
                logo_url,
                website_url
            )
            VALUES (
                ${name},
                ${type || null},
                ${support_type || null},
                ${description || null},
                ${logo_url.secure_url},
                ${website_url || null}
            )
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Supporter created successfully",
                data: result[0],
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating supporter:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create supporter",
            },
            { status: 500 }
        );
    }
}