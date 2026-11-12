
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import {
    FaArrowRight,
    FaCalendarDays,
    FaHouse,
} from "react-icons/fa6";

import { getNews } from "@/lib/data/news/news";

// =====================================================
// SEO CONFIGURATION
// =====================================================

const BASE_URL = "https://yourdomain.com";
const SITE_NAME = "Bashir Memorial Welfare Hospital";

const PAGE_URL = `${BASE_URL}/pages/news-updates`;

const DEFAULT_OG_IMAGE = `${BASE_URL}/logo.png`;

// =====================================================
// CACHE CONFIGURATION
// =====================================================

export const revalidate = 86400;

// =====================================================
// INTERFACES
// =====================================================

interface AllNewsUpdate {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image_url: string | null;
    category: string;
    author_name: string;
    published_at: string;
}

// =====================================================
// SEO METADATA
// =====================================================

export const metadata: Metadata = {
    title: "News & Updates | Bashir Memorial Welfare Hospital",

    description:
        "Stay updated with the latest healthcare news, hospital developments, community welfare initiatives, medical programs, and events at Bashir Memorial Welfare Hospital.",

    keywords: [
        "Bashir Memorial Welfare Hospital News",
        "Hospital News",
        "Healthcare Updates",
        "Medical News",
        "Healthcare Initiatives",
        "Community Welfare Programs",
        "Hospital Events",
        "Healthcare Developments",
    ],

    alternates: {
        canonical: PAGE_URL,
    },

    openGraph: {
        title: "News & Updates | Bashir Memorial Welfare Hospital",

        description:
            "Explore the latest healthcare news, hospital developments, community initiatives, and events at Bashir Memorial Welfare Hospital.",

        url: PAGE_URL,

        siteName: SITE_NAME,

        locale: "en_US",

        type: "website",

        images: [
            {
                url: DEFAULT_OG_IMAGE,
                width: 1200,
                height: 630,
                alt: `${SITE_NAME} - News and Updates`,
            },
        ],
    },

    twitter: {
        card: "summary_large_image",

        title: "News & Updates | Bashir Memorial Welfare Hospital",

        description:
            "Stay informed about the latest hospital news, healthcare initiatives, and community programs.",

        images: [DEFAULT_OG_IMAGE],
    },

    robots: {
        index: true,
        follow: true,

        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function formatDate(date: string) {
    if (!date) return "Date not available";

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
        return "Date not available";
    }

    return formattedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getValidISODate(date: string) {
    if (!date) return undefined;

    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
        return undefined;
    }

    return formattedDate.toISOString();
}

// =====================================================
// PAGE COMPONENT
// =====================================================

export default async function AllNewsUpdates() {

    // =====================================================
    // FETCH NEWS
    // =====================================================

    let newsAndUpdates: AllNewsUpdate[] = [];

    try {
        newsAndUpdates = ((await getNews()) || []) as AllNewsUpdate[];
    } catch (error) {
        console.error("Failed to fetch news and updates:", error);
    }

    // =====================================================
    // STRUCTURED DATA (JSON-LD)
    // =====================================================

    const structuredData = {
        "@context": "https://schema.org",

        "@type": "CollectionPage",

        name: "News & Updates",

        description:
            "Latest healthcare news, hospital developments, community programs, and events at Bashir Memorial Welfare Hospital.",

        url: PAGE_URL,

        isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: BASE_URL,
        },

        publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: BASE_URL,

            logo: {
                "@type": "ImageObject",
                url: DEFAULT_OG_IMAGE,
            },
        },

        mainEntity: {
            "@type": "ItemList",

            itemListOrder: "https://schema.org/ItemListOrderDescending",

            numberOfItems: newsAndUpdates.length,

            itemListElement: newsAndUpdates.map((update, index) => ({
                "@type": "ListItem",

                position: index + 1,

                item: {
                    "@type": "NewsArticle",

                    headline: update.title,

                    description: update.excerpt,

                    url: `${BASE_URL}/pages/new_update/${update.slug}`,

                    ...(update.image_url && {
                        image: update.image_url,
                    }),

                    ...(getValidISODate(update.published_at) && {
                        datePublished: getValidISODate(
                            update.published_at
                        ),
                    }),

                    ...(update.author_name && {
                        author: {
                            "@type": "Person",
                            name: update.author_name,
                        },
                    }),

                    publisher: {
                        "@type": "Organization",
                        name: SITE_NAME,
                    },
                },
            })),
        },
    };

    return (
        <main
            id="news-updates"
            className="w-full bg-white"
        >

            {/* =====================================================
                STRUCTURED DATA
            ====================================================== */}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData).replace(
                        /</g,
                        "\\u003c"
                    ),
                }}
            />

            {/* =====================================================
                HEADER / OVERVIEW
            ====================================================== */}

            <section
                id="news-updates-overview"
                className="w-full scroll-mt-28 bg-[#FBF9F9] px-5 py-10 sm:px-10 lg:py-14"
            >
                <div className="mx-auto w-full max-w-300">

                    {/* Breadcrumbs */}

                    <nav
                        aria-label="Breadcrumb"
                        className="mb-12 flex w-fit items-center rounded-md border border-[#EFEDED] bg-white px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                    >
                        <div className="breadcrumbs text-sm">
                            <ul>

                                <li>
                                    <Link
                                        href="/"
                                        className="flex items-center gap-2 text-[#6B6462] transition-colors hover:text-[#3F3A39]"
                                    >
                                        <FaHouse size={12} />
                                        <span>Home</span>
                                    </Link>
                                </li>

                                <li>
                                    <span
                                        aria-current="page"
                                        className="font-medium text-[#6B6462]"
                                    >
                                        News & Updates
                                    </span>
                                </li>

                            </ul>
                        </div>
                    </nav>

                    {/* Page Header */}

                    <div className="flex flex-col items-start">

                        <div className="mb-3 flex items-center gap-2">

                            <div className="h-1 w-8 bg-[#86000D]" />

                            <span className="text-sm font-semibold uppercase tracking-[1.4px] text-[#86000D]">
                                News & Updates
                            </span>

                        </div>

                        <h1 className="text-4xl font-bold leading-tight tracking-[-0.7px] text-[#1B1C1C] sm:text-5xl">
                            Latest News & Updates
                        </h1>

                        <p className="mt-4 max-w-175 text-base leading-7 text-[#5B403D] sm:text-lg">
                            Stay informed about the latest healthcare initiatives,
                            community programs, hospital developments, and events at
                            Bashir Memorial Welfare Hospital.
                        </p>

                    </div>

                </div>
            </section>

            {/* =====================================================
                NEWS LISTING
            ====================================================== */}

            <section
                id="all-news-updates"
                className="w-full scroll-mt-28 px-5 py-16 sm:px-10 lg:py-24"
            >
                <div className="mx-auto w-full max-w-300">

                    {newsAndUpdates.length > 0 ? (

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                            {newsAndUpdates.map((update) => (

                                <article
                                    key={update.id}
                                    className="group flex min-h-100 flex-col overflow-hidden rounded-lg bg-[#FBF9F9] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
                                >

                                    {/* Image */}

                                    <div className="relative h-48 w-full overflow-hidden bg-[#EFEDED]">

                                        {update.image_url ? (

                                            <Image
                                                src={update.image_url}
                                                alt={`${update.title} - ${SITE_NAME} news`}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />

                                        ) : (

                                            <div className="flex h-full w-full items-center justify-center text-sm text-[#5B403D]">
                                                No image available
                                            </div>

                                        )}

                                        {/* Category */}

                                        <div className="absolute left-4 top-4 rounded-sm bg-[#86000D] px-3 py-1">

                                            <span className="text-xs font-medium leading-4 tracking-[0.24px] text-white">
                                                {update.category}
                                            </span>

                                        </div>

                                    </div>

                                    {/* Content */}

                                    <div className="flex flex-1 flex-col gap-2 p-4">

                                        {/* Date */}

                                        <div className="flex items-center gap-1 text-xs font-medium tracking-[0.24px] text-[#5B403D]">

                                            <FaCalendarDays size={11} />

                                            <time
                                                dateTime={
                                                    getValidISODate(
                                                        update.published_at
                                                    ) || undefined
                                                }
                                            >
                                                {formatDate(update.published_at)}
                                            </time>

                                        </div>

                                        {/* Title */}

                                        <h2 className="line-clamp-2 text-2xl font-semibold leading-8.25 text-[#1B1C1C]">
                                            {update.title}
                                        </h2>

                                        {/* Excerpt */}

                                        <p className="line-clamp-2 text-base leading-6 text-[#5B403D]">
                                            {update.excerpt}
                                        </p>

                                        {/* Read More */}

                                        <div className="mt-auto pt-4">

                                            <Link
                                                href={`/pages/new_update/${update.slug}`}
                                                aria-label={`Read more about ${update.title}`}
                                                className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.14px] text-[#86000D] transition-opacity hover:opacity-75"
                                            >
                                                <span>Read More</span>

                                                <FaArrowRight size={12} />

                                            </Link>

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>

                    ) : (

                        <div
                            id="no-news-updates"
                            className="flex min-h-60 scroll-mt-28 items-center justify-center rounded-lg bg-[#FBF9F9]"
                        >

                            <p className="text-base text-[#5B403D]">
                                No news and updates available at the moment.
                            </p>

                        </div>

                    )}

                </div>
            </section>

        </main>
    );
}
