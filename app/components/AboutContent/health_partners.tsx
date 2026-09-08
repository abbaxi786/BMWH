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
        <section className="w-full bg-white py-20">
            <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <FaHandshake className="text-[#911824]" />

                        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#911824]">
                            Our Partners
                        </span>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        Our Health Partners
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
                        We collaborate with trusted healthcare organizations
                        and institutions to strengthen healthcare services
                        and improve patient care.
                    </p>
                </div>

                {/* Empty State */}
                {partners.length === 0 ? (
                    <div className="rounded-2xl bg-gray-50 px-6 py-12 text-center">
                        <FaHandshake className="mx-auto mb-4 text-3xl text-gray-400" />

                        <h3 className="text-lg font-semibold text-gray-800">
                            No health partners available
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Partner information will be displayed here once
                            available.
                        </p>
                    </div>
                ) : (
                    /* Partners Grid */
                    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                        {partners.map((partner) => {
                            const content = (
                                <div
                                    className="
                                        group
                                        flex
                                        h-full
                                        flex-col
                                        items-center
                                        justify-between
                                        rounded-2xl
                                        border
                                        border-gray-100
                                        bg-white
                                        p-6
                                        text-center
                                        shadow-sm
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-[#911824]/20
                                        hover:shadow-lg
                                    "
                                >
                                    {/* Logo */}
                                    <div className="flex h-28 w-full items-center justify-center">
                                        {partner.logo_url ? (
                                            <div className="relative h-24 w-40">
                                                <Image
                                                    src={partner.logo_url}
                                                    alt={`${partner.name} logo`}
                                                    fill
                                                    loading="eager"
                                                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                                                    sizes="160px"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                                                <FaHandshake className="text-2xl text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Information */}
                                    <div className="w-full">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {partner.name}
                                        </h3>

                                        {partner.type && (
                                            <p className="mt-1 text-sm font-medium text-[#911824]">
                                                {partner.type}
                                            </p>
                                        )}

                                        {partner.partnership_type && (
                                            <p className="mt-2 text-xs text-gray-500">
                                                {partner.partnership_type}
                                            </p>
                                        )}

                                        {partner.description && (
                                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                                                {partner.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Website */}
                                    {partner.website_url && (
                                        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#911824]">
                                            <span>
                                                Visit Website
                                            </span>

                                            <FaArrowRight
                                                className="
                                                    text-xs
                                                    transition-transform
                                                    duration-300
                                                    group-hover:translate-x-1
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
                                        className="h-full"
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