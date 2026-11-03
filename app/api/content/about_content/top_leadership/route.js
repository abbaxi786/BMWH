
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
    getLeadershipMessages,
    patchLeadershipMessage,
} from "../../../../../lib/data/aboutSectionQuery/TopLearderShip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isLeaderKey(value) {
    return value === "chairman" || value === "president";
}

// GET /api/content/leadership_messages
// GET /api/content/leadership_messages?includeInactive=true
// GET /api/content/leadership_messages?leader_key=chairman
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const includeInactive =
            searchParams.get("includeInactive") === "true";

        const keyParam = searchParams.get("leader_key");
        let leaderKey;

        if (keyParam) {
            if (!isLeaderKey(keyParam)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid leader_key.",
                    },
                    { status: 400 }
                );
            }

            leaderKey = keyParam;
        }

        if (includeInactive) {
            const admin = await requireAdmin();

            if (!admin) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Unauthorized.",
                    },
                    { status: 401 }
                );
            }
        }

        const data = await getLeadershipMessages(
            includeInactive,
            leaderKey
        );

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("GET leadership messages error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch leadership messages.",
            },
            { status: 500 }
        );
    }
}

// PATCH /api/content/leadership_messages
export async function PATCH(request) {
    try {
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized.",
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

        const { leader_key, ...updates } = body;

        if (!isLeaderKey(leader_key)) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "leader_key must be chairman or president.",
                },
                { status: 400 }
            );
        }

        const allowedFields = [
            "name",
            "designation",
            "image",
            "section_label",
            "heading",
            "signature_text",
            "message",
            "quranic_verse",
            "quranic_translation",
            "quranic_reference",
            "is_active",
        ];

        const fields = Object.keys(updates);

        if (
            fields.length === 0 ||
            fields.some((field) => !allowedFields.includes(field))
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Provide valid fields to update.",
                },
                { status: 400 }
            );
        }

        const stringFields = [
            "name",
            "designation",
            "image",
            "section_label",
            "heading",
            "signature_text",
        ];

        for (const field of stringFields) {
            if (
                field in updates &&
                typeof updates[field] !== "string"
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `${field} must be a string.`,
                    },
                    { status: 400 }
                );
            }
        }

        const nullableStringFields = [
            "quranic_verse",
            "quranic_translation",
            "quranic_reference",
        ];

        for (const field of nullableStringFields) {
            if (
                field in updates &&
                updates[field] !== null &&
                typeof updates[field] !== "string"
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `${field} must be a string or null.`,
                    },
                    { status: 400 }
                );
            }
        }

        if (
            "message" in updates &&
            (
                !Array.isArray(updates.message) ||
                !updates.message.every(
                    (paragraph) => typeof paragraph === "string"
                )
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "message must be an array of strings.",
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
                    message: "is_active must be a boolean.",
                },
                { status: 400 }
            );
        }

        const data = await patchLeadershipMessage(
            leader_key,
            updates
        );

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Leadership record not found.",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Leadership message updated successfully.",
            data,
        });
    } catch (error) {
        console.error("PATCH leadership messages error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update leadership message.",
            },
            { status: 500 }
        );
    }
}
