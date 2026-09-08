import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const is_active = searchParams.get("is_active");

        let facilities;

        if (is_active != null || is_active != undefined) {
            facilities = await sql`
                SELECT *
                FROM hospital_facilities
                WHERE is_active = ${is_active}
                ORDER BY id ASC
            `;
        } else {
            facilities = await sql`
                SELECT *
                FROM hospital_facilities
                ORDER BY id ASC
            `;
        }

        return NextResponse.json({
            success: true,
            data: facilities,
            count: facilities.length,
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching hospital facilities:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch hospital facilities",
        }, { status: 500 });
    }
}