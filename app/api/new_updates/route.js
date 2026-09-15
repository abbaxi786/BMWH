import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

import {
    uploadFileToCloudinary,
    deleteFileFromCloudinary,
} from "@/lib/uploadToCloudinary";

import { requireAdmin } from "@/lib/auth";


// ======================================================
// CREATE NEWS
// ======================================================

export async function POST(request) {
    try {
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

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
            const uploadResult = await uploadFileToCloudinary(
                image,
                "bmh/news"
            );

            image_url = uploadResult.secure_url;
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
                ${image_url},
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


// ======================================================
// GET NEWS
// ======================================================

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const id = searchParams.get("id");
        const slug = searchParams.get("slug");
        const category = searchParams.get("category");
        const featured = searchParams.get("featured");

        // ---------------------------------------------
        // GET SINGLE NEWS BY ID
        // ---------------------------------------------

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

        // ---------------------------------------------
        // GET SINGLE NEWS BY SLUG
        // ---------------------------------------------

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

        // ---------------------------------------------
        // GET NEWS BY CATEGORY
        // ---------------------------------------------

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

        // ---------------------------------------------
        // GET FEATURED NEWS
        // ---------------------------------------------

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

        // ---------------------------------------------
        // GET ALL PUBLISHED NEWS
        // ---------------------------------------------

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


// ======================================================
// UPDATE NEWS
// ======================================================

export async function PUT(request) {
    try {
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);

        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "News ID is required",
                },
                { status: 400 }
            );
        }

        // ---------------------------------------------
        // Find existing news
        // ---------------------------------------------

        const existingNews = await sql`
            SELECT *
            FROM news_updates
            WHERE id = ${id}
            LIMIT 1
        `;

        if (existingNews.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "News article not found",
                },
                { status: 404 }
            );
        }

        const oldNews = existingNews[0];

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

        const remove_image =
            formData.get("remove_image") === "true";


        // ---------------------------------------------
        // Required fields
        // ---------------------------------------------

        if (!title || !slug || !content) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title, slug and content are required",
                },
                { status: 400 }
            );
        }


        // ---------------------------------------------
        // Check duplicate slug
        // Exclude current news article
        // ---------------------------------------------

        const duplicateSlug = await sql`
            SELECT id
            FROM news_updates
            WHERE slug = ${slug}
            AND id != ${id}
            LIMIT 1
        `;

        if (duplicateSlug.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Another news article already uses this slug",
                },
                { status: 409 }
            );
        }


        // ---------------------------------------------
        // Handle image
        // ---------------------------------------------

        let image_url = oldNews.image_url;

        let newImageUploaded = false;

        // New image selected
        if (image && typeof image !== "string") {

            const uploadResult = await uploadFileToCloudinary(
                image,
                "bmh/news"
            );

            image_url = uploadResult.secure_url;

            newImageUploaded = true;
        }

        // Remove existing image
        else if (remove_image) {
            image_url = null;
        }


        // ---------------------------------------------
        // Update database
        // ---------------------------------------------

        const result = await sql`
            UPDATE news_updates
            SET
                title = ${title},
                slug = ${slug},
                excerpt = ${excerpt || null},
                content = ${content},
                image_url = ${image_url},
                category = ${category || null},
                author_name = ${author_name || null},
                is_featured = ${is_featured},
                is_published = ${is_published},
                published_at = ${published_at || null},
                meta_title = ${meta_title || null},
                meta_description = ${meta_description || null},
                updated_at = NOW()
            WHERE id = ${id}
            RETURNING *
        `;


        // ---------------------------------------------
        // Delete old Cloudinary image
        // Only after DB update succeeds
        // ---------------------------------------------

        if (
            oldNews.image_url &&
            (
                newImageUploaded ||
                remove_image
            )
        ) {
            try {
                await deleteFileFromCloudinary(
                    oldNews.image_url
                );
            } catch (cloudinaryError) {
                console.error(
                    "Failed to delete old Cloudinary image:",
                    cloudinaryError
                );
            }
        }


        return NextResponse.json({
            success: true,
            message: "News article updated successfully",
            data: result[0],
        });

    } catch (error) {
        console.error("Update news error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update news article",
            },
            { status: 500 }
        );
    }
}


// ======================================================
// DELETE NEWS
// ======================================================

export async function DELETE(request) {
    try {
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);

        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "News ID is required",
                },
                { status: 400 }
            );
        }


        // ---------------------------------------------
        // Find news before deleting
        // ---------------------------------------------

        const existingNews = await sql`
            SELECT *
            FROM news_updates
            WHERE id = ${id}
            LIMIT 1
        `;

        if (existingNews.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "News article not found",
                },
                { status: 404 }
            );
        }

        const news = existingNews[0];


        // ---------------------------------------------
        // Delete from database
        // ---------------------------------------------

        await sql`
            DELETE FROM news_updates
            WHERE id = ${id}
        `;


        // ---------------------------------------------
        // Delete Cloudinary image
        // ---------------------------------------------

        if (news.image_url) {
            try {
                await deleteFileFromCloudinary(
                    news.image_url
                );
            } catch (cloudinaryError) {
                console.error(
                    "Failed to delete Cloudinary image:",
                    cloudinaryError
                );
            }
        }


        return NextResponse.json({
            success: true,
            message: "News article deleted successfully",
        });

    } catch (error) {
        console.error("Delete news error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete news article",
            },
            { status: 500 }
        );
    }
}