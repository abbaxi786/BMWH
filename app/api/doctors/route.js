import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
    uploadFileToCloudinary,
    deleteFileFromCloudinary,
} from "@/lib/uploadToCloudinary";
import { requireAdmin } from "@/lib/auth";

import {
    getDoctorById,
} from "@/lib/data/doctors/doctors";


// ============================================================
// POST - CREATE DOCTOR
// ============================================================

export async function POST(request) {
    try {
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const formData = await request.formData();

        const department_id = formData.get("department_id");
        const name = formData.get("name");
        const doctor_type = formData.get("doctor_type");
        const designation = formData.get("designation");
        const specialty = formData.get("specialty");
        const qualifications = formData.get("qualifications");
        const biography = formData.get("biography");
        const expertise = formData.get("expertise");
        const profile_link = formData.get("profile_link");
        const is_active = formData.get("is_active") === "true";

        const photo = formData.get("photo");

        if (
            !department_id ||
            !name ||
            !doctor_type ||
            !designation
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "department_id, name, doctor_type and designation are required",
                },
                {
                    status: 400,
                }
            );
        }

        let photo_url = null;

        // ----------------------------------------------------
        // Upload doctor photo
        // ----------------------------------------------------

        if (
            photo &&
            typeof photo.arrayBuffer === "function"
        ) {
            const uploadedPhoto =
                await uploadFileToCloudinary(
                    photo,
                    "bmh/doctors"
                );

            photo_url = uploadedPhoto.secure_url;
        }

        // ----------------------------------------------------
        // Insert doctor
        // ----------------------------------------------------

        const result = await sql`
            INSERT INTO doctors
            (
                department_id,
                name,
                doctor_type,
                designation,
                specialty,
                qualifications,
                biography,
                expertise,
                photo_url,
                profile_link,
                is_active
            )
            VALUES
            (
                ${department_id},
                ${name},
                ${doctor_type},
                ${designation},
                ${specialty},
                ${qualifications},
                ${biography},
                ${expertise},
                ${photo_url},
                ${profile_link},
                ${is_active}
            )
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message: "Doctor created successfully",
                data: result[0],
            },
            {
                status: 201,
            }
        );

    } catch (error) {
        console.error("Create doctor error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to create doctor",
            },
            {
                status: 500,
            }
        );
    }
}


// ============================================================
// GET - GET SINGLE DOCTOR
// ============================================================

export async function GET(request) {
    try {
        const { searchParams } =
            new URL(request.url);

        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "ID is required",
                },
                {
                    status: 400,
                }
            );
        }

        // ----------------------------------------------------
        // Use data-layer function
        // ----------------------------------------------------

        const doctor = await getDoctorById(id);

        if (!doctor) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Doctor not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: doctor,
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "Get doctor error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to fetch doctor",
            },
            {
                status: 500,
            }
        );
    }
}


// ============================================================
// PUT - UPDATE DOCTOR
// ============================================================

export async function PUT(request) {
    try {
        // ----------------------------------------------------
        // Check admin authentication
        // ----------------------------------------------------

        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        // ----------------------------------------------------
        // Get doctor ID
        // ----------------------------------------------------

        const { searchParams } =
            new URL(request.url);

        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Doctor ID is required",
                },
                {
                    status: 400,
                }
            );
        }

        // ----------------------------------------------------
        // Get existing doctor
        // ----------------------------------------------------

        const existingDoctor = await sql`
            SELECT *
            FROM doctors
            WHERE id = ${id}
        `;

        if (existingDoctor.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Doctor not found",
                },
                {
                    status: 404,
                }
            );
        }

        const currentDoctor =
            existingDoctor[0];

        // ----------------------------------------------------
        // Read form data
        // ----------------------------------------------------

        const formData =
            await request.formData();

        const department_id =
            formData.get("department_id");

        const name =
            formData.get("name");

        const doctor_type =
            formData.get("doctor_type");

        const designation =
            formData.get("designation");

        const specialty =
            formData.get("specialty");

        const qualifications =
            formData.get("qualifications");

        const biography =
            formData.get("biography");

        const expertise =
            formData.get("expertise");

        const profile_link =
            formData.get("profile_link");

        const is_active =
            formData.get("is_active") === "true";

        const photo =
            formData.get("photo");

        const remove_photo =
            formData.get("remove_photo") === "true";

        // ----------------------------------------------------
        // Validate required fields
        // ----------------------------------------------------

        if (
            !department_id ||
            !name ||
            !doctor_type ||
            !designation
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "department_id, name, doctor_type and designation are required",
                },
                {
                    status: 400,
                }
            );
        }

        // ----------------------------------------------------
        // Determine photo URL
        // ----------------------------------------------------

        let photo_url =
            currentDoctor.photo_url;

        // ----------------------------------------------------
        // New photo selected
        // ----------------------------------------------------

        if (
            photo &&
            typeof photo.arrayBuffer === "function"
        ) {
            const uploadedPhoto =
                await uploadFileToCloudinary(
                    photo,
                    "bmh/doctors"
                );

            photo_url =
                uploadedPhoto.secure_url;
        }

        // ----------------------------------------------------
        // Existing photo removed
        // ----------------------------------------------------

        else if (remove_photo) {
            photo_url = null;
        }

        // ----------------------------------------------------
        // Update doctor
        // ----------------------------------------------------

        const result = await sql`
            UPDATE doctors
            SET
                department_id = ${department_id},
                name = ${name},
                doctor_type = ${doctor_type},
                designation = ${designation},
                specialty = ${specialty},
                qualifications = ${qualifications},
                biography = ${biography},
                expertise = ${expertise},
                photo_url = ${photo_url},
                profile_link = ${profile_link},
                is_active = ${is_active}
            WHERE id = ${id}
            RETURNING *;
        `;

        // ----------------------------------------------------
        // Delete old Cloudinary image
        // ----------------------------------------------------

        if (
            currentDoctor.photo_url &&
            photo_url !== currentDoctor.photo_url
        ) {
            try {
                await deleteFileFromCloudinary(
                    currentDoctor.photo_url
                );
            } catch (cloudinaryError) {
                console.error(
                    "Failed to delete old doctor photo from Cloudinary:",
                    cloudinaryError
                );
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: "Doctor updated successfully",
                data: result[0],
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "Update doctor error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to update doctor",
            },
            {
                status: 500,
            }
        );
    }
}


// ============================================================
// DELETE - DELETE DOCTOR
// ============================================================

export async function DELETE(request) {
    try {
        // ----------------------------------------------------
        // Check admin authentication
        // ----------------------------------------------------

        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        // ----------------------------------------------------
        // Get doctor ID
        // ----------------------------------------------------

        const { searchParams } =
            new URL(request.url);

        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Doctor ID is required",
                },
                {
                    status: 400,
                }
            );
        }

        // ----------------------------------------------------
        // Get doctor before deleting
        // ----------------------------------------------------

        const existingDoctor = await sql`
            SELECT *
            FROM doctors
            WHERE id = ${id}
        `;

        if (existingDoctor.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Doctor not found",
                },
                {
                    status: 404,
                }
            );
        }

        const doctor =
            existingDoctor[0];

        // ----------------------------------------------------
        // Delete doctor
        // ----------------------------------------------------

        await sql`
            DELETE FROM doctors
            WHERE id = ${id}
        `;

        // ----------------------------------------------------
        // Delete Cloudinary photo
        // ----------------------------------------------------

        if (doctor.photo_url) {
            try {
                await deleteFileFromCloudinary(
                    doctor.photo_url
                );
            } catch (cloudinaryError) {
                console.error(
                    "Failed to delete doctor photo from Cloudinary:",
                    cloudinaryError
                );
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: "Doctor deleted successfully",
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "Delete doctor error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to delete doctor",
            },
            {
                status: 500,
            }
        );
    }
}