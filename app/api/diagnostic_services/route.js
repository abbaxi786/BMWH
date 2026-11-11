import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";
import { requireAdmin } from "@/lib/auth";

import { revalidatePath } from "next/cache";

import {
    getDiagnosticServices,
} from "@/lib/data/diagnostic/diagnostic";

export async function POST(request) {
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

    try {
        const formData = await request.formData();

        const name = formData.get("name");
        const category = formData.get("category");
        const description = formData.get("description");
        const is_active = formData.get("is_active") === "true";
        const image = formData.get("image");

        if (!name || !category) {
            return NextResponse.json(
                {
                    success: false,
                    message: "name and category are required",
                },
                {
                    status: 400,
                }
            );
        }

        let image_url = null;

        if (
            image &&
            typeof image.arrayBuffer === "function" &&
            image.size > 0
        ) {
            const uploaded = await uploadFileToCloudinary(
                image,
                "bmh/diagnostic-services"
            );

            image_url = uploaded.secure_url;
        }

        const result = await sql`
            INSERT INTO diagnostic_services
            (
                name,
                category,
                description,
                image_url,
                is_active
            )
            VALUES
            (
                ${name},
                ${category},
                ${description},
                ${image_url},
                ${is_active}
            )
            RETURNING *;
        `;

        revalidatePath(
            `/pages/diagnostic/${result[0].id}`,
            "page"
        );

        revalidatePath(`/`,"page");

        return NextResponse.json(
            {
                success: true,
                message: "Diagnostic service created successfully",
                data: result[0],
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("Create diagnostic service error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to create diagnostic service",
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET() {
    try {
        const result = await getDiagnosticServices();

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
            "Get diagnostic services error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Failed to fetch diagnostic services",
            },
            {
                status: 500,
            }
        );
    }
}