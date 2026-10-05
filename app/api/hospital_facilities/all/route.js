import { NextResponse } from "next/server";
import { getHospitalFacilities } from "@/lib/data/hospitalFacilities/hospitalFacilties";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const is_active = searchParams.get("is_active");

        const facilities = await getHospitalFacilities(
            is_active !== null ? is_active : null
        );

        return NextResponse.json(
            {
                success: true,
                data: facilities,
                count: facilities.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching hospital facilities:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch hospital facilities",
            },
            { status: 500 }
        );
    }
}