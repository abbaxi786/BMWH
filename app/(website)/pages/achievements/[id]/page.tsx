import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
    FaArrowLeft,
    FaAward,
    FaBuilding,
    FaCalendarAlt,
    FaExternalLinkAlt,
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

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

async function getAchievement(id: string): Promise<AchievementAward | null> {
    try {
        const response = await axios.get(
            `${process.env.BACKEND_URL}/api/acheivement_awards/${id}`,
            {
                timeout: 10000,
            }
        );

        return response.data?.data || null;
    } catch (error) {
        console.error("Error fetching achievement:", error);
        return null;
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

export default async function AchievementDetailPage({
    params,
}: PageProps) {
    const { id } = await params;

    const achievement = await getAchievement(id);

    /* ================= NOT FOUND ================= */

    if (!achievement) {
        return (
            <main className="min-h-screen bg-white">
                <section className="flex min-h-[70vh] items-center justify-center px-6">
                    <div className="max-w-lg text-center">

                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                            <FaAward className="text-4xl text-[#911824]" />
                        </div>

                        <h1 className="text-3xl font-bold text-[#5B403D]">
                            Achievement Not Found
                        </h1>

                        <p className="mt-4 leading-7 text-gray-600">
                            The achievement or award you are looking for could
                            not be found or is no longer available.
                        </p>

                        <Link
                            href="/pages/achievements-awards"
                            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#911824] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#86000D]"
                        >
                            <FaArrowLeft />
                            Back to Achievements
                        </Link>

                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white">

            {/* ================= HERO ================= */}

            <section className="relative overflow-hidden bg-[#911824]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#911824] via-[#911824] to-[#86000D]" />

                <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">

                    {/* Back button */}

                    <Link
                        href="/pages/achievements-awards"
                        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-red-100 transition-colors hover:text-white"
                    >
                        <FaArrowLeft />
                        Back to Achievements & Awards
                    </Link>

                    <div className="max-w-4xl">

                        {/* Type */}

                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                            <FaAward />
                            {formatType(achievement.type)}
                        </div>

                        <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                            {achievement.title}
                        </h1>

                        {achievement.issuing_organization && (
                            <div className="mt-6 flex items-center gap-2 text-red-100">
                                <FaBuilding />

                                <span>
                                    {achievement.issuing_organization}
                                </span>
                            </div>
                        )}

                    </div>
                </div>
            </section>

            {/* ================= MAIN CONTENT ================= */}

            <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">

                <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

                    {/* ================= IMAGE ================= */}

                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">

                        {achievement.image_url ? (
                            <div className="relative aspect-[4/3] w-full">

                                <Image
                                    src={achievement.image_url}
                                    alt={achievement.title}
                                    fill
                                    priority
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 55vw"
                                />

                            </div>
                        ) : (
                            <div className="flex aspect-[4/3] w-full items-center justify-center bg-red-50">

                                <FaAward className="text-8xl text-[#911824]/20" />

                            </div>
                        )}

                    </div>

                    {/* ================= INFORMATION ================= */}

                    <div>

                        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#911824]">
                            Recognition
                        </p>

                        <h2 className="text-3xl font-bold leading-tight text-[#5B403D] sm:text-4xl">
                            {achievement.title}
                        </h2>

                        {/* Details */}

                        <div className="mt-8 space-y-5">

                            {/* Type */}

                            <div className="flex gap-4 border-b border-gray-100 pb-5">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[#911824]">
                                    <FaAward />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Recognition Type
                                    </p>

                                    <p className="mt-1 font-semibold text-[#5B403D]">
                                        {formatType(achievement.type)}
                                    </p>
                                </div>

                            </div>

                            {/* Organization */}

                            {achievement.issuing_organization && (
                                <div className="flex gap-4 border-b border-gray-100 pb-5">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[#911824]">
                                        <FaBuilding />
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Issuing Organization
                                        </p>

                                        <p className="mt-1 font-semibold text-[#5B403D]">
                                            {achievement.issuing_organization}
                                        </p>
                                    </div>

                                </div>
                            )}

                            {/* Date */}

                            {achievement.award_date && (
                                <div className="flex gap-4 border-b border-gray-100 pb-5">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[#911824]">
                                        <FaCalendarAlt />
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Date
                                        </p>

                                        <p className="mt-1 font-semibold text-[#5B403D]">
                                            {formatDate(
                                                achievement.award_date
                                            )}
                                        </p>
                                    </div>

                                </div>
                            )}

                        </div>

                        {/* Official Website */}

                        {achievement.website_url && (
                            <a
                                href={achievement.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#911824] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#86000D]"
                            >
                                Visit Official Website
                                <FaExternalLinkAlt className="text-sm" />
                            </a>
                        )}

                    </div>

                </div>

                {/* ================= DESCRIPTION ================= */}

                {achievement.description && (
                    <div className="mt-16 border-t border-gray-200 pt-12">

                        <div className="max-w-4xl">

                            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#911824]">
                                About This Recognition
                            </p>

                            <h2 className="text-3xl font-bold text-[#5B403D]">
                                Achievement Details
                            </h2>

                            <div className="mt-6 text-base leading-8 text-gray-600">
                                {achievement.description
                                    .split("\n")
                                    .map((paragraph, index) => (
                                        <p
                                            key={index}
                                            className="mb-4 last:mb-0"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                            </div>

                        </div>

                    </div>
                )}

            </section>

            {/* ================= CTA ================= */}

            <section className="bg-gray-50">
                <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                    <div className="rounded-3xl bg-[#911824] px-8 py-12 text-center sm:px-12">

                        <FaAward className="mx-auto mb-5 text-4xl text-white/80" />

                        <h2 className="text-3xl font-bold text-white">
                            Excellence in Healthcare
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl leading-7 text-red-100">
                            Our recognitions represent our ongoing commitment
                            to quality healthcare, patient welfare, and service
                            to our community.
                        </p>

                        <Link
                            href="/pages/achievements-awards"
                            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-[#911824] transition-colors hover:bg-red-50"
                        >
                            <FaArrowLeft />
                            View All Achievements
                        </Link>

                    </div>

                </div>
            </section>

        </main>
    );
}