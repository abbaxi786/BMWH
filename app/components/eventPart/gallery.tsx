import Image from "next/image";

import {
    getActiveEventGalleryByEventId,
} from "@/lib/data/events/eventGallery";

interface EventGalleryItem {
    id: number;
    event_id: number;
    image_url: string;
    title: string | null;
    description: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface EventGalleryProps {
    eventId: number;
}

export default async function EventGallery({
    eventId,
}: EventGalleryProps) {
    let gallery: EventGalleryItem[] = [];

    try {
        const result =
            await getActiveEventGalleryByEventId(eventId);

        gallery = result as EventGalleryItem[];
    } catch (error) {
        console.error(
            "Error fetching event gallery:",
            error
        );
    }

    if (gallery.length === 0) {
        return null;
    }

    return (
        <section className="w-full bg-[#FBF9F9] py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-8">
                {/* Heading */}
                <div className="mb-10 max-w-2xl">
                    <div className="mb-3 flex items-center gap-2">
                        <span className="h-px w-8 bg-[#911824]" />

                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#911824]">
                            Event Memories
                        </span>
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-[#1B1C1C] sm:text-4xl">
                        Event Gallery
                    </h2>

                    <p className="mt-4 text-base leading-7 text-[#5B403D]">
                        Explore moments and highlights captured during the
                        event.
                    </p>
                </div>

                {/* Gallery */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {gallery.map((item) => (
                        <div
                            key={item.id}
                            className="group overflow-hidden bg-white shadow-sm ring-1 ring-gray-100"
                        >
                            {/* Image */}
                            <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
                                <Image
                                    src={item.image_url}
                                    alt={
                                        item.title ||
                                        "Event gallery image"
                                    }
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Content */}
                            {(item.title ||
                                item.description) && (
                                <div className="p-5">
                                    {item.title && (
                                        <h3 className="text-lg font-bold text-[#1B1C1C]">
                                            {item.title}
                                        </h3>
                                    )}

                                    {item.description && (
                                        <p className="mt-2 text-sm leading-6 text-gray-600">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

