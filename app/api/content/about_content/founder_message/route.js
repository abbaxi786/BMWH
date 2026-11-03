
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
    uploadFileToCloudinary,
    deleteFileFromCloudinary,
} from "../../../../../lib/uploadToCloudinary";

import {
    getFounderMessage,
    updateFounderMessage,
} from "../../../../../lib/data/aboutSectionQuery/founderMessage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const textFields = [
    "section_label",
    "heading",
    "founder_name",
    "designation",
    "message",
    "read_more_text",
    "read_more_url",
    "english_quote",
    "urdu_quote",
    "quranic_ayat",
    "quranic_surah",
    "quranic_translation",
    "quranic_translation_language",
];

const nullableTextFields = [
    "english_quote",
    "urdu_quote",
    "quranic_ayat",
    "quranic_surah",
    "quranic_translation",
];

function parseOptionalNumber(value, fieldName) {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    const number = Number(value);

    if (!Number.isInteger(number) || number < 1) {
        throw new Error(`${fieldName} must be a positive integer.`);
    }

    return number;
}

function isCloudinaryUrl(url) {
    return (
        typeof url === "string" &&
        /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//i.test(url)
    );
}

function parseBoolean(value, fallback) {
    if (value === null || value === undefined || value === "") {
        return fallback;
    }

    if (value === true || value === "true" || value === "1") {
        return true;
    }

    if (value === false || value === "false" || value === "0") {
        return false;
    }

    throw new Error("is_active must be true or false.");
}

// Public content endpoint: used by SSR when needed by clients too.
export async function GET() {
    try {
        const founder = await getFounderMessage();

        if (!founder) {
            return NextResponse.json(
                { success: false, message: "Founder message not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: founder },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (error) {
        console.error("GET founder message error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch founder message." },
            { status: 500 }
        );
    }
}

// Admin-only update endpoint.
export async function PUT(request) {
    let uploadedPublicId = null;

    try {
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Unauthorized." },
                { status: 401 }
            );
        }

        const current = await getFounderMessage();

        if (!current) {
            return NextResponse.json(
                { success: false, message: "Founder record with id 1 not found." },
                { status: 404 }
            );
        }

        const formData = await request.formData();

        // Preserve existing values when a field is omitted.
        const data = { ...current };

        for (const field of textFields) {
            if (formData.has(field)) {
                const value = formData.get(field);

                if (typeof value !== "string") {
                    return NextResponse.json(
                        { success: false, message: `Invalid field: ${field}` },
                        { status: 400 }
                    );
                }

                data[field] = nullableTextFields.includes(field)
                    ? value.trim() || null
                    : value.trim();
            }
        }

        if (formData.has("quranic_surah_number")) {
            data.quranic_surah_number = parseOptionalNumber(
                formData.get("quranic_surah_number"),
                "quranic_surah_number"
            );
        }

        if (formData.has("quranic_ayat_number")) {
            data.quranic_ayat_number = parseOptionalNumber(
                formData.get("quranic_ayat_number"),
                "quranic_ayat_number"
            );
        }

        data.is_active = parseBoolean(
            formData.get("is_active"),
            current.is_active
        );

        // Validate required fields.
        if (!data.founder_name || !data.message) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Founder name and message are required.",
                },
                { status: 400 }
            );
        }

        const image = formData.get("image");
        const hasNewImage =
            image instanceof File && image.size > 0;

        const oldImageUrl = current.image_url;
        const oldPublicId = current.image_public_id;

        if (hasNewImage) {
            if (!image.type.startsWith("image/")) {
                return NextResponse.json(
                    { success: false, message: "Please upload an image file." },
                    { status: 400 }
                );
            }

            // Adjust this call/response mapping if your existing helper
            // uses different argument or return property names.
            const uploaded = await uploadFileToCloudinary(
                image,
                "founder_message"
            );

            data.image_url =
                uploaded.secure_url ??
                uploaded.url ??
                uploaded.imageUrl;

            uploadedPublicId =
                uploaded.public_id ??
                uploaded.publicId ??
                uploaded.public_id_string;

            if (!data.image_url || !uploadedPublicId) {
                throw new Error(
                    "Cloudinary upload did not return an image URL and public ID."
                );
            }

            data.image_public_id = uploadedPublicId;
        }

        // Update database first, so a failed upload/update never removes
        // the previous image prematurely.
        const updated = await updateFounderMessage(data);

        if (!updated) {
            // Best-effort cleanup of the newly uploaded asset.
            if (uploadedPublicId) {
                try {
                    await deleteFileFromCloudinary(uploadedPublicId);
                } catch (cleanupError) {
                    console.error(
                        "Could not clean up new Cloudinary image:",
                        cleanupError
                    );
                }
            }

            return NextResponse.json(
                { success: false, message: "Founder record was not updated." },
                { status: 404 }
            );
        }

        // Delete the old asset only after the database update succeeds.
        if (
            hasNewImage &&
            oldImageUrl &&
            isCloudinaryUrl(oldImageUrl) &&
            oldPublicId &&
            oldPublicId !== uploadedPublicId
        ) {
            try {
                await deleteFileFromCloudinary(oldPublicId);
            } catch (deleteError) {
                // The database already points to the new image.
                // Log deletion failure so the old asset can be cleaned up later.
                console.error(
                    "Could not delete previous Cloudinary image:",
                    deleteError
                );
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: "Founder message updated successfully.",
                data: updated,
            },
            { status: 200 }
        );
    } catch (error) {
        // Clean up a newly uploaded asset if the operation failed before
        // the database was successfully updated.
        if (uploadedPublicId) {
            try {
                await deleteFileFromCloudinary(uploadedPublicId);
            } catch (cleanupError) {
                console.error("Cloudinary cleanup failed:", cleanupError);
            }
        }

        console.error("PUT founder message error:", error);

        const isValidationError =
            error instanceof Error &&
            /must be a positive integer|is_active must be true or false/i.test(
                error.message
            );

        return NextResponse.json(
            {
                success: false,
                message: isValidationError
                    ? error.message
                    : "Failed to update founder message.",
            },
            { status: isValidationError ? 400 : 500 }
        );
    }
}
