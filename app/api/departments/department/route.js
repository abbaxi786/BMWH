import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
    uploadFileToCloudinary,
    deleteFileFromCloudinary,
} from "@/lib/uploadToCloudinary";

import { requireAdmin } from "@/lib/auth";

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
| Get a department by slug along with doctors and services.
*/

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const slug = searchParams.get("slug");

        // Validate slug
        if (!slug) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Department slug is required",
                },
                {
                    status: 400,
                }
            );
        }

        const result = await sql`
            SELECT
                d.id AS department_id,
                d.name AS department_name,
                d.category AS department_category,
                d.description AS department_description,
                d.slug AS department_slug,
                d.image_url AS department_image,
                d.is_active AS department_active,

                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'id', doc.id,
                            'name', doc.name,
                            'doctor_type', doc.doctor_type,
                            'designation', doc.designation,
                            'specialty', doc.specialty,
                            'qualifications', doc.qualifications,
                            'biography', doc.biography,
                            'expertise', doc.expertise,
                            'photo_url', doc.photo_url,
                            'profile_link', doc.profile_link,
                            'is_active', doc.is_active
                        )
                    ) FILTER (WHERE doc.id IS NOT NULL),
                    '[]'::json
                ) AS doctors,

                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'id', ds.id,
                            'name', ds.name,
                            'description', ds.description,
                            'image_url', ds.image_url,
                            'is_active', ds.is_active
                        )
                    ) FILTER (WHERE ds.id IS NOT NULL),
                    '[]'::json
                ) AS services

            FROM departments d

            LEFT JOIN doctors doc
                ON doc.department_id = d.id

            LEFT JOIN department_services ds
                ON ds.department_id = d.id

            WHERE d.slug = ${slug}
              AND d.is_active = true

            GROUP BY
                d.id,
                d.name,
                d.category,
                d.description,
                d.slug,
                d.image_url,
                d.is_active;
        `;

        // Department not found
        if (result.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Department not found",
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
            "Failed to fetch department:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch department",
            },
            {
                status: 500,
            }
        );
    }
}


/*
|--------------------------------------------------------------------------
| PUT
|--------------------------------------------------------------------------
| Update department information.
|
| FormData:
| - name
| - category
| - description
| - slug
| - is_active
| - image             optional
| - remove_image      true / false
|--------------------------------------------------------------------------
*/

