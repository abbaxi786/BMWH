import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";

// GET - Get all active health partners
export async function GET() {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                type,
                partnership_type,
                description,
                logo_url,
                website_url,
                is_active,
                created_at,
                updated_at
            FROM health_partners
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
        console.error("Error fetching health partners:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch health partners",
            },
            { status: 500 }
        );
    }
}


// POST - Create a new health partner
export async function POST(request) {
    try {
        const formData = await request.formData();

        const name = formData.get("name");
        const type = formData.get("type");
        const partnership_type = formData.get("partnership_type");
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
                "bmwh/health-partners"
            );
        }

        // Insert into database
        const result = await sql`
            INSERT INTO health_partners (
                name,
                type,
                partnership_type,
                description,
                logo_url,
                website_url
            )
            VALUES (
                ${name},
                ${type || null},
                ${partnership_type || null},
                ${description || null},
                ${logo_url.secure_url},
                ${website_url || null}
            )
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Health partner created successfully",
                data: result[0],
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating health partner:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create health partner",
            },
            { status: 500 }
        );
    }
}