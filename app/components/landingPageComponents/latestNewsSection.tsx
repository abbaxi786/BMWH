import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaCalendarDays } from "react-icons/fa6";

interface NewsUpdate {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    image_url: string | null;
    category: string;
    published_at: string;
}

interface NewsUpdatesProps {
    updates: NewsUpdate[];
}

export default function NewsUpdates({
    updates,
}: NewsUpdatesProps) {
    return (
        <section className="w-full bg-white py-16 sm:py-20 lg:py-24">

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
                "
            >

                {/* =================================================
                    SECTION HEADER
                ================================================= */}
                <div
                    className="
                        flex
                        w-full
                        flex-col
                        gap-5

                        sm:flex-row
                        sm:items-end
                        sm:justify-between

                        sm:gap-6
                    "
                >

                    {/* Heading */}
                    <div className="flex max-w-2xl flex-col gap-2">

                        {/* Label */}
                        <div className="flex items-center gap-2">

                            <div className="h-1 w-7 bg-[#86000D] sm:w-8" />

                            <span
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[1.2px]
                                    text-[#86000D]

                                    sm:text-sm
                                    sm:tracking-[1.4px]
                                "
                            >
                                News & Updates
                            </span>

                        </div>


                        {/* Heading */}
                        <h2
                            className="
                                text-[28px]
                                font-bold
                                leading-9
                                tracking-[-0.28px]
                                text-[#1B1C1C]

                                sm:text-[32px]
                                sm:leading-10
                            "
                        >
                            Latest from BMWH
                        </h2>

                    </div>


                    {/* View All */}
                    <Link
                        href="/pages/all_news_updates"
                        className="
                            flex
                            w-fit
                            shrink-0
                            items-center
                            gap-1
                            text-sm
                            font-semibold
                            tracking-[0.14px]
                            text-[#86000D]
                            transition-opacity
                            hover:opacity-75
                        "
                    >
                        <span>View All News</span>

                        <FaArrowRight size={12} />

                    </Link>

                </div>


                {/* =================================================
                    NEWS CARDS
                ================================================= */}
                {updates.length > 0 ? (

                    <div
                        className="
                            grid
                            w-full
                            grid-cols-1
                            gap-5

                            sm:gap-6

                            md:grid-cols-2

                            lg:grid-cols-3
                        "
                    >

                        {updates.map((update) => (

                            <article
                                key={update.id}
                                className="
                                    flex
                                    min-h-[380px]
                                    flex-col
                                    overflow-hidden
                                    rounded-lg
                                    bg-[#FBF9F9]
                                    shadow-[0_1px_2px_rgba(0,0,0,0.05)]

                                    sm:min-h-[400px]
                                "
                            >

                                {/* =================================================
                                    IMAGE
                                ================================================= */}
                                <div
                                    className="
                                        relative
                                        h-[190px]
                                        w-full
                                        shrink-0
                                        overflow-hidden
                                        bg-[#EFEDED]

                                        sm:h-48
                                    "
                                >

                                    {update.image_url ? (

                                        <Image
                                            src={update.image_url}
                                            alt={update.title}
                                            fill
                                            sizes="
                                                (max-width: 640px) 100vw,
                                                (max-width: 1024px) 50vw,
                                                33vw
                                            "
                                            className="
                                                object-cover
                                                transition-transform
                                                duration-300
                                                hover:scale-105
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
                                                px-4
                                                text-center
                                                text-sm
                                                text-[#5B403D]
                                            "
                                        >
                                            No image available
                                        </div>

                                    )}


                                    {/* Category */}
                                    <div
                                        className="
                                            absolute
                                            left-3
                                            top-3
                                            rounded-sm
                                            bg-[#86000D]
                                            px-2.5
                                            py-1

                                            sm:left-4
                                            sm:top-4
                                            sm:px-3
                                        "
                                    >
                                        <span
                                            className="
                                                text-[10px]
                                                font-medium
                                                leading-4
                                                tracking-[0.2px]
                                                text-white

                                                sm:text-xs
                                                sm:tracking-[0.24px]
                                            "
                                        >
                                            {update.category}
                                        </span>
                                    </div>

                                </div>


                                {/* =================================================
                                    CONTENT
                                ================================================= */}
                                <div
                                    className="
                                        flex
                                        flex-1
                                        flex-col
                                        gap-2
                                        p-4

                                        sm:p-5
                                    "
                                >

                                    {/* Date */}
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-1
                                            text-[11px]
                                            font-medium
                                            tracking-[0.2px]
                                            text-[#5B403D]

                                            sm:text-xs
                                            sm:tracking-[0.24px]
                                        "
                                    >
                                        <FaCalendarDays size={11} />

                                        <time dateTime={update.published_at}>
                                            {new Date(
                                                update.published_at
                                            ).toLocaleDateString(
                                                "en-US",
                                                {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                }
                                            )}
                                        </time>
                                    </div>


                                    {/* Title */}
                                    <h3
                                        className="
                                            line-clamp-2
                                            text-xl
                                            font-semibold
                                            leading-7
                                            text-[#1B1C1C]

                                            sm:text-2xl
                                            sm:leading-8
                                        "
                                    >
                                        {update.title}
                                    </h3>


                                    {/* Excerpt */}
                                    <p
                                        className="
                                            line-clamp-3
                                            text-sm
                                            font-normal
                                            leading-5
                                            text-[#5B403D]

                                            sm:line-clamp-2
                                            sm:text-base
                                            sm:leading-6
                                        "
                                    >
                                        {update.excerpt}
                                    </p>


                                    {/* Read More */}
                                    <div className="mt-auto pt-3 sm:pt-4">

                                        <Link
                                            href={`/pages/new_update/${update.slug}`}
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                text-sm
                                                font-semibold
                                                tracking-[0.14px]
                                                text-[#86000D]
                                                transition-opacity
                                                hover:opacity-75
                                            "
                                        >
                                            <span>Read More</span>

                                            <FaArrowRight size={12} />

                                        </Link>

                                    </div>

                                </div>

                            </article>

                        ))}

                    </div>

                ) : (

                    /* Empty State */
                    <div
                        className="
                            flex
                            min-h-40
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#FBF9F9]
                            px-5
                            text-center
                            text-sm
                            text-[#5B403D]

                            sm:min-h-48
                            sm:text-base
                        "
                    >
                        No news updates available.
                    </div>

                )}

            </div>

        </section>
    );
}