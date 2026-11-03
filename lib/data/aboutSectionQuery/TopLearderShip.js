
import { sql } from "@/lib/db";

// GET: Fetch active or all leadership messages.
export async function getLeadershipMessages(
    includeInactive = false,
    leaderKey = null
) {
    let result;

    if (leaderKey && includeInactive) {
        result = await sql`
            SELECT *
            FROM leadership_messages
            WHERE leader_key = ${leaderKey}
            ORDER BY id ASC
        `;
    } else if (leaderKey) {
        result = await sql`
            SELECT *
            FROM leadership_messages
            WHERE leader_key = ${leaderKey}
              AND is_active = TRUE
            ORDER BY id ASC
        `;
    } else if (includeInactive) {
        result = await sql`
            SELECT *
            FROM leadership_messages
            ORDER BY id ASC
        `;
    } else {
        result = await sql`
            SELECT *
            FROM leadership_messages
            WHERE is_active = TRUE
            ORDER BY id ASC
        `;
    }

    return result;
}

// PATCH: Update only the fields supplied by the admin.
export async function patchLeadershipMessage(leaderKey, data) {
    const {
        name,
        designation,
        image,
        section_label,
        heading,
        signature_text,
        message,
        quranic_verse,
        quranic_translation,
        quranic_reference,
        is_active,
    } = data;

    const result = await sql`
        UPDATE leadership_messages
        SET
            name = COALESCE(${name ?? null}, name),
            designation = COALESCE(${designation ?? null}, designation),
            image = COALESCE(${image ?? null}, image),
            section_label = COALESCE(${section_label ?? null}, section_label),
            heading = COALESCE(${heading ?? null}, heading),
            signature_text = COALESCE(${signature_text ?? null}, signature_text),

            message = COALESCE(
                ${
                    message === undefined
                        ? null
                        : JSON.stringify(message)
                }::jsonb,
                message
            ),

            quranic_verse = CASE
                WHEN ${quranic_verse === undefined}
                    THEN quranic_verse
                ELSE ${quranic_verse ?? null}
            END,

            quranic_translation = CASE
                WHEN ${quranic_translation === undefined}
                    THEN quranic_translation
                ELSE ${quranic_translation ?? null}
            END,

            quranic_reference = CASE
                WHEN ${quranic_reference === undefined}
                    THEN quranic_reference
                ELSE ${quranic_reference ?? null}
            END,

            is_active = COALESCE(${is_active ?? null}, is_active),
            updated_at = NOW()

        WHERE leader_key = ${leaderKey}
        RETURNING *
    `;

    return result[0] || null;
}
