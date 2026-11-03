import Image from "next/image";
import Link from "next/link";
import {
    FaArrowRight,
    FaQuoteLeft,
    FaHeart,
} from "react-icons/fa";

import { getFounderMessage } from "../../../lib/data/aboutSectionQuery/founderMessage";

type FounderMessageData = {
    id?: number;
    is_active?: boolean | number | string;
    image_url?: string | null;
    founder_name?: string | null;
    designation?: string | null;
    message?: string | null;
    section_label?: string | null;
    heading?: string | null;
    read_more_text?: string | null;
    read_more_url?: string | null;
    english_quote?: string | null;
    urdu_quote?: string | null;
    quranic_ayat?: string | null;
    quranic_surah?: string | null;
    quranic_surah_number?: number | string | null;
    quranic_ayat_number?: number | string | null;
    quranic_translation?: string | null;
    quranic_translation_language?: string | null;
};

export default async function FounderMessage() {
    let founder: FounderMessageData | null;

    try {
        founder = await getFounderMessage();
    } catch (error) {
        console.error("Failed to fetch founder content:", error);
        return null;
    }

    const founderIsActive = founder?.is_active ?? false;
    const isActive = [true, 1, "1", "true", "t"].includes(
        founderIsActive as boolean | number | string
    );

    if (!founder || !isActive) {
        return null;
    }

    const image = founder.image_url || "";
    const name = founder.founder_name || "";
    const designation = founder.designation || "";
    const message = founder.message || "";
    const sectionLabel = founder.section_label || "";
    const heading = founder.heading || "";
    const readMoreText = founder.read_more_text || "";
    const readMoreUrl = founder.read_more_url || "";
    const englishQuote = founder.english_quote || "";
    const urduQuote = founder.urdu_quote || "";
    const ayat = founder.quranic_ayat || "";
    const translation = founder.quranic_translation || "";

    const hasFounderContent = [
        image,
        name,
        designation,
        message,
        sectionLabel,
        heading,
        Boolean(readMoreText && readMoreUrl),
        englishQuote,
        urduQuote,
        ayat,
        translation,
    ].some(Boolean);

    if (!hasFounderContent) {
        return null;
    }

    return (
        <section
            id="founder"
            className="py-16 bg-white sm:py-20 lg:py-24"
        >
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
                {/* Section heading */}
                {(sectionLabel || heading) && (
                    <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
                        {sectionLabel && (
                            <span className="text-xs font-bold uppercase tracking-widest text-[#911824] block mb-2">
                                {sectionLabel}
                            </span>
                        )}

                        {heading && (
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                                {heading}
                            </h2>
                        )}
                        <div className="mx-auto mt-4 h-0.5 w-12 bg-[#911824]" />
                    </div>
                )}

                <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
                    {/* Founder portrait */}
                    {image && (
                        <div className="lg:col-span-4">
                            <div className="overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                                <div className="relative aspect-4/5 w-full">
                                    <Image
                                        src={image}
                                        alt={name || "Hospital founder"}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            {(name || designation) && (
                                <div className="mt-4 text-center lg:text-left">
                                    {name && (
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {name}
                                        </h3>
                                    )}
                                    {designation && (
                                        <p className="text-sm font-medium text-[#911824]">
                                            {designation}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Founder content */}
                    <div className={`${image ? "lg:col-span-8" : "lg:col-span-12"} space-y-6`}>
                        {message && (
                            <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6 sm:p-8">
                                <FaQuoteLeft
                                    aria-hidden="true"
                                    size={24}
                                    className="text-[#911824]/30 mb-4"
                                />
                                <blockquote className="text-base leading-relaxed text-gray-700 sm:text-lg">
                                    {message}
                                </blockquote>
                            </div>
                        )}

                        {/* Optional founder quotations */}
                        {(englishQuote || urduQuote) && (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {englishQuote && (
                                    <blockquote className="rounded-lg border-l-2 border-[#911824] bg-gray-50 p-4 text-sm italic text-gray-700">
                                        “{englishQuote}”
                                    </blockquote>
                                )}

                                {urduQuote && (
                                    <blockquote
                                        lang="ur"
                                        dir="rtl"
                                        className="rounded-lg border-r-2 border-[#911824] bg-gray-50 p-4 text-right text-base text-gray-700"
                                    >
                                        {urduQuote}
                                    </blockquote>
                                )}
                            </div>
                        )}

                        {/* Optional Quranic verse */}
                        {(ayat || translation) && (
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#911824] block mb-3">
                                    Guidance &amp; Inspiration
                                </span>

                                {ayat && (
                                    <p
                                        lang="ar"
                                        dir="rtl"
                                        className="text-right text-xl leading-loose text-gray-900 sm:text-2xl font-serif"
                                    >
                                        {ayat}
                                    </p>
                                )}

                                {founder.quranic_surah && (
                                    <p className="mt-3 text-xs font-medium text-gray-500">
                                        {founder.quranic_surah}
                                        {founder.quranic_surah_number != null
                                            ? ` (${founder.quranic_surah_number})`
                                            : ""}
                                        {founder.quranic_ayat_number != null
                                            ? ` · Ayat ${founder.quranic_ayat_number}`
                                            : ""}
                                    </p>
                                )}

                                {translation && (
                                    <p className="mt-3 border-t border-gray-200 pt-3 text-sm text-gray-600">
                                        {founder.quranic_translation_language
                                            ? `${founder.quranic_translation_language}: `
                                            : ""}
                                        {translation}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Read more button and footer note */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 gap-4">
                            {readMoreText && readMoreUrl && (
                                <Link
                                    href={readMoreUrl}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#911824] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#76121D]"
                                >
                                    {readMoreText}
                                    <FaArrowRight aria-hidden="true" size={12} />
                                </Link>
                            )}

                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <FaHeart aria-hidden="true" size={12} className="text-[#911824]" />
                                <span>Committed to care, dignity, and community welfare.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}