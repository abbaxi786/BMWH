import Image from "next/image";
import Link from "next/link";
import {
    FaArrowRight,
    FaHeart,
    FaQuoteLeft,
} from "react-icons/fa";

import { getFeaturedSuccessStories } from "@/lib/data/successStories/successStories";

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

function formatStoryDate(date: string | null) {
    if (!date) return "";

    try {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    } catch {
        return "";
    }
}

export default async function SuccessStories() {
    let stories: SuccessStory[] = [];

    try {
        const result = await getFeaturedSuccessStories();

        stories = result as SuccessStory[];
    } catch (error) {
        console.error(
            "Error fetching featured success stories:",
            error
        );
    }

    return (
        <section
            aria-labelledby="success-stories-heading"
            className="
                w-full
                bg-[#FBF9F9]
                py-16
                sm:py-20
                lg:py-24
                xl:py-28
                2xl:py-32
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    w-full
                    max-w-7xl
                    flex-col
                    gap-8
                    px-5
                    sm:px-8
                    lg:px-10
                    xl:px-12
                    2xl:max-w-[1440px]
                    2xl:px-16
                    3xl:max-w-[1600px]
                "
            >
                {/* =====================================================
                    SECTION HEADER
                ===================================================== */}
                <div
                    className="
                        flex
                        flex-col
                        items-center
                        text-center
                    "
                >
                    {/* Label */}
                    <div className="mb-3 flex items-center gap-2">
                        <span
                            aria-hidden="true"
                            className="
                                h-px
                                w-8
                                bg-[#911824]
                                sm:w-10
                            "
                        />

                        <FaHeart
                            aria-hidden="true"
                            className="text-[#911824]"
                            size={13}
                        />

                        <span
                            className="
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-[0.2em]
                                text-[#911824]
                                sm:text-xs
                            "
                        >
                            Patient Stories
                        </span>

                        <span
                            aria-hidden="true"
                            className="
                                h-px
                                w-8
                                bg-[#911824]
                                sm:w-10
                            "
                        />
                    </div>

                    {/* Heading */}
                    <h2
                        id="success-stories-heading"
                        className="
                            text-3xl
                            font-bold
                            leading-tight
                            tracking-tight
                            text-[#1B1C1C]
                            sm:text-4xl
                            lg:text-[42px]
                            lg:leading-[1.15]
                            xl:text-[46px]
                            2xl:text-[50px]
                        "
                    >
                        Stories of Hope & Healing
                    </h2>

                    {/* Description */}
                    <p
                        className="
                            mx-auto
                            mt-4
                            max-w-2xl
                            text-sm
                            leading-6
                            text-[#5B403D]
                            sm:text-base
                            sm:leading-7
                            lg:mt-5
                            xl:max-w-3xl
                            xl:text-[17px]
                            xl:leading-8
                        "
                    >
                        Every patient has a story. Discover some of the
                        journeys of hope, recovery, and healing made possible
                        through compassionate care at BMWH.
                    </p>
                </div>

                {/* =====================================================
                    STORIES
                ===================================================== */}
                {stories.length > 0 ? (
                    <>
                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5
                                sm:grid-cols-2
                                sm:gap-6
                                lg:grid-cols-3
                                xl:gap-7
                                2xl:gap-8
                            "
                        >
                            {stories.map((story) => {
                                const storyUrl =
                                    `/pages/success_stories/${story.id}`;

                                return (
                                    <article
                                        key={story.id}
                                        className="
                                            group
                                            flex
                                            min-h-[460px]
                                            flex-col
                                            overflow-hidden
                                            rounded-sm
                                            border
                                            border-[#E4DCDC]
                                            bg-white
                                            shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                                            transition-all
                                            duration-300
                                            hover:-translate-y-1
                                            hover:border-[#D9C8C6]
                                            hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]
                                            sm:min-h-[480px]
                                            lg:min-h-[500px]
                                            xl:min-h-[520px]
                                            2xl:min-h-[550px]
                                        "
                                    >
                                        {/* =================================================
                                            IMAGE
                                        ================================================= */}
                                        <Link
                                            href={storyUrl}
                                            aria-label={`Read ${story.title}`}
                                            className="
                                                relative
                                                block
                                                h-56
                                                w-full
                                                overflow-hidden
                                                bg-[#F2EEEE]
                                                sm:h-60
                                                lg:h-64
                                                xl:h-72
                                                2xl:h-80
                                                focus:outline-none
                                                focus-visible:ring-2
                                                focus-visible:ring-inset
                                                focus-visible:ring-[#911824]
                                            "
                                        >
                                            {story.image_url ? (
                                                <Image
                                                    src={story.image_url}
                                                    alt={story.title}
                                                    fill
                                                    sizes="
                                                        (max-width: 640px) 100vw,
                                                        (max-width: 1024px) 50vw,
                                                        (max-width: 1536px) 33vw,
                                                        480px
                                                    "
                                                    className="
                                                        object-cover
                                                        transition-transform
                                                        duration-500
                                                        ease-out
                                                        group-hover:scale-105
                                                    "
                                                />
                                            ) : (
                                                <div
                                                    className="
                                                        flex
                                                        h-full
                                                        w-full
                                                        items-center
                                                        justify-center
                                                        bg-[#F7F2F2]
                                                    "
                                                >
                                                    <FaHeart
                                                        aria-hidden="true"
                                                        className="
                                                            text-5xl
                                                            text-[#911824]/20
                                                            sm:text-6xl
                                                        "
                                                    />
                                                </div>
                                            )}

                                            {/* Image Overlay */}
                                            <div
                                                aria-hidden="true"
                                                className="
                                                    absolute
                                                    inset-0
                                                    bg-gradient-to-t
                                                    from-black/25
                                                    via-transparent
                                                    to-transparent
                                                    opacity-0
                                                    transition-opacity
                                                    duration-300
                                                    group-hover:opacity-100
                                                "
                                            />

                                            {/* Quote Icon */}
                                            <div
                                                aria-hidden="true"
                                                className="
                                                    absolute
                                                    bottom-4
                                                    left-4
                                                    flex
                                                    h-10
                                                    w-10
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-white/95
                                                    text-[#911824]
                                                    shadow-md
                                                    sm:bottom-5
                                                    sm:left-5
                                                "
                                            >
                                                <FaQuoteLeft size={14} />
                                            </div>
                                        </Link>

                                        {/* =================================================
                                            CONTENT
                                        ================================================= */}
                                        <div
                                            className="
                                                flex
                                                flex-1
                                                flex-col
                                                p-5
                                                sm:p-6
                                                lg:p-7
                                                xl:p-8
                                            "
                                        >
                                            {/* Category */}
                                            {story.category && (
                                                <span
                                                    className="
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-[0.12em]
                                                        text-[#911824]
                                                        sm:text-[11px]
                                                    "
                                                >
                                                    {story.category}
                                                </span>
                                            )}

                                            {/* Title */}
                                            <Link
                                                href={storyUrl}
                                                className="
                                                    mt-2
                                                    block
                                                    rounded-sm
                                                    focus:outline-none
                                                    focus-visible:ring-2
                                                    focus-visible:ring-[#911824]
                                                    focus-visible:ring-offset-2
                                                "
                                            >
                                                <h3
                                                    className="
                                                        line-clamp-2
                                                        text-lg
                                                        font-bold
                                                        leading-7
                                                        text-[#1B1C1C]
                                                        transition-colors
                                                        duration-300
                                                        group-hover:text-[#911824]
                                                        sm:text-xl
                                                        xl:text-[21px]
                                                        2xl:text-[22px]
                                                    "
                                                >
                                                    {story.title}
                                                </h3>
                                            </Link>

                                            {/* Summary */}
                                            {story.summary && (
                                                <p
                                                    className="
                                                        mt-3
                                                        line-clamp-3
                                                        text-sm
                                                        leading-6
                                                        text-[#6B5A58]
                                                        xl:text-[15px]
                                                        xl:leading-6
                                                    "
                                                >
                                                    {story.summary}
                                                </p>
                                            )}

                                            {/* Patient */}
                                            {story.patient_name && (
                                                <div className="mt-4">
                                                    <p
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-[#1B1C1C]
                                                            xl:text-[15px]
                                                        "
                                                    >
                                                        {story.patient_name}

                                                        {story.patient_age ? (
                                                            <span className="font-normal text-[#6B5A58]">
                                                                {`, ${story.patient_age} years`}
                                                            </span>
                                                        ) : null}
                                                    </p>
                                                </div>
                                            )}

                                            {/* =================================================
                                                FOOTER
                                            ================================================= */}
                                            <div
                                                className="
                                                    mt-auto
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                    border-t
                                                    border-[#EEE8E8]
                                                    pt-5
                                                    mt-5
                                                    xl:pt-6
                                                "
                                            >
                                                {/* Story Date */}
                                                {story.story_date ? (
                                                    <time
                                                        dateTime={story.story_date}
                                                        className="
                                                            min-w-0
                                                            truncate
                                                            text-xs
                                                            text-[#6B5A58]
                                                            xl:text-sm
                                                        "
                                                    >
                                                        {formatStoryDate(
                                                            story.story_date
                                                        )}
                                                    </time>
                                                ) : (
                                                    <span />
                                                )}

                                                {/* Read More */}
                                                <Link
                                                    href={storyUrl}
                                                    aria-label={`Read full story: ${story.title}`}
                                                    className="
                                                        group/link
                                                        inline-flex
                                                        shrink-0
                                                        items-center
                                                        gap-1.5
                                                        rounded-sm
                                                        text-xs
                                                        font-semibold
                                                        text-[#911824]
                                                        transition-colors
                                                        duration-200
                                                        hover:text-[#6F1019]
                                                        focus:outline-none
                                                        focus-visible:ring-2
                                                        focus-visible:ring-[#911824]
                                                        focus-visible:ring-offset-2
                                                        xl:text-sm
                                                    "
                                                >
                                                    <span>
                                                        Read Full Story
                                                    </span>

                                                    <FaArrowRight
                                                        aria-hidden="true"
                                                        size={11}
                                                        className="
                                                            transition-transform
                                                            duration-300
                                                            group-hover/link:translate-x-1
                                                        "
                                                    />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {/* =====================================================
                            VIEW ALL
                        ===================================================== */}
                        <div className="flex justify-center pt-2">
                            <Link
                                href="/pages/success_stories"
                                aria-label="View all patient success stories"
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-2
                                    border
                                    border-[#911824]
                                    px-6
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-[#911824]
                                    transition-all
                                    duration-300
                                    hover:bg-[#911824]
                                    hover:text-white
                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-[#911824]
                                    focus-visible:ring-offset-2
                                    xl:px-7
                                    xl:py-3.5
                                "
                            >
                                <span>
                                    View All Success Stories
                                </span>

                                <FaArrowRight
                                    aria-hidden="true"
                                    size={13}
                                    className="
                                        transition-transform
                                        duration-300
                                        group-hover:translate-x-1
                                    "
                                />
                            </Link>
                        </div>
                    </>
                ) : (
                    /* =====================================================
                       EMPTY STATE
                    ===================================================== */
                    <div
                        className="
                            flex
                            min-h-[260px]
                            flex-col
                            items-center
                            justify-center
                            border
                            border-[#E4DCDC]
                            bg-white
                            px-6
                            py-12
                            text-center
                            shadow-[0_2px_12px_rgba(0,0,0,0.03)]
                        "
                    >
                        <div
                            className="
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-full
                                bg-[#F7EEEE]
                            "
                        >
                            <FaHeart
                                aria-hidden="true"
                                className="text-xl text-[#911824]/40"
                            />
                        </div>

                        <h3
                            className="
                                mt-5
                                text-lg
                                font-semibold
                                text-[#1B1C1C]
                            "
                        >
                            Stories Coming Soon
                        </h3>

                        <p
                            className="
                                mt-2
                                max-w-md
                                text-sm
                                leading-6
                                text-[#6B5A58]
                            "
                        >
                            We will be sharing inspiring stories of hope,
                            recovery, and healing from our patients soon.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}