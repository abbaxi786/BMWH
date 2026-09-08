import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
    FaArrowRight,
    FaCalendarDays,
    FaClock,
    FaLocationDot,
} from "react-icons/fa6";

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

interface EventsResponse {
    success: boolean;
    data: Event[];
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

async function getEvents(): Promise<Event[]> {
    try {
        const response = await axios.get<EventsResponse>(
            `${process.env.BACKEND_URL}/api/events`
        );

        if (response.data.success) {
            return response.data.data;
        }

        return [];
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
}

export default async function EventsSection() {
    const events = await getEvents();

    return (
        <section className="w-full bg-[#FBF9F9] py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">

                {/* Section Header */}
                <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-px w-8 bg-[#911824]" />

                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#911824]">
                                Hospital Events
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight text-[#1B1C1C] sm:text-4xl">
                            Events & Activities
                        </h2>

                        <p className="mt-4 text-base leading-7 text-[#5B403D]">
                            Stay connected with the latest events, medical
                            camps, awareness programs, and community activities
                            at Bashir Memorial Welfare Hospital.
                        </p>
                    </div>

                    <Link
                        href="/pages/event"
                        className="group inline-flex w-fit items-center gap-2 border border-[#911824] px-5 py-3 text-sm font-semibold text-[#911824] transition-all duration-300 hover:bg-[#911824] hover:text-white"
                    >
                        View All Events

                        <FaArrowRight
                            size={14}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                {/* Events */}
                {events.length > 0 ? (
                    <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <Link
                                key={event.id}
                                href={`/pages/events/${event.id}`}
                                className="group flex h-full flex-col overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* Image */}
                                <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
                                    {event.cover_image_url ? (
                                        <Image
                                            src={event.cover_image_url}
                                            alt={event.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <FaCalendarDays className="text-5xl text-gray-300" />
                                        </div>
                                    )}

                                    {/* Featured Badge */}
                                    {event.is_featured && (
                                        <div className="absolute left-4 top-4 bg-[#911824] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                                            Featured
                                        </div>
                                    )}

                                    {/* Date Badge */}
                                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white px-3 py-2 text-sm font-semibold text-[#911824] shadow-md">
                                        <FaCalendarDays size={13} />

                                        {formatDate(event.event_date)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 flex-col p-6">
                                    <h3 className="text-xl font-bold leading-7 text-[#1B1C1C] transition-colors duration-300 group-hover:text-[#911824]">
                                        {event.title}
                                    </h3>

                                    {event.description && (
                                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                                            {event.description}
                                        </p>
                                    )}

                                    {/* Event Details */}
                                    <div className="mt-5 space-y-3 border-t border-gray-100 pt-5">
                                        {(event.start_time ||
                                            event.end_time) && (
                                            <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                                <FaClock
                                                    size={14}
                                                    className="shrink-0 text-[#911824]"
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

                                        {event.location && (
                                            <div className="flex items-start gap-2.5 text-sm text-gray-600">
                                                <FaLocationDot
                                                    size={14}
                                                    className="mt-0.5 shrink-0 text-[#911824]"
                                                />

                                                <span className="line-clamp-2">
                                                    {event.location}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* View Event */}
                                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#911824]">
                                        View Event

                                        <FaArrowRight
                                            size={13}
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white px-6 py-14 text-center shadow-sm ring-1 ring-gray-100">
                        <FaCalendarDays className="mx-auto text-4xl text-gray-300" />

                        <h3 className="mt-4 text-lg font-semibold text-gray-800">
                            No Events Available
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            There are currently no hospital events available.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}