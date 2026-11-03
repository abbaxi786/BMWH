
import { sql } from "../../../lib/db";

const FOUNDER_ID = 1;

export async function getFounderMessage() {
    const rows = await sql`
        SELECT *
        FROM founder_message
        WHERE id = ${FOUNDER_ID}
        LIMIT 1
    `;

    return rows[0] ?? null;
}

export async function updateFounderMessage(data) {
    const rows = await sql`
        UPDATE founder_message
        SET
            section_label = ${data.section_label},
            heading = ${data.heading},
            founder_name = ${data.founder_name},
            designation = ${data.designation},
            image_url = ${data.image_url},
            image_public_id = ${data.image_public_id},
            message = ${data.message},

            read_more_text = ${data.read_more_text},
            read_more_url = ${data.read_more_url},

            english_quote = ${data.english_quote},
            urdu_quote = ${data.urdu_quote},

            quranic_ayat = ${data.quranic_ayat},
            quranic_surah = ${data.quranic_surah},
            quranic_surah_number = ${data.quranic_surah_number},
            quranic_ayat_number = ${data.quranic_ayat_number},
            quranic_translation = ${data.quranic_translation},
            quranic_translation_language =
                ${data.quranic_translation_language},

            is_active = ${data.is_active},
            updated_at = NOW()
        WHERE id = ${FOUNDER_ID}
        RETURNING *
    `;

    return rows[0] ?? null;
}
