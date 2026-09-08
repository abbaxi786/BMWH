import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import {
    FaArrowRight,
    FaHeart,
    FaQuoteLeft,
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

async function GetSuccessStories(): Promise<SuccessStory[]> {
    try {
        const baseUrl =
            process.env.BACKEND_URL ||
            "http://localhost:3000";

        const response =
            await axios.get<SuccessStoriesResponse>(
                `${baseUrl}/api/success_stories`
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
        console.error(
            "Error fetching success stories:",
            error
        );

        return [];
    }
}

export default async function SuccessStories() {
    const stories = await GetSuccessStories();

    return (
        <section className="w-full bg-[#FBF9F9] py-20">
            <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <FaHeart className="text-[#911824]" />

                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#911824]">
                            Patient Stories
                        </span>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        Stories of Hope & Healing
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
                        Every patient has a story. Discover some of the
                        journeys of hope, recovery, and healing made possible
                        through compassionate care at BMWH.
                    </p>
                </div>

                {stories.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-3">
                        {stories.map((story) => (
                            <article
                                key={story.id}
                                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* Image */}
                                <div className="relative h-56 w-full overflow-hidden">
                                    {story.image_url ? (
                                        <Image
                                            src={story.image_url}
                                            alt={story.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                            <FaHeart className="text-4xl text-gray-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {story.category && (
                                        <span className="text-xs font-semibold uppercase tracking-wider text-[#911824]">
                                            {story.category}
                                        </span>
                                    )}

                                    <h3 className="mt-2 text-xl font-bold text-gray-900">
                                        {story.title}
                                    </h3>

                                    {story.summary && (
                                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                                            {story.summary}
                                        </p>
                                    )}

                                    {story.patient_name && (
                                        <p className="mt-4 text-sm font-medium text-gray-800">
                                            {story.patient_name}
                                            {story.patient_age
                                                ? `, ${story.patient_age} years`
                                                : ""}
                                        </p>
                                    )}

                                    <Link
                                        href={`/success-stories/${story.id}`}
                                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#911824]"
                                    >
                                        Read Full Story
                                        <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* View All */}
                {stories.length > 0 && (
                    <div className="mt-10 text-center">
                        <Link
                            href="/pages/success_stories"
                            className="inline-flex items-center gap-2 rounded-lg bg-[#911824] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#75131d]"
                        >
                            View All Success Stories
                            <FaArrowRight />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}