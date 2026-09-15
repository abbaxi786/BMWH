import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

import {
    uploadFileToCloudinary,
    deleteFileFromCloudinary,
} from "@/lib/uploadToCloudinary";

import { requireAdmin } from "@/lib/auth";

/*
|--------------------------------------------------------------------------
| POST - Create Department Service
|--------------------------------------------------------------------------
*/
export async function POST(request) {
    try {
        /*
         * Only admin can create services
         */
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

        const department_id =
            formData.get("department_id");

        const name =
            formData.get("name");

        const description =
            formData.get("description");

        const is_active =
            formData.get("is_active") === "true";

        const image =
            formData.get("image");

        /*
         * Validate required fields
         */
        if (!department_id || !name) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "department_id and name are required",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Upload image if provided
         */
        let image_url = null;

        if (
            image &&
            typeof image.arrayBuffer === "function"
        ) {
            const uploaded =
                await uploadFileToCloudinary(
                    image,
                    "bmh/department-services"
                );

            image_url =
                uploaded.secure_url;
        }

        /*
         * Insert service
         */
        const result = await sql`
            INSERT INTO department_services
                (
                    department_id,
                    name,
                    description,
                    image_url,
                    is_active
                )
            VALUES
                (
                    ${department_id},
                    ${name},
                    ${description},
                    ${image_url},
                    ${is_active}
                )
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message:
                    "Department service created successfully",
                data: result[0],
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(
            "Create department service error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to create department service",
            },
            {
                status: 500,
            }
        );
    }
}


/*
|--------------------------------------------------------------------------
| GET - Get Department Services
|--------------------------------------------------------------------------
*/
export async function GET(request) {
    try {
        const { searchParams } =
            new URL(request.url);

        const department_id =
            searchParams.get("department_id");

        if (!department_id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "department_id is required",
                },
                {
                    status: 400,
                }
            );
        }

        const result = await sql`
            SELECT *
            FROM department_services
            WHERE department_id = ${department_id}
            ORDER BY id ASC;
        `;

        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "Get department services error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to get department services",
            },
            {
                status: 500,
            }
        );
    }
}


/*
|--------------------------------------------------------------------------
| PUT - Update Department Service
|--------------------------------------------------------------------------
|
| URL:
| PUT /api/department_services?id=1
|
|--------------------------------------------------------------------------
*/
export async function PUT(request) {
    try {
        /*
         * Only admin can update services
         */
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

        /*
         * Get service ID
         */
        const { searchParams } =
            new URL(request.url);

        const id =
            searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Service id is required",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Find existing service
         */
        const existing =
            await sql`
                SELECT *
                FROM department_services
                WHERE id = ${id}
                LIMIT 1;
            `;

        if (existing.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Department service not found",
                },
                {
                    status: 404,
                }
            );
        }

        const currentService =
            existing[0];

        /*
         * Read FormData
         */
        const formData =
            await request.formData();

        const department_id =
            formData.get("department_id");

        const name =
            formData.get("name");

        const description =
            formData.get("description");

        const is_active =
            formData.get("is_active") === "true";

        const image =
            formData.get("image");

        const remove_image =
            formData.get("remove_image") === "true";

        /*
         * Validate required fields
         */
        if (!department_id || !name) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "department_id and name are required",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Start with existing image
         */
        let image_url =
            currentService.image_url;

        let newImageUploaded = false;

        /*
         * -------------------------------------------------------
         * CASE 1:
         * New image uploaded
         * -------------------------------------------------------
         */
        if (
            image &&
            typeof image.arrayBuffer === "function"
        ) {
            const uploaded =
                await uploadFileToCloudinary(
                    image,
                    "bmh/department-services"
                );

            image_url =
                uploaded.secure_url;

            newImageUploaded = true;
        }

        /*
         * -------------------------------------------------------
         * CASE 2:
         * Remove existing image
         *
         * Only remove when a new image was NOT uploaded.
         * -------------------------------------------------------
         */
        else if (
            remove_image &&
            currentService.image_url
        ) {
            image_url = null;
        }

        /*
         * Update database
         */
        const result = await sql`
            UPDATE department_services
            SET
                department_id = ${department_id},
                name = ${name},
                description = ${description},
                image_url = ${image_url},
                is_active = ${is_active}
            WHERE id = ${id}
            RETURNING *;
        `;

        /*
         * Delete old Cloudinary image
         *
         * Do this AFTER successful DB update.
         */
        if (
            currentService.image_url &&
            (
                newImageUploaded ||
                remove_image
            ) &&
            currentService.image_url !==
                image_url
        ) {
            try {
                await deleteFileFromCloudinary(
                    currentService.image_url
                );
            } catch (deleteError) {
                /*
                 * Do not fail the entire update
                 * if Cloudinary deletion fails.
                 */
                console.error(
                    "Failed to delete old department service image:",
                    deleteError
                );
            }
        }

        return NextResponse.json(
            {
                success: true,
                message:
                    "Department service updated successfully",
                data: result[0],
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "Update department service error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to update department service",
            },
            {
                status: 500,
            }
        );
    }
}


/*
|--------------------------------------------------------------------------
| DELETE - Delete Department Service
|--------------------------------------------------------------------------
|
| URL:
| DELETE /api/department_services?id=1
|
|--------------------------------------------------------------------------
*/
export async function DELETE(request) {
    try {
        /*
         * Only admin can delete services
         */
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

        /*
         * Get service ID
         */
        const { searchParams } =
            new URL(request.url);

        const id =
            searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Service id is required",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Find existing service
         */
        const existing =
            await sql`
                SELECT *
                FROM department_services
                WHERE id = ${id}
                LIMIT 1;
            `;

        if (existing.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Department service not found",
                },
                {
                    status: 404,
                }
            );
        }

        const service =
            existing[0];

        /*
         * Delete database record
         */
        await sql`
            DELETE FROM department_services
            WHERE id = ${id};
        `;

        /*
         * Delete Cloudinary image
         */
        if (service.image_url) {
            try {
                await deleteFileFromCloudinary(
                    service.image_url
                );
            } catch (deleteError) {
                console.error(
                    "Failed to delete department service image:",
                    deleteError
                );
            }
        }

        return NextResponse.json(
            {
                success: true,
                message:
                    "Department service deleted successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "Delete department service error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to delete department service",
            },
            {
                status: 500,
            }
        );
    }
}
