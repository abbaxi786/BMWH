import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { FaArrowRight, FaHandshake } from "react-icons/fa6";

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

interface SupportersResponse {
    success: boolean;
    data: Supporter[];
}

export default async function Supporters() {
    let supporters: Supporter[] = [];

    try {
        const response = await axios.get<SupportersResponse>(
            `${process.env.BACKEND_URL}/api/supporters`,
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );

        if (response.data.success) {
            supporters = response.data.data;
        }
    } catch (error) {
        console.error("Failed to fetch supporters:", error);
    }

    // Don't render an empty section if there are no supporters.
    if (!supporters.length) {
        return null;
    }

    return (
        <section className="w-full bg-[#FBF9F9] py-16 sm:py-20 lg:py-24">
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-12">

                {/* Section Header */}
                <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12 lg:mb-14">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#86000D]/10 px-4 py-2">
                        <FaHandshake
                            size={14}
                            className="text-[#86000D]"
                        />

                        <span className="text-xs font-semibold uppercase tracking-[1px] text-[#86000D]">
                            Our Supporters
                        </span>
                    </div>

                    <h2 className="text-[30px] font-bold leading-tight tracking-[-0.6px] text-[#1B1C1C] sm:text-[34px] lg:text-[38px]">
                        Partners who support our mission
                    </h2>

                    <p className="mt-4 text-sm leading-6 text-[#5B403D] sm:text-base sm:leading-7">
                        We are grateful to the organizations and individuals
                        who support our efforts to provide quality healthcare
                        and serve the community.
                    </p>
                </div>

                {/* Supporters */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {supporters.map((supporter) => (
                        <div
                            key={supporter.id}
                            className="
                                group flex h-full flex-col
                                rounded-2xl border border-[#E8E4E4]
                                bg-white p-5
                                shadow-[0_4px_15px_rgba(0,0,0,0.04)]
                                transition-all duration-300
                                hover:-translate-y-1
                                hover:shadow-[0_12px_25px_rgba(0,0,0,0.08)]
                            "
                        >
                            {/* Logo */}
                            <div className="mb-5 flex h-28 w-full items-center justify-center rounded-xl bg-[#FBF9F9] p-5">
                                {supporter.logo_url ? (
                                    <div className="relative h-full w-full">
                                        <Image
                                            src={supporter.logo_url}
                                            alt={`${supporter.name} logo`}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-contain"
                                        />
                                    </div>
                                ) : (
                                    <FaHandshake
                                        size={38}
                                        className="text-[#86000D]/40"
                                    />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col">
                                <h3 className="text-lg font-semibold leading-6 text-[#1B1C1C]">
                                    {supporter.name}
                                </h3>

                                {(supporter.type || supporter.support_type) && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {supporter.type && (
                                            <span className="rounded-full bg-[#EFEDED] px-2.5 py-1 text-[11px] font-medium text-[#5B403D]">
                                                {supporter.type}
                                            </span>
                                        )}

                                        {supporter.support_type && (
                                            <span className="rounded-full bg-[#86000D]/10 px-2.5 py-1 text-[11px] font-medium text-[#86000D]">
                                                {supporter.support_type}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {supporter.description && (
                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#5B403D]">
                                        {supporter.description}
                                    </p>
                                )}

                                {/* Website */}
                                {supporter.website_url && (
                                    <div className="mt-auto pt-5">
                                        <Link
                                            href={supporter.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
                                                inline-flex items-center gap-2
                                                text-sm font-semibold
                                                text-[#86000D]
                                                transition-colors
                                                hover:text-[#650009]
                                            "
                                        >
                                            Visit Website
                                            <FaArrowRight
                                                size={11}
                                                className="transition-transform duration-200 group-hover:translate-x-1"
                                            />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}