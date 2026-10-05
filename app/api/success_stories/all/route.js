import { NextResponse } from "next/server";

import {
    getActiveSuccessStories,
} from "@/lib/data/successStories/successStories";


export async function GET() {
    try {
        const stories = await getActiveSuccessStories();

        return NextResponse.json(
            {
                success: true,
                data: stories,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error(
            "Error fetching all success stories:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch success stories",
            },
            { status: 500 }
        );
    }
}