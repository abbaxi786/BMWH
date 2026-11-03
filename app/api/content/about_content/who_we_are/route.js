
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
    getWhoWeAreForAdmin,
    updateWhoWeAre,
} from "@/lib/data/aboutSectionQuery/WhoWeAre";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: Fetch Who We Are content for the admin accordion
export async function GET() {
    try {
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized. Admin access required.",
                },
                { status: 401 }
            );
        }

        const data = await getWhoWeAreForAdmin();

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("GET Who We Are error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch Who We Are content.",
            },
            { status: 500 }
        );
    }
}

// PATCH: Update Who We Are content
export async function PATCH(request) {
    try {
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized. Admin access required.",
                },
                { status: 401 }
            );
        }

        let body;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid JSON request body.",
                },
                { status: 400 }
            );
        }

        if (
            !body ||
            typeof body !== "object" ||
            Array.isArray(body)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid request body.",
                },
                { status: 400 }
            );
        }

        const allowedFields = [
            "eyebrow",
            "title",
            "descriptionOne",
            "descriptionTwo",
            "isActive",
        ];

        const suppliedFields = allowedFields.filter((field) =>
            Object.prototype.hasOwnProperty.call(body, field)
        );

        if (suppliedFields.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No editable fields were provided.",
                },
                { status: 400 }
            );
        }

        // Validate supplied fields.
        for (const field of suppliedFields) {
            const value = body[field];

            if (field === "isActive") {
                if (typeof value !== "boolean") {
                    return NextResponse.json(
                        {
                            success: false,
                            message: "isActive must be a boolean.",
                        },
                        { status: 400 }
                    );
                }

                continue;
            }

            if (value !== null && typeof value !== "string") {
                return NextResponse.json(
                    {
                        success: false,
                        message: `${field} must be a string or null.`,
                    },
                    { status: 400 }
                );
            }
        }

        // Pass only supported, supplied fields to the SQL function.
        const fields = Object.fromEntries(
            suppliedFields.map((field) => [field, body[field]])
        );

        const data = await updateWhoWeAre(fields);

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Who We Are record not found. Insert a record before updating.",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Who We Are content updated successfully.",
            data,
        });
    } catch (error) {
        console.error("PATCH Who We Are error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update Who We Are content.",
            },
            { status: 500 }
        );
    }
}
