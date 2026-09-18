import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "../../../lib/auth";

export async function GET(request) {
    try {
        await requireAdmin(request);

        /*
         * =====================================================
         * DASHBOARD STATISTICS
         *
         * Only COUNT(*) is used here.
         * Therefore, we don't assume any particular columns
         * such as is_active, summary, image_url, etc.
         * =====================================================
         */

        const [
            doctorsResult,
            departmentsResult,
            departmentServicesResult,
            achievementsResult,
            doctorSchedulesResult,
            galleryResult,
            guestsResult,
            eventsResult,
            healthPartnersResult,
            facilitiesResult,
            newsResult,
            successStoriesResult,
            supportersResult,
        ] = await Promise.all([
            sql`
                SELECT COUNT(*)::int AS count
                FROM doctors
            `,

            sql`
                SELECT COUNT(*)::int AS count
                FROM departments
            `,

            sql`
                SELECT COUNT(*)::int AS count
                FROM department_services
            `,

            sql`
                SELECT COUNT(*)::int AS count
                FROM achievements_awards
            `,

            sql`
                SELECT COUNT(*)::int AS count
                FROM doctor_schedules
            `,

            sql`
                SELECT COUNT(*)::int AS count
                FROM event_gallery
            `,

            sql`
                SELECT COUNT(*)::int AS count
                FROM event_guests
            `,

            sql`
                SELECT COUNT(*)::int AS count
                FROM events
            `,

            sql`
                SELECT COUNT(*)::int AS count
                FROM health_partners
            `,

            sql`
                SELECT COUNT(*)::int AS count
                FROM hospital_facilities
            `,

            sql`
                SELECT COUNT(*)::int AS count
                FROM news_updates
            `,

            sql`
                SELECT COUNT(*)::int AS count
                FROM success_stories
            `,

            sql`
                SELECT COUNT(*)::int AS count
                FROM supporters
            `,
        ]);

        /*
         * =====================================================
         * RECENT EVENTS
         *
         * These columns are already known from your events API.
         * =====================================================
         */

        const recentEventsResult = await sql`
            SELECT
                id,
                title,
                description,
                event_date,
                start_time,
                end_time,
                location,
                cover_image_url,
                is_featured,
                is_active,
                created_at
            FROM events
            ORDER BY created_at DESC
            LIMIT 5
        `;

        /*
         * =====================================================
         * UPCOMING EVENTS
         *
         * Your events table is already confirmed to contain
         * event_date and is_active.
         * =====================================================
         */

        const upcomingEventsResult = await sql`
            SELECT
                id,
                title,
                description,
                event_date,
                start_time,
                end_time,
                location,
                cover_image_url,
                is_featured,
                is_active
            FROM events
            WHERE event_date >= CURRENT_DATE
              AND is_active = TRUE
            ORDER BY
                event_date ASC,
                start_time ASC NULLS LAST
            LIMIT 5
        `;

        /*
         * =====================================================
         * DASHBOARD RESPONSE
         *
         * We are intentionally NOT querying the detailed
         * news/success-story columns yet because their exact
         * schemas have not been provided.
         * =====================================================
         */

        return NextResponse.json(
            {
                success: true,

                data: {
                    statistics: {
                        doctors:
                            doctorsResult[0].count,

                        departments:
                            departmentsResult[0].count,

                        departmentServices:
                            departmentServicesResult[0].count,

                        achievements:
                            achievementsResult[0].count,

                        doctorSchedules:
                            doctorSchedulesResult[0].count,

                        galleryImages:
                            galleryResult[0].count,

                        eventGuests:
                            guestsResult[0].count,

                        events:
                            eventsResult[0].count,

                        healthPartners:
                            healthPartnersResult[0].count,

                        hospitalFacilities:
                            facilitiesResult[0].count,

                        newsUpdates:
                            newsResult[0].count,

                        successStories:
                            successStoriesResult[0].count,

                        supporters:
                            supportersResult[0].count,
                    },

                    recentEvents:
                        recentEventsResult,

                    upcomingEvents:
                        upcomingEventsResult,

                    recentNews: [],

                    recentSuccessStories: [],
                },
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "Dashboard API error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to load dashboard data",
                error:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
            },
            {
                status: 500,
            }
        );
    }
}

