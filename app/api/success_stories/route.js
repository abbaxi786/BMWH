import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";

// GET - Get top 3 featured success stories
export async function GET() {
    try {
        const result = await sql`
            SELECT
                id,
                title,
                summary,
                content,
                image_url,
                patient_name,
                patient_age,
                category,
                story_date,
                is_featured,
                is_active,
                created_at,
                updated_at
            FROM success_stories
            WHERE is_active = TRUE
              AND is_featured = TRUE
            ORDER BY story_date DESC NULLS LAST, id DESC
            LIMIT 3
        `;

        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching success stories:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch success stories",
            },
            { status: 500 }
        );
    }
}


// POST - Create a new success story
export async function POST(request) {
    try {
        const formData = await request.formData();

        const title = formData.get("title");
        const summary = formData.get("summary");
        const content = formData.get("content");
        const patient_name = formData.get("patient_name");
        const patient_age = formData.get("patient_age");
        const category = formData.get("category");
        const story_date = formData.get("story_date");
        const is_featured = formData.get("is_featured");
        const image = formData.get("image");

        // Required field validation
        if (!title) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title is required",
                },
                { status: 400 }
            );
        }

        if (!content) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Content is required",
                },
                { status: 400 }
            );
        }

        let image_url = null;

        // Upload image to Cloudinary
        if (image && image instanceof File && image.size > 0) {
            image_url = await uploadFileToCloudinary(
                image,
                "bmwh/success-stories"
            );
        }

        // Convert featured value
        const featured =
            is_featured === "true" ||
            is_featured === "1" ||
            is_featured === "on";

        // Convert patient age
        const age =
            patient_age !== null &&
            patient_age !== ""
                ? Number(patient_age)
                : null;

        // Validate patient age
        if (
            age !== null &&
            (Number.isNaN(age) || age < 0 || age > 150)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid patient age",
                },
                { status: 400 }
            );
        }

        // Insert into database
        const result = await sql`
            INSERT INTO success_stories (
                title,
                summary,
                content,
                image_url,
                patient_name,
                patient_age,
                category,
                story_date,
                is_featured
            )
            VALUES (
                ${title},
                ${summary || null},
                ${content},
                ${image_url ? image_url.secure_url : null},
                ${patient_name || null},
                ${age},
                ${category || null},
                ${story_date || null},
                ${featured}
            )
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Success story created successfully",
                data: result[0],
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating success story:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create success story",
            },
            { status: 500 }
        );
    }
}