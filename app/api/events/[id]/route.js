import { NextResponse } from "next/server";
import { getActiveEventById } from "@/lib/data/events/events";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const eventId = Number(id);

        // Validate ID
        if (!id || Number.isNaN(eventId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid event ID",
                },
                { status: 400 }
            );
        }

        const event = await getActiveEventById(eventId);

        // Event not found
        if (!event) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Event not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: event,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching event:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch event",
            },
            { status: 500 }
        );
    }
}