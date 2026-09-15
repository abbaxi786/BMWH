import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";
import { requireAdmin } from "../../../lib/auth";

// GET - Get all active health partners
export async function GET() {
    try {
        const result = await sql`
            SELECT
                id,
                name,
                type,
                partnership_type,
                description,
                logo_url,
                website_url,
                is_active,
                created_at,
                updated_at
            FROM health_partners
            WHERE is_active = TRUE
            ORDER BY id DESC
        `;

        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(
            "Error fetching health partners:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to fetch health partners",
            },
            { status: 500 }
        );
    }
}

// POST - Create a new health partner
export async function POST(request) {
    try {
        // Admin authentication
        await requireAdmin(request);

        const formData = await request.formData();

        const name = formData.get("name");
        const type = formData.get("type");
        const partnership_type =
            formData.get("partnership_type");
        const description =
            formData.get("description");
        const website_url =
            formData.get("website_url");
        const is_active =
            formData.get("is_active");
        const logo = formData.get("logo");

        // Required field validation
        if (
            typeof name !== "string" ||
            !name.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Name is required",
                },
                { status: 400 }
            );
        }

        let logo_url = null;

        // Upload logo to Cloudinary
        if (
            logo &&
            logo instanceof File &&
            logo.size > 0
        ) {
            const uploadedLogo =
                await uploadFileToCloudinary(
                    logo,
                    "bmwh/health-partners"
                );

            logo_url =
                uploadedLogo.secure_url;
        }

        // Convert is_active from FormData string
        const activeValue =
            is_active === null
                ? true
                : is_active === true ||
                  is_active === "true" ||
                  is_active === "1" ||
                  is_active === "on";

        // Insert into database
        const result = await sql`
            INSERT INTO health_partners (
                name,
                type,
                partnership_type,
                description,
                logo_url,
                website_url,
                is_active
            )
            VALUES (
                ${name.trim()},
                ${
                    typeof type === "string" &&
                    type.trim()
                        ? type.trim()
                        : null
                },
                ${
                    typeof partnership_type ===
                        "string" &&
                    partnership_type.trim()
                        ? partnership_type.trim()
                        : null
                },
                ${
                    typeof description ===
                        "string" &&
                    description.trim()
                        ? description.trim()
                        : null
                },
                ${logo_url},
                ${
                    typeof website_url ===
                        "string" &&
                    website_url.trim()
                        ? website_url.trim()
                        : null
                },
                ${activeValue}
            )
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message:
                    "Health partner created successfully",
                data: result[0],
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "Error creating health partner:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to create health partner",
            },
            { status: 500 }
        );
    }
}