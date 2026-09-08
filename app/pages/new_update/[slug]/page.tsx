import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaArrowRight,
  FaCalendarDays,
  FaHouse,
  FaUser,
} from "react-icons/fa6";

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

export default async function NewsUpdatePage({ params }: PageProps) {
  const { slug } = await params;

  let news: NewsUpdate;

  try {
    const response = await axios.get(
      "http://localhost:3000/api/new_updates",
      {
        params: {
          slug,
        },
      }
    );

    news = response.data.data;

    if (!news) {
      notFound();
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }

    console.error("Failed to fetch news update:", error);

    throw error;
  }

  const publishedDate = new Date(news.published_at).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <main className="w-full bg-white my-5">

      {/* =====================================================
          Header / Breadcrumbs
      ====================================================== */}
      <section className="w-full bg-[#FBF9F9] px-5 py-8 sm:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-300">

          {/* Breadcrumbs */}
          <div className="inline-flex rounded-md border border-[#EFEDED] bg-white px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">

            <div className="breadcrumbs text-sm">
              <ul>

                {/* Home */}
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-[#6B6462] transition-colors hover:text-[#3F3A39]"
                  >
                    <FaHouse size={12} />
                    <span>Home</span>
                  </Link>
                </li>

                {/* News & Updates */}
                <li>
                  <Link
                    href="/pages/all_news_updates"
                    className="text-[#6B6462] transition-colors hover:text-[#3F3A39]"
                  >
                    News & Updates
                  </Link>
                </li>

                {/* Current Article */}
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


      {/* =====================================================
          Article Header
      ====================================================== */}
      <section className="w-full px-5 py-12 sm:px-10 lg:py-16">
        <div className="mx-auto w-full max-w-300">

          {/* Category */}
          <div className="mb-5 inline-flex rounded-sm bg-[#86000D] px-3 py-1">
            <span className="text-xs font-medium leading-4 tracking-[0.24px] text-white">
              {news.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="max-w-225 text-4xl font-bold leading-tight tracking-[-0.7px] text-[#1B1C1C] sm:text-5xl lg:text-[52px] lg:leading-[1.15]">
            {news.title}
          </h1>

          {/* Excerpt */}
          <p className="mt-6 max-w-200 text-lg leading-8 text-[#5B403D]">
            {news.excerpt}
          </p>

          {/* Meta Information */}
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#6B6462]">

            {/* Date */}
            <div className="flex items-center gap-2">
              <FaCalendarDays size={14} />

              <time dateTime={news.published_at}>
                {publishedDate}
              </time>
            </div>

            {/* Author */}
            <div className="flex items-center gap-2">
              <FaUser size={13} />

              <span>{news.author_name}</span>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          Featured Image
      ====================================================== */}
      <section className="w-full px-5 sm:px-10">
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


      {/* =====================================================
          Article Content
      ====================================================== */}
      <section className="w-full px-5 sm:px-10 mt-5">
        <div className="mx-auto w-full max-w-300">

          {/* Article Content */}
          <article className="text-base leading-8 text-[#5B403D] sm:text-lg">

            {news.content
              .split("\n")
              .map((paragraph, index) =>
                paragraph.trim() ? (
                  <p key={index} className="mb-6">
                    {paragraph}
                  </p>
                ) : null
              )}

          </article>


          <div className="mt-10 border-t border-[#EFEDED] pt-8">

            <Link
              href="/pages/all_news_updates"
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.14px] text-[#86000D] transition-opacity hover:opacity-75"
            >
              <FaArrowRight
                size={12}
                className="rotate-180"
              />

              <span>Back to News & Updates</span>
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}