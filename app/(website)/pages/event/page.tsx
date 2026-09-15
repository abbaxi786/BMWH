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
            `${process.env.BACKEND_URL}/api/events/all`
        );

        if (response.data.success) {
            return response.data.data;
        }

        return [];
    } catch (error) {
        console.error("Error fetching all events:", error);
        return [];
    }
}

export default async function EventsPage() {
    const events = await getEvents();

    return (
        <main className="w-full bg-[#FBF9F9]">
            {/* HERO */}
            <section className="relative w-full overflow-hidden bg-[#911824]">
                <div className="absolute inset-0 bg-black/10" />

                <div className="relative mx-auto flex min-h-90 max-w-7xl flex-col justify-center px-5 py-20 sm:px-8 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center gap-2 text-sm text-white/80">
                        <Link
                            href="/"
                            className="transition-colors hover:text-white"
                        >
                            Home
                        </Link>

                        <span>/</span>

                        <span className="text-white">Events</span>
                    </div>

                    <div className="max-w-3xl">
                        <div className="mb-4 flex items-center gap-2">
                            <span className="h-px w-10 bg-white" />

                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
                                Hospital Events
                            </span>
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Events & Activities
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
                            Explore the latest events, medical camps,
                            awareness programs, community activities, and
                            important occasions at Bashir Memorial Welfare
                            Hospital.
                        </p>
                    </div>
                </div>
            </section>

            {/* EVENTS */}
            <section className="w-full py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
                    {/* Section Heading */}
                    <div className="mb-12 max-w-2xl">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-px w-8 bg-[#911824]" />

                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#911824]">
                                Our Activities
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight text-[#1B1C1C] sm:text-4xl">
                            Latest Hospital Events
                        </h2>

                        <p className="mt-4 text-base leading-7 text-[#5B403D]">
                            Stay informed about upcoming and past activities
                            organized by Bashir Memorial Welfare Hospital.
                        </p>
                    </div>

                    {/* Events Grid */}
                    {events.length > 0 ? (
                        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                            {events.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/pages/event/${event.id}`}
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

                                        {/* Featured */}
                                        {event.is_featured && (
                                            <div className="absolute left-4 top-4 bg-[#911824] px-3 py-1.5 text-xs font-semibold text-white shadow-md">
                                                Featured
                                            </div>
                                        )}

                                        {/* Date */}
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

                                        {/* Event Information */}
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
                        /* Empty State */
                        <div className="bg-white px-6 py-16 text-center shadow-sm ring-1 ring-gray-100">
                            <FaCalendarDays className="mx-auto text-5xl text-gray-300" />

                            <h3 className="mt-5 text-xl font-semibold text-gray-800">
                                No Events Available
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                There are currently no hospital events
                                available. Please check back later for
                                upcoming activities.
                            </p>

                            <Link
                                href="/"
                                className="mt-6 inline-flex items-center gap-2 bg-[#911824] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#760f19]"
                            >
                                Back to Home
                                <FaArrowRight size={13} />
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}