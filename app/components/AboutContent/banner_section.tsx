
import Image from "next/image";
import Link from "next/link";
import { getAboutOverview } from "@/lib/data/aboutSectionQuery/AboutOverview";
import { FaArrowRight, FaHeartbeat } from "react-icons/fa";

export const dynamic = "force-dynamic";

type AboutOverviewData = {
    id?: number;
    eyebrow?: string | null | any;
    title?: string | null | any;
    highlightedTitle?: string | null | any;
    subtitle?: string | null | any;
    bannerImage?: string | null |any;
    imageAlt?: string | null |any;
    floatingTitle?: string | null |any;
    floatingSubtitle?: string | null |any;
    contactUrl?: string | null | any;
    departmentsUrl?: string | null | any;
};

export default async function AboutOverview() {
    let data: AboutOverviewData | null = null;

    try {
        data = await getAboutOverview();
    } catch (error) {
        console.error("Failed to fetch About Overview:", error);
    }

    // Use defaults only when no database row exists.
    // If a row exists but a field is NULL, treat that field as empty.
    const content: Required<Omit<AboutOverviewData, "id">> = {
        eyebrow: data?.eyebrow ?? (data ? "" : "About BMWH"),
        title: data?.title ?? (data ? "" : "Caring for People,"),
        highlightedTitle:
            data?.highlightedTitle ??
            (data ? "" : "Serving the Community"),
        subtitle: data?.subtitle ?? "",
        bannerImage:
            data?.bannerImage ??
            (data ? "" : "/images/buildingImage.jpeg"),
        imageAlt:
            data?.imageAlt ??
            (data ? "" : "Bashir Memorial Welfare Hospital"),
        floatingTitle:
            data?.floatingTitle ?? (data ? "" : "Patient-Centered"),
        floatingSubtitle:
            data?.floatingSubtitle ?? (data ? "" : "Healthcare & Welfare"),
        contactUrl:
            data?.contactUrl ?? (data ? "" : "/pages/contact"),
        departmentsUrl:
            data?.departmentsUrl ?? (data ? "" : "/pages/departments"),
    };

    // All values are now guaranteed to be strings.
    const eyebrow = content.eyebrow;
    const title = content.title;
    const highlightedTitle = content.highlightedTitle;
    const subtitle = content.subtitle;
    const bannerImage = content.bannerImage;
    const imageAlt = content.imageAlt;
    const floatingTitle = content.floatingTitle;
    const floatingSubtitle = content.floatingSubtitle;
    const contactUrl = content.contactUrl ?? "";
    const departmentsUrl = content.departmentsUrl ?? "";

    return (
        <section
            id="about-overview"
            className="
                relative
                scroll-mt-28
                overflow-hidden
                bg-white
                py-16
                sm:py-20
                lg:py-24
                xl:py-28
                2xl:py-32
            "
        >
            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
                <div
                    className="
                        grid
                        w-full
                        items-center
                        gap-10
                        lg:grid-cols-2
                        lg:gap-14
                        xl:gap-16
                        2xl:gap-20
                    "
                >
                    {/* Content */}
                    <div className="max-w-2xl">
                        {eyebrow.trim() !== "" && (
                            <div
                                className="
                                    mb-4
                                    flex
                                    items-center
                                    gap-2
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.2em]
                                    text-[#911824]
                                    sm:text-xs
                                "
                            >
                                <span className="h-px w-8 bg-[#911824] sm:w-10" />
                                <span>{eyebrow}</span>
                            </div>
                        )}

                        {(title.trim() !== "" ||
                            highlightedTitle.trim() !== "") && (
                            <h1
                                className="
                                    text-4xl
                                    font-bold
                                    leading-[1.1]
                                    tracking-tight
                                    text-[#1B1C1C]
                                    sm:text-5xl
                                    lg:text-[52px]
                                    xl:text-[58px]
                                    2xl:text-[64px]
                                "
                            >
                                {title}

                                {highlightedTitle.trim() !== "" && (
                                    <span className="block text-[#911824]">
                                        {highlightedTitle}
                                    </span>
                                )}
                            </h1>
                        )}

                        {subtitle.trim() !== "" && (
                            <p
                                className="
                                    mt-5
                                    max-w-2xl
                                    text-base
                                    leading-7
                                    text-[#5B403D]
                                    sm:mt-6
                                    sm:text-lg
                                    sm:leading-8
                                    xl:text-[19px]
                                "
                            >
                                {subtitle}
                            </p>
                        )}

                        {/* Action Buttons */}
                        {(contactUrl.trim() !== "" ||
                            departmentsUrl.trim() !== "") && (
                            <div className="mt-7 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
                                {contactUrl.trim() !== "" && (
                                    <Link
                                        href={contactUrl}
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            bg-[#911824]
                                            px-6
                                            py-3
                                            text-sm
                                            font-semibold
                                            text-white
                                            transition-all
                                            duration-300
                                            hover:bg-[#7d1420]
                                            focus:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-[#911824]
                                            focus-visible:ring-offset-2
                                            sm:px-7
                                            sm:py-3.5
                                        "
                                    >
                                        Contact Us
                                        <FaArrowRight
                                            aria-hidden="true"
                                            size={13}
                                        />
                                    </Link>
                                )}

                                {departmentsUrl.trim() !== "" && (
                                    <Link
                                        href={departmentsUrl}
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            border
                                            border-[#D9D0CE]
                                            px-6
                                            py-3
                                            text-sm
                                            font-semibold
                                            text-[#5B403D]
                                            transition-all
                                            duration-300
                                            hover:border-[#911824]
                                            hover:bg-[#911824]
                                            hover:text-white
                                            focus:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-[#911824]
                                            focus-visible:ring-offset-2
                                            sm:px-7
                                            sm:py-3.5
                                        "
                                    >
                                        Our Departments
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Image and floating card */}
                    {bannerImage.trim() !== "" && (
                        <div className="relative">
                            <div
                                className="
                                    relative
                                    h-[300px]
                                    w-full
                                    overflow-hidden
                                    rounded-2xl
                                    bg-gray-100
                                    sm:h-[380px]
                                    lg:h-[440px]
                                    xl:h-[500px]
                                    2xl:h-[560px]
                                "
                            >
                                <Image
                                    src={bannerImage}
                                    alt={imageAlt}
                                    fill
                                    unoptimized
                                    sizes="
                                        (max-width: 1024px) 100vw,
                                        (max-width: 1536px) 50vw,
                                        680px
                                    "
                                    className="object-cover"
                                />
                            </div>

                            {(floatingTitle.trim() !== "" ||
                                floatingSubtitle.trim() !== "") && (
                                <div
                                    className="
                                        absolute
                                        -bottom-5
                                        left-4
                                        hidden
                                        rounded-xl
                                        bg-white
                                        p-4
                                        shadow-xl
                                        sm:block
                                        lg:-left-6
                                        lg:p-5
                                    "
                                >
                                    <div className="flex items-center gap-3 lg:gap-4">
                                        <div
                                            className="
                                                flex
                                                h-11
                                                w-11
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-[#911824]/10
                                                text-lg
                                                text-[#911824]
                                                lg:h-12
                                                lg:w-12
                                                lg:text-xl
                                            "
                                        >
                                            <FaHeartbeat aria-hidden="true" />
                                        </div>

                                        <div>
                                            {floatingTitle.trim() !== "" && (
                                                <p className="text-sm font-semibold text-[#1B1C1C]">
                                                    {floatingTitle}
                                                </p>
                                            )}

                                            {floatingSubtitle.trim() !== "" && (
                                                <p className="text-xs text-[#6B5A58]">
                                                    {floatingSubtitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
