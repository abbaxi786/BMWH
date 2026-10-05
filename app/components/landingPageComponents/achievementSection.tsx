import Link from "next/link";
import Image from "next/image";
import {
  FaAward,
  FaCalendarDays,
  FaArrowRight,
} from "react-icons/fa6";
import {
  getAchievements,
} from "@/lib/data/achievment/achievements.js";

export interface AchievementAward {
  id: number;
  title: string;
  type: string;
  description: string | null;
  image_url: string | null;
  award_date: string | null;
  issuing_organization: string | null;
  website_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default async function AchievementsAwards() {
  let achievements: AchievementAward[] = [];

  try {
    const result = await getAchievements();

    achievements = result as AchievementAward[];
  } catch (error) {
    console.error(
      "Failed to fetch achievements and awards:",
      error
    );
  }

  // Show only the latest 3 on homepage
  const topAchievements = achievements.slice(0, 3);

  // Don't render section when there is no data
  if (topAchievements.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="achievements-section-heading"
      className="
        w-full
        bg-[#FBF9F9]
        py-16
        sm:py-20
        lg:py-24
        xl:py-28
        2xl:py-32
      "
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-7xl
          flex-col
          gap-8
          px-5
          sm:px-8
          lg:px-10
          xl:px-12
          2xl:max-w-360
          2xl:px-16
          3xl:max-w-[1600px]
        "
      >
        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div
          className="
            flex
            flex-col
            gap-6
            md:flex-row
            md:items-end
            md:justify-between
            xl:gap-10
          "
        >
          <div className="max-w-2xl xl:max-w-3xl">

            {/* Label */}
            <div className="mb-3 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-[#86000D] sm:w-10"
              />

              <span
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#86000D]
                  sm:text-xs
                "
              >
                Recognition & Excellence
              </span>
            </div>

            {/* Heading */}
            <h2
              id="achievements-section-heading"
              className="
                text-3xl
                font-bold
                leading-tight
                tracking-tight
                text-[#1B1C1C]
                sm:text-4xl
                lg:text-[42px]
                lg:leading-[1.15]
                xl:text-[46px]
                2xl:text-[50px]
              "
            >
              Our Achievements & Awards
            </h2>

            {/* Description */}
            <p
              className="
                mt-4
                max-w-2xl
                text-sm
                leading-6
                text-[#5B403D]
                sm:text-base
                sm:leading-7
                lg:mt-5
                xl:text-[17px]
                xl:leading-8
              "
            >
              Our commitment to quality healthcare and community welfare has
              been recognized through various achievements, awards, and
              professional recognitions.
            </p>
          </div>

          {/* =====================================================
              DESKTOP VIEW ALL
          ===================================================== */}

          <Link
            href="/pages/achievements"
            aria-label="View all achievements and awards"
            className="
              group
              inline-flex
              w-fit
              shrink-0
              items-center
              gap-2
              border
              border-[#86000D]
              px-5
              py-3
              text-sm
              font-semibold
              text-[#86000D]
              transition-all
              duration-300
              hover:bg-[#86000D]
              hover:text-white
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#86000D]
              focus-visible:ring-offset-2
              xl:px-6
              xl:py-3.5
            "
          >
            <span>View All</span>

            <FaArrowRight
              aria-hidden="true"
              size={13}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </Link>
        </div>

        {/* =====================================================
            ACHIEVEMENT CARDS
        ===================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            sm:gap-6
            lg:grid-cols-3
            xl:gap-7
            2xl:gap-8
          "
        >
          {topAchievements.map((achievement) => {

            /*
             * Individual achievement URL
             *
             * /pages/achievements
             *              ↓
             * /pages/achievements/[id]
             */
            const detailsUrl = `/pages/achievements/${achievement.id}`;

            return (
              <article
                key={achievement.id}
                className="
                  group
                  flex
                  min-h-112.5
                  flex-col
                  overflow-hidden
                  rounded-sm
                  border
                  border-[#E4DCDC]
                  bg-white
                  shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#D9C8C6]
                  hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]
                  sm:min-h-117.5
                  lg:min-h-122.5
                  xl:min-h-127.5
                  2xl:min-h-135
                "
              >

                {/* =================================================
                    IMAGE
                ================================================= */}

                <Link
                  href={detailsUrl}
                  aria-label={`View ${achievement.title}`}
                  className="
                    relative
                    block
                    h-56
                    w-full
                    overflow-hidden
                    bg-[#F2EEEE]
                    sm:h-60
                    lg:h-64
                    xl:h-72
                    2xl:h-80
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-inset
                    focus-visible:ring-[#86000D]
                  "
                >
                  {achievement.image_url ? (
                    <Image
                      src={achievement.image_url}
                      alt={achievement.title}
                      fill
                      sizes="
                        (max-width: 640px) 100vw,
                        (max-width: 1024px) 50vw,
                        (max-width: 1536px) 33vw,
                        480px
                      "
                      className="
                        object-cover
                        transition-transform
                        duration-500
                        ease-out
                        group-hover:scale-105
                      "
                    />
                  ) : (
                    <div
                      className="
                        flex
                        h-full
                        w-full
                        items-center
                        justify-center
                        bg-[#F7F2F2]
                      "
                    >
                      <FaAward
                        aria-hidden="true"
                        className="
                          text-5xl
                          text-[#86000D]/25
                          sm:text-6xl
                        "
                      />
                    </div>
                  )}

                  {/* Image Overlay */}
                  <div
                    aria-hidden="true"
                    className="
                      absolute
                      inset-0
                      bg-linear-to-t
                      from-black/20
                      via-transparent
                      to-transparent
                      opacity-0
                      transition-opacity
                      duration-300
                      group-hover:opacity-100
                    "
                  />

                  {/* =================================================
                      TYPE BADGE
                  ================================================= */}

                  <div
                    className="
                      absolute
                      left-4
                      top-4
                      inline-flex
                      items-center
                      gap-2
                      bg-[#86000D]
                      px-3
                      py-1.5
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                      text-white
                      shadow-sm
                      sm:left-5
                      sm:top-5
                      sm:px-3.5
                      sm:py-2
                      sm:text-[11px]
                    "
                  >
                    <FaAward
                      aria-hidden="true"
                      size={11}
                    />

                    <span>
                      {formatType(achievement.type)}
                    </span>
                  </div>
                </Link>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div
                  className="
                    flex
                    flex-1
                    flex-col
                    p-5
                    sm:p-6
                    lg:p-7
                    xl:p-8
                  "
                >

                  {/* Title */}

                  <Link
                    href={detailsUrl}
                    className="
                      block
                      rounded-sm
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#86000D]
                      focus-visible:ring-offset-2
                    "
                  >
                    <h3
                      className="
                        line-clamp-2
                        text-lg
                        font-bold
                        leading-7
                        text-[#1B1C1C]
                        transition-colors
                        duration-300
                        group-hover:text-[#86000D]
                        sm:text-xl
                        sm:leading-7
                        xl:text-[21px]
                        2xl:text-[22px]
                      "
                    >
                      {achievement.title}
                    </h3>
                  </Link>

                  {/* Organization */}

                  {achievement.issuing_organization && (
                    <div className="mt-3 flex items-start gap-2.5">

                      <FaAward
                        aria-hidden="true"
                        size={14}
                        className="mt-1 shrink-0 text-[#86000D]"
                      />

                      <p
                        className="
                          line-clamp-2
                          text-sm
                          font-medium
                          leading-5
                          text-[#5B403D]
                          xl:text-[15px]
                        "
                      >
                        {achievement.issuing_organization}
                      </p>

                    </div>
                  )}

                  {/* Description */}

                  {achievement.description && (
                    <p
                      className="
                        mt-4
                        line-clamp-3
                        text-sm
                        leading-6
                        text-[#6B5A58]
                        xl:text-[15px]
                        xl:leading-6
                      "
                    >
                      {achievement.description}
                    </p>
                  )}

                  {/* =================================================
                      FOOTER
                  ================================================= */}

                  <div
                    className="
                      mt-auto
                      flex
                      items-center
                      justify-between
                      gap-4
                      border-t
                      border-[#EEE8E8]
                      pt-5
                      xl:pt-6
                    "
                  >

                    {/* Date */}

                    {achievement.award_date ? (
                      <time
                        dateTime={achievement.award_date}
                        className="
                          flex
                          min-w-0
                          items-center
                          gap-2
                          text-xs
                          text-[#6B5A58]
                          xl:text-sm
                        "
                      >
                        <FaCalendarDays
                          aria-hidden="true"
                          size={13}
                          className="shrink-0 text-[#86000D]"
                        />

                        <span className="truncate">
                          {formatDate(
                            achievement.award_date
                          )}
                        </span>
                      </time>
                    ) : (
                      <span />
                    )}

                    {/* View Details */}

                    <Link
                      href={detailsUrl}
                      aria-label={`View details for ${achievement.title}`}
                      className="
                        group/link
                        inline-flex
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-sm
                        text-xs
                        font-semibold
                        text-[#86000D]
                        transition-colors
                        duration-200
                        hover:text-[#6F000A]
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-[#86000D]
                        focus-visible:ring-offset-2
                        xl:text-sm
                      "
                    >
                      <span>View Details</span>

                      <FaArrowRight
                        aria-hidden="true"
                        size={11}
                        className="
                          transition-transform
                          duration-300
                          group-hover/link:translate-x-1
                        "
                      />
                    </Link>

                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* =====================================================
            MOBILE VIEW ALL
        ===================================================== */}

        <div className="flex justify-center pt-2 md:hidden">

          <Link
            href="/pages/achievements"
            aria-label="View all achievements and awards"
            className="
              inline-flex
              items-center
              gap-2
              bg-[#86000D]
              px-6
              py-3
              text-sm
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-[#72000A]
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#86000D]
              focus-visible:ring-offset-2
            "
          >
            <span>View All Achievements</span>

            <FaArrowRight
              aria-hidden="true"
              size={13}
            />

          </Link>

        </div>

      </div>
    </section>
  );
}

/* ============================================================
   FORMAT ACHIEVEMENT TYPE
============================================================ */

function formatType(type: string) {
  if (!type) return "Recognition";

  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/* ============================================================
   FORMAT DATE
============================================================ */

function formatDate(date: string) {
  try {
    const formattedDate = new Date(date);

    if (Number.isNaN(formattedDate.getTime())) {
      return date;
    }

    return formattedDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
}