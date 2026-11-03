
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
    getMissionVisionForAdmin,
    updateMissionVision,
} from "../../../../../lib/data/aboutSectionQuery/VisionAndMission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedFields = [
    "eyebrow",
    "title",
    "missionTitle",
    "missionDescription",
    "visionTitle",
    "visionDescription",
    "isActive",
];

// GET: Fetch Mission & Vision content for the admin panel
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

        const data = await getMissionVisionForAdmin();

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("GET Mission & Vision error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch Mission & Vision content.",
            },
            { status: 500 }
        );
    }
}

// PATCH: Update Mission & Vision content
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

        // Pass only supported fields to the SQL function.
        const fields = Object.fromEntries(
            suppliedFields.map((field) => [field, body[field]])
        );

        const data = await updateMissionVision(fields);

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Mission & Vision record not found. Insert a record before updating.",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Mission & Vision content updated successfully.",
            data,
        });
    } catch (error) {
        console.error("PATCH Mission & Vision error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update Mission & Vision content.",
            },
            { status: 500 }
        );
    }
}
