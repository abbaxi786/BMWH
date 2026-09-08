import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";

export async function POST(request) {
    try {
        const formData = await request.formData();

        const title = formData.get("title");
        const slug = formData.get("slug");
        const excerpt = formData.get("excerpt");
        const content = formData.get("content");
        const category = formData.get("category");
        const author_name = formData.get("author_name");

        const is_featured =
            formData.get("is_featured") === "true";

        const is_published =
            formData.get("is_published") !== "false";

        const published_at = formData.get("published_at");

        const meta_title = formData.get("meta_title");
        const meta_description = formData.get("meta_description");

        const image = formData.get("image");

        // Required fields
        if (!title || !slug || !content) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title, slug and content are required",
                },
                { status: 400 }
            );
        }

        // Check duplicate slug
        const existingNews = await sql`
            SELECT id
            FROM news_updates
            WHERE slug = ${slug}
            LIMIT 1
        `;

        if (existingNews.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A news article with this slug already exists",
                },
                { status: 409 }
            );
        }

        let image_url = null;

        // Upload image if provided
        if (image && typeof image !== "string") {
            image_url = await uploadFileToCloudinary(image);
        }

        const result = await sql`
            INSERT INTO news_updates (
                title,
                slug,
                excerpt,
                content,
                image_url,
                category,
                author_name,
                is_featured,
                is_published,
                published_at,
                meta_title,
                meta_description
            )
            VALUES (
                ${title},
                ${slug},
                ${excerpt || null},
                ${content},
                ${image_url.secure_url},
                ${category || null},
                ${author_name || null},
                ${is_featured},
                ${is_published},
                ${published_at || null},
                ${meta_title || null},
                ${meta_description || null}
            )
            RETURNING *
        `;

        return NextResponse.json(
            {
                success: true,
                message: "News article created successfully",
                data: result[0],
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Create news error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create news article",
            },
            { status: 500 }
        );
    }
}


export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const id = searchParams.get("id");
        const slug = searchParams.get("slug");
        const category = searchParams.get("category");
        const featured = searchParams.get("featured");

        if (id) {
            const result = await sql`
                SELECT *
                FROM news_updates
                WHERE id = ${id}
                LIMIT 1
            `;

            if (result.length === 0) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "News article not found",
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: result[0],
            });
        }

        if (slug) {
            const result = await sql`
                SELECT *
                FROM news_updates
                WHERE slug = ${slug}
                LIMIT 1
            `;

            if (result.length === 0) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "News article not found",
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                data: result[0],
            });
        }

        // Get news by category
        if (category) {
            const result = await sql`
                SELECT *
                FROM news_updates
                WHERE category = ${category}
                AND is_published = TRUE
                ORDER BY published_at DESC NULLS LAST, created_at DESC
            `;

            return NextResponse.json({
                success: true,
                count: result.length,
                data: result,
            });
        }

        // Get featured news
        if (featured === "true") {
            const result = await sql`
                SELECT *
                FROM news_updates
                WHERE is_featured = TRUE
                AND is_published = TRUE
                ORDER BY published_at DESC NULLS LAST, created_at DESC
            `;

            return NextResponse.json({
                success: true,
                count: result.length,
                data: result,
            });
        }

        // Get all published news
        const result = await sql`
            SELECT *
            FROM news_updates
            WHERE is_published = TRUE
            ORDER BY published_at DESC NULLS LAST, created_at DESC
        `;

        return NextResponse.json({
            success: true,
            count: result.length,
            data: result,
        });

    } catch (error) {
        console.error("Get news error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch news",
            },
            { status: 500 }
        );
    }
}