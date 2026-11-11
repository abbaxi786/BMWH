import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getImpactStats } from "../../../../lib/data/home_page/home_page";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { revalidateTag } from "next/cache";

const noCacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
};

export async function GET() {
    try {
        const result = await getImpactStats();

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("GET stats error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch impact statistics",
            },
            { status: 500 }
        );
    }
}


export async function PATCH(request) {
    try {
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized access. Please log in as an admin.",
                },
                { status: 401, headers: noCacheHeaders }
            );
        }

        const body = await request.json();

        const id = Number(body.id);
        const target = Number(body.target);
        const { suffix, title, description, is_active } = body;

        if (!Number.isInteger(id) || id < 1) {
            return NextResponse.json(
                { success: false, message: "A valid statistic ID is required." },
                { status: 400, headers: noCacheHeaders }
            );
        }

        if (!Number.isInteger(target) || target < 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Target must be a non-negative integer.",
                },
                { status: 400, headers: noCacheHeaders }
            );
        }

        if (typeof suffix !== "string" || suffix.length > 20) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Suffix must be a string of up to 20 characters.",
                },
                { status: 400, headers: noCacheHeaders }
            );
        }

        if (
            typeof title !== "string" ||
            !title.trim() ||
            title.trim().length > 150
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title is required and must not exceed 150 characters.",
                },
                { status: 400, headers: noCacheHeaders }
            );
        }

        if (typeof description !== "string") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Description must be a string.",
                },
                { status: 400, headers: noCacheHeaders }
            );
        }

        if (typeof is_active !== "boolean") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Active status must be true or false.",
                },
                { status: 400, headers: noCacheHeaders }
            );
        }

        const result = await sql`
            UPDATE impact_stats
            SET
                target = ${target},
                suffix = ${suffix.trim()},
                title = ${title.trim()},
                description = ${description.trim()},
                is_active = ${is_active},
                updated_at = NOW()
            WHERE id = ${id}
            RETURNING
                id,
                target,
                suffix,
                title,
                description,
                display_order,
                is_active
        `;

        if (result.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: `No impact statistic found with ID ${id}.`,
                },
                { status: 404, headers: noCacheHeaders }
            );
        }

        revalidateTag("impact-stats", "max");

        return NextResponse.json(
            {
                success: true,
                message: "Impact statistic updated successfully.",
                data: result[0],
            },
            { status: 200, headers: noCacheHeaders }
        );
    } catch (error) {
        console.error("PATCH /api/content/stats error:", error);

        const message =
            error instanceof Error ? error.message : "Unknown server error";

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update impact statistic",
                ...(process.env.NODE_ENV !== "production"
                    ? { detail: message }
                    : {}),
            },
            { status: 500, headers: noCacheHeaders }
        );
    }
}