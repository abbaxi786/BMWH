import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const limitParam = searchParams.get("limit");
        const offsetParam = searchParams.get("offset");

        const limit = Math.min(
            Math.max(parseInt(limitParam) || 10, 1),
            50
        );

        const offset = Math.max(
            parseInt(offsetParam) || 0,
            0
        );

        const result = await sql`
            SELECT *
            FROM news_updates
            WHERE is_published = TRUE
            ORDER BY published_at DESC NULLS LAST, created_at DESC
            LIMIT ${limit}
            OFFSET ${offset}
        `;

        // Check whether more news exists
        const nextResult = await sql`
            SELECT id
            FROM news_updates
            WHERE is_published = TRUE
            ORDER BY published_at DESC NULLS LAST, created_at DESC
            LIMIT 1
            OFFSET ${offset + limit}
        `;

        const hasMore = nextResult.length > 0;

        return NextResponse.json({
            success: true,
            count: result.length,
            limit,
            offset,
            hasMore,
            data: result,
        });

    } catch (error) {
        console.error("Get news error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch news",
            },
            { status: 500 }
        );
    }
}