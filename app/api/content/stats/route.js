
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function PATCH(request) {
    try {
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized access",
                },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id } = body;

        if (
            !Number.isInteger(Number(id)) ||
            Number(id) < 1
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Valid card ID is required",
                },
                { status: 400 }
            );
        }

        const allowedFields = [
            "target",
            "suffix",
            "title",
            "description",
            "is_active",
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(body, field)) {
                updates[field] = body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No editable fields provided",
                },
                { status: 400 }
            );
        }

        // Validate only the fields provided
        if (
            "target" in updates &&
            (!Number.isInteger(updates.target) || updates.target < 0)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Target must be a non-negative integer",
                },
                { status: 400 }
            );
        }

        if (
            "suffix" in updates &&
            (typeof updates.suffix !== "string" ||
                updates.suffix.length > 20)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Suffix must be a string of up to 20 characters",
                },
                { status: 400 }
            );
        }

        if (
            "title" in updates &&
            (typeof updates.title !== "string" ||
                !updates.title.trim() ||
                updates.title.trim().length > 150)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title is required and must not exceed 150 characters",
                },
                { status: 400 }
            );
        }

        if (
            "description" in updates &&
            typeof updates.description !== "string"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Description must be a string",
                },
                { status: 400 }
            );
        }

        if (
            "is_active" in updates &&
            typeof updates.is_active !== "boolean"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "is_active must be a boolean",
                },
                { status: 400 }
            );
        }

        // Trim text fields
        if ("suffix" in updates) {
            updates.suffix = updates.suffix.trim();
        }

        if ("title" in updates) {
            updates.title = updates.title.trim();
        }

        if ("description" in updates) {
            updates.description = updates.description.trim();
        }

        // Build a parameterized UPDATE query
        const columns = {
            target: (value) => sql`target = ${value}`,
            suffix: (value) => sql`suffix = ${value}`,
            title: (value) => sql`title = ${value}`,
            description: (value) => sql`description = ${value}`,
            is_active: (value) => sql`is_active = ${value}`,
        };

        const setClauses = Object.entries(updates).map(
            ([field, value]) => columns[field](value)
        );

        const result = await sql`
            UPDATE impact_stats
            SET
                ${sql.join(setClauses, sql`, `)},
                updated_at = NOW()
            WHERE id = ${Number(id)}
            RETURNING
                id,
                target,
                suffix,
                title,
                description,
                display_order,
                is_active,
                created_at,
                updated_at
        `;

        if (result.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Impact statistic not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Impact statistic updated successfully",
            data: result[0],
        });
    } catch (error) {
        console.error("PATCH impact stats error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update impact statistic",
            },
            { status: 500 }
        );
    }
}


export async function GET() {
    try {
        const result = await sql`
            SELECT
                id,
                target,
                suffix,
                title,
                description,
                display_order
            FROM impact_stats
            WHERE is_active = TRUE
            ORDER BY display_order ASC
        `;

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Public impact stats error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch impact statistics",
            },
            { status: 500 }
        );
    }
}