export async function PUT(request) {
    try {
        /*
        |--------------------------------------------------------------------------
        | Admin authentication
        |--------------------------------------------------------------------------
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

        const { searchParams } =
            new URL(request.url);

        const currentSlug =
            searchParams.get("slug");

        if (!currentSlug) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Current department slug is required",
                },
                {
                    status: 400,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Find existing department
        |--------------------------------------------------------------------------
        */

        const existingDepartment = await sql`
            SELECT *
            FROM departments
            WHERE slug = ${currentSlug}
            LIMIT 1;
        `;

        if (existingDepartment.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Department not found",
                },
                {
                    status: 404,
                }
            );
        }

        const department =
            existingDepartment[0];

        /*
        |--------------------------------------------------------------------------
        | Read FormData
        |--------------------------------------------------------------------------
        */

        const formData =
            await request.formData();

        const name =
            formData.get("name");

        const category =
            formData.get("category");

        const description =
            formData.get("description");

        const slug =
            formData.get("slug");

        const is_active =
            formData.get("is_active") === "true";

        const image =
            formData.get("image");

        const removeImage =
            formData.get("remove_image") === "true";

        /*
        |--------------------------------------------------------------------------
        | Validate required fields
        |--------------------------------------------------------------------------
        */

        if (!name || !String(name).trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Department name is required",
                },
                {
                    status: 400,
                }
            );
        }

        if (!category || !String(category).trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Department category is required",
                },
                {
                    status: 400,
                }
            );
        }

        if (!slug || !String(slug).trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Department slug is required",
                },
                {
                    status: 400,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Check slug uniqueness
        |--------------------------------------------------------------------------
        */

        const duplicateSlug = await sql`
            SELECT id
            FROM departments
            WHERE slug = ${String(slug).trim()}
              AND id != ${department.id}
            LIMIT 1;
        `;

        if (duplicateSlug.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "A department with this slug already exists",
                },
                {
                    status: 409,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Existing image
        |--------------------------------------------------------------------------
        */

        const oldImageUrl =
            department.image_url;

        let image_url =
            oldImageUrl;

        /*
        |--------------------------------------------------------------------------
        | Upload new image
        |--------------------------------------------------------------------------
        */

        if (
            image &&
            typeof image.arrayBuffer === "function" &&
            image.size > 0
        ) {
            const uploaded =
                await uploadFileToCloudinary(
                    image,
                    "bmh/departments"
                );

            image_url =
                uploaded.secure_url;
        }

        /*
        |--------------------------------------------------------------------------
        | Remove existing image
        |--------------------------------------------------------------------------
        */

        if (
            removeImage &&
            !image
        ) {
            image_url = null;
        }

        /*
        |--------------------------------------------------------------------------
        | Update database
        |--------------------------------------------------------------------------
        */

        const updatedDepartment =
            await sql`
                UPDATE departments
                SET
                    name = ${String(name).trim()},
                    category = ${String(category).trim()},
                    description = ${
                        description
                            ? String(description).trim()
                            : null
                    },
                    slug = ${String(slug).trim()},
                    image_url = ${image_url},
                    is_active = ${is_active},
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ${department.id}
                RETURNING *;
            `;

        /*
        |--------------------------------------------------------------------------
        | Delete old Cloudinary image
        |--------------------------------------------------------------------------
        |
        | Delete the old image only when:
        |
        | 1. A new image replaced it
        | OR
        | 2. The image was removed.
        |
        */

        if (
            oldImageUrl &&
            oldImageUrl !== image_url
        ) {
            try {
                await deleteFileFromCloudinary(
                    oldImageUrl
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
                message:
                    "Department updated successfully",
                data: updatedDepartment[0],
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "Failed to update department:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to update department",
            },
            {
                status: 500,
            }
        );
    }
}


/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
| Delete department and its Cloudinary image.
|--------------------------------------------------------------------------
*/

export async function DELETE(request) {
    try {
        /*
        |--------------------------------------------------------------------------
        | Admin authentication
        |--------------------------------------------------------------------------
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

        const { searchParams } =
            new URL(request.url);

        const slug =
            searchParams.get("slug");

        /*
        |--------------------------------------------------------------------------
        | Validate slug
        |--------------------------------------------------------------------------
        */

        if (!slug) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Department slug is required",
                },
                {
                    status: 400,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Find department first
        |--------------------------------------------------------------------------
        */

        const existingDepartment =
            await sql`
                SELECT *
                FROM departments
                WHERE slug = ${slug}
                LIMIT 1;
            `;

        if (
            existingDepartment.length === 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Department not found",
                },
                {
                    status: 404,
                }
            );
        }

        const department =
            existingDepartment[0];

        /*
        |--------------------------------------------------------------------------
        | Delete department
        |--------------------------------------------------------------------------
        */

        await sql`
            DELETE FROM departments
            WHERE id = ${department.id};
        `;

        /*
        |--------------------------------------------------------------------------
        | Delete Cloudinary image
        |--------------------------------------------------------------------------
        */

        if (department.image_url) {
            try {
                await deleteFileFromCloudinary(
                    department.image_url
                );
            } catch (cloudinaryError) {
                console.error(
                    "Failed to delete department image from Cloudinary:",
                    cloudinaryError
                );
            }
        }

        return NextResponse.json(
            {
                success: true,
                message:
                    "Department deleted successfully",
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "Failed to delete department:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to delete department",
            },
            {
                status: 500,
            }
        );
    }
}