import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaCalendarDays, FaHouse } from "react-icons/fa6";

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

export default async function AllNewsUpdates() {
  let newsAndUpdates: AllNewsUpdate[] = [];

  try {
    const response = await axios.get(
      "http://localhost:3000/api/new_updates"
    );

    newsAndUpdates = response.data.data;
  } catch (error) {
    console.error("Failed to fetch news and updates:", error);
  }

  return (
    <main
      id="news-updates"
      className="w-full bg-white"
    >

      {/* =====================================================
          Header / Overview
      ====================================================== */}
      <section
        id="news-updates-overview"
        className="w-full scroll-mt-28 bg-[#FBF9F9] px-5 py-10 sm:px-10 lg:py-14"
      >
        <div className="mx-auto w-full max-w-300">

          {/* Breadcrumbs - Top Left */}
          <nav
            aria-label="Breadcrumb"
            className="mb-12 flex w-fit items-center rounded-md border border-[#EFEDED] bg-white px-4 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          >
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

                {/* Current Page */}
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

            {/* Label */}
            <div className="mb-3 flex items-center gap-2">
              <div className="h-1 w-8 bg-[#86000D]" />

              <span className="text-sm font-semibold uppercase tracking-[1.4px] text-[#86000D]">
                News & Updates
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold leading-tight tracking-[-0.7px] text-[#1B1C1C] sm:text-5xl">
              Latest News & Updates
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-175 text-base leading-7 text-[#5B403D] sm:text-lg">
              Stay informed about the latest healthcare initiatives,
              community programs, hospital developments, and events at
              Bashir Memorial Welfare Hospital.
            </p>

          </div>

        </div>
      </section>


      {/* =====================================================
          News Listing
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
                        alt={update.title}
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

                      <time dateTime={update.published_at}>
                        {new Date(
                          update.published_at
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
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