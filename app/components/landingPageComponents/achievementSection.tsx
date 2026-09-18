import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import {
  FaAward,
  FaCalendarDays,
  FaArrowRight,
} from "react-icons/fa6";

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
    const response = await axios.get(
      `${process.env.BACKEND_URL}/api/acheivement_awards`
    );

    achievements = response.data.data || [];
  } catch (error) {
    console.error("Failed to fetch achievements and awards:", error);
  }

  // Show only the latest 3 on Home/About
  const topAchievements = achievements.slice(0, 3);

  // If there are no achievements, don't render the section
  if (topAchievements.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#FBF9F9] px-5 py-16 sm:px-8 md:px-10 lg:px-12 xl:px-16">
      <div className="mx-auto w-full max-w-7xl">

        {/* SECTION HEADER */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div className="max-w-2xl">
            {/* Small Label */}
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-8 bg-[#86000D]" />

              <span className="text-xs font-semibold uppercase tracking-[1.5px] text-[#86000D]">
                Recognition & Excellence
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl font-bold leading-tight tracking-[-0.5px] text-[#1B1C1C] sm:text-4xl lg:text-[42px]">
              Our Achievements & Awards
            </h2>

            {/* Description */}
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#5B403D] sm:text-base">
              Our commitment to quality healthcare and community welfare has
              been recognized through various achievements, awards, and
              professional recognitions.
            </p>
          </div>

          {/* View All */}
          <Link
            href="/pages/achievements"
            className="
              group
              inline-flex
              w-fit
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
              duration-200
              hover:bg-[#86000D]
              hover:text-white
            "
          >
            <span>View All</span>

            <FaArrowRight
              size={13}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* ACHIEVEMENT CARDS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

          {topAchievements.map((achievement) => (
            <article
              key={achievement.id}
              className="
                group
                flex
                h-full
                flex-col
                overflow-hidden
                border
                border-[#E7E1E1]
                bg-white
                shadow-[0_2px_10px_rgba(0,0,0,0.04)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]
              "
            >
              {/* IMAGE */}
              <Link
                href={`/pages/achievements-awards/${achievement.id}`}
                className="relative block aspect-[16/10] w-full overflow-hidden bg-[#F2EEEE]"
              >
                {achievement.image_url ? (
                  <Image
                    src={achievement.image_url}
                    alt={achievement.title}
                    fill
                    sizes="
                      (max-width: 768px) 100vw,
                      (max-width: 1024px) 50vw,
                      33vw
                    "
                    className="
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <FaAward
                      size={50}
                      className="text-[#86000D]/30"
                    />
                  </div>
                )}

                {/* TYPE BADGE */}
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
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.5px]
                    text-white
                  "
                >
                  <FaAward size={11} />

                  <span>
                    {formatType(achievement.type)}
                  </span>
                </div>
              </Link>

              {/* CONTENT */}
              <div className="flex flex-1 flex-col p-5 sm:p-6">

                {/* TITLE */}
                <Link
                  href={`/pages/achievements-awards/${achievement.id}`}
                >
                  <h3
                    className="
                      line-clamp-2
                      text-xl
                      font-bold
                      leading-7
                      text-[#1B1C1C]
                      transition-colors
                      duration-200
                      group-hover:text-[#86000D]
                    "
                  >
                    {achievement.title}
                  </h3>
                </Link>

                {/* ORGANIZATION */}
                {achievement.issuing_organization && (
                  <div className="mt-3 flex items-start gap-2">
                    <FaAward
                      size={14}
                      className="mt-1 shrink-0 text-[#86000D]"
                    />

                    <p className="text-sm font-medium leading-5 text-[#5B403D]">
                      {achievement.issuing_organization}
                    </p>
                  </div>
                )}

                {/* DESCRIPTION */}
                {achievement.description && (
                  <p
                    className="
                      mt-4
                      line-clamp-3
                      text-sm
                      leading-6
                      text-[#6B5A58]
                    "
                  >
                    {achievement.description}
                  </p>
                )}

                {/* FOOTER */}
                <div
                  className="
                    mt-auto
                    flex
                    items-center
                    justify-between
                    border-t
                    border-[#EEE8E8]
                    pt-5
                    mt-5
                  "
                >
                  {/* DATE */}
                  {achievement.award_date ? (
                    <div className="flex items-center gap-2 text-xs text-[#6B5A58]">
                      <FaCalendarDays
                        size={13}
                        className="text-[#86000D]"
                      />

                      <span>
                        {formatDate(achievement.award_date)}
                      </span>
                    </div>
                  ) : (
                    <span />
                  )}

                  {/* READ MORE */}
                  <Link
                    href={`/pages/achievements-awards/${achievement.id}`}
                    className="
                      group/link
                      inline-flex
                      items-center
                      gap-1.5
                      text-xs
                      font-semibold
                      text-[#86000D]
                    "
                  >
                    <span>View Details</span>

                    <FaArrowRight
                      size={11}
                      className="
                        transition-transform
                        duration-200
                        group-hover/link:translate-x-1
                      "
                    />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* MOBILE VIEW ALL */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/pages/achievements-awards"
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
              transition-opacity
              hover:opacity-90
            "
          >
            <span>View All Achievements</span>
            <FaArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------
   FORMAT ACHIEVEMENT TYPE
--------------------------------------- */

function formatType(type: string) {
  if (!type) return "Recognition";

  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/* ---------------------------------------
   FORMAT DATE
--------------------------------------- */

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

