import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

import { uploadFileToCloudinary } from "@/lib/uploadToCloudinary";

const SETTINGS_DIR = path.join(process.cwd(), "setting");
const SETTINGS_FILE = path.join(SETTINGS_DIR, "setting.json");

// ======================================================
// GET - Get Website Settings
// ======================================================
export async function GET() {
    try {
        // Make sure setting directory exists
        await fs.mkdir(SETTINGS_DIR, { recursive: true });

        // Check if settings file exists
        try {
            await fs.access(SETTINGS_FILE);
        } catch {
            // Create default settings if file doesn't exist
            const defaultSettings = {
                websiteName: "",
                logo: null,
            };

            await fs.writeFile(
                SETTINGS_FILE,
                JSON.stringify(defaultSettings, null, 4),
                "utf-8"
            );
        }

        // Read settings
        const file = await fs.readFile(SETTINGS_FILE, "utf-8");

        const setting = JSON.parse(file);

        return NextResponse.json(
            {
                setting,
                success: true,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET Settings Error:", error);

        return NextResponse.json(
            {
                message: error instanceof Error ? error.message : "Failed to load settings",
                success: false,
            },
            { status: 500 }
        );
    }
}

// ======================================================
// POST - Create / Update Website Settings
// ======================================================
export async function POST(request) {
    try {
        const formData = await request.formData();

        const websiteName = formData.get("websiteName");
        const image = formData.get("logo");

        // Make sure setting directory exists
        await fs.mkdir(SETTINGS_DIR, { recursive: true });

        // ------------------------------------------
        // Read existing settings
        // ------------------------------------------
        let existingSettings = {
            websiteName: "",
            logo: null,
        };

        try {
            const existingFile = await fs.readFile(
                SETTINGS_FILE,
                "utf-8"
            );

            existingSettings = JSON.parse(existingFile);
        } catch {
            // File doesn't exist yet.
            // We'll create it below.
        }

        // ------------------------------------------
        // Website Name
        // ------------------------------------------
        const updatedWebsiteName =
            websiteName !== null
                ? websiteName.toString().trim()
                : existingSettings.websiteName;

        // ------------------------------------------
        // Logo
        // ------------------------------------------
        let logo = existingSettings.logo || null;

        // Upload new logo if provided
        if (
            image &&
            typeof image !== "string" &&
            typeof image.arrayBuffer === "function" &&
            image.size > 0
        ) {
            const uploaded = await uploadFileToCloudinary(
                image,
                "bmwh/logo"
            );

            logo = uploaded.secure_url;
        }

        // ------------------------------------------
        // Final Settings Object
        // ------------------------------------------
        const settings = {
            websiteName: updatedWebsiteName,
            logo,
        };

        // ------------------------------------------
        // Save settings.json
        // ------------------------------------------
        await fs.writeFile(
            SETTINGS_FILE,
            JSON.stringify(settings, null, 4),
            "utf-8"
        );

        return NextResponse.json(
            {
                message: "Website settings updated successfully",
                setting: settings,
                success: true,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("POST Settings Error:", error);

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to update website settings",
                success: false,
            },
            { status: 500 }
        );
    }
}

