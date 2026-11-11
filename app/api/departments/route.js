
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { sql } from "@/lib/db";

import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";

import { requireAdmin } from "../../../lib/auth";

import {
    getDepartments,
    getDepartmentsWithLimit,
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
| POST
|--------------------------------------------------------------------------
| Create a new department.
*/

export async function POST(request) {
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

    try {
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

        /*
        |--------------------------------------------------------------------------
        | Validate required fields
        |--------------------------------------------------------------------------
        */

        if (
            !name ||
            !String(name).trim() ||
            !category ||
            !String(category).trim() ||
            !slug ||
            !String(slug).trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "name, category and slug are required",
                },
                {
                    status: 400,
                }
            );
        }

        const newSlug = String(slug).trim();

        /*
        |--------------------------------------------------------------------------
        | Upload image to Cloudinary
        |--------------------------------------------------------------------------
        */

        let image_url = null;

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
        | Insert department
        |--------------------------------------------------------------------------
        */

        const result = await sql`
            INSERT INTO departments
            (
                name,
                category,
                description,
                slug,
                image_url,
                is_active
            )
            VALUES
            (
                ${String(name).trim()},
                ${String(category).trim()},
                ${
                    description
                        ? String(description).trim()
                        : null
                },
                ${newSlug},
                ${image_url},
                ${is_active}
            )
            RETURNING *;
        `;

        const newDepartment = result[0];

        /*
        |--------------------------------------------------------------------------
        | Revalidate cached frontend pages
        |--------------------------------------------------------------------------
        */

        revalidateDepartmentPages(newDepartment.slug);

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        return NextResponse.json(
            {
                success: true,
                message: "Department created successfully",
                data: newDepartment,
            },
            {
                status: 201,
            }
        );

    } catch (error) {
        console.error(
            "Create department error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to create department",
            },
            {
                status: 500,
            }
        );
    }
}


/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
| Get departments.
|
| Examples:
|
| /api/departments
| /api/departments?limit=6
*/

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const limitParam = searchParams.get("limit");

        /*
        |--------------------------------------------------------------------------
        | Get all departments
        |--------------------------------------------------------------------------
        */

        if (!limitParam) {
            const result = await getDepartments();

            return NextResponse.json(
                {
                    success: true,
                    data: result,
                },
                {
                    status: 200,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Convert limit to number
        |--------------------------------------------------------------------------
        */

        const limit = Number.parseInt(
            limitParam,
            10
        );

        /*
        |--------------------------------------------------------------------------
        | Validate limit
        |--------------------------------------------------------------------------
        */

        if (
            !Number.isInteger(limit) ||
            limit <= 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "limit must be a positive integer",
                },
                {
                    status: 400,
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Get departments with limit
        |--------------------------------------------------------------------------
        */

        const result = await getDepartmentsWithLimit(limit);

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
            "Get departments error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch departments",
            },
            {
                status: 500,
            }
        );
    }
}
