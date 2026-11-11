import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";
import { requireAdmin } from "../../../lib/auth";
import { getAchievements } from "@/lib/data/achievment/achievements";
import { revalidatePath } from "next/cache";

// Revalidate achievement frontend pages
function revalidateAchievementPages(id) {
    revalidatePath("/achievements");
    revalidatePath(`/achievements/${id}`);

    // Uncomment if homepage displays achievements
    // revalidatePath("/");
}

// GET - Get all achievements and awards
export async function GET() {
    try {
        const result = await getAchievements();

        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(
            "Error fetching achievements and awards:",
            error
        );

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
        // Admin only
        const admin = await requireAdmin(request);

        if (!admin) {
            return NextResponse.json(
                {
                    message: "Unauthorized person",
                    success: false,
                },
                { status: 401 }
            );
        }

        const formData = await request.formData();

        const title = formData.get("title");
        const type = formData.get("type");
        const description = formData.get("description");
        const award_date = formData.get("award_date");
        const issuing_organization = formData.get("issuing_organization");
        const website_url = formData.get("website_url");
        const image = formData.get("image");

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

        let image_url = null;

        // Upload image to Cloudinary
        if (
            image &&
            image instanceof File &&
            image.size > 0
        ) {
            const uploaded = await uploadFileToCloudinary(
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
                ${title.trim()},
                ${type.trim()},
                ${
                    typeof description === "string" &&
                    description.trim()
                        ? description.trim()
                        : null
                },
                ${image_url},
                ${
                    typeof award_date === "string" &&
                    award_date.trim()
                        ? award_date.trim()
                        : null
                },
                ${
                    typeof issuing_organization === "string" &&
                    issuing_organization.trim()
                        ? issuing_organization.trim()
                        : null
                },
                ${
                    typeof website_url === "string" &&
                    website_url.trim()
                        ? website_url.trim()
                        : null
                }
            )
            RETURNING *;
        `;

        // Revalidate cached frontend pages
        const newAchievementId = result[0].id;

        revalidateAchievementPages(newAchievementId);

        return NextResponse.json(
            {
                success: true,
                message: "Achievement/Award created successfully",
                data: result[0],
            },
            { status: 201 }
        );

    } catch (error) {
        console.error(
            "Error creating achievement/award:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create achievement/award",
            },
            { status: 500 }
        );
    }
}
