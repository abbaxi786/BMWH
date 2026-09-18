import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
    try {
        const result = await sql`
            SELECT
                id,
                title,
                type,
                description,
                image_url,
                award_date,
                issuing_organization,
                website_url,
                is_active,
                created_at,
                updated_at
            FROM achievements_awards
            WHERE is_active = TRUE
            ORDER BY award_date DESC NULLS LAST, id DESC
            LIMIT 3
        `;

        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching achievements and awards:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch achievements and awards",
            },
            { status: 500 }
        );
    }
}
