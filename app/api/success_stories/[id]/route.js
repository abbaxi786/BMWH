import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";

// ============================================================
// GET - Get single success story by ID
// ============================================================
export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const storyId = Number(id);

        // Validate ID
        if (!id || Number.isNaN(storyId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid success story ID",
                },
                { status: 400 }
            );
        }

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
            WHERE id = ${storyId}
              AND is_active = TRUE
            LIMIT 1
        `;

        // Story not found
        if (result.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Success story not found",
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
        console.error("Error fetching success story:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch success story",
            },
            { status: 500 }
        );
    }
}


// ============================================================
// PUT - Update success story by ID
// ============================================================
export async function PUT(request, { params }) {
    try {
        const { id } = await params;

        const storyId = Number(id);

        // --------------------------------------------------------
        // Validate ID
        // --------------------------------------------------------

        if (!id || Number.isNaN(storyId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid success story ID",
                },
                { status: 400 }
            );
        }

        // --------------------------------------------------------
        // Check if story exists
        // --------------------------------------------------------

        const existingStory = await sql`
            SELECT *
            FROM success_stories
            WHERE id = ${storyId}
            LIMIT 1
        `;

        if (existingStory.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Success story not found",
                },
                { status: 404 }
            );
        }

        const oldStory = existingStory[0];

        // --------------------------------------------------------
        // Read form data
        // --------------------------------------------------------

        const formData = await request.formData();

        const title = formData.get("title");
        const summary = formData.get("summary");
        const content = formData.get("content");
        const patient_name = formData.get("patient_name");
        const patient_age = formData.get("patient_age");
        const category = formData.get("category");
        const story_date = formData.get("story_date");
        const is_featured = formData.get("is_featured");
        const is_active = formData.get("is_active");
        const image = formData.get("image");

        // --------------------------------------------------------
        // Validate required fields
        // --------------------------------------------------------

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

        // --------------------------------------------------------
        // Convert patient age
        // --------------------------------------------------------

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

        // --------------------------------------------------------
        // Convert is_featured
        // --------------------------------------------------------

        const featured =
            is_featured === null
                ? oldStory.is_featured
                : (
                    is_featured === "true" ||
                    is_featured === "1" ||
                    is_featured === "on"
                );

        // --------------------------------------------------------
        // Convert is_active
        // --------------------------------------------------------

        const active =
            is_active === null
                ? oldStory.is_active
                : (
                    is_active === "true" ||
                    is_active === "1" ||
                    is_active === "on"
                );

        // --------------------------------------------------------
        // Keep old image by default
        // --------------------------------------------------------

        let imageUrl = oldStory.image_url;

        // --------------------------------------------------------
        // Upload new image if provided
        // --------------------------------------------------------

        if (image && image instanceof File && image.size > 0) {
            const uploadedImage = await uploadFileToCloudinary(
                image,
                "bmwh/success-stories"
            );

            imageUrl = uploadedImage.secure_url;
        }

        // --------------------------------------------------------
        // Update database
        // --------------------------------------------------------

        const result = await sql`
            UPDATE success_stories
            SET
                title = ${title},
                summary = ${summary || null},
                content = ${content},
                image_url = ${imageUrl},
                patient_name = ${patient_name || null},
                patient_age = ${age},
                category = ${category || null},
                story_date = ${story_date || null},
                is_featured = ${featured},
                is_active = ${active},
                updated_at = NOW()
            WHERE id = ${storyId}
            RETURNING *
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Success story updated successfully",
                data: result[0],
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error updating success story:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update success story",
            },
            { status: 500 }
        );
    }
}


// ============================================================
// DELETE - Delete success story by ID
// ============================================================
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        const storyId = Number(id);

        // --------------------------------------------------------
        // Validate ID
        // --------------------------------------------------------

        if (!id || Number.isNaN(storyId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid success story ID",
                },
                { status: 400 }
            );
        }

        // --------------------------------------------------------
        // Check if story exists
        // --------------------------------------------------------

        const existingStory = await sql`
            SELECT *
            FROM success_stories
            WHERE id = ${storyId}
            LIMIT 1
        `;

        if (existingStory.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Success story not found",
                },
                { status: 404 }
            );
        }

        // --------------------------------------------------------
        // Delete story
        // --------------------------------------------------------

        const result = await sql`
            DELETE FROM success_stories
            WHERE id = ${storyId}
            RETURNING *
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Success story deleted successfully",
                data: result[0],
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error deleting success story:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete success story",
            },
            { status: 500 }
        );
    }
}

