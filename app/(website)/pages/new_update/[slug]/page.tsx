
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";

import {
    FaArrowRight,
    FaCalendarDays,
    FaHouse,
    FaUser,
} from "react-icons/fa6";

import { getNewsBySlug } from "@/lib/data/news/news";

export const revalidate = 86400;

interface NewsUpdate {
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

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Cache the database result within the same server request.
// This allows generateMetadata and the page to reuse the result.
const getCachedNews = cache(
    async (slug: string): Promise<NewsUpdate | null> => {
        const result = await getNewsBySlug(slug);
        return result as NewsUpdate | null;
    }
);

// Dynamic SEO metadata
export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;

    const news = await getCachedNews(slug);

    // Prevent indexing of nonexistent news articles.
    if (!news) {
        return {
            title: "News Not Found",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const siteUrl = process.env.BACKEND_URL?.replace(/\/+$/, "") || "";
    const canonicalUrl = `/pages/new_update/${news.slug}`;

    // Clean and limit description for search engines.
    const description = (
        news.excerpt || news.content || news.title
    )
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 160);

    const keywords = [
        news.title,
        news.category,
        "Hospital News",
        "Healthcare Updates",
        "Hospital Updates",
    ].filter(Boolean);

    return {
        title: news.title,

        description,

        keywords,

        alternates: {
            canonical: canonicalUrl,
        },

        openGraph: {
            type: "article",
            title: news.title,
            description,
            url: siteUrl
                ? `${siteUrl.replace(/\/$/, "")}${canonicalUrl}`
                : canonicalUrl,
            publishedTime: news.published_at,
            authors: [news.author_name],
            section: news.category,
            images: news.image_url
                ? [
                    {
                        url: news.image_url,
                        alt: news.title,
                        width: 1200,
                        height: 630,
                    },
                ]
                : [],
        },

        twitter: {
            card: news.image_url
                ? "summary_large_image"
                : "summary",
            title: news.title,
            description,
            images: news.image_url
                ? [news.image_url]
                : [],
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
}

export default async function NewsUpdatePage({
    params,
}: PageProps) {
    const { slug } = await params;

    let news: NewsUpdate | null = null;

    try {
        news = await getCachedNews(slug);
    } catch (error) {
        console.error(
            "Failed to fetch news update:",
            error
        );

        throw error;
    }

    // News does not exist or is not published.
    if (!news) {
        notFound();
    }

    const publishedDate = new Date(
        news.published_at
    ).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <main
            id="news-update-article"
            className="my-5 w-full bg-white"
        >
            {/* Header / Breadcrumbs */}
            <section
                id="news-update-header"
                className="w-full scroll-mt-28 bg-[#FBF9F9] px-5 py-8 sm:px-10 lg:py-10"
            >
                <div className="mx-auto w-full max-w-300">
                    <div className="inline-flex rounded-md border border-[#EFEDED] bg-white px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
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
                                    <Link
                                        href="/pages/all_news_updates"
                                        className="text-[#6B6462] transition-colors hover:text-[#3F3A39]"
                                    >
                                        News & Updates
                                    </Link>
                                </li>

                                <li>
                                    <span
                                        aria-current="page"
                                        className="max-w-50 truncate font-medium text-[#6B6462] sm:max-w-none"
                                    >
                                        {news.title}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Header */}
            <section className="w-full scroll-mt-28 px-5 py-12 sm:px-10 lg:py-16">
                <div className="mx-auto w-full max-w-300">
                    <div className="mb-5 inline-flex rounded-sm bg-[#86000D] px-3 py-1">
                        <span className="text-xs font-medium leading-4 tracking-[0.24px] text-white">
                            {news.category}
                        </span>
                    </div>

                    <h1 className="max-w-225 text-4xl font-bold leading-tight tracking-[-0.7px] text-[#1B1C1C] sm:text-5xl lg:text-[52px] lg:leading-[1.15]">
                        {news.title}
                    </h1>

                    <p className="mt-6 max-w-200 text-lg leading-8 text-[#5B403D]">
                        {news.excerpt}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#6B6462]">
                        <div className="flex items-center gap-2">
                            <FaCalendarDays size={14} />

                            <time dateTime={news.published_at}>
                                {publishedDate}
                            </time>
                        </div>

                        <div className="flex items-center gap-2">
                            <FaUser size={13} />

                            <span>{news.author_name}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            <section
                id="news-update-image"
                className="w-full scroll-mt-28 px-5 sm:px-10"
            >
                <div className="mx-auto w-full max-w-300">
                    {news.image_url ? (
                        <div className="relative h-70 w-full overflow-hidden rounded-lg bg-[#EFEDED] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] sm:h-100 lg:h-125">
                            <Image
                                src={news.image_url}
                                alt={news.title}
                                fill
                                priority
                                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1200px"
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex h-70 w-full items-center justify-center rounded-lg bg-[#EFEDED] text-[#6B6462] sm:h-100 lg:h-125">
                            No image available
                        </div>
                    )}
                </div>
            </section>

            {/* Article Content */}
            <section
                id="news-update-content"
                className="mt-5 w-full scroll-mt-28 px-5 sm:px-10"
            >
                <div className="mx-auto w-full max-w-300">
                    <article className="text-base leading-8 text-[#5B403D] sm:text-lg">
                        {news.content
                            .split("\n")
                            .map((paragraph, index) =>
                                paragraph.trim() ? (
                                    <p
                                        key={index}
                                        className="mb-6"
                                    >
                                        {paragraph}
                                    </p>
                                ) : null
                            )}
                    </article>

                    {/* Back Link */}
                    <div className="mt-10 border-t border-[#EFEDED] pt-8">
                        <Link
                            href="/pages/all_news_updates"
                            className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.14px] text-[#86000D] transition-opacity hover:opacity-75"
                        >
                            <FaArrowRight
                                size={12}
                                className="rotate-180"
                            />

                            <span>
                                Back to News & Updates
                            </span>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
