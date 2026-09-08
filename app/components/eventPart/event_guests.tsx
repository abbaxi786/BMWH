import axios from "axios";
import Image from "next/image";
import { FaUserTie } from "react-icons/fa6";

interface EventGuest {
    id: number;
    event_id: number;
    name: string;
    designation: string | null;
    organization: string | null;
    photo_url: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
}

interface GuestsResponse {
    success: boolean;
    data: EventGuest[];
}

interface EventGuestsProps {
    eventId: number;
}

async function getGuests(eventId: number): Promise<EventGuest[]> {
    try {
        const response = await axios.get<GuestsResponse>(
            `${process.env.BACKEND_URL}/api/events/guests?event_id=${eventId}`
        );

        if (response.data.success) {
            return response.data.data;
        }

        return [];
    } catch (error) {
        console.error("Error fetching event guests:", error);
        return [];
    }
}

export default async function EventGuests({
    eventId,
}: EventGuestsProps) {
    const guests = await getGuests(eventId);

    if (guests.length === 0) {
        return null;
    }

    return (
        <section className="w-full bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
                {/* Heading */}
                <div className="mb-10 max-w-2xl">
                    <div className="mb-3 flex items-center gap-2">
                        <span className="h-px w-8 bg-[#911824]" />

                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#911824]">
                            Special Guests
                        </span>
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-[#1B1C1C] sm:text-4xl">
                        Guests & Speakers
                    </h2>

                    <p className="mt-4 text-base leading-7 text-[#5B403D]">
                        Meet the distinguished guests, speakers, and
                        representatives who participated in this event.
                    </p>
                </div>

                {/* Guests */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {guests.map((guest) => (
                        <div
                            key={guest.id}
                            className="group overflow-hidden bg-[#FBF9F9] ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            {/* Image */}
                            <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
                                {guest.photo_url ? (
                                    <Image
                                        src={guest.photo_url}
                                        alt={guest.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <FaUserTie className="text-6xl text-gray-300" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-[#1B1C1C] transition-colors duration-300 group-hover:text-[#911824]">
                                    {guest.name}
                                </h3>

                                {guest.designation && (
                                    <p className="mt-2 text-sm font-semibold text-[#911824]">
                                        {guest.designation}
                                    </p>
                                )}

                                {guest.organization && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        {guest.organization}
                                    </p>
                                )}

                                {guest.description && (
                                    <p className="mt-4 text-sm leading-6 text-gray-600">
                                        {guest.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}