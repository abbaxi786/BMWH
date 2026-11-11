import Image from "next/image";
import Link from "next/link";
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaChevronRight,
    FaHeart,
    FaUser,
} from "react-icons/fa";

import { getActiveSuccessStoryById } from "@/lib/data/successStories/successStories";

export const revalidate = 86400;

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

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function SuccessStoryPage({
    params,
}: PageProps) {
    const { id } = await params;

    const storyId = Number(id);

    if (!id || Number.isNaN(storyId)) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
                <div className="max-w-xl w-full bg-white rounded-2xl shadow-md p-10 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Invalid Success Story
                    </h1>

                    <p className="text-gray-600 mb-8">
                        The success story ID provided is not valid.
                    </p>

                    <Link
                        href="/pages/success_stories"
                        className="inline-flex items-center gap-2 bg-[#911824] text-white px-6 py-3 rounded-lg hover:bg-[#7a141f] transition"
                    >
                        <FaArrowLeft />
                        Back to Success Stories
                    </Link>
                </div>
            </main>
        );
    }

    let story: SuccessStory | null = null;

    try {
        const result = await getActiveSuccessStoryById(storyId);

        story = result as SuccessStory | null;
    } catch (error) {
        console.error("Error fetching success story:", error);
    }

    if (!story) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
                <div className="max-w-xl w-full bg-white rounded-2xl shadow-md p-10 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                        <FaHeart className="text-3xl text-[#911824]" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Success Story Not Found
                    </h1>

                    <p className="text-gray-600 mb-8">
                        The success story you are looking for may have been
                        removed or is no longer available.
                    </p>

                    <Link
                        href="/pages/success_stories"
                        className="inline-flex items-center gap-2 bg-[#911824] text-white px-6 py-3 rounded-lg hover:bg-[#7a141f] transition"
                    >
                        <FaArrowLeft />
                        Back to Success Stories
                    </Link>
                </div>
            </main>
        );
    }

    const formattedDate = story.story_date
        ? new Date(story.story_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : null;

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="relative h-[420px] md:h-[500px] overflow-hidden">
                {story.image_url ? (
                    <Image
                        src={story.image_url}
                        alt={story.title}
                        fill
                        priority
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-[#911824]" />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-end pb-12">
                    <div className="max-w-4xl text-white">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm mb-6 text-gray-200 flex-wrap">
                            <Link
                                href="/"
                                className="hover:text-white transition"
                            >
                                Home
                            </Link>

                            <FaChevronRight className="text-xs" />

                            <Link
                                href="/pages/success_stories"
                                className="hover:text-white transition"
                            >
                                Success Stories
                            </Link>

                            <FaChevronRight className="text-xs" />

                            <span className="text-gray-300">
                                {story.title}
                            </span>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                            {story.category && (
                                <span className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full text-sm">
                                    {story.category}
                                </span>
                            )}

                            {story.is_featured && (
                                <span className="inline-block bg-[#911824] text-white px-4 py-2 rounded-full text-sm font-medium">
                                    Featured Story
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                            {story.title}
                        </h1>

                        {/* Summary */}
                        {story.summary && (
                            <p className="text-lg md:text-xl text-gray-200 max-w-3xl leading-relaxed">
                                {story.summary}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 md:py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
                        {/* Story Content */}
                        <article className="lg:col-span-2">
                            {/* Patient Information */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    {story.patient_name && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-[#911824]/10 flex items-center justify-center shrink-0">
                                                <FaUser className="text-[#911824]" />
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Patient
                                                </p>

                                                <p className="font-semibold text-gray-800">
                                                    {story.patient_name}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {story.patient_age !== null && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-[#911824]/10 flex items-center justify-center shrink-0">
                                                <FaUser className="text-[#911824]" />
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Age
                                                </p>

                                                <p className="font-semibold text-gray-800">
                                                    {story.patient_age} years
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {formattedDate && (
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-[#911824]/10 flex items-center justify-center shrink-0">
                                                <FaCalendarAlt className="text-[#911824]" />
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Story Date
                                                </p>

                                                <p className="font-semibold text-gray-800">
                                                    {formattedDate}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Story */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 md:p-10">
                                <div className="mb-8">
                                    <p className="text-[#911824] font-semibold text-sm uppercase tracking-wider mb-3">
                                        Patient Success Story
                                    </p>

                                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                                        A Journey of Hope and Recovery
                                    </h2>
                                </div>

                                <div className="prose prose-lg max-w-none">
                                    <div className="text-gray-700 leading-8 whitespace-pre-line">
                                        {story.content}
                                    </div>
                                </div>
                            </div>

                            {/* Back Button */}
                            <div className="mt-8">
                                <Link
                                    href="/pages/success_stories"
                                    className="inline-flex items-center gap-2 text-[#911824] font-semibold hover:gap-3 transition-all"
                                >
                                    <FaArrowLeft />
                                    Back to Success Stories
                                </Link>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1">
                            <div className="space-y-6 lg:sticky lg:top-24">
                                {/* Story Image */}
                                {story.image_url && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="relative aspect-[4/3]">
                                            <Image
                                                src={story.image_url}
                                                alt={story.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Compassionate Care */}
                                <div className="bg-[#911824] rounded-2xl p-7 text-white">
                                    <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-5">
                                        <FaHeart className="text-2xl" />
                                    </div>

                                    <h3 className="text-2xl font-bold mb-3">
                                        Compassionate Care
                                    </h3>

                                    <p className="text-white/85 leading-7">
                                        Every patient deserves compassionate
                                        care, expert treatment, and support
                                        throughout their healthcare journey.
                                    </p>
                                </div>

                                {/* Contact Us */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                        Need Medical Care?
                                    </h3>

                                    <p className="text-gray-600 leading-7 mb-6">
                                        Our healthcare team is here to help you
                                        receive the care and treatment you need.
                                    </p>

                                    <Link
                                        href="/pages/contact"
                                        className="inline-flex items-center justify-center w-full bg-[#911824] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7a141f] transition"
                                    >
                                        Contact Us
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="bg-[#911824] py-16">
                <div className="max-w-4xl mx-auto px-6 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5">
                        Your Health, Our Commitment
                    </h2>

                    <p className="text-lg text-white/85 leading-8 max-w-2xl mx-auto mb-8">
                        Our team is committed to providing quality healthcare,
                        compassionate treatment, and support for every patient.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/pages/appointment"
                            className="inline-flex items-center justify-center bg-white text-[#911824] px-7 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Book an Appointment
                        </Link>

                        <Link
                            href="/pages/success_stories"
                            className="inline-flex items-center justify-center border border-white text-white px-7 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
                        >
                            View More Stories
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}