import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAboutOverview } from "../../../../../lib/data/aboutSectionQuery/AboutOverview";
import {
    uploadFileToCloudinary,
} from "../../../../../lib/uploadToCloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: Fetch About Banner Content
export async function GET() {
    try {
        const aboutOverview = await getAboutOverview();

        if (!aboutOverview) {
            return NextResponse.json(
                {
                    success: false,
                    message: "About banner content not found.",
                    data: null,
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "About banner content fetched successfully.",
                data: aboutOverview,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET About Banner Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch About banner content.",
            },
            { status: 500 }
        );
    }
}

// PATCH: Update About Banner Content and optionally upload a new image
export async function PATCH(request) {
    try {
        const contentType = request.headers.get("content-type") || "";

        let body = {};
        let imageFile = null;

        // Support multipart FormData for image uploads.
        // JSON is also supported for text-only updates.
        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();

            imageFile = formData.get("bannerImageFile");

            for (const [key, value] of formData.entries()) {
                if (key === "bannerImageFile") continue;

                if (typeof value === "string") {
                    body[key] = value;
                }
            }

            if (!(imageFile instanceof File) || imageFile.size === 0) {
                imageFile = null;
            }
        } else {
            body = await request.json();
        }

        const allowedFields = {
            eyebrow: "eyebrow",
            title: "title",
            highlightedTitle: "highlighted_title",
            subtitle: "subtitle",
            bannerImage: "banner_image",
            imageAlt: "image_alt",
            floatingTitle: "floating_title",
            floatingSubtitle: "floating_subtitle",
            contactUrl: "contact_url",
            departmentsUrl: "departments_url",
        };

        const existing = await getAboutOverview();

        if (!existing) {
            return NextResponse.json(
                {
                    success: false,
                    message: "About banner content not found.",
                },
                { status: 404 }
            );
        }

        // Upload the selected image to Cloudinary.
        if (imageFile) {
            if (!imageFile.type.startsWith("image/")) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Please upload a valid image file.",
                    },
                    { status: 400 }
                );
            }

            const maxSize = 10 * 1024 * 1024;

            if (imageFile.size > maxSize) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Image size must not exceed 10 MB.",
                    },
                    { status: 400 }
                );
            }

            const uploadedImage = await uploadFileToCloudinary(imageFile);

            // Supports either a URL string or a common Cloudinary result object.
            const imageUrl =
                typeof uploadedImage === "string"
                    ? uploadedImage
                    : uploadedImage?.secure_url ||
                      uploadedImage?.url ||
                      uploadedImage?.imageUrl;

            if (!imageUrl) {
                throw new Error(
                    "Cloudinary upload did not return an image URL."
                );
            }

            // The uploaded Cloudinary URL replaces the previous banner image.
            body.bannerImage = imageUrl;
        }

        const updates = Object.entries(allowedFields).filter(([key]) =>
            Object.prototype.hasOwnProperty.call(body, key)
        );

        if (updates.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No valid fields provided to update.",
                },
                { status: 400 }
            );
        }

        const setClauses = [];
        const values = [];

        for (const [key, column] of updates) {
            values.push(body[key]);
            setClauses.push(`${column} = $${values.length}`);
        }

        setClauses.push("updated_at = NOW()");
        values.push(existing.id);

        const query = `
            UPDATE about_overview
            SET ${setClauses.join(", ")}
            WHERE id = $${values.length}
            RETURNING
                id,
                eyebrow,
                title,
                highlighted_title AS "highlightedTitle",
                subtitle,
                banner_image AS "bannerImage",
                image_alt AS "imageAlt",
                floating_title AS "floatingTitle",
                floating_subtitle AS "floatingSubtitle",
                contact_url AS "contactUrl",
                departments_url AS "departmentsUrl",
                updated_at AS "updatedAt"
        `;

        const result = await sql.query(query, values);
        const updatedContent = result.rows?.[0] ?? result[0] ?? null;

        if (!updatedContent) {
            return NextResponse.json(
                {
                    success: false,
                    message: "About banner content could not be updated.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: imageFile
                    ? "About banner content and image updated successfully."
                    : "About banner content updated successfully.",
                data: updatedContent,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("PATCH About Banner Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update About banner content.",
                error:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
            },
            { status: 500 }
        );
    }
}
