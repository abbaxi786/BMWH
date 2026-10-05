import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaCalendarDays } from "react-icons/fa6";

interface NewsUpdate {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
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
        <section
            className="
                w-full
                bg-white

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
                    flex-col

                    max-w-7xl
                    2xl:max-w-[1440px]
                    3xl:max-w-[1600px]

                    gap-8

                    px-5
                    sm:px-8
                    lg:px-10
                    xl:px-12
                    2xl:px-16
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

                        xl:gap-8
                    "
                >
                    {/* =================================================
                        HEADING
                    ================================================= */}
                    <div
                        className="
                            flex
                            max-w-2xl
                            flex-col
                            gap-2

                            2xl:max-w-3xl
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-3

                                2xl:gap-3
                            "
                        >
                            <div
                                className="
                                    h-1
                                    w-7
                                    bg-[#86000D]

                                    sm:w-8

                                    2xl:w-10
                                "
                            />

                            <span
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[1.2px]
                                    text-[#86000D]

                                    sm:text-sm
                                    sm:tracking-[1.4px]

                                    2xl:text-[15px]
                                    2xl:tracking-[1.6px]
                                "
                            >
                                News & Updates
                            </span>
                        </div>

                        <h2
                            className="
                                text-[28px]
                                font-bold
                                leading-9
                                tracking-[-0.28px]
                                text-[#1B1C1C]

                                sm:text-[32px]
                                sm:leading-10

                                lg:text-[36px]
                                lg:leading-[1.2]

                                xl:text-[40px]
                                xl:leading-[1.18]

                                2xl:text-[46px]
                                2xl:leading-[1.15]
                                2xl:tracking-[-0.5px]
                            "
                        >
                            Latest from BMWH
                        </h2>
                    </div>

                    {/* =================================================
                        VIEW ALL
                    ================================================= */}
                    <Link
                        href="/pages/all_news_updates"
                        className="
                            group
                            flex
                            w-fit
                            shrink-0
                            items-center
                            gap-2

                            text-sm
                            font-semibold
                            tracking-[0.14px]
                            text-[#86000D]

                            transition-all
                            duration-300

                            hover:gap-3

                            md:mb-1

                            2xl:text-[15px]
                        "
                    >
                        <span>
                            View All News
                        </span>

                        <FaArrowRight
                            size={12}
                            className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-1

                                2xl:h-3.5
                                2xl:w-3.5
                            "
                        />
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
                            sm:grid-cols-2

                            lg:grid-cols-3

                            xl:gap-7

                            2xl:gap-8
                        "
                    >
                        {updates.map((update) => (
                            <article
                                key={update.id}
                                className="
                                    group
                                    flex
                                    min-h-[380px]
                                    flex-col
                                    overflow-hidden
                                    rounded-lg

                                    bg-[#FBF9F9]

                                    shadow-[0_1px_2px_rgba(0,0,0,0.05)]

                                    transition-all
                                    duration-300

                                    hover:-translate-y-1
                                    hover:shadow-[0_15px_35px_rgba(134,0,13,0.10)]

                                    sm:min-h-[400px]

                                    lg:min-h-[430px]

                                    xl:min-h-[450px]

                                    2xl:min-h-[480px]

                                    2xl:rounded-xl
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

                                        lg:h-56

                                        xl:h-60

                                        2xl:h-64
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
                                                (max-width: 1536px) 33vw,
                                                33vw
                                            "
                                            className="
                                                object-cover
                                                transition-transform
                                                duration-500
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
                                                px-4
                                                text-center
                                                text-sm
                                                text-[#5B403D]
                                            "
                                        >
                                            No image available
                                        </div>
                                    )}

                                    {/* =================================================
                                        CATEGORY
                                    ================================================= */}
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

                                            2xl:left-5
                                            2xl:top-5
                                            2xl:px-3.5
                                            2xl:py-1.5
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

                                                2xl:text-[13px]
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

                                        lg:p-6

                                        2xl:p-7
                                    "
                                >
                                    {/* =================================================
                                        DATE
                                    ================================================= */}
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-1.5

                                            text-[11px]
                                            font-medium
                                            tracking-[0.2px]
                                            text-[#5B403D]

                                            sm:text-xs
                                            sm:tracking-[0.24px]

                                            2xl:text-sm
                                        "
                                    >
                                        <FaCalendarDays
                                            size={11}
                                            className="2xl:h-3.5 2xl:w-3.5"
                                        />

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

                                    {/* =================================================
                                        TITLE
                                    ================================================= */}
                                    <h3
                                        className="
                                            line-clamp-2

                                            text-xl
                                            font-semibold
                                            leading-7
                                            text-[#1B1C1C]

                                            transition-colors
                                            duration-300

                                            group-hover:text-[#86000D]

                                            sm:text-2xl
                                            sm:leading-8

                                            2xl:text-[25px]
                                            2xl:leading-9
                                        "
                                    >
                                        {update.title}
                                    </h3>

                                    {/* =================================================
                                        EXCERPT
                                    ================================================= */}
                                    <p
                                        className="
                                            line-clamp-3

                                            text-sm
                                            font-normal
                                            leading-5
                                            text-[#5B403D]

                                            sm:text-base
                                            sm:leading-6

                                            2xl:text-[17px]
                                            2xl:leading-7
                                        "
                                    >
                                        {update.excerpt ||
                                            "Read the latest news and updates from BMWH."}
                                    </p>

                                    {/* =================================================
                                        READ MORE
                                    ================================================= */}
                                    <div
                                        className="
                                            mt-auto
                                            pt-3

                                            sm:pt-4

                                            2xl:pt-6
                                        "
                                    >
                                        <Link
                                            href={`/pages/new_update/${update.slug}`}
                                            className="
                                                group/link
                                                inline-flex
                                                items-center
                                                gap-2

                                                text-sm
                                                font-semibold
                                                tracking-[0.14px]
                                                text-[#86000D]

                                                transition-all
                                                duration-300

                                                hover:gap-3

                                                2xl:text-[15px]
                                            "
                                        >
                                            <span>
                                                Read More
                                            </span>

                                            <FaArrowRight
                                                size={12}
                                                className="
                                                    transition-transform
                                                    duration-300
                                                    group-hover/link:translate-x-1

                                                    2xl:h-3.5
                                                    2xl:w-3.5
                                                "
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    /* =================================================
                        EMPTY STATE
                    ================================================= */
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

                            2xl:min-h-56
                            2xl:rounded-xl
                            2xl:text-lg
                        "
                    >
                        No news updates available.
                    </div>
                )}
            </div>
        </section>
    );
}