import Image from "next/image";
import Link from "next/link";
import {
    FaArrowRight,
    FaCalendarDays,
    FaClock,
    FaLocationDot,
} from "react-icons/fa6";
import {
    getTopThreeActiveEvents,
} from "@/lib/data/events/events";

interface Event {
    id: number;
    title: string;
    description: string | null;
    event_date: string;
    start_time: string | null;
    end_time: string | null;
    location: string | null;
    cover_image_url: string | null;
    is_featured: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}



function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatTime(time: string | null) {
    if (!time) return "";

    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes));

    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
}




export default async function EventsSection() {
    let events: Event[] = [];

    try {
        const result = await getTopThreeActiveEvents();

        events = result as Event[];
    } catch (error) {
        console.error(
            "Error fetching events:",
            error
        );
    }

    return (
        <section
            aria-labelledby="events-section-heading"
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
                        TITLE AREA
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

                        {/* Label */}

                        <div
                            className="
                                flex
                                items-center
                                gap-2.5
                            "
                        >

                            <span
                                aria-hidden="true"
                                className="
                                    h-1
                                    w-7
                                    rounded-full
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
                                Hospital Events
                            </span>

                        </div>


                        {/* Heading */}

                        <h2
                            id="events-section-heading"
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
                            Events & Activities
                        </h2>


                        {/* Description */}

                        <p
                            className="
                                mt-1

                                max-w-2xl

                                text-sm
                                leading-6
                                text-[#5B403D]

                                sm:text-base
                                sm:leading-7

                                lg:text-[17px]

                                2xl:text-[18px]
                                2xl:leading-7
                            "
                        >
                            Stay connected with the latest events, medical
                            camps, awareness programs, and community activities
                            at Bashir Memorial Welfare Hospital.
                        </p>

                    </div>


                    {/* =================================================
                        VIEW ALL
                    ================================================= */}

                    <Link
                        href="/pages/event"
                        aria-label="View all hospital events"
                        className="
                            group
                            inline-flex
                            w-fit
                            shrink-0
                            items-center
                            justify-center
                            gap-2

                            rounded-lg

                            border
                            border-[#86000D]

                            px-5
                            py-3

                            text-sm
                            font-semibold
                            text-[#86000D]

                            transition-all
                            duration-300

                            hover:bg-[#86000D]
                            hover:text-white

                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-[#86000D]
                            focus-visible:ring-offset-2

                            2xl:px-6
                            2xl:py-3.5
                            2xl:text-[15px]
                        "
                    >

                        <span>
                            View All Events
                        </span>

                        <FaArrowRight
                            aria-hidden="true"
                            size={13}
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
                    EVENTS GRID
                ================================================= */}

                {events.length > 0 ? (

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

                        {events.map((event) => (

                            <Link
                                key={event.id}
                                href={`/pages/event/${event.id}`}
                                aria-label={`View event: ${event.title}`}
                                className="
                                    group
                                    flex
                                    h-full
                                    min-h-[460px]
                                    flex-col
                                    overflow-hidden

                                    rounded-lg

                                    bg-white

                                    shadow-[0_1px_2px_rgba(0,0,0,0.05)]

                                    ring-1
                                    ring-[#E8E2E1]

                                    transition-all
                                    duration-300

                                    hover:-translate-y-1
                                    hover:shadow-[0_15px_35px_rgba(134,0,13,0.10)]
                                    hover:ring-[#E4BEBA]

                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-[#86000D]
                                    focus-visible:ring-offset-2

                                    sm:min-h-[480px]

                                    lg:min-h-[500px]

                                    xl:min-h-[520px]

                                    2xl:min-h-[550px]

                                    2xl:rounded-xl
                                "
                            >

                                {/* =================================================
                                    IMAGE
                                ================================================= */}

                                <div
                                    className="
                                        relative
                                        h-52
                                        w-full
                                        shrink-0
                                        overflow-hidden
                                        bg-[#EFEDED]

                                        sm:h-56

                                        lg:h-60

                                        xl:h-64

                                        2xl:h-72
                                    "
                                >

                                    {event.cover_image_url ? (

                                        <Image
                                            src={event.cover_image_url}
                                            alt={`Cover image for ${event.title}`}
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
                                                bg-[#F4F1F1]
                                            "
                                        >
                                            <FaCalendarDays
                                                aria-hidden="true"
                                                className="
                                                    text-5xl
                                                    text-[#D8C8C6]

                                                    2xl:text-6xl
                                                "
                                            />
                                        </div>

                                    )}


                                    {/* =================================================
                                        FEATURED BADGE
                                    ================================================= */}

                                    {event.is_featured && (
                                        <div
                                            className="
                                                absolute
                                                left-4
                                                top-4

                                                rounded-sm

                                                bg-[#86000D]

                                                px-3
                                                py-1.5

                                                text-[11px]
                                                font-semibold
                                                uppercase
                                                tracking-[0.5px]
                                                text-white

                                                shadow-sm

                                                2xl:left-5
                                                2xl:top-5
                                            "
                                        >
                                            Featured
                                        </div>
                                    )}


                                    {/* =================================================
                                        DATE BADGE
                                    ================================================= */}

                                    <div
                                        className="
                                            absolute
                                            bottom-4
                                            left-4

                                            flex
                                            items-center
                                            gap-2

                                            rounded-md

                                            bg-white

                                            px-3
                                            py-2

                                            text-xs
                                            font-semibold
                                            text-[#86000D]

                                            shadow-md

                                            sm:text-sm

                                            2xl:bottom-5
                                            2xl:left-5
                                            2xl:px-3.5
                                            2xl:py-2.5
                                            2xl:text-[15px]
                                        "
                                    >

                                        <FaCalendarDays
                                            aria-hidden="true"
                                            size={13}
                                        />

                                        <time dateTime={event.event_date}>
                                            {formatDate(event.event_date)}
                                        </time>

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

                                        p-5

                                        sm:p-6

                                        lg:p-6

                                        2xl:p-7
                                    "
                                >

                                    {/* Title */}

                                    <h3
                                        className="
                                            line-clamp-2

                                            text-xl
                                            font-bold
                                            leading-7
                                            text-[#1B1C1C]

                                            transition-colors
                                            duration-300

                                            group-hover:text-[#86000D]

                                            sm:text-[22px]
                                            sm:leading-8

                                            2xl:text-2xl
                                            2xl:leading-9
                                        "
                                    >
                                        {event.title}
                                    </h3>


                                    {/* Description */}

                                    {event.description && (
                                        <p
                                            className="
                                                mt-2.5

                                                line-clamp-3

                                                text-sm
                                                leading-6
                                                text-[#5B403D]

                                                sm:text-[15px]

                                                2xl:text-base
                                                2xl:leading-6
                                            "
                                        >
                                            {event.description}
                                        </p>
                                    )}


                                    {/* =================================================
                                        EVENT DETAILS
                                    ================================================= */}

                                    {(event.start_time ||
                                        event.end_time ||
                                        event.location) && (

                                            <div
                                                className="
                                                mt-4

                                                space-y-2.5

                                                border-t
                                                border-[#EEE7E5]

                                                pt-4

                                                2xl:mt-5
                                                2xl:pt-5
                                            "
                                            >

                                                {/* Time */}

                                                {(event.start_time ||
                                                    event.end_time) && (

                                                        <div
                                                            className="
                                                        flex
                                                        items-start
                                                        gap-2.5

                                                        text-sm
                                                        leading-5
                                                        text-[#5B403D]
                                                    "
                                                        >

                                                            <FaClock
                                                                aria-hidden="true"
                                                                size={14}
                                                                className="
                                                            mt-0.5
                                                            shrink-0
                                                            text-[#86000D]
                                                        "
                                                            />

                                                            <span>
                                                                {formatTime(
                                                                    event.start_time
                                                                )}

                                                                {event.end_time && (
                                                                    <>
                                                                        {" - "}
                                                                        {formatTime(
                                                                            event.end_time
                                                                        )}
                                                                    </>
                                                                )}
                                                            </span>

                                                        </div>

                                                    )}


                                                {/* Location */}

                                                {event.location && (

                                                    <div
                                                        className="
                                                        flex
                                                        items-start
                                                        gap-2.5

                                                        text-sm
                                                        leading-5
                                                        text-[#5B403D]
                                                    "
                                                    >

                                                        <FaLocationDot
                                                            aria-hidden="true"
                                                            size={14}
                                                            className="
                                                            mt-0.5
                                                            shrink-0
                                                            text-[#86000D]
                                                        "
                                                        />

                                                        <span className="line-clamp-2">
                                                            {event.location}
                                                        </span>

                                                    </div>

                                                )}

                                            </div>

                                        )}


                                    {/* =================================================
                                        VIEW EVENT
                                    ================================================= */}

                                    <div
                                        className="
                                            mt-auto
                                            flex
                                            items-center
                                            gap-2

                                            pt-5

                                            text-sm
                                            font-semibold
                                            text-[#86000D]

                                            2xl:pt-6
                                            2xl:text-[15px]
                                        "
                                    >

                                        <span>
                                            View Event
                                        </span>

                                        <FaArrowRight
                                            aria-hidden="true"
                                            size={13}
                                            className="
                                                transition-transform
                                                duration-300

                                                group-hover:translate-x-1

                                                2xl:h-3.5
                                                2xl:w-3.5
                                            "
                                        />

                                    </div>

                                </div>

                            </Link>

                        ))}

                    </div>

                ) : (

                    /* =================================================
                        EMPTY STATE
                    ================================================= */

                    <div
                        className="
                            flex
                            min-h-48
                            flex-col
                            items-center
                            justify-center

                            rounded-lg

                            bg-white

                            px-6
                            py-12

                            text-center

                            shadow-[0_1px_2px_rgba(0,0,0,0.05)]

                            ring-1
                            ring-[#E8E2E1]

                            sm:min-h-56

                            2xl:min-h-64
                            2xl:rounded-xl
                        "
                    >

                        <FaCalendarDays
                            aria-hidden="true"
                            className="
                                text-4xl
                                text-[#D8C8C6]

                                2xl:text-5xl
                            "
                        />

                        <h3
                            className="
                                mt-3
                                text-lg
                                font-semibold
                                text-[#1B1C1C]

                                2xl:text-xl
                            "
                        >
                            No Events Available
                        </h3>

                        <p
                            className="
                                mt-1.5
                                max-w-md
                                text-sm
                                leading-6
                                text-[#5B403D]

                                2xl:text-base
                            "
                        >
                            There are currently no hospital events available.
                        </p>

                    </div>

                )}

            </div>

        </section>
    );
}