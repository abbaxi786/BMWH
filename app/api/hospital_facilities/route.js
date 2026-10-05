import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

import {
    uploadFileToCloudinary,
    deleteFileFromCloudinary,
} from "@/lib/uploadToCloudinary";

import {getHospitalFacilities,getHospitalFacilityById} from "@/lib/data/hospitalFacilities/hospitalFacilties"


// =====================================================
// GET - Get all facilities OR one facility by ID
// =====================================================

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const facilityId = searchParams.get("facility_id");

        // =================================================
        // Get single facility
        // =================================================

        if (facilityId) {
            const facility = await getHospitalFacilityById(
                facilityId
            );

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

        // =================================================
        // Get all facilities
        // =================================================

        const facilities = await getHospitalFacilities();

        return NextResponse.json(
            {
                success: true,
                data: facilities,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(
            "Error fetching hospital facilities:",
            error
        );

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
        // Check admin authentication
        await requireAdmin();

        const formData = await request.formData();

        const name = formData.get("name");
        const category = formData.get("category");
        const description = formData.get("description");
        const isActive = formData.get("is_active");
        const image = formData.get("image");

        // =================================================
        // Validate required fields
        // =================================================

        if (!name) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Facility name is required",
                },
                { status: 400 }
            );
        }

        // =================================================
        // Upload image
        // =================================================

        let imageUrl = null;

        if (image && image.size > 0) {
            const uploadResult = await uploadFileToCloudinary(
                image,
                "bmh/facilities"
            );

            // Your existing function returns the Cloudinary result
            imageUrl = uploadResult.secure_url;
        }

        // =================================================
        // Insert facility
        // =================================================

        const result = await sql`
            INSERT INTO hospital_facilities (
                name,
                category,
                description,
                image_url,
                is_active
            )
            VALUES (
                ${name},
                ${category || null},
                ${description || null},
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

        return NextResponse.json(
            {
                success: true,
                message: "Hospital facility created successfully",
                data: result[0],
            },
            { status: 201 }
        );

    } catch (error) {
        console.error(
            "Error creating hospital facility:",
            error
        );

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
        // Check admin authentication
        await requireAdmin();

        const formData = await request.formData();

        const facilityId = formData.get("facility_id");
        const name = formData.get("name");
        const category = formData.get("category");
        const description = formData.get("description");
        const isActive = formData.get("is_active");
        const image = formData.get("image");
        const removeImage = formData.get("remove_image");

        // =================================================
        // Validate facility ID
        // =================================================

        if (!facilityId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Facility ID is required",
                },
                { status: 400 }
            );
        }

        // =================================================
        // Get existing facility
        // =================================================

        const existingResult = await sql`
            SELECT
                id,
                name,
                category,
                description,
                image_url,
                is_active
            FROM hospital_facilities
            WHERE id = ${facilityId}
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

        let imageUrl = existingFacility.image_url;

        // =================================================
        // Upload new image
        // =================================================

        if (image && image.size > 0) {
            const uploadResult = await uploadFileToCloudinary(
                image,
                "bmh/facilities"
            );

            imageUrl = uploadResult.secure_url;
        }

        // =================================================
        // Remove image
        // =================================================

        if (removeImage === "true") {
            imageUrl = null;
        }

        // =================================================
        // Update facility
        // =================================================

        const result = await sql`
            UPDATE hospital_facilities
            SET
                name = ${name || existingFacility.name},
                category = ${category || null},
                description = ${description || null},
                image_url = ${imageUrl},
                is_active = ${isActive === "true"},
                updated_at = NOW()
            WHERE id = ${facilityId}
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

        // =================================================
        // Delete old image
        // =================================================

        if (
            existingFacility.image_url &&
            (
                (image && image.size > 0) ||
                removeImage === "true"
            )
        ) {
            try {
                await deleteFileFromCloudinary(
                    existingFacility.image_url
                );
            } catch (cloudinaryError) {
                console.error(
                    "Failed to delete old Cloudinary image:",
                    cloudinaryError
                );
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: "Hospital facility updated successfully",
                data: result[0],
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(
            "Error updating hospital facility:",
            error
        );

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
        // Check admin authentication
        await requireAdmin();

        const { searchParams } = new URL(request.url);

        const facilityId = searchParams.get("facility_id");

        // =================================================
        // Validate facility ID
        // =================================================

        if (!facilityId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Facility ID is required",
                },
                { status: 400 }
            );
        }

        // =================================================
        // Get facility before deleting
        // =================================================

        const existingResult = await sql`
            SELECT
                id,
                image_url
            FROM hospital_facilities
            WHERE id = ${facilityId}
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

        // =================================================
        // Delete from database
        // =================================================

        await sql`
            DELETE FROM hospital_facilities
            WHERE id = ${facilityId}
        `;

        // =================================================
        // Delete image from Cloudinary
        // =================================================

        if (existingFacility.image_url) {
            try {
                await deleteFileFromCloudinary(
                    existingFacility.image_url
                );
            } catch (cloudinaryError) {
                console.error(
                    "Failed to delete Cloudinary image:",
                    cloudinaryError
                );
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: "Hospital facility deleted successfully",
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(
            "Error deleting hospital facility:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete hospital facility",
            },
            { status: 500 }
        );
    }
}