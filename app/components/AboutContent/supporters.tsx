import Image from "next/image";
import { FaArrowRight, FaHandshake } from "react-icons/fa6";

import { getActiveSupporters } from "@/lib/data/supporters/supporters";

interface Supporter {
    id: number;
    name: string;
    type: string | null;
    support_type: string | null;
    description: string | null;
    logo_url: string | null;
    website_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const containerClass = `
    mx-auto
    w-full
    max-w-7xl
    px-5
    sm:px-8
    lg:px-10
    xl:px-12
    2xl:max-w-[1440px]
    2xl:px-16
    3xl:max-w-[1600px]
`;

export default async function Supporters() {
    let supporters: Supporter[] = [];

    try {
        const result = await getActiveSupporters();

        supporters = result as Supporter[];
    } catch (error) {
        console.error("Failed to fetch supporters:", error);
    }

    if (!supporters.length) {
        return null;
    }

    return (
        <section
            id="supporters"
            className="
                scroll-mt-28
                w-full
                bg-[#FBF9F9]
                py-12
                sm:py-14
                lg:py-16
                xl:py-20
                2xl:py-24
            "
        >
            <div className={containerClass}>

                {/* Header */}
                <div
                    className="
                        mx-auto
                        mb-8
                        max-w-3xl
                        text-center
                        sm:mb-10
                        lg:mb-12
                    "
                >
                    <div
                        className="
                            mb-3
                            flex
                            items-center
                            justify-center
                            gap-3
                            text-xs
                            font-bold
                            uppercase
                            tracking-[0.15em]
                            text-[#911824]
                            sm:text-sm
                        "
                    >
                        <span className="h-0.5 w-6 bg-[#911824] sm:w-8" />

                        <span className="flex items-center gap-2">
                            <FaHandshake
                                aria-hidden="true"
                                className="text-xs"
                            />

                            Our Supporters
                        </span>

                        <span className="h-0.5 w-6 bg-[#911824] sm:w-8" />
                    </div>

                    <h2
                        className="
                            text-2xl
                            font-bold
                            leading-tight
                            text-[#1B1C1C]
                            sm:text-3xl
                            lg:text-4xl
                            xl:text-[2.75rem]
                        "
                    >
                        Partners Who Support Our Mission
                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-3
                            max-w-2xl
                            text-sm
                            leading-6
                            text-[#5B403D]
                            sm:mt-4
                            sm:text-base
                            sm:leading-7
                        "
                    >
                        We are grateful to the organizations and individuals
                        who support our efforts to provide quality healthcare
                        and serve the community.
                    </p>
                </div>

                {/* Supporters */}
                <div
                    className="
                        grid
                        grid-cols-1
                        gap-4
                        sm:grid-cols-2
                        sm:gap-5
                        lg:grid-cols-3
                        xl:grid-cols-4
                        xl:gap-6
                    "
                >
                    {supporters.map((supporter, index) => (
                        <article
                            key={supporter.id}
                            className="
                                group
                                relative
                                flex
                                flex-col
                                overflow-hidden
                                rounded-2xl
                                border
                                border-[#E4BEBA]/40
                                bg-white
                                p-4
                                shadow-[0_4px_18px_rgba(134,0,13,0.04)]
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:border-[#911824]/30
                                hover:shadow-[0_10px_28px_rgba(134,0,13,0.09)]
                                sm:p-5
                                lg:p-5
                            "
                        >
                            {/* Decorative Circle */}
                            <div
                                className="
                                    absolute
                                    -right-8
                                    -top-8
                                    h-24
                                    w-24
                                    rounded-full
                                    bg-[#911824]/5
                                    transition-transform
                                    duration-500
                                    group-hover:scale-125
                                "
                            />

                            {/* Number */}
                            <span
                                className="
                                    absolute
                                    right-4
                                    top-4
                                    text-[10px]
                                    font-bold
                                    tracking-wider
                                    text-gray-200
                                    group-hover:text-[#911824]/20
                                "
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            {/* Logo */}
                            <div
                                className="
                                    relative
                                    flex
                                    h-20
                                    w-full
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[#FBF9F9]
                                    p-3
                                    sm:h-22
                                    sm:p-4
                                "
                            >
                                {supporter.logo_url ? (
                                    <div
                                        className="
                                            relative
                                            h-full
                                            w-full
                                        "
                                    >
                                        <Image
                                            src={supporter.logo_url}
                                            alt={`${supporter.name} logo`}
                                            fill
                                            sizes="
                                                (max-width: 640px) 100vw,
                                                (max-width: 1024px) 50vw,
                                                25vw
                                            "
                                            className="
                                                object-contain
                                                transition-transform
                                                duration-300
                                                group-hover:scale-105
                                            "
                                        />
                                    </div>
                                ) : (
                                    <FaHandshake
                                        aria-hidden="true"
                                        className="
                                            text-2xl
                                            text-[#911824]/40
                                        "
                                    />
                                )}
                            </div>

                            {/* Content */}
                            <div className="mt-4">
                                <h3
                                    className="
                                        break-words
                                        text-base
                                        font-bold
                                        leading-6
                                        text-[#1B1C1C]
                                        transition-colors
                                        group-hover:text-[#911824]
                                        sm:text-lg
                                    "
                                >
                                    {supporter.name}
                                </h3>

                                {/* Tags */}
                                {(supporter.type ||
                                    supporter.support_type) && (
                                    <div
                                        className="
                                            mt-2
                                            flex
                                            flex-wrap
                                            gap-1.5
                                        "
                                    >
                                        {supporter.type && (
                                            <span
                                                className="
                                                    rounded-full
                                                    bg-[#F3EEEE]
                                                    px-2.5
                                                    py-0.5
                                                    text-[10px]
                                                    font-semibold
                                                    leading-5
                                                    text-[#5B403D]
                                                "
                                            >
                                                {supporter.type}
                                            </span>
                                        )}

                                        {supporter.support_type && (
                                            <span
                                                className="
                                                    rounded-full
                                                    bg-[#911824]/10
                                                    px-2.5
                                                    py-0.5
                                                    text-[10px]
                                                    font-semibold
                                                    leading-5
                                                    text-[#911824]
                                                "
                                            >
                                                {supporter.support_type}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Description */}
                                {supporter.description && (
                                    <p
                                        className="
                                            mt-2
                                            line-clamp-2
                                            text-xs
                                            leading-5
                                            text-[#5B403D]
                                            sm:text-sm
                                        "
                                    >
                                        {supporter.description}
                                    </p>
                                )}
                            </div>

                            {/* Website */}
                            {supporter.website_url && (
                                <div
                                    className="
                                        mt-4
                                        border-t
                                        border-[#E4BEBA]/40
                                        pt-3
                                    "
                                >
                                    <a
                                        href={supporter.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Visit ${supporter.name} website`}
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            text-xs
                                            font-bold
                                            text-[#911824]
                                            transition-colors
                                            hover:text-[#650009]
                                            focus:outline-none
                                            focus-visible:rounded
                                            focus-visible:ring-2
                                            focus-visible:ring-[#911824]
                                            focus-visible:ring-offset-2
                                            sm:text-sm
                                        "
                                    >
                                        Visit Website

                                        <FaArrowRight
                                            aria-hidden="true"
                                            className="
                                                text-[9px]
                                                transition-transform
                                                duration-300
                                                group-hover:translate-x-1
                                            "
                                        />
                                    </a>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}