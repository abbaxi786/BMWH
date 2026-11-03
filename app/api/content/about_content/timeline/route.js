
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

import {
    getTimelineHistory,
    createTimelineHistory,
    updateTimelineHistory,
    deleteTimelineHistory,
} from "../../../../../lib/data/aboutSectionQuery/timeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function validId(value) {
    return (
        typeof value === "string" &&
        /^[1-9]\d*$/.test(value) &&
        Number.isSafeInteger(Number(value))
    );
}

function validateTimeline(data) {
    if (
        !data ||
        typeof data.year !== "string" ||
        !data.year.trim() ||
        data.year.trim().length > 20 ||
        typeof data.title !== "string" ||
        !data.title.trim() ||
        data.title.trim().length > 255 ||
        typeof data.description !== "string" ||
        !data.description.trim()
    ) {
        return "Year, title, and description are required. Year must be at most 20 characters and title at most 255 characters.";
    }

    if (
        data.sort_order !== undefined &&
        (!Number.isSafeInteger(Number(data.sort_order)) ||
            Number(data.sort_order) < 0)
    ) {
        return "sort_order must be a non-negative integer";
    }

    if (
        data.is_active !== undefined &&
        typeof data.is_active !== "boolean"
    ) {
        return "is_active must be true or false";
    }

    return null;
}

// GET: Public gets active records; admin can get all records
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const includeAll = searchParams.get("all") === "true";

        if (includeAll) {
            const admin = await requireAdmin();

            if (!admin) {
                return NextResponse.json(
                    { success: false, message: "Unauthorized person" },
                    { status: 401 }
                );
            }
        }

        const data = await getTimelineHistory(!includeAll);

        return NextResponse.json(
            { success: true, data },
            { status: 200 }
        );
    } catch (error) {
        console.error("Get timeline history error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch timeline history" },
            { status: 500 }
        );
    }
}

// POST: Create a timeline record
export async function POST(request) {
    try {
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Unauthorized person" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validationError = validateTimeline(body);

        if (validationError) {
            return NextResponse.json(
                { success: false, message: validationError },
                { status: 400 }
            );
        }

        const sortOrder =
            body.sort_order === undefined ? 0 : Number(body.sort_order);

        const isActive =
            body.is_active === undefined ? true : body.is_active;

        const data = await createTimelineHistory({
            year: body.year.trim(),
            title: body.title.trim(),
            description: body.description.trim(),
            sort_order: sortOrder,
            is_active: isActive,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Timeline milestone added successfully",
                data,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create timeline history error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to add timeline milestone" },
            { status: 500 }
        );
    }
}

// PUT: Update an existing timeline record
export async function PUT(request) {
    try {
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Unauthorized person" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const idParam = searchParams.get("id");

        if (!validId(idParam)) {
            return NextResponse.json(
                { success: false, message: "A valid timeline ID is required" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const validationError = validateTimeline(body);

        if (validationError) {
            return NextResponse.json(
                { success: false, message: validationError },
                { status: 400 }
            );
        }

        const data = await updateTimelineHistory(Number(idParam), {
            year: body.year.trim(),
            title: body.title.trim(),
            description: body.description.trim(),
            sort_order:
                body.sort_order === undefined ? 0 : Number(body.sort_order),
            is_active:
                body.is_active === undefined ? true : body.is_active,
        });

        if (!data) {
            return NextResponse.json(
                { success: false, message: "Timeline milestone not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Timeline milestone updated successfully",
                data,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Update timeline history error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to update timeline milestone" },
            { status: 500 }
        );
    }
}

// DELETE: Delete a timeline record using ?id=1
export async function DELETE(request) {
    try {
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Unauthorized person" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const idParam = searchParams.get("id");

        if (!validId(idParam)) {
            return NextResponse.json(
                { success: false, message: "A valid timeline ID is required" },
                { status: 400 }
            );
        }

        const deleted = await deleteTimelineHistory(Number(idParam));

        if (!deleted) {
            return NextResponse.json(
                { success: false, message: "Timeline milestone not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Timeline milestone deleted successfully",
                data: deleted,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Delete timeline history error:", error);

        return NextResponse.json(
            { success: false, message: "Failed to delete timeline milestone" },
            { status: 500 }
        );
    }
}
