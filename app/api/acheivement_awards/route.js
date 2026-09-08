import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";

// GET - Get all active achievements and awards
export async function GET() {
    try {
        const result = await sql`
            SELECT
                id,
                title,
                type,
                description,
                image_url,
                award_date,
                issuing_organization,
                website_url,
                is_active,
                created_at,
                updated_at
            FROM achievements_awards
            WHERE is_active = TRUE
            ORDER BY award_date DESC NULLS LAST, id DESC
        `;

        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching achievements and awards:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch achievements and awards",
            },
            { status: 500 }
        );
    }
}


// POST - Create achievement/award
export async function POST(request) {
    try {
        const formData = await request.formData();

        const title = formData.get("title");
        const type = formData.get("type");
        const description = formData.get("description");
        const award_date = formData.get("award_date");
        const issuing_organization = formData.get("issuing_organization");
        const website_url = formData.get("website_url");
        const image = formData.get("image");

        // Required fields
        if (!title || !type) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title and type are required",
                },
                { status: 400 }
            );
        }

        let image_url = null;
        let uploaded = null

        // Upload image to Cloudinary
        if (image && image instanceof File && image.size > 0) {
            uploaded = await uploadFileToCloudinary(
                image,
                "bmwh/achievements-awards"
            );
            image_url = uploaded.secure_url;
        }

        // Insert into database
        const result = await sql`
            INSERT INTO achievements_awards (
                title,
                type,
                description,
                image_url,
                award_date,
                issuing_organization,
                website_url
            )
            VALUES (
                ${title},
                ${type},
                ${description || null},
                ${image_url},
                ${award_date || null},
                ${issuing_organization || null},
                ${website_url || null}
            )
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Achievement/Award created successfully",
                data: result[0],
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating achievement/award:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create achievement/award",
            },
            { status: 500 }
        );
    }
}