import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET - Get single success story by ID
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