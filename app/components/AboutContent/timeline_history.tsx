import { FaCheckCircle } from "react-icons/fa";
import { getTimelineHistory } from "../../../lib/data/aboutSectionQuery/timeline";

type TimelineItem = {
    id: number;
    year: string;
    title: string;
    description: string;
    sort_order: number;
    is_active: boolean;
};

export default async function TimelineHistory() {
    let journey: TimelineItem[] = [];

    try {
        const result = await getTimelineHistory(true);

        journey = (Array.from(result) as TimelineItem[]).sort(
            (a, b) => a.sort_order - b.sort_order
        );
    } catch (error) {
        console.error("Failed to fetch timeline history:", error);
    }

    if (journey.length === 0) {
        return null;
    }

    return (
        <section
            id="our-journey"
            aria-labelledby="journey-heading"
            className="
                scroll-mt-28
                bg-[#FBF9F9]
                py-16
                sm:py-20
                lg:py-24
                xl:py-28
                2xl:py-32
            "
        >
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Heading */}
                <div className="mb-10 text-center sm:mb-14">
                    <div className="mb-3 flex items-center justify-center gap-2">
                        <span className="h-px w-8 bg-[#911824]" />

                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#911824] sm:text-xs">
                            Our Journey
                        </p>

                        <span className="h-px w-8 bg-[#911824]" />
                    </div>

                    <h2
                        id="journey-heading"
                        className="
                            text-3xl
                            font-bold
                            tracking-tight
                            text-[#1B1C1C]
                            sm:text-4xl
                            lg:text-[42px]
                            xl:text-[46px]
                        "
                    >
                        Building Our Future
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#5B403D] sm:text-base">
                        As a growing hospital, every step marks progress
                        toward serving our community better.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Center Timeline Line */}
                    <div
                        aria-hidden="true"
                        className="
                            absolute
                            left-1/2
                            top-0
                            hidden
                            h-full
                            w-px
                            -translate-x-1/2
                            bg-[#E1D8D6]
                            md:block
                        "
                    />

                    <div className="space-y-10 xl:space-y-14">
                        {journey.map((item, index) => (
                            <div
                                key={item.id}
                                className="
                                    relative
                                    grid
                                    items-center
                                    gap-8
                                    md:grid-cols-2
                                    md:gap-16
                                "
                            >
                                {/* Timeline Content */}
                                <div
                                    className={
                                        index % 2 === 0
                                            ? "md:text-right"
                                            : "md:order-2 md:text-left"
                                    }
                                >
                                    <span className="text-sm font-bold text-[#911824]">
                                        {item.year}
                                    </span>

                                    <h3 className="mt-2 text-xl font-bold text-[#1B1C1C] xl:text-2xl">
                                        {item.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-[#5B403D] sm:text-base">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Timeline Point */}
                                <div
                                    className={`
                                        hidden
                                        md:flex
                                        ${
                                            index % 2 === 0
                                                ? "justify-start"
                                                : "order-1 justify-end"
                                        }
                                    `}
                                >
                                    <div
                                        className="
                                            relative
                                            z-10
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-[#911824]
                                            text-white
                                            shadow-lg
                                            ring-8
                                            ring-[#FBF9F9]
                                        "
                                    >
                                        <FaCheckCircle
                                            aria-hidden="true"
                                            size={16}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}