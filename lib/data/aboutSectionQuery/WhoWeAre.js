
import { sql } from "@/lib/db";

// GET: Fetch active Who We Are content
export async function getWhoWeAre() {
    try {
        const result = await sql`
            SELECT
                id,
                eyebrow,
                title,
                description_one AS "descriptionOne",
                description_two AS "descriptionTwo",
                is_active AS "isActive",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            FROM who_we_are
            WHERE is_active = TRUE
            ORDER BY id ASC
            LIMIT 1
        `;

        return result[0] ?? null;
    } catch (error) {
        console.error("Error fetching Who We Are:", error);
        throw error;
    }
}

// GET for admin: Fetch the record even if it is inactive
export async function getWhoWeAreForAdmin() {
    try {
        const result = await sql`
            SELECT
                id,
                eyebrow,
                title,
                description_one AS "descriptionOne",
                description_two AS "descriptionTwo",
                is_active AS "isActive",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            FROM who_we_are
            ORDER BY id ASC
            LIMIT 1
        `;

        return result[0] ?? null;
    } catch (error) {
        console.error("Error fetching Who We Are for admin:", error);
        throw error;
    }
}

// PATCH: Update only the supplied fields
export async function updateWhoWeAre(fields) {
    try {
        const {
            eyebrow,
            title,
            descriptionOne,
            descriptionTwo,
            isActive,
        } = fields;

        const hasEyebrow = Object.hasOwn(fields, "eyebrow");
        const hasTitle = Object.hasOwn(fields, "title");
        const hasDescriptionOne = Object.hasOwn(fields, "descriptionOne");
        const hasDescriptionTwo = Object.hasOwn(fields, "descriptionTwo");
        const hasIsActive = Object.hasOwn(fields, "isActive");

        const result = await sql`
            UPDATE who_we_are
            SET
                eyebrow = CASE
                    WHEN ${hasEyebrow} THEN ${eyebrow ?? null}
                    ELSE eyebrow
                END,
                title = CASE
                    WHEN ${hasTitle} THEN ${title ?? null}
                    ELSE title
                END,
                description_one = CASE
                    WHEN ${hasDescriptionOne} THEN ${descriptionOne ?? null}
                    ELSE description_one
                END,
                description_two = CASE
                    WHEN ${hasDescriptionTwo} THEN ${descriptionTwo ?? null}
                    ELSE description_two
                END,
                is_active = CASE
                    WHEN ${hasIsActive} THEN ${isActive}
                    ELSE is_active
                END,
                updated_at = NOW()
            WHERE id = (
                SELECT id
                FROM who_we_are
                ORDER BY id ASC
                LIMIT 1
            )
            RETURNING
                id,
                eyebrow,
                title,
                description_one AS "descriptionOne",
                description_two AS "descriptionTwo",
                is_active AS "isActive",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
        `;

        return result[0] ?? null;
    } catch (error) {
        console.error("Error updating Who We Are:", error);
        throw error;
    }
}
