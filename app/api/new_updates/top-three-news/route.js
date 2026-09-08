import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
    try {
        const result = await sql`
            SELECT *
            FROM news_updates
            WHERE is_published = TRUE
            ORDER BY published_at DESC NULLS LAST
            LIMIT 3
        `;

        return NextResponse.json({
            success: true,
            count: result.length,
            data: result,
        });

    } catch (error) {
        console.error("Get latest news error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch latest news",
            },
            { status: 500 }
        );
    }
}