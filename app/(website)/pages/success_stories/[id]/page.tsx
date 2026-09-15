import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaChevronRight,
    FaHeart,
    FaUser,
} from "react-icons/fa";

interface SuccessStory {
    id: number;
    title: string;
    summary: string | null;
    content: string;
    image_url: string | null;
    patient_name: string | null;
    patient_age: number | null;
    category: string | null;
    story_date: string | null;
    is_featured: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface SuccessStoryResponse {
    success: boolean;
    data: SuccessStory;
    message?: string;
}

async function getSuccessStory(
    id: string
): Promise<SuccessStory | null> {
    try {
        const baseUrl =
            process.env.BACKEND_URL || "http://127.0.0.1:3000";

        const response = await axios.get<SuccessStoryResponse>(
            `${baseUrl}/api/success_stories/${id}`,
            {
                timeout: 10000,
            }
        );

        if (!response.data.success) {
            console.error(
                "Failed to fetch success story:",
                response.data.message
            );

            return null;
        }

        return response.data.data;
    } catch (error) {
        console.error("Error fetching success story:", error);
        return null;
    }
}


function formatDate(date: string | null) {
    if (!date) return "Recent";

    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

interface SuccessStoryPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function SuccessStoryPage({
    params,
}: SuccessStoryPageProps) {
    const { id } = await params;

    const story = await getSuccessStory(id);

    // Story not found
    if (!story) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-[#FBF9F9] px-6">
                <div className="max-w-lg text-center">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#911824]/10">
                        <FaHeart className="text-3xl text-[#911824]" />
                    </div>

                    <h1 className="mt-6 text-3xl font-bold text-gray-900">
                        Story Not Found
                    </h1>

                    <p className="mt-3 text-gray-600">
                        The success story you are looking for could not
                        be found or is no longer available.
                    </p>

                    <Link
                        href="/pages/success_stories"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#911824] px-6 py-3 font-semibold text-white transition hover:bg-[#7d151f]"
                    >
                        <FaArrowLeft />
                        Back to Success Stories
                    </Link>

                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#FBF9F9]">

            {/* =====================================
                HERO / STORY BANNER
            ====================================== */}
            <section className="relative h-105 w-full overflow-hidden">

                {/* Background Image */}
                {story.image_url ? (
                    <Image
                        src={story.image_url}
                        alt={story.title}
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-[#911824]" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/65" />

                {/* Hero Content */}
                <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">

                    <div className="max-w-4xl text-white">

                        {/* Breadcrumb */}
                        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/75">

                            <Link
                                href="/"
                                className="transition hover:text-white"
                            >
                                Home
                            </Link>

                            <FaChevronRight className="text-xs" />

                            <Link
                                href="/pages/success_stories"
                                className="transition hover:text-white"
                            >
                                Success Stories
                            </Link>

                            <FaChevronRight className="text-xs" />

                            <span className="text-white">
                                {story.title}
                            </span>

                        </div>

                        {/* Category / Featured */}
                        <div className="mb-5 flex flex-wrap items-center gap-3">

                            {story.category && (
                                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                                    {story.category}
                                </span>
                            )}

                            {story.is_featured && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-[#911824] px-4 py-2 text-sm font-semibold">
                                    <FaHeart />
                                    Featured Story
                                </span>
                            )}

                        </div>

                        {/* Title */}
                        <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                            {story.title}
                        </h1>

                        {/* Summary */}
                        {story.summary && (
                            <p className="mt-5 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
                                {story.summary}
                            </p>
                        )}

                    </div>

                </div>
            </section>


            {/* =====================================
                STORY CONTENT
            ====================================== */}
            <section className="px-6 py-16 lg:px-8">
                <div className="mx-auto max-w-6xl">

                    <div className="grid gap-12 lg:grid-cols-[1fr_320px]">

                        {/* =========================
                            MAIN STORY
                        ========================== */}
                        <article>

                            {/* Patient Information */}
                            <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">

                                <div className="flex flex-wrap items-center gap-6">

                                    {/* Patient */}
                                    {story.patient_name && (
                                        <div className="flex items-center gap-3">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#911824]/10">
                                                <FaUser className="text-[#911824]" />
                                            </div>

                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-gray-500">
                                                    Patient
                                                </p>

                                                <p className="font-semibold text-gray-900">
                                                    {story.patient_name}
                                                </p>
                                            </div>

                                        </div>
                                    )}

                                    {/* Age */}
                                    {story.patient_age !== null && (
                                        <div className="border-l border-gray-200 pl-6">

                                            <p className="text-xs uppercase tracking-wide text-gray-500">
                                                Age
                                            </p>

                                            <p className="font-semibold text-gray-900">
                                                {story.patient_age} years
                                            </p>

                                        </div>
                                    )}

                                    {/* Date */}
                                    {story.story_date && (
                                        <div className="border-l border-gray-200 pl-6">

                                            <div className="flex items-center gap-2">

                                                <FaCalendarAlt className="text-[#911824]" />

                                                <div>
                                                    <p className="text-xs uppercase tracking-wide text-gray-500">
                                                        Story Date
                                                    </p>

                                                    <p className="font-semibold text-gray-900">
                                                        {formatDate(
                                                            story.story_date
                                                        )}
                                                    </p>
                                                </div>

                                            </div>

                                        </div>
                                    )}

                                </div>

                            </div>


                            {/* Story Heading */}
                            <div className="mb-8">
                                <span className="text-sm font-semibold uppercase tracking-wider text-[#911824]">
                                    Patient Success Story
                                </span>

                                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                    A Journey of Hope and Recovery
                                </h2>
                            </div>


                            {/* Content */}
                            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8 lg:p-10">

                                <div className="whitespace-pre-line text-base leading-8 text-gray-700">
                                    {story.content}
                                </div>

                            </div>


                            {/* Back Button */}
                            <div className="mt-8">

                                <Link
                                    href="/pages/success_stories"
                                    className="inline-flex items-center gap-2 font-semibold text-[#911824] transition-all hover:gap-3"
                                >
                                    <FaArrowLeft />
                                    Back to Success Stories
                                </Link>

                            </div>

                        </article>


                        {/* =================================
                            SIDEBAR
                        ================================== */}
                        <aside>

                            <div className="sticky top-24 space-y-6">

                                {/* Story Image */}
                                {story.image_url && (
                                    <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm">

                                        <Image
                                            src={story.image_url}
                                            alt={story.title}
                                            fill
                                            sizes="320px"
                                            className="object-cover"
                                        />

                                    </div>
                                )}


                                {/* About Card */}
                                <div className="rounded-2xl bg-[#911824] p-6 text-white">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                                        <FaHeart className="text-xl" />
                                    </div>

                                    <h3 className="mt-5 text-xl font-bold">
                                        Compassionate Care
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-white/80">
                                        At Bashir Memorial Welfare Hospital,
                                        every patient receives dedicated care,
                                        support, and attention throughout their
                                        healthcare journey.
                                    </p>

                                </div>


                                {/* Contact Card */}
                                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">

                                    <h3 className="text-xl font-bold text-gray-900">
                                        Need Medical Assistance?
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-gray-600">
                                        Our healthcare team is here to help you
                                        with quality and compassionate medical
                                        care.
                                    </p>

                                    <Link
                                        href="/contact"
                                        className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[#911824] px-5 py-3 font-semibold text-white transition hover:bg-[#7d151f]"
                                    >
                                        Contact Us
                                    </Link>

                                </div>

                            </div>

                        </aside>

                    </div>

                </div>
            </section>


            {/* =====================================
                BOTTOM CTA
            ====================================== */}
            <section className="bg-white px-6 py-14 lg:px-8">

                <div className="mx-auto max-w-7xl rounded-3xl bg-[#911824] px-6 py-10 sm:px-10 lg:px-14">

                    <div className="flex flex-col items-center justify-between gap-7 md:flex-row">

                        <div className="max-w-2xl text-white">

                            <h2 className="text-3xl font-bold sm:text-4xl">
                                Your Health Matters to Us
                            </h2>

                            <p className="mt-3 leading-7 text-white/80">
                                Experience compassionate healthcare and
                                professional medical services at Bashir
                                Memorial Welfare Hospital.
                            </p>

                        </div>

                        <Link
                            href="/contact"
                            className="inline-flex shrink-0 items-center gap-3 rounded-lg bg-white px-6 py-3 font-semibold text-[#911824] transition hover:bg-gray-100"
                        >
                            Contact Us
                            <FaChevronRight className="text-sm" />
                        </Link>

                    </div>

                </div>

            </section>

        </main>
    );
}