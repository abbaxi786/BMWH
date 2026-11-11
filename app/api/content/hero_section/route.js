
import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getHeroSection } from "../../../../lib/data/home_page/home_page";
import { revalidateTag } from "next/cache";

export const runtime = "nodejs";

// GET: Fetch hero section content
export async function GET() {
    try {
        const result = await getHeroSection();

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("GET hero section error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch hero section content.",
            },
            { status: 500 }
        );
    }
}

// PATCH: Update hero section content
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

        const body = await request.json();

        const allowedFields = [
            "badge_text",
            "heading",
            "description",
            "button_text",
            "button_url",
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(body, field)) {
                if (
                    body[field] !== null &&
                    typeof body[field] !== "string"
                ) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: `${field} must be a string or null.`,
                        },
                        { status: 400 }
                    );
                }

                updates[field] = body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No valid fields provided for update.",
                },
                { status: 400 }
            );
        }

        const existing = await sql`
            SELECT id
            FROM hero_section_content
            WHERE id = 1
            LIMIT 1
        `;

        if (existing.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Hero section record not found. Insert the initial record first.",
                },
                { status: 404 }
            );
        }

        // Update only fields supplied in the request.
        const result = await sql`
            UPDATE hero_section_content
            SET
                badge_text = CASE
                    WHEN ${Object.prototype.hasOwnProperty.call(updates, "badge_text")}
                    THEN ${updates.badge_text ?? null}
                    ELSE badge_text
                END,
                heading = CASE
                    WHEN ${Object.prototype.hasOwnProperty.call(updates, "heading")}
                    THEN ${updates.heading ?? null}
                    ELSE heading
                END,
                description = CASE
                    WHEN ${Object.prototype.hasOwnProperty.call(updates, "description")}
                    THEN ${updates.description ?? null}
                    ELSE description
                END,
                button_text = CASE
                    WHEN ${Object.prototype.hasOwnProperty.call(updates, "button_text")}
                    THEN ${updates.button_text ?? null}
                    ELSE button_text
                END,
                button_url = CASE
                    WHEN ${Object.prototype.hasOwnProperty.call(updates, "button_url")}
                    THEN ${updates.button_url ?? null}
                    ELSE button_url
                END,
                updated_at = NOW()
            WHERE id = 1
            RETURNING
                id,
                badge_text,
                heading,
                description,
                button_text,
                button_url
        `;

        revalidateTag("hero-section", "max");

        return NextResponse.json({
            success: true,
            message: "Hero section content updated successfully.",
            data: result[0],
        });
    } catch (error) {
        console.error("PATCH hero section error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update hero section content.",
            },
            { status: 500 }
        );
    }
}
