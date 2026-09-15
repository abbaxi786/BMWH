import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";
import { requireAdmin } from "../../../../lib/auth";

// ============================================================
// GET - Get one health partner
// ============================================================

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const partnerId = Number(id);

        if (!Number.isInteger(partnerId)) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid health partner ID",
                },
                { status: 400 }
            );
        }

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
            WHERE id = ${partnerId}
            LIMIT 1
        `;

        if (result.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Health partner not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: result[0],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(
            "Error fetching health partner:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to fetch health partner",
            },
            { status: 500 }
        );
    }
}

// ============================================================
// PUT - Update health partner
// ============================================================

export async function PUT(request, { params }) {
    try {
        // Admin authentication
        await requireAdmin(request);

        const { id } = await params;

        const partnerId = Number(id);

        if (!Number.isInteger(partnerId)) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid health partner ID",
                },
                { status: 400 }
            );
        }

        // Get existing partner
        const existingResult = await sql`
            SELECT
                id,
                name,
                type,
                partnership_type,
                description,
                logo_url,
                website_url,
                is_active
            FROM health_partners
            WHERE id = ${partnerId}
            LIMIT 1
        `;

        if (existingResult.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Health partner not found",
                },
                { status: 404 }
            );
        }

        const existingPartner =
            existingResult[0];

        const formData =
            await request.formData();

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

        // Keep old logo if no new logo was uploaded
        let logo_url =
            existingPartner.logo_url;

        // Upload new logo if selected
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

        // Keep existing active value
        let activeValue =
            existingPartner.is_active;

        // Only change it if the field was sent
        if (is_active !== null) {
            activeValue =
                is_active === true ||
                is_active === "true" ||
                is_active === "1" ||
                is_active === "on";
        }

        const result = await sql`
            UPDATE health_partners
            SET
                name = ${name.trim()},
                type = ${
                    typeof type === "string" &&
                    type.trim()
                        ? type.trim()
                        : null
                },
                partnership_type = ${
                    typeof partnership_type ===
                        "string" &&
                    partnership_type.trim()
                        ? partnership_type.trim()
                        : null
                },
                description = ${
                    typeof description ===
                        "string" &&
                    description.trim()
                        ? description.trim()
                        : null
                },
                logo_url = ${logo_url},
                website_url = ${
                    typeof website_url ===
                        "string" &&
                    website_url.trim()
                        ? website_url.trim()
                        : null
                },
                is_active = ${activeValue},
                updated_at = NOW()
            WHERE id = ${partnerId}
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message:
                    "Health partner updated successfully",
                data: result[0],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(
            "Error updating health partner:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to update health partner",
            },
            { status: 500 }
        );
    }
}

// ============================================================
// DELETE - Delete health partner
// ============================================================

export async function DELETE(
    request,
    { params }
) {
    try {
        // Admin authentication
        await requireAdmin(request);

        const { id } = await params;

        const partnerId = Number(id);

        if (!Number.isInteger(partnerId)) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid health partner ID",
                },
                { status: 400 }
            );
        }

        // Check if partner exists
        const existingResult = await sql`
            SELECT
                id,
                name,
                logo_url
            FROM health_partners
            WHERE id = ${partnerId}
            LIMIT 1
        `;

        if (existingResult.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Health partner not found",
                },
                { status: 404 }
            );
        }

        // Delete from database
        const result = await sql`
            DELETE FROM health_partners
            WHERE id = ${partnerId}
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message:
                    "Health partner deleted successfully",
                data: result[0],
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(
            "Error deleting health partner:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to delete health partner",
            },
            { status: 500 }
        );
    }
}