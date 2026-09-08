import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request, { params }) {
    try {
        const { ds_id } = await params;

        if (!ds_id) {
            return NextResponse.json(
                { error: "Invalid diagnostic service ID" },
                { status: 400 }
            );
        }

        const result = await sql`
            SELECT *
            FROM diagnostic_services
            WHERE id = ${ds_id};
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { error: "Diagnostic service not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(result[0]);

    } catch (error) {
        console.error("Error fetching diagnostic service:", error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}