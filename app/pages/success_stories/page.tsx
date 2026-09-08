import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
    FaArrowRight,
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

interface SuccessStoriesResponse {
    success: boolean;
    data: SuccessStory[];
    message?: string;
}

async function getAllSuccessStories(): Promise<SuccessStory[]> {
    try {
        const baseUrl =
            process.env.BACKEND_URL || "http://localhost:3000";

        const response = await axios.get<SuccessStoriesResponse>(
            `${baseUrl}/api/success_stories/all`,
            {
                timeout: 10000,
            }
        );

        if (!response.data.success) {
            console.error(
                "Failed to fetch success stories:",
                response.data.message
            );

            return [];
        }

        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching success stories:", error);
        return [];
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

export default async function SuccessStoriesPage() {
    const stories = await getAllSuccessStories();

    return (
        <main className="min-h-screen bg-[#FBF9F9]">

            {/* =========================
                HERO / IMAGE BANNER
            ========================== */}
            <section className="relative h-107.5 w-full overflow-hidden">

                {/* Background Image */}
                <Image
                    src="/images/buildingImage.jpeg"
                    alt="Bashir Memorial Welfare Hospital"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60" />

                {/* Hero Content */}
                <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-8">
                    <div className="max-w-3xl text-white">

                        {/* Breadcrumbs */}
                        <div className="mb-6 flex items-center gap-2 text-sm text-white/80">
                            <Link
                                href="/"
                                className="transition hover:text-white"
                            >
                                Home
                            </Link>

                            <FaChevronRight className="text-xs" />

                            <span className="text-white">
                                Success Stories
                            </span>
                        </div>

                        {/* Badge */}
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                            <FaHeart />
                            Patient Success Stories
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                            Stories of Hope,
                            <span className="block text-white">
                                Healing & Recovery
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
                            Discover inspiring journeys of patients who received
                            compassionate care and treatment at Bashir Memorial
                            Welfare Hospital. Every story represents hope,
                            dedication, and the commitment of our healthcare team.
                        </p>

                    </div>
                </div>
            </section>


            {/* =========================
                INTRODUCTION
            ========================== */}
            <section className="px-6 py-16 lg:px-8">
                <div className="mx-auto max-w-7xl">

                    <div className="max-w-3xl">
                        <span className="text-sm font-semibold uppercase tracking-wider text-[#911824]">
                            Our Patients
                        </span>

                        <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                            Real Stories of Successful Care
                        </h2>

                        <p className="mt-5 text-base leading-7 text-gray-600">
                            Behind every successful treatment is a personal
                            journey. These stories highlight the experiences
                            of patients and families who trusted our medical
                            professionals with their care.
                        </p>
                    </div>


                    {/* =========================
                        STORIES GRID
                    ========================== */}
                    {stories.length > 0 ? (
                        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

                            {stories.map((story) => (
                                <article
                                    key={story.id}
                                    className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >

                                    {/* Image */}
                                    <div className="relative h-64 w-full overflow-hidden bg-gray-100">

                                        {story.image_url ? (
                                            <Image
                                                src={story.image_url}
                                                alt={story.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                <FaHeart className="text-5xl text-gray-300" />
                                            </div>
                                        )}

                                        {/* Featured Badge */}
                                        {story.is_featured && (
                                            <div className="absolute left-4 top-4 rounded-full bg-[#911824] px-3 py-1.5 text-xs font-semibold text-white shadow">
                                                Featured Story
                                            </div>
                                        )}

                                        {/* Category */}
                                        {story.category && (
                                            <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#911824] shadow-sm">
                                                {story.category}
                                            </div>
                                        )}
                                    </div>


                                    {/* Card Content */}
                                    <div className="p-6">

                                        {/* Date */}
                                        <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                                            <FaCalendarAlt className="text-[#911824]" />

                                            <span>
                                                {formatDate(story.story_date)}
                                            </span>
                                        </div>


                                        {/* Title */}
                                        <h3 className="line-clamp-2 text-xl font-bold leading-7 text-gray-900 transition-colors group-hover:text-[#911824]">
                                            {story.title}
                                        </h3>


                                        {/* Patient Information */}
                                        {(story.patient_name ||
                                            story.patient_age) && (
                                            <div className="mt-4 flex items-center gap-3 border-b border-gray-100 pb-4">

                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#911824]/10">
                                                    <FaUser className="text-sm text-[#911824]" />
                                                </div>

                                                <div>
                                                    {story.patient_name && (
                                                        <p className="text-sm font-semibold text-gray-800">
                                                            {story.patient_name}
                                                        </p>
                                                    )}

                                                    {story.patient_age && (
                                                        <p className="text-xs text-gray-500">
                                                            {story.patient_age} years old
                                                        </p>
                                                    )}
                                                </div>

                                            </div>
                                        )}


                                        {/* Summary */}
                                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                                            {story.summary ||
                                                story.content}
                                        </p>


                                        {/* Read More */}
                                        <div className="mt-6">
                                            <Link
                                                href={`/pages/success_stories/${story.id}`}
                                                className="inline-flex items-center gap-2 font-semibold text-[#911824] transition-all hover:gap-3"
                                            >
                                                Read Full Story
                                                <FaArrowRight className="text-sm" />
                                            </Link>
                                        </div>

                                    </div>
                                </article>
                            ))}

                        </div>
                    ) : (

                        /* =========================
                           EMPTY STATE
                        ========================== */
                        <div className="mt-12 rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-100">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#911824]/10">
                                <FaHeart className="text-2xl text-[#911824]" />
                            </div>

                            <h3 className="mt-5 text-xl font-bold text-gray-900">
                                No Success Stories Available
                            </h3>

                            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-600">
                                We are currently updating our patient success
                                stories. Please check back soon to read inspiring
                                journeys of healing and recovery.
                            </p>

                        </div>
                    )}

                </div>
            </section>


            {/* =========================
                BOTTOM CTA
            ========================== */}
            <section className="bg-[#911824] px-6 py-16 lg:px-8">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">

                    <div className="max-w-2xl text-white">
                        <h2 className="text-3xl font-bold sm:text-4xl">
                            Compassionate Care. Better Outcomes.
                        </h2>

                        <p className="mt-4 leading-7 text-white/80">
                            Our dedicated healthcare professionals work every day
                            to provide quality medical care and support to every
                            patient who walks through our doors.
                        </p>
                    </div>

                    <Link
                        href="/contact"
                        className="inline-flex shrink-0 items-center gap-3 rounded-lg bg-white px-6 py-3 font-semibold text-[#911824] transition hover:bg-gray-100"
                    >
                        Contact Us
                        <FaArrowRight />
                    </Link>

                </div>
            </section>

        </main>
    );
}