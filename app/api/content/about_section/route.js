import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE_HEADERS = {
    "Cache-Control": "no-store, no-cache, must-revalidate",
};

const CONTENT_FIELDS = [
    "section_title",
    "heading",
    "description",
    "description_two",
    "button_text",
    "button_url",
];

// GET: Fetch About Section content
export async function GET() {
    try {
        const rows = await sql`
            SELECT
                section_title,
                heading,
                description,
                description_two,
                button_text,
                button_url
            FROM about_section_content
            WHERE id = 1
              AND is_active = TRUE
            LIMIT 1
        `;

        

        return NextResponse.json(
            {
                success: true,
                data: rows[0] ?? null,
            },
            {
                status: 200,
                headers: CACHE_HEADERS,
            }
        );
    } catch (error) {
        console.error("GET about_section error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch About Section content.",
                detail:
                    process.env.NODE_ENV !== "production"
                        ? error instanceof Error
                            ? error.message
                            : String(error)
                        : undefined,
            },
            {
                status: 500,
                headers: CACHE_HEADERS,
            }
        );
    }
}

// PATCH: Update About Section content
export async function PATCH(request) {
    try {
        // 1. Check admin authentication
        const admin = await requireAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized. Please log in as an admin.",
                },
                {
                    status: 401,
                    headers: CACHE_HEADERS,
                }
            );
        }

        // 2. Read request body
        let body;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid JSON request body.",
                },
                {
                    status: 400,
                    headers: CACHE_HEADERS,
                }
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
                    message: "Request body must be a valid object.",
                },
                {
                    status: 400,
                    headers: CACHE_HEADERS,
                }
            );
        }

        // 3. Validate the fields sent by the frontend.
        // This frontend sends the complete content object.
        for (const field of CONTENT_FIELDS) {
            if (
                !Object.prototype.hasOwnProperty.call(body, field) ||
                typeof body[field] !== "string"
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Missing or invalid field: ${field}`,
                    },
                    {
                        status: 400,
                        headers: CACHE_HEADERS,
                    }
                );
            }
        }

        // 4. Update the existing database record.
        // All values are parameterized by the sql tagged template.
        const rows = await sql`
            UPDATE about_section_content
            SET
                section_title = ${body.section_title},
                heading = ${body.heading},
                description = ${body.description},
                description_two = ${body.description_two},
                button_text = ${body.button_text},
                button_url = ${body.button_url}
            WHERE id = 1
            RETURNING
                id,
                is_active,
                section_title,
                heading,
                description,
                description_two,
                button_text,
                button_url
        `;

        // 5. Check whether the database updated a row.
        if (rows.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "No About Section record found with id = 1.",
                },
                {
                    status: 404,
                    headers: CACHE_HEADERS,
                }
            );
        }

        // 6. Return the actual saved database values.
        return NextResponse.json(
            {
                success: true,
                message: "About Section updated successfully.",
                data: rows[0],
            },
            {
                status: 200,
                headers: CACHE_HEADERS,
            }
        );
    } catch (error) {
        console.error("PATCH /api/content/about_section error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update About Section content.",
                detail:
                    process.env.NODE_ENV !== "production"
                        ? error instanceof Error
                            ? error.message
                            : String(error)
                        : undefined,
            },
            {
                status: 500,
                headers: CACHE_HEADERS,
            }
        );
    }
}