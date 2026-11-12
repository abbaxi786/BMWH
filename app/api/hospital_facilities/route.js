import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import {
    uploadFileToCloudinary,
    deleteFileFromCloudinary,
} from "@/lib/uploadToCloudinary";
import {
    getHospitalFacilities,
    getHospitalFacilityById,
} from "@/lib/data/hospitalFacilities/hospitalFacilties";
import { revalidatePath } from "next/cache";

// =====================================================
// GET - Get all facilities OR one facility by ID
// =====================================================
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const facilityId = searchParams.get("facility_id");

        // Get a single facility
        if (facilityId) {
            const facility = await getHospitalFacilityById(facilityId);

            if (!facility) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Hospital facility not found",
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                {
                    success: true,
                    data: facility,
                },
                { status: 200 }
            );
        }

        // Get all facilities
        const facilities = await getHospitalFacilities();

        return NextResponse.json(
            {
                success: true,
                data: facilities,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching hospital facilities:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch hospital facilities",
            },
            { status: 500 }
        );
    }
}

// =====================================================
// POST - Create a new facility
// =====================================================
export async function POST(request) {
    try {
        await requireAdmin();

        const formData = await request.formData();

        const name = formData.get("name");
        const category = formData.get("category");
        const description = formData.get("description");
        const isActive = formData.get("is_active");
        const image = formData.get("image");

        // Validate required fields
        if (typeof name !== "string" || !name.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Facility name is required",
                },
                { status: 400 }
            );
        }

        if (typeof category !== "string" || !category.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Facility category is required",
                },
                { status: 400 }
            );
        }

        // Upload image if provided
        let imageUrl = null;

        if (image instanceof File && image.size > 0) {
            if (!image.type.startsWith("image/")) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Please upload a valid image",
                    },
                    { status: 400 }
                );
            }

            const uploadResult = await uploadFileToCloudinary(
                image,
                "bmh/facilities"
            );

            imageUrl = uploadResult.secure_url;
        }

        // Insert facility.
        // PostgreSQL should generate the ID automatically.
        const result = await sql`
            INSERT INTO hospital_facilities (
                name,
                category,
                description,
                image_url,
                is_active
            )
            VALUES (
                ${name.trim()},
                ${category.trim()},
                ${typeof description === "string" && description.trim()
                ? description.trim()
                : null},
                ${imageUrl},
                ${isActive === "true"}
            )
            RETURNING
                id,
                name,
                category,
                description,
                image_url,
                is_active,
                created_at,
                updated_at
        `;

        revalidatePath("/pages/facilities");
        revalidatePath(`/pages/facilities/${result[0].id}`);

        return NextResponse.json(
            {
                success: true,
                message: "Hospital facility created successfully",
                data: result[0],
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating hospital facility:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create hospital facility",
            },
            { status: 500 }
        );
    }
}

// =====================================================
// PUT - Update an existing facility
// =====================================================
export async function PUT(request) {
    try {
        await requireAdmin();

        // FIX: Read facility_id from the URL, not FormData.
        const { searchParams } = new URL(request.url);
        const facilityId = searchParams.get("facility_id");

        const formData = await request.formData();

        const name = formData.get("name");
        const category = formData.get("category");
        const description = formData.get("description");
        const isActive = formData.get("is_active");
        const image = formData.get("image");
        const removeImage = formData.get("remove_image");

        // Validate facility ID
        if (!facilityId || !/^\d+$/.test(facilityId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A valid facility ID is required",
                },
                { status: 400 }
            );
        }

        // Find existing facility
        const existingResult = await sql`
            SELECT
                id,
                name,
                category,
                description,
                image_url,
                is_active
            FROM hospital_facilities
            WHERE id = ${Number(facilityId)}
            LIMIT 1
        `;

        if (existingResult.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Hospital facility not found",
                },
                { status: 404 }
            );
        }

        const existingFacility = existingResult[0];

        // Validate provided values
        if (name !== null && (typeof name !== "string" || !name.trim())) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Facility name cannot be empty",
                },
                { status: 400 }
            );
        }

        if (
            category !== null &&
            (typeof category !== "string" || !category.trim())
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Facility category cannot be empty",
                },
                { status: 400 }
            );
        }

        // Keep existing image unless a replacement or removal is requested
        let imageUrl = existingFacility.image_url;

        // Upload replacement image
        if (image instanceof File && image.size > 0) {
            if (!image.type.startsWith("image/")) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Please upload a valid image",
                    },
                    { status: 400 }
                );
            }

            const uploadResult = await uploadFileToCloudinary(
                image,
                "bmh/facilities"
            );

            imageUrl = uploadResult.secure_url;
        } else if (removeImage === "true") {
            imageUrl = null;
        }

        // Update database record
        const result = await sql`
            UPDATE hospital_facilities
            SET
                name = ${name === null
                ? existingFacility.name
                : name.trim()},
                category = ${category === null
                ? existingFacility.category
                : category.trim()},
                description = ${description === null
                ? existingFacility.description
                : (description.trim() || null)},
                image_url = ${imageUrl},
                is_active = ${isActive === null
                ? existingFacility.is_active
                : isActive === "true"},
                updated_at = NOW()
            WHERE id = ${Number(facilityId)}
            RETURNING
                id,
                name,
                category,
                description,
                image_url,
                is_active,
                created_at,
                updated_at
        `;

        // Delete the previous Cloudinary image after successful database update
        const imageWasReplaced =
            image instanceof File && image.size > 0;

        const shouldDeleteOldImage =
            existingFacility.image_url &&
            (imageWasReplaced || removeImage === "true");

        if (shouldDeleteOldImage) {
            try {
                await deleteFileFromCloudinary(existingFacility.image_url);
            } catch (cloudinaryError) {
                console.error(
                    "Failed to delete old Cloudinary image:",
                    cloudinaryError
                );
            }
        }

        revalidatePath("/pages/facilities");
        revalidatePath(`/pages/facilities/${facilityId}`);

        return NextResponse.json(
            {
                success: true,
                message: "Hospital facility updated successfully",
                data: result[0],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating hospital facility:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update hospital facility",
            },
            { status: 500 }
        );
    }
}

// =====================================================
// DELETE - Delete a facility
// =====================================================
export async function DELETE(request) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(request.url);
        const facilityId = searchParams.get("facility_id");

        // Validate facility ID
        if (!facilityId || !/^\d+$/.test(facilityId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A valid facility ID is required",
                },
                { status: 400 }
            );
        }

        // Find facility before deleting
        const existingResult = await sql`
            SELECT id, image_url
            FROM hospital_facilities
            WHERE id = ${Number(facilityId)}
            LIMIT 1
        `;

        if (existingResult.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Hospital facility not found",
                },
                { status: 404 }
            );
        }

        const existingFacility = existingResult[0];

        // Delete database record
        await sql`
            DELETE FROM hospital_facilities
            WHERE id = ${Number(facilityId)}
        `;

        // Delete associated Cloudinary image
        if (existingFacility.image_url) {
            try {
                await deleteFileFromCloudinary(existingFacility.image_url);
            } catch (cloudinaryError) {
                console.error(
                    "Failed to delete Cloudinary image:",
                    cloudinaryError
                );
            }
        }

        revalidatePath("/pages/facilities");
        revalidatePath(`/pages/facilities/${facilityId}`);

        return NextResponse.json(
            {
                success: true,
                message: "Hospital facility deleted successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting hospital facility:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete hospital facility",
            },
            { status: 500 }
        );
    }
}