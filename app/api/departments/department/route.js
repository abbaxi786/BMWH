
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { sql } from "@/lib/db";

import {
    uploadFileToCloudinary,
    deleteFileFromCloudinary,
} from "@/lib/uploadToCloudinary";

import { requireAdmin } from "@/lib/auth";

import {
    getDepartmentDetailsBySlug,
} from "@/lib/data/department/all_department";


/*
|--------------------------------------------------------------------------
| Cache Revalidation
|--------------------------------------------------------------------------
| Revalidate homepage, department listing and department detail page.
*/

function revalidateDepartmentPages(slug) {
    revalidatePath("/", "page");
    revalidatePath("/pages/departments", "page");

    if (slug) {
        revalidatePath(
            `/pages/department/departments/${slug}`,
            "page"
        );
    }
}


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

        /*
        |--------------------------------------------------------------------------
        | Validate slug
        |--------------------------------------------------------------------------
        */

        if (!slug) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Department slug is required",
                },
                { status: 400 }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Get department from shared function
        |--------------------------------------------------------------------------
        */

        const department =
            await getDepartmentDetailsBySlug(slug);

        /*
        |--------------------------------------------------------------------------
        | Department not found
        |--------------------------------------------------------------------------
        */

        if (!department) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Department not found",
                },
                { status: 404 }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        return NextResponse.json(
            {
                success: true,
                data: department,
            },
            { status: 200 }
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
            { status: 500 }
        );
    }
}


/*
|--------------------------------------------------------------------------
| PUT
|--------------------------------------------------------------------------
| Update department information.
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
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);

        const currentSlug = searchParams.get("slug");

        if (!currentSlug) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Current department slug is required",
                },
                { status: 400 }
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
                { status: 404 }
            );
        }

        const department = existingDepartment[0];

        /*
        |--------------------------------------------------------------------------
        | Read FormData
        |--------------------------------------------------------------------------
        */

        const formData = await request.formData();

        const name = formData.get("name");
        const category = formData.get("category");
        const description = formData.get("description");
        const slug = formData.get("slug");

        const is_active =
            formData.get("is_active") === "true";

        const image = formData.get("image");

        const removeImage =
            formData.get("remove_image") === "true";

        /*
        |--------------------------------------------------------------------------
        | Validate fields
        |--------------------------------------------------------------------------
        */

        if (!name || !String(name).trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Department name is required",
                },
                { status: 400 }
            );
        }

        if (!category || !String(category).trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Department category is required",
                },
                { status: 400 }
            );
        }

        if (!slug || !String(slug).trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Department slug is required",
                },
                { status: 400 }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Normalize new slug
        |--------------------------------------------------------------------------
        */

        const newSlug = String(slug).trim();

        /*
        |--------------------------------------------------------------------------
        | Check duplicate slug
        |--------------------------------------------------------------------------
        */

        const duplicateSlug = await sql`
            SELECT id
            FROM departments
            WHERE slug = ${newSlug}
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
                { status: 409 }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Existing image
        |--------------------------------------------------------------------------
        */

        const oldImageUrl = department.image_url;

        let image_url = oldImageUrl;

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
            const uploaded = await uploadFileToCloudinary(
                image,
                "bmh/departments"
            );

            image_url = uploaded.secure_url;
        }

        /*
        |--------------------------------------------------------------------------
        | Remove image
        |--------------------------------------------------------------------------
        */

        if (removeImage && !image) {
            image_url = null;
        }

        /*
        |--------------------------------------------------------------------------
        | Update department
        |--------------------------------------------------------------------------
        */

        const updatedDepartment = await sql`
            UPDATE departments
            SET
                name = ${String(name).trim()},
                category = ${String(category).trim()},
                description = ${
                    description
                        ? String(description).trim()
                        : null
                },
                slug = ${newSlug},
                image_url = ${image_url},
                is_active = ${is_active},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${department.id}
            RETURNING *;
        `;

        /*
        |--------------------------------------------------------------------------
        | Revalidate cached frontend pages
        |--------------------------------------------------------------------------
        */

        // Always revalidate the homepage and department listing.
        revalidatePath("/", "page");
        revalidatePath("/pages/departments", "page");

        // Revalidate the old department URL.
        revalidatePath(
            `/pages/department/departments/${currentSlug}`,
            "page"
        );

        // If slug changed, also revalidate the new department URL.
        if (currentSlug !== newSlug) {
            revalidatePath(
                `/pages/department/departments/${newSlug}`,
                "page"
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Delete old Cloudinary image
        |--------------------------------------------------------------------------
        */

        if (oldImageUrl && oldImageUrl !== image_url) {
            try {
                await deleteFileFromCloudinary(oldImageUrl);
            } catch (cloudinaryError) {
                console.error(
                    "Failed to delete old Cloudinary image:",
                    cloudinaryError
                );
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        return NextResponse.json(
            {
                success: true,
                message: "Department updated successfully",
                data: updatedDepartment[0],
            },
            { status: 200 }
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
            { status: 500 }
        );
    }
}


/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
| Delete department and its Cloudinary image.
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
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);

        const slug = searchParams.get("slug");

        /*
        |--------------------------------------------------------------------------
        | Validate slug
        |--------------------------------------------------------------------------
        */

        if (!slug) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Department slug is required",
                },
                { status: 400 }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Find department
        |--------------------------------------------------------------------------
        */

        const existingDepartment = await sql`
            SELECT *
            FROM departments
            WHERE slug = ${slug}
            LIMIT 1;
        `;

        if (existingDepartment.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Department not found",
                },
                { status: 404 }
            );
        }

        const department = existingDepartment[0];

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
        | Revalidate cached frontend pages
        |--------------------------------------------------------------------------
        */

        revalidateDepartmentPages(slug);

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

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        return NextResponse.json(
            {
                success: true,
                message: "Department deleted successfully",
            },
            { status: 200 }
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
            { status: 500 }
        );
    }
}
