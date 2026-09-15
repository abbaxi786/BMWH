import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";


// ============================================================
// GET - Get single supporter
// ============================================================

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const supporterId = Number(id);

        if (!Number.isInteger(supporterId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid supporter ID",
                },
                { status: 400 }
            );
        }

        const result = await sql`
            SELECT
                id,
                name,
                type,
                support_type,
                description,
                logo_url,
                website_url,
                is_active,
                created_at,
                updated_at
            FROM supporters
            WHERE id = ${supporterId}
            LIMIT 1
        `;

        if (result.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Supporter not found",
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
            "Error fetching supporter:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch supporter",
            },
            { status: 500 }
        );
    }
}


// ============================================================
// PUT - Update supporter
// ============================================================

export async function PUT(request, { params }) {
    try {
        const { id } = await params;

        const supporterId = Number(id);

        if (!Number.isInteger(supporterId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid supporter ID",
                },
                { status: 400 }
            );
        }

        // ------------------------------------------------------
        // Check whether supporter exists
        // ------------------------------------------------------

        const existingResult = await sql`
            SELECT
                id,
                name,
                type,
                support_type,
                description,
                logo_url,
                website_url,
                is_active
            FROM supporters
            WHERE id = ${supporterId}
            LIMIT 1
        `;

        if (existingResult.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Supporter not found",
                },
                { status: 404 }
            );
        }

        const existingSupporter =
            existingResult[0];

        // ------------------------------------------------------
        // Read form data
        // ------------------------------------------------------

        const formData =
            await request.formData();

        const name =
            formData.get("name");

        const type =
            formData.get("type");

        const support_type =
            formData.get("support_type");

        const description =
            formData.get("description");

        const website_url =
            formData.get("website_url");

        const is_active =
            formData.get("is_active");

        const logo =
            formData.get("logo");

        // ------------------------------------------------------
        // Validate required fields
        // ------------------------------------------------------

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

        // ------------------------------------------------------
        // Keep existing logo by default
        // ------------------------------------------------------

        let logo_url =
            existingSupporter.logo_url;

        // ------------------------------------------------------
        // Upload new logo if provided
        // ------------------------------------------------------

        if (
            logo &&
            logo instanceof File &&
            logo.size > 0
        ) {
            const uploadedLogo =
                await uploadFileToCloudinary(
                    logo,
                    "bmwh/supporters"
                );

            logo_url =
                uploadedLogo.secure_url;
        }

        // ------------------------------------------------------
        // Convert is_active
        // ------------------------------------------------------

        let activeValue =
            existingSupporter.is_active;

        if (
            is_active !== null
        ) {
            activeValue =
                is_active === true ||
                is_active === "true" ||
                is_active === "1" ||
                is_active === "on";
        }

        // ------------------------------------------------------
        // Update supporter
        // ------------------------------------------------------

        const result = await sql`
            UPDATE supporters
            SET
                name = ${name.trim()},
                type = ${
                    typeof type === "string" &&
                    type.trim()
                        ? type.trim()
                        : null
                },
                support_type = ${
                    typeof support_type === "string" &&
                    support_type.trim()
                        ? support_type.trim()
                        : null
                },
                description = ${
                    typeof description === "string" &&
                    description.trim()
                        ? description.trim()
                        : null
                },
                logo_url = ${logo_url},
                website_url = ${
                    typeof website_url === "string" &&
                    website_url.trim()
                        ? website_url.trim()
                        : null
                },
                is_active = ${activeValue},
                updated_at = NOW()
            WHERE id = ${supporterId}
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message:
                    "Supporter updated successfully",
                data: result[0],
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(
            "Error updating supporter:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to update supporter",
            },
            { status: 500 }
        );
    }
}


// ============================================================
// DELETE - Delete supporter
// ============================================================

export async function DELETE(
    request,
    { params }
) {
    try {
        const { id } = await params;

        const supporterId = Number(id);

        if (!Number.isInteger(supporterId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid supporter ID",
                },
                { status: 400 }
            );
        }

        // ------------------------------------------------------
        // Check whether supporter exists
        // ------------------------------------------------------

        const existingResult = await sql`
            SELECT
                id,
                name,
                logo_url
            FROM supporters
            WHERE id = ${supporterId}
            LIMIT 1
        `;

        if (existingResult.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Supporter not found",
                },
                { status: 404 }
            );
        }

        // ------------------------------------------------------
        // Delete from database
        // ------------------------------------------------------

        const result = await sql`
            DELETE FROM supporters
            WHERE id = ${supporterId}
            RETURNING *;
        `;

        return NextResponse.json(
            {
                success: true,
                message:
                    "Supporter deleted successfully",
                data: result[0],
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(
            "Error deleting supporter:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to delete supporter",
            },
            { status: 500 }
        );
    }
}