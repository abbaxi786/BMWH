import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";
import { requireAdmin } from "../../../../lib/auth";


// GET - Get single achievement/award
export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const achievementId = Number(id);

        if (!Number.isInteger(achievementId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid achievement/award ID",
                },
                { status: 400 }
            );
        }

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
            WHERE id = ${achievementId}
            LIMIT 1
        `;

        if (result.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Achievement/Award not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: result[0],
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(
            "Error fetching achievement/award:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch achievement/award",
            },
            { status: 500 }
        );
    }
}


// PUT - Update achievement/award
export async function PUT(request, { params }) {
    try {
        // Admin only
        await requireAdmin(request);

        const { id } = await params;

        const achievementId = Number(id);

        if (!Number.isInteger(achievementId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid achievement/award ID",
                },
                { status: 400 }
            );
        }

        // Get existing achievement
        const existingResult = await sql`
            SELECT
                id,
                title,
                type,
                description,
                image_url,
                award_date,
                issuing_organization,
                website_url,
                is_active
            FROM achievements_awards
            WHERE id = ${achievementId}
            LIMIT 1
        `;

        if (existingResult.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Achievement/Award not found",
                },
                { status: 404 }
            );
        }

        const existingAchievement =
            existingResult[0];

        const formData =
            await request.formData();

        const title =
            formData.get("title");

        const type =
            formData.get("type");

        const description =
            formData.get("description");

        const award_date =
            formData.get("award_date");

        const issuing_organization =
            formData.get(
                "issuing_organization"
            );

        const website_url =
            formData.get("website_url");

        const is_active =
            formData.get("is_active");

        const image =
            formData.get("image");


        // Required fields
        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof type !== "string" ||
            !type.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title and type are required",
                },
                { status: 400 }
            );
        }


        // Keep existing image by default
        let image_url =
            existingAchievement.image_url;


        // Upload replacement image
        if (
            image &&
            image instanceof File &&
            image.size > 0
        ) {
            const uploaded =
                await uploadFileToCloudinary(
                    image,
                    "bmwh/achievements-awards"
                );

            image_url =
                uploaded.secure_url;
        }


        // Keep existing active status
        let activeValue =
            existingAchievement.is_active;


        // If is_active was sent, convert it
        // from FormData string to boolean.
        if (is_active !== null) {
            activeValue =
                is_active === true ||
                is_active === "true" ||
                is_active === "1" ||
                is_active === "on";
        }


        // Update database
        const result = await sql`
            UPDATE achievements_awards
            SET
                title = ${title.trim()},
                type = ${type.trim()},
                description = ${
                    typeof description === "string" &&
                    description.trim()
                        ? description.trim()
                        : null
                },
                image_url = ${image_url},
                award_date = ${
                    typeof award_date === "string" &&
                    award_date.trim()
                        ? award_date.trim()
                        : null
                },
                issuing_organization = ${
                    typeof issuing_organization === "string" &&
                    issuing_organization.trim()
                        ? issuing_organization.trim()
                        : null
                },
                website_url = ${
                    typeof website_url === "string" &&
                    website_url.trim()
                        ? website_url.trim()
                        : null
                },
                is_active = ${activeValue},
                updated_at = NOW()
            WHERE id = ${achievementId}
            RETURNING *;
        `;


        return NextResponse.json(
            {
                success: true,
                message:
                    "Achievement/Award updated successfully",
                data: result[0],
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(
            "Error updating achievement/award:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to update achievement/award",
            },
            { status: 500 }
        );
    }
}


// DELETE - Delete achievement/award
export async function DELETE(
    request,
    { params }
) {
    try {
        // Admin only
        await requireAdmin(request);

        const { id } = await params;

        const achievementId = Number(id);

        if (!Number.isInteger(achievementId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid achievement/award ID",
                },
                { status: 400 }
            );
        }


        // Check if achievement exists
        const existingResult = await sql`
            SELECT
                id,
                title,
                image_url
            FROM achievements_awards
            WHERE id = ${achievementId}
            LIMIT 1
        `;

        if (existingResult.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Achievement/Award not found",
                },
                { status: 404 }
            );
        }


        // Delete database record
        const result = await sql`
            DELETE FROM achievements_awards
            WHERE id = ${achievementId}
            RETURNING *;
        `;


        return NextResponse.json(
            {
                success: true,
                message:
                    "Achievement/Award deleted successfully",
                data: result[0],
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(
            "Error deleting achievement/award:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to delete achievement/award",
            },
            { status: 500 }
        );
    }
}