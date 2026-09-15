import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
    uploadFileToCloudinary,
    deleteFileFromCloudinary,
} from "@/lib/uploadToCloudinary";
import { requireAdmin } from "@/lib/auth";


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

        // Upload doctor photo
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

        const result = await sql`
            SELECT
                doctors.*,
                departments.name AS department_name
            FROM doctors
            INNER JOIN departments
                ON doctors.department_id = departments.id
            WHERE doctors.id = ${id}
        `;

        if (result.length === 0) {
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
                data: result[0],
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
            formData.get("is_active") ===
            "true";

        const photo =
            formData.get("photo");

        const remove_photo =
            formData.get("remove_photo") ===
            "true";

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

        // Case 1:
        // A new photo was selected
        //
        // The new photo will replace the old photo.
        // ----------------------------------------------------

        if (
            photo &&
            typeof photo.arrayBuffer ===
                "function"
        ) {
            const uploadedPhoto =
                await uploadFileToCloudinary(
                    photo,
                    "bmh/doctors"
                );

            photo_url =
                uploadedPhoto.secure_url;
        }

        // Case 2:
        // User explicitly removed existing photo
        // and did not upload a new one.
        // ----------------------------------------------------

        else if (remove_photo) {
            photo_url = null;
        }

        // ----------------------------------------------------
        // Update doctor in database
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
        // Delete old Cloudinary photo
        //
        // This happens only if the photo changed or
        // was removed.
        // ----------------------------------------------------

        if (
            currentDoctor.photo_url &&
            photo_url !==
                currentDoctor.photo_url
        ) {
            try {
                await deleteFileFromCloudinary(
                    currentDoctor.photo_url
                );
            } catch (cloudinaryError) {
                // Do not fail the database update
                // just because Cloudinary deletion failed.

                console.error(
                    "Failed to delete old doctor photo from Cloudinary:",
                    cloudinaryError
                );
            }
        }

        return NextResponse.json(
            {
                success: true,
                message:
                    "Doctor updated successfully",
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
        //
        // We need photo_url so we can delete the
        // Cloudinary image afterwards.
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
        // Delete doctor from database
        // ----------------------------------------------------

        await sql`
            DELETE FROM doctors
            WHERE id = ${id}
        `;

        // ----------------------------------------------------
        // Delete doctor's photo from Cloudinary
        // ----------------------------------------------------

        if (doctor.photo_url) {
            try {
                await deleteFileFromCloudinary(
                    doctor.photo_url
                );
            } catch (cloudinaryError) {
                // Database deletion already succeeded.
                // Do not return a failed DELETE response
                // just because Cloudinary failed.

                console.error(
                    "Failed to delete doctor photo from Cloudinary:",
                    cloudinaryError
                );
            }
        }

        return NextResponse.json(
            {
                success: true,
                message:
                    "Doctor deleted successfully",
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