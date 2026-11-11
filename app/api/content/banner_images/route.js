import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getBannerImages } from "../../../../lib/data/home_page/home_page";
import {
    uploadFileToCloudinary,
    deleteFileFromCloudinary,
} from "@/lib/uploadToCloudinary";
import { revalidateTag } from "next/cache";


export const runtime = "nodejs";

export async function POST(request) {
    try {
        // Authenticate admin
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized person",
                },
                { status: 401 }
            );
        }

        // Read multipart form data
        const formData = await request.formData();

        const image = formData.get("image");
        const alt = formData.get("alt");

        // Validate image
        if (
            !image ||
            typeof image === "string" ||
            typeof image.arrayBuffer !== "function" ||
            image.size === 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A valid image is required",
                },
                { status: 400 }
            );
        }

        // Validate image type
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
        ];

        if (!allowedTypes.includes(image.type)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only JPEG, PNG, WebP, and AVIF images are allowed",
                },
                { status: 400 }
            );
        }

        // Limit image size to 5 MB
        const MAX_FILE_SIZE = 5 * 1024 * 1024;

        if (image.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Image size must not exceed 5 MB",
                },
                { status: 400 }
            );
        }

        // Validate alt text
        const imageAlt = typeof alt === "string" ? alt.trim() : "";

        if (imageAlt.length > 255) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Alt text must not exceed 255 characters",
                },
                { status: 400 }
            );
        }

        // Upload image to Cloudinary
        const uploadResult = await uploadFileToCloudinary(image);

        // Support common upload helper return formats
        const imageUrl =
            typeof uploadResult === "string"
                ? uploadResult
                : uploadResult?.secure_url || uploadResult?.url;

        if (!imageUrl || typeof imageUrl !== "string") {
            throw new Error("Image upload did not return a valid URL");
        }

        // Save image URL and alt text in PostgreSQL
        const result = await sql`
            INSERT INTO bannerImages (alt, src)
            VALUES (${imageAlt || null}, ${imageUrl})
            RETURNING id, alt, src
        `;

        revalidateTag("banner-images", "max");

        return NextResponse.json(
            {
                success: true,
                message: "Banner image uploaded successfully",
                data: result[0],
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Banner image upload error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to upload banner image",
            },
            { status: 500 }
        );
    }
}

// Get all banner images
export async function GET() {
    try {
        const result = await getBannerImages();

        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Fetch banner images error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch banner images",
            },
            { status: 500 }
        );
    }
}


// DELETE: Remove banner image from Cloudinary (if applicable) and database
export async function DELETE(request) {
    try {
        // 1. Authenticate admin
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized person",
                },
                { status: 401 }
            );
        }

        // 2. Validate image ID
        const { searchParams } = new URL(request.url);
        const idParam = searchParams.get("id");

        if (!idParam || !/^[1-9]\d*$/.test(idParam)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A valid banner image ID is required",
                },
                { status: 400 }
            );
        }

        const id = Number(idParam);

        if (!Number.isSafeInteger(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid banner image ID",
                },
                { status: 400 }
            );
        }

        // 3. Find the existing banner image
        const existing = await sql`
            SELECT id, src
            FROM bannerImages
            WHERE id = ${id}
            LIMIT 1
        `;

        if (existing.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Banner image not found",
                },
                { status: 404 }
            );
        }

        const imageUrl = existing[0].src;

        // 4. Delete from Cloudinary only if this is a Cloudinary URL
        const isCloudinaryUrl =
            typeof imageUrl === "string" &&
            /^https?:\/\/res\.cloudinary\.com\//i.test(imageUrl);

        if (isCloudinaryUrl) {
            const cloudinaryResult =
                await deleteFileFromCloudinary(imageUrl);

            // Cloudinary destroy() returns result: "ok" or "not found".
            // "not found" means the asset is already absent.
            if (
                cloudinaryResult &&
                cloudinaryResult.result &&
                !["ok", "not found"].includes(
                    cloudinaryResult.result
                )
            ) {
                throw new Error(
                    `Cloudinary deletion failed: ${cloudinaryResult.result}`
                );
            }
        }

        // 5. Delete the database row
        const deleted = await sql`
            DELETE FROM bannerImages
            WHERE id = ${id}
            RETURNING id
        `;

        if (deleted.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to delete the banner image record",
                },
                { status: 500 }
            );
        }

        revalidateTag("banner-images", "max");

        // 6. Return success
        return NextResponse.json(
            {
                success: true,
                message: isCloudinaryUrl
                    ? "Banner image deleted successfully"
                    : "Banner image record deleted successfully. The local image file was not deleted.",
                data: {
                    id: deleted[0].id,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Banner image deletion error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete banner image",
            },
            { status: 500 }
        );
    }
}
