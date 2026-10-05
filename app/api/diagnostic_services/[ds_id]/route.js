import { NextResponse } from "next/server";
import {
    sql,
} from "@/lib/db";

import {
    uploadFileToCloudinary,
    deleteFileFromCloudinary,
} from "@/lib/uploadToCloudinary";

import { requireAdmin } from "@/lib/auth";

import {
    getDiagnosticServiceById,
} from "@/lib/data/diagnostic/diagnostic";


// ============================================================
// GET - Get single diagnostic service
// ============================================================

export async function GET(request, { params }) {
    try {
        const { ds_id } = await params;

        if (!ds_id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid diagnostic service ID",
                },
                {
                    status: 400,
                }
            );
        }

        const service =
            await getDiagnosticServiceById(ds_id);

        if (!service) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Diagnostic service not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            service,
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "Error fetching diagnostic service:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error: "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}


// ============================================================
// PUT - Update diagnostic service
// ============================================================

export async function PUT(request, { params }) {
    try {

        // --------------------------------------------------------
        // Check admin authentication
        // --------------------------------------------------------

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


        // --------------------------------------------------------
        // Get ID
        // --------------------------------------------------------

        const { ds_id } = await params;

        if (!ds_id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid diagnostic service ID",
                },
                {
                    status: 400,
                }
            );
        }


        // --------------------------------------------------------
        // Check if service exists
        // --------------------------------------------------------

        const existingService = await sql`
            SELECT *
            FROM diagnostic_services
            WHERE id = ${ds_id};
        `;

        if (existingService.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Diagnostic service not found",
                },
                {
                    status: 404,
                }
            );
        }


        // --------------------------------------------------------
        // Read form data
        // --------------------------------------------------------

        const formData =
            await request.formData();

        const name =
            formData.get("name");

        const category =
            formData.get("category");

        const description =
            formData.get("description");

        const is_active =
            formData.get("is_active") === "true";

        const image =
            formData.get("image");


        // --------------------------------------------------------
        // Validate required fields
        // --------------------------------------------------------

        if (!name || !category) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Name and category are required",
                },
                {
                    status: 400,
                }
            );
        }


        // --------------------------------------------------------
        // Keep existing image
        // --------------------------------------------------------

        let image_url =
            existingService[0].image_url;


        // --------------------------------------------------------
        // Upload new image if provided
        // --------------------------------------------------------

        if (
            image &&
            image instanceof File &&
            image.size > 0
        ) {

            const uploaded =
                await uploadFileToCloudinary(
                    image,
                    "bmh/diagnostic-services"
                );

            image_url =
                uploaded.secure_url;


            // ----------------------------------------------------
            // Delete old Cloudinary image
            // ----------------------------------------------------

            if (
                existingService[0]
                    .image_url
            ) {
                await deleteFileFromCloudinary(
                    existingService[0]
                        .image_url
                );
            }
        }


        // --------------------------------------------------------
        // Update database
        // --------------------------------------------------------

        const result = await sql`
            UPDATE diagnostic_services
            SET
                name = ${name},
                category = ${category},
                description = ${
                    description || null
                },
                image_url = ${image_url},
                is_active = ${is_active},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${ds_id}
            RETURNING *;
        `;


        return NextResponse.json(
            {
                success: true,
                message:
                    "Diagnostic service updated successfully",
                data: result[0],
            },
            {
                status: 200,
            }
        );

    } catch (error) {

        console.error(
            "Error updating diagnostic service:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to update diagnostic service",
            },
            {
                status: 500,
            }
        );
    }
}


// ============================================================
// DELETE - Delete diagnostic service
// ============================================================

export async function DELETE(
    request,
    { params }
) {
    try {

        // --------------------------------------------------------
        // Check admin authentication
        // --------------------------------------------------------

        const admin =
            await requireAdmin();

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


        // --------------------------------------------------------
        // Get ID
        // --------------------------------------------------------

        const { ds_id } =
            await params;

        if (!ds_id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid diagnostic service ID",
                },
                {
                    status: 400,
                }
            );
        }


        // --------------------------------------------------------
        // Check if service exists
        // --------------------------------------------------------

        const existingService =
            await sql`
                SELECT *
                FROM diagnostic_services
                WHERE id = ${ds_id};
            `;

        if (
            existingService.length === 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Diagnostic service not found",
                },
                {
                    status: 404,
                }
            );
        }


        // --------------------------------------------------------
        // Store image URL before deleting record
        // --------------------------------------------------------

        const imageUrl =
            existingService[0]
                .image_url;


        // --------------------------------------------------------
        // Delete database record
        // --------------------------------------------------------

        const result = await sql`
            DELETE FROM diagnostic_services
            WHERE id = ${ds_id}
            RETURNING *;
        `;


        // --------------------------------------------------------
        // Delete Cloudinary image
        // --------------------------------------------------------

        if (imageUrl) {
            await deleteFileFromCloudinary(
                imageUrl
            );
        }


        // --------------------------------------------------------
        // Response
        // --------------------------------------------------------

        return NextResponse.json(
            {
                success: true,
                message:
                    "Diagnostic service deleted successfully",
                data: result[0],
            },
            {
                status: 200,
            }
        );

    } catch (error) {

        console.error(
            "Error deleting diagnostic service:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to delete diagnostic service",
            },
            {
                status: 500,
            }
        );
    }
}