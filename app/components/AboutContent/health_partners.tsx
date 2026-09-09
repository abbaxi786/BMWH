import Image from "next/image";
import axios from "axios";
import {
    FaArrowRight,
    FaHandshake,
} from "react-icons/fa";

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

interface HealthPartnersResponse {
    success: boolean;
    data: HealthPartner[];
    message?: string;
}

async function getHealthPartners(): Promise<HealthPartner[]> {
    try {
        const baseUrl =
            process.env.BACKEND_URL ||
            "http://localhost:3000";

        const response = await axios.get<HealthPartnersResponse>(
            `${baseUrl}/api/health_partners`
        );

        if (!response.data.success) {
            console.error(
                "Failed to fetch health partners:",
                response.data.message
            );

            return [];
        }

        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching health partners:", error);
        return [];
    }
}

export default async function HealthPartners() {
    const partners = await getHealthPartners();

    return (
        <section className="w-full bg-white py-14 sm:py-16 lg:py-20">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-10 text-center sm:mb-12">
                    <div className="mb-3 flex items-center justify-center gap-2 sm:mb-4">
                        <FaHandshake className="text-sm text-[#911824] sm:text-base" />

                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#911824] sm:text-sm sm:tracking-[0.2em]">
                            Our Partners
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl md:text-4xl">
                        Our Health Partners
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:mt-4 sm:text-base sm:leading-7">
                        We collaborate with trusted healthcare organizations
                        and institutions to strengthen healthcare services
                        and improve patient care.
                    </p>
                </div>

                {/* Empty State */}
                {partners.length === 0 ? (
                    <div className="rounded-2xl bg-gray-50 px-5 py-10 text-center sm:px-6 sm:py-12">
                        <FaHandshake className="mx-auto mb-4 text-3xl text-gray-400" />

                        <h3 className="text-base font-semibold text-gray-800 sm:text-lg">
                            No health partners available
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
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
                        "
                    >
                        {partners.map((partner) => {
                            const content = (
                                <div
                                    className="
                                        group
                                        flex
                                        h-full
                                        min-h-90
                                        flex-col
                                        items-center
                                        justify-between
                                        rounded-2xl
                                        border
                                        border-gray-100
                                        bg-white
                                        p-5
                                        text-center
                                        shadow-sm
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-[#911824]/20
                                        hover:shadow-lg
                                        sm:min-h-95
                                        sm:p-6
                                    "
                                >
                                    {/* Logo */}
                                    <div className="flex h-24 w-full items-center justify-center sm:h-28">
                                        {partner.logo_url ? (
                                            <div className="relative h-20 w-32 sm:h-24 sm:w-40">
                                                <Image
                                                    src={partner.logo_url}
                                                    alt={`${partner.name} logo`}
                                                    fill
                                                    loading="eager"
                                                    className="
                                                        object-contain
                                                        transition-transform
                                                        duration-300
                                                        group-hover:scale-105
                                                    "
                                                    sizes="(max-width: 640px) 128px, 160px"
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="
                                                    flex
                                                    h-16
                                                    w-16
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-gray-100
                                                    sm:h-20
                                                    sm:w-20
                                                "
                                            >
                                                <FaHandshake className="text-xl text-gray-400 sm:text-2xl" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Information */}
                                    <div className="flex w-full flex-1 flex-col justify-center">
                                        <h3
                                            className="
                                                wrap-break-words
                                                text-base
                                                font-semibold
                                                leading-6
                                                text-gray-900
                                                sm:text-lg
                                            "
                                        >
                                            {partner.name}
                                        </h3>

                                        {partner.type && (
                                            <p className="mt-1 text-sm font-medium text-[#911824]">
                                                {partner.type}
                                            </p>
                                        )}

                                        {partner.partnership_type && (
                                            <p className="mt-2 text-xs leading-5 text-gray-500">
                                                {partner.partnership_type}
                                            </p>
                                        )}

                                        {partner.description && (
                                            <p
                                                className="
                                                    mt-3
                                                    line-clamp-3
                                                    text-sm
                                                    leading-6
                                                    text-gray-600
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
                                                mt-5
                                                flex
                                                items-center
                                                justify-center
                                                gap-2
                                                text-xs
                                                font-medium
                                                text-[#911824]
                                                sm:text-sm
                                            "
                                        >
                                            <span>
                                                Visit Website
                                            </span>

                                            <FaArrowRight
                                                className="
                                                    text-[10px]
                                                    transition-transform
                                                    duration-300
                                                    group-hover:translate-x-1
                                                    sm:text-xs
                                                "
                                            />
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
                                        className="block h-full"
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