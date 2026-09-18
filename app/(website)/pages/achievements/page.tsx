import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
    FaAward,
    FaCalendarAlt,
    FaExternalLinkAlt,
    FaBuilding,
} from "react-icons/fa";

interface AchievementAward {
    id: number;
    title: string;
    type: string;
    description: string | null;
    image_url: string | null;
    award_date: string | null;
    issuing_organization: string | null;
    website_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

async function getAchievements(): Promise<AchievementAward[]> {
    try {
        const response = await axios.get(
            `${process.env.BACKEND_URL}/api/acheivement_awards/all`,
            {
                timeout: 10000,
            }
        );

        return response.data?.data || [];
    } catch (error) {
        console.error("Error fetching achievements and awards:", error);
        return [];
    }
}

function formatType(type: string) {
    return type
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date: string | null) {
    if (!date) return "Date not available";

    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default async function AchievementsAwardsPage() {
    const achievements = await getAchievements();

    return (
        <main className="min-h-screen bg-white">

            {/* ================= HERO ================= */}
            <section className="relative overflow-hidden bg-[#911824]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#911824] via-[#911824] to-[#86000D]" />

                <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
                    <div className="max-w-3xl">

                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                            <FaAward />
                            Our Achievements & Awards
                        </div>

                        <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                            Recognizing Excellence in
                            <span className="block text-red-100">
                                Healthcare & Service
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-7 text-red-100 sm:text-lg">
                            Our achievements and awards reflect our continued
                            commitment to quality healthcare, patient welfare,
                            medical excellence, and service to the community.
                        </p>

                    </div>
                </div>
            </section>

            {/* ================= CONTENT ================= */}
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                {/* Section heading */}
                <div className="mb-12 max-w-3xl">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#911824]">
                        Excellence & Recognition
                    </p>

                    <h2 className="text-3xl font-bold text-[#5B403D] sm:text-4xl">
                        Our Achievements & Awards
                    </h2>

                    <p className="mt-4 leading-7 text-gray-600">
                        Explore the milestones, recognitions, certifications,
                        and awards that represent our commitment to providing
                        quality healthcare and serving our community.
                    </p>
                </div>

                {/* ================= EMPTY STATE ================= */}
                {achievements.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-16 text-center">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-[#911824]">
                            <FaAward />
                        </div>

                        <h3 className="text-xl font-semibold text-[#5B403D]">
                            No achievements available
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-gray-500">
                            Our achievements and awards will be displayed here
                            as they become available.
                        </p>
                    </div>
                ) : (
                    /* ================= ACHIEVEMENTS GRID ================= */
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                        {achievements.map((achievement) => (
                            <article
                                key={achievement.id}
                                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >

                                {/* Image */}
                                <div className="relative h-60 w-full overflow-hidden bg-gray-100">

                                    {achievement.image_url ? (
                                        <Image
                                            src={achievement.image_url}
                                            alt={achievement.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-red-50">
                                            <FaAward className="text-6xl text-[#911824]/30" />
                                        </div>
                                    )}

                                    {/* Type badge */}
                                    <div className="absolute left-4 top-4">
                                        <span className="rounded-full bg-[#911824] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow">
                                            {formatType(achievement.type)}
                                        </span>
                                    </div>

                                </div>

                                {/* Card content */}
                                <div className="p-6">

                                    <h3 className="line-clamp-2 text-xl font-bold text-[#5B403D] transition-colors group-hover:text-[#911824]">
                                        {achievement.title}
                                    </h3>

                                    {/* Organization */}
                                    {achievement.issuing_organization && (
                                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                            <FaBuilding className="shrink-0 text-[#911824]" />

                                            <span className="line-clamp-1">
                                                {achievement.issuing_organization}
                                            </span>
                                        </div>
                                    )}

                                    {/* Date */}
                                    {achievement.award_date && (
                                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                            <FaCalendarAlt className="shrink-0 text-[#911824]" />

                                            <span>
                                                {formatDate(
                                                    achievement.award_date
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {achievement.description && (
                                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                                            {achievement.description}
                                        </p>
                                    )}

                                    {/* Footer */}
                                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">

                                        <Link
                                            href={`/pages/achievements/${achievement.id}`}
                                            className="font-semibold text-[#911824] transition-colors hover:text-[#86000D]"
                                        >
                                            View Details
                                        </Link>

                                        {achievement.website_url && (
                                            <a
                                                href={
                                                    achievement.website_url
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-[#911824]"
                                            >
                                                <FaExternalLinkAlt />
                                                Official Website
                                            </a>
                                        )}

                                    </div>
                                </div>

                            </article>
                        ))}

                    </div>
                )}

            </section>

            {/* ================= BOTTOM CTA ================= */}
            <section className="bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                    <div className="rounded-3xl bg-[#911824] px-8 py-12 text-center sm:px-12">

                        <FaAward className="mx-auto mb-5 text-4xl text-white/80" />

                        <h2 className="text-3xl font-bold text-white">
                            Committed to Excellence
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl leading-7 text-red-100">
                            Every recognition represents our dedication to
                            improving healthcare services and making a
                            meaningful difference in the lives of the people
                            we serve.
                        </p>

                        <Link
                            href="/pages/about"
                            className="mt-7 inline-flex items-center rounded-lg bg-white px-6 py-3 font-semibold text-[#911824] transition-colors hover:bg-red-50"
                        >
                            Learn More About Us
                        </Link>

                    </div>

                </div>
            </section>

        </main>
    );
}