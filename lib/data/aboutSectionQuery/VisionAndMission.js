
import { sql } from "@/lib/db";

// GET: Fetch active Mission & Vision content for the public website
export async function getMissionVision() {
    try {
        const result = await sql`
            SELECT
                id,
                eyebrow,
                title,
                mission_title AS "missionTitle",
                mission_description AS "missionDescription",
                vision_title AS "visionTitle",
                vision_description AS "visionDescription",
                is_active AS "isActive",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            FROM public.mission_vision
            WHERE is_active = TRUE
            ORDER BY id ASC
            LIMIT 1
        `;

        return result[0] ?? null;
    } catch (error) {
        console.error("Error fetching Mission & Vision:", error);
        throw error;
    }
}

// GET: Fetch Mission & Vision content for the admin accordion
// Returns the record even when is_active is false.
export async function getMissionVisionForAdmin() {
    try {
        const result = await sql`
            SELECT
                id,
                eyebrow,
                title,
                mission_title AS "missionTitle",
                mission_description AS "missionDescription",
                vision_title AS "visionTitle",
                vision_description AS "visionDescription",
                is_active AS "isActive",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            FROM public.mission_vision
            ORDER BY id ASC
            LIMIT 1
        `;

        return result[0] ?? null;
    } catch (error) {
        console.error("Error fetching Mission & Vision for admin:", error);
        throw error;
    }
}

// PATCH: Update only the fields supplied by the admin
export async function updateMissionVision(fields) {
    try {
        const allowedFields = [
            "eyebrow",
            "title",
            "missionTitle",
            "missionDescription",
            "visionTitle",
            "visionDescription",
            "isActive",
        ];

        const hasField = (field) =>
            Object.prototype.hasOwnProperty.call(fields, field);

        const suppliedFields = allowedFields.filter(hasField);

        if (suppliedFields.length === 0) {
            return null;
        }

        const hasEyebrow = hasField("eyebrow");
        const hasTitle = hasField("title");
        const hasMissionTitle = hasField("missionTitle");
        const hasMissionDescription = hasField("missionDescription");
        const hasVisionTitle = hasField("visionTitle");
        const hasVisionDescription = hasField("visionDescription");
        const hasIsActive = hasField("isActive");

        const result = await sql`
            UPDATE public.mission_vision
            SET
                eyebrow = CASE
                    WHEN ${hasEyebrow} THEN ${fields.eyebrow ?? null}
                    ELSE eyebrow
                END,
                title = CASE
                    WHEN ${hasTitle} THEN ${fields.title ?? null}
                    ELSE title
                END,
                mission_title = CASE
                    WHEN ${hasMissionTitle} THEN ${fields.missionTitle ?? null}
                    ELSE mission_title
                END,
                mission_description = CASE
                    WHEN ${hasMissionDescription} THEN ${fields.missionDescription ?? null}
                    ELSE mission_description
                END,
                vision_title = CASE
                    WHEN ${hasVisionTitle} THEN ${fields.visionTitle ?? null}
                    ELSE vision_title
                END,
                vision_description = CASE
                    WHEN ${hasVisionDescription} THEN ${fields.visionDescription ?? null}
                    ELSE vision_description
                END,
                is_active = CASE
                    WHEN ${hasIsActive} THEN ${fields.isActive}
                    ELSE is_active
                END,
                updated_at = NOW()
            WHERE id = (
                SELECT id
                FROM public.mission_vision
                ORDER BY id ASC
                LIMIT 1
            )
            RETURNING
                id,
                eyebrow,
                title,
                mission_title AS "missionTitle",
                mission_description AS "missionDescription",
                vision_title AS "visionTitle",
                vision_description AS "visionDescription",
                is_active AS "isActive",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
        `;

        return result[0] ?? null;
    } catch (error) {
        console.error("Error updating Mission & Vision:", error);
        throw error;
    }
}
