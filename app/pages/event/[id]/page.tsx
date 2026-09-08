import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
    FaArrowLeft,
    FaCalendarDays,
    FaClock,
    FaLocationDot,
} from "react-icons/fa6";

import EventGuests from "@/app/components/eventPart/event_guests";
import EventGallery from "@/app/components/eventPart/gallery";

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

interface EventResponse {
    success: boolean;
    data: Event;
}

interface EventPageProps {
    params: Promise<{
        id: string;
    }>;
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
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

async function getEvent(eventId: number): Promise<Event | null> {
    try {
        const response = await axios.get<EventResponse>(
            `${process.env.BACKEND_URL}/api/events/${eventId}`
        );

        if (response.data.success) {
            return response.data.data;
        }

        return null;
    } catch (error) {
        console.error("Error fetching event:", error);
        return null;
    }
}

export default async function EventDetailPage({
    params,
}: EventPageProps) {
    const { id } = await params;

    const eventId = Number(id);

    if (!id || Number.isNaN(eventId)) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-[#FBF9F9] px-5">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-[#1B1C1C]">
                        Invalid Event
                    </h1>

                    <p className="mt-3 text-gray-600">
                        The event ID provided is not valid.
                    </p>

                    <Link
                        href="/pages/events"
                        className="mt-6 inline-flex items-center gap-2 bg-[#911824] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#760f19]"
                    >
                        <FaArrowLeft size={13} />
                        Back to Events
                    </Link>
                </div>
            </main>
        );
    }

    const event = await getEvent(eventId);

    if (!event) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center bg-[#FBF9F9] px-5">
                <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#911824]/10">
                        <FaCalendarDays className="text-3xl text-[#911824]" />
                    </div>

                    <h1 className="mt-6 text-3xl font-bold text-[#1B1C1C]">
                        Event Not Found
                    </h1>

                    <p className="mx-auto mt-3 max-w-md text-gray-600">
                        The event you are looking for does not exist or is no
                        longer available.
                    </p>

                    <Link
                        href="/events"
                        className="mt-6 inline-flex items-center gap-2 bg-[#911824] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#760f19]"
                    >
                        <FaArrowLeft size={13} />
                        Back to Events
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="w-full bg-[#FBF9F9]">
            {/* HERO */}
            <section className="w-full bg-[#911824]">
                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-white/80">
                        <Link
                            href="/"
                            className="transition-colors hover:text-white"
                        >
                            Home
                        </Link>

                        <span>/</span>

                        <Link
                            href="/pages/event"
                            className="transition-colors hover:text-white"
                        >
                            Events
                        </Link>

                        <span>/</span>

                        <span className="max-w-62.5 truncate text-white">
                            {event.title}
                        </span>
                    </div>
                </div>
            </section>

            {/* EVENT CONTENT */}
            <section className="w-full py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
                    {/* Back */}
                    <Link
                        href="/pages/event"
                        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#911824] transition-all hover:gap-3"
                    >
                        <FaArrowLeft size={13} />
                        Back to Events
                    </Link>

                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
                        {/* Cover Image */}
                        <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 shadow-sm">
                            {event.cover_image_url ? (
                                <Image
                                    src={event.cover_image_url}
                                    alt={event.title}
                                    fill
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 60vw"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <FaCalendarDays className="text-7xl text-gray-300" />
                                </div>
                            )}

                            {event.is_featured && (
                                <div className="absolute left-5 top-5 bg-[#911824] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md">
                                    Featured Event
                                </div>
                            )}
                        </div>

                        {/* Event Information */}
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <span className="h-px w-8 bg-[#911824]" />

                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#911824]">
                                    Hospital Event
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#1B1C1C] sm:text-4xl lg:text-5xl">
                                {event.title}
                            </h1>

                            {/* Event Details */}
                            <div className="mt-8 space-y-5 border-y border-gray-200 py-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#911824]/10 text-[#911824]">
                                        <FaCalendarDays size={17} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Date
                                        </p>

                                        <p className="mt-1 text-sm font-medium text-gray-700">
                                            {formatDate(event.event_date)}
                                        </p>
                                    </div>
                                </div>

                                {(event.start_time || event.end_time) && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#911824]/10 text-[#911824]">
                                            <FaClock size={17} />
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                Time
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-gray-700">
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
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {event.location && (
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#911824]/10 text-[#911824]">
                                            <FaLocationDot size={17} />
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                Location
                                            </p>

                                            <p className="mt-1 text-sm font-medium leading-6 text-gray-700">
                                                {event.location}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {event.description && (
                                <div className="mt-8">
                                    <h2 className="text-xl font-bold text-[#1B1C1C]">
                                        About This Event
                                    </h2>

                                    <p className="mt-4 whitespace-pre-line text-base leading-8 text-gray-600">
                                        {event.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* GUESTS */}
            <EventGuests eventId={event.id} />

            {/* GALLERY */}
            <EventGallery eventId={event.id} />

            {/* BOTTOM CTA */}
            <section className="w-full bg-[#911824] py-14">
                <div className="mx-auto max-w-7xl px-5 text-center sm:px-8 lg:px-8">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                        Explore More Hospital Events
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/80">
                        Discover more activities, programs, medical camps, and
                        community events organized by Bashir Memorial Welfare
                        Hospital.
                    </p>

                    <Link
                        href="/events"
                        className="mt-6 inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold text-[#911824] transition-all hover:bg-gray-100"
                    >
                        View All Events
                        <FaArrowLeft
                            size={13}
                            className="rotate-180"
                        />
                    </Link>
                </div>
            </section>
        </main>
    );
}