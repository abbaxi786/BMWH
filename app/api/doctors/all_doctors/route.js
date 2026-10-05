import { NextResponse } from "next/server";
import { getActiveDoctors } from "@/lib/data/doctors/doctors";

export async function GET() {
    try {
        const doctors = await getActiveDoctors();

        return NextResponse.json(
            {
                success: true,
                data: doctors,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("Failed to fetch doctors:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch doctors",
            },
            {
                status: 500,
            }
        );
    }
}