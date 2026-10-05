import { NextResponse } from "next/server";
import {GetTopThree} from "@/lib/data/achievment/achievements";

export async function GET() {
    try {
        const result = await GetTopThree();

        return NextResponse.json(
            {
                success: true,
                data: result,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching top three achievements:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch top three achievements",
            },
            { status: 500 }
        );
    }
}
