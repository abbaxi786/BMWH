import Image from "next/image";
import {
    FaArrowRight,
    FaHandshake,
} from "react-icons/fa";

import {
    getActiveHealthPartners,
} from "@/lib/data/healthPartners/healthPartners";

interface HealthPartner {
    id: number;
    name: string;
    type: string | null;
    partnership_type: string | null;
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

export default async function HealthPartners() {
    let partners: HealthPartner[] = [];

    try {
        const result = await getActiveHealthPartners();

        partners = result as HealthPartner[];
    } catch (error) {
        console.error(
            "Error fetching health partners:",
            error
        );
    }

    return (
        <section
            id="health-partners"
            className="
                scroll-mt-28
                w-full
                bg-white
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

                            Our Partners
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
                        Our Health Partners
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
                        We collaborate with trusted healthcare organizations
                        and institutions to strengthen healthcare services
                        and improve patient care.
                    </p>
                </div>

                {/* Empty State */}
                {partners.length === 0 ? (
                    <div
                        className="
                            rounded-2xl
                            border
                            border-[#E4BEBA]/40
                            bg-[#FBF9F9]
                            px-5
                            py-10
                            text-center
                            shadow-[0_4px_18px_rgba(134,0,13,0.04)]
                            sm:px-6
                            sm:py-12
                        "
                    >
                        <div
                            className="
                                mx-auto
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#911824]/10
                                text-xl
                                text-[#911824]/60
                            "
                        >
                            <FaHandshake aria-hidden="true" />
                        </div>

                        <h3
                            className="
                                mt-4
                                text-base
                                font-bold
                                text-[#1B1C1C]
                                sm:text-lg
                            "
                        >
                            No health partners available
                        </h3>

                        <p
                            className="
                                mt-1
                                text-sm
                                leading-6
                                text-[#8A7774]
                            "
                        >
                            Partner information will be displayed here once
                            available.
                        </p>
                    </div>
                ) : (
                    /* Partners Grid */
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
                        {partners.map((partner, index) => {
                            const content = (
                                <div
                                    className="
                                        group
                                        relative
                                        flex
                                        h-full
                                        flex-col
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-[#E4BEBA]/40
                                        bg-white
                                        p-4
                                        text-center
                                        shadow-[0_4px_18px_rgba(134,0,13,0.04)]
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-[#911824]/30
                                        hover:shadow-[0_10px_28px_rgba(134,0,13,0.09)]
                                        sm:p-5
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
                                            transition-colors
                                            duration-300
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
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-[#FBF9F9]
                                            p-3
                                            sm:h-22
                                            sm:p-4
                                        "
                                    >
                                        {partner.logo_url ? (
                                            <div
                                                className="
                                                    relative
                                                    h-full
                                                    w-full
                                                "
                                            >
                                                <Image
                                                    src={partner.logo_url}
                                                    alt={`${partner.name} logo`}
                                                    fill
                                                    className="
                                                        object-contain
                                                        transition-transform
                                                        duration-300
                                                        group-hover:scale-105
                                                    "
                                                    sizes="
                                                        (max-width: 640px) 100vw,
                                                        (max-width: 1024px) 50vw,
                                                        25vw
                                                    "
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="
                                                    flex
                                                    h-14
                                                    w-14
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-[#911824]/10
                                                    text-[#911824]/50
                                                "
                                            >
                                                <FaHandshake
                                                    aria-hidden="true"
                                                    className="text-xl"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Information */}
                                    <div className="mt-4">
                                        <h3
                                            className="
                                                break-words
                                                text-base
                                                font-bold
                                                leading-6
                                                text-[#1B1C1C]
                                                transition-colors
                                                duration-300
                                                group-hover:text-[#911824]
                                                sm:text-lg
                                            "
                                        >
                                            {partner.name}
                                        </h3>

                                        {partner.type && (
                                            <p
                                                className="
                                                    mt-1
                                                    text-sm
                                                    font-semibold
                                                    text-[#911824]
                                                "
                                            >
                                                {partner.type}
                                            </p>
                                        )}

                                        {partner.partnership_type && (
                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    leading-5
                                                    text-[#8A7774]
                                                "
                                            >
                                                {partner.partnership_type}
                                            </p>
                                        )}

                                        {partner.description && (
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
                                                {partner.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Website */}
                                    {partner.website_url && (
                                        <div
                                            className="
                                                mt-4
                                                border-t
                                                border-[#E4BEBA]/40
                                                pt-3
                                            "
                                        >
                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    text-xs
                                                    font-bold
                                                    text-[#911824]
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
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );

                            if (partner.website_url) {
                                return (
                                    <a
                                        key={partner.id}
                                        href={partner.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={`Visit ${partner.name} website`}
                                        className="
                                            block
                                            h-full
                                            rounded-2xl
                                            focus:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-[#911824]
                                            focus-visible:ring-offset-2
                                        "
                                    >
                                        {content}
                                    </a>
                                );
                            }

                            return (
                                <div
                                    key={partner.id}
                                    className="h-full"
                                >
                                    {content}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}