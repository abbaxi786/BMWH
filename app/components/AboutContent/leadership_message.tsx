import Image from "next/image";
import { getLeadershipMessages as fetchLeadershipMessages } from "@/lib/data/aboutSectionQuery/TopLearderShip";
import { FaQuoteLeft, FaHandHoldingHeart } from "react-icons/fa";

export const dynamic = "force-static";

type LeaderKey = "chairman" | "president";

type LeadershipMessage = {
    id: number;
    leader_key: LeaderKey;
    name: string;
    designation: string;
    image: string;
    section_label: string;
    heading: string;
    signature_text: string;
    message: string[] | string;
    quranic_verse: string | null;
    quranic_translation: string | null;
    quranic_reference: string | null;
    is_active: boolean;
};

type DatabaseLeadershipRecord = Record<string, any>;

function normalizeMessage(
    message: string[] | string | null | undefined
): string[] {
    if (Array.isArray(message)) {
        return message.filter(
            (paragraph): paragraph is string =>
                typeof paragraph === "string" && paragraph.trim().length > 0
        );
    }

    if (typeof message === "string") {
        try {
            const parsed: unknown = JSON.parse(message);

            if (Array.isArray(parsed)) {
                return parsed.filter(
                    (paragraph): paragraph is string =>
                        typeof paragraph === "string" &&
                        paragraph.trim().length > 0
                );
            }
        } catch {
            // Treat a regular string as a single paragraph.
        }

        return message.trim() ? [message] : [];
    }

    return [];
}

function normalizeLeaderKey(value: unknown): LeaderKey | null {
    if (value === "chairman" || value === "president") {
        return value;
    }

    return null;
}

async function getPublicLeadershipMessages(): Promise<LeadershipMessage[]> {
    try {
        const records: DatabaseLeadershipRecord[] =
            await fetchLeadershipMessages(false);

        return records
            .filter(
                (leader) =>
                    leader.is_active === true &&
                    normalizeLeaderKey(leader.leader_key) !== null
            )
            .map((leader): LeadershipMessage => ({
                id: Number(leader.id),
                leader_key: normalizeLeaderKey(leader.leader_key)!,
                name: String(leader.name ?? ""),
                designation: String(leader.designation ?? ""),
                image: String(leader.image ?? ""),
                section_label: String(leader.section_label ?? ""),
                heading: String(leader.heading ?? ""),
                signature_text: String(leader.signature_text ?? ""),
                message: normalizeMessage(leader.message),
                quranic_verse: leader.quranic_verse ?? null,
                quranic_translation: leader.quranic_translation ?? null,
                quranic_reference: leader.quranic_reference ?? null,
                is_active: leader.is_active === true,
            }));
    } catch (error) {
        console.error("Error fetching leadership messages:", error);
        return [];
    }
}

function getImagePath(image: string | null | undefined): string {
    return image?.trim() || "/images/founder.jpeg";
}

function ChairmanCard({ leader }: { leader: LeadershipMessage }) {
    const paragraphs = normalizeMessage(leader.message);

    return (
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Chairman Image */}
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-[#F7ECEE]">
                <Image
                    src={getImagePath(leader.image)}
                    alt={leader.name || "Chairman"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top"
                />
            </div>

            {/* Chairman Message */}
            <div className="py-2">
                <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F7E8EA] text-[#911824]">
                        <FaQuoteLeft size={18} />
                    </span>

                    <span className="text-sm font-semibold uppercase tracking-wider text-[#911824]">
                        {leader.section_label || "Chairman's Message"}
                    </span>
                </div>

                <h2 className="mb-5 text-2xl font-bold leading-snug text-black sm:text-3xl">
                    {leader.heading || "A Message from Our Chairman"}
                </h2>

                <div className="space-y-4 text-base leading-8 text-gray-600">
                    {paragraphs.map((paragraph, index) => (
                        <p key={`${leader.id}-paragraph-${index}`}>
                            {paragraph}
                        </p>
                    ))}
                </div>

                <div className="mt-7 border-l-4 border-[#911824] pl-4">
                    <p className="font-semibold text-[#421017]">
                        {leader.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        {leader.designation || "Chairman"}
                    </p>

                    {leader.signature_text && (
                        <p className="mt-3 font-serif text-xl italic text-[#911824]">
                            {leader.signature_text}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function PresidentCard({ leader }: { leader: LeadershipMessage }) {
    const paragraphs = normalizeMessage(leader.message);

    const hasQuranicContent = Boolean(
        leader.quranic_verse ||
            leader.quranic_translation ||
            leader.quranic_reference
    );

    return (
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* President Message */}
            <div className="order-2 py-2 lg:order-1">
                <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F7E8EA] text-[#911824]">
                        <FaHandHoldingHeart size={20} />
                    </span>

                    <span className="text-sm font-semibold uppercase tracking-wider text-[#911824]">
                        {leader.section_label || "President's Message"}
                    </span>
                </div>

                <h2 className="mb-5 text-2xl font-bold leading-snug text-[#421017] sm:text-3xl">
                    {leader.heading || "A Message from Our President"}
                </h2>

                <div className="space-y-4 text-base leading-8 text-gray-600">
                    {paragraphs.map((paragraph, index) => (
                        <p key={`${leader.id}-paragraph-${index}`}>
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* Quranic Content */}
                {hasQuranicContent && (
                    <div className="mt-7 rounded-xl border border-[#EBD4D7] bg-[#FCF6F6] p-5">
                        {leader.quranic_verse && (
                            <p
                                dir="rtl"
                                lang="ar"
                                className="text-right font-serif text-2xl leading-loose text-[#911824]"
                            >
                                {leader.quranic_verse}
                            </p>
                        )}

                        {leader.quranic_translation && (
                            <p className="mt-3 text-sm italic leading-7 text-gray-600">
                                “{leader.quranic_translation}”
                            </p>
                        )}

                        {leader.quranic_reference && (
                            <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#911824]">
                                {leader.quranic_reference}
                            </p>
                        )}
                    </div>
                )}

                <div className="mt-7 border-l-4 border-[#911824] pl-4">
                    <p className="font-semibold text-[#421017]">
                        {leader.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        {leader.designation || "President"}
                    </p>

                    {leader.signature_text && (
                        <p className="mt-3 font-serif text-xl italic text-[#911824]">
                            {leader.signature_text}
                        </p>
                    )}
                </div>
            </div>

            {/* President Image */}
            <div className="relative order-1 mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-[#F7ECEE] lg:order-2">
                <Image
                    src={getImagePath(leader.image)}
                    alt={leader.name || "President"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top"
                />
            </div>
        </div>
    );
}

export default async function LeadershipMessages() {
    const leaders = await getPublicLeadershipMessages();

    const chairman = leaders.find(
        (leader) => leader.leader_key === "chairman"
    );

    const president = leaders.find(
        (leader) => leader.leader_key === "president"
    );

    if (!chairman && !president) {
        return null;
    }

    return (
        <section className="w-full bg-[#FFFBFB] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
                {/* Section Heading */}
                <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-20">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#911824]">
                        Our Leadership
                    </span>

                    <h1 className="mt-4 text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
                        Messages from Our Leadership
                    </h1>

                    <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-[#911824]" />

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
                        Our leadership is committed to compassionate service,
                        accessible healthcare, and improving the well-being of
                        our community.
                    </p>
                </div>

                {/* Chairman */}
                {chairman && (
                    <div className="mb-16 sm:mb-20 lg:mb-24">
                        <ChairmanCard leader={chairman} />
                    </div>
                )}

                {/* President */}
                {president && <PresidentCard leader={president} />}
            </div>
        </section>
    );
}