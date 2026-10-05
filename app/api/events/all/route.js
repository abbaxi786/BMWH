import { NextResponse } from "next/server";
import { getActiveEvents } from "@/lib/data/events/events";

export async function GET() {
    try {
        const events = await getActiveEvents();

        return NextResponse.json(
            {
                success: true,
                data: events,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching all events:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch events",
            },
            { status: 500 }
        );
    }
}