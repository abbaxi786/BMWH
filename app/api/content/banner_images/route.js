import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import {
    uploadFileToCloudinary,
    deleteFileFromCloudinary,
} from "@/lib/uploadToCloudinary";


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
        const result = await sql`
            SELECT id, alt, src
            FROM bannerImages
            ORDER BY id ASC
        `;

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


// DELETE: Remove banner image from Cloudinary and database
export async function DELETE(request) {
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

        // Read image ID from query string
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

        // Find the image before deleting anything
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

        // Delete from Cloudinary first.
        // This assumes your helper accepts the stored image URL.
        const cloudinaryResult =
            await deleteFileFromCloudinary(imageUrl);

        // If your helper returns false on failure, do not delete the DB row.
        if (cloudinaryResult === false) {
            throw new Error("Cloudinary image deletion failed");
        }

        // Delete the database record after Cloudinary deletion succeeds
        const deleted = await sql`
            DELETE FROM bannerImages
            WHERE id = ${id}
            RETURNING id
        `;

        if (deleted.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "The Cloudinary image was deleted, but the database record could not be deleted.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Banner image deleted successfully",
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