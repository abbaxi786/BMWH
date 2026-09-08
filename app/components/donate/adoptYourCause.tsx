import Image from "next/image";
import Link from "next/link";
import {
  FaArrowRight,
  FaHandHoldingHeart,
  FaHeartbeat,
  FaBuilding,
} from "react-icons/fa";
import type { IconType } from "react-icons";

type Sponsorship = {
  title: string;
  description: string;
  category: string;
  linkText: string;
  image: string;
  icon: IconType;
  categoryStyle: "maroon" | "gray" | "dark-gray";
};

const sponsorships: Sponsorship[] = [
  {
    title: "Sponsor a Patient",
    description:
      "Take full financial responsibility for a critically ill patient's journey, from diagnostics to post-operative care.",
    category: "PATIENT CARE",
    linkText: "Sponsor a Patient",
    image: "/images/support.jpeg",
    icon: FaHandHoldingHeart,
    categoryStyle: "maroon",
  },
  {
    title: "Fund Free Surgeries",
    description:
      "Contribute to our general surgery fund, helping clear the backlog of life-saving procedures for patients who cannot afford them.",
    category: "SURGICAL CARE",
    linkText: "Fund a Surgery",
    image: "/images/fundSurgury.jpeg",
    icon: FaHeartbeat,
    categoryStyle: "gray",
  },
  {
    title: "Capital Projects",
    description:
      "Invest in the hospital's infrastructure. Current initiatives include expanding the Dialysis Center and upgrading the NICU.",
    category: "INFRASTRUCTURE",
    linkText: "Support a Project",
    image: "/images/project.jpeg",
    icon: FaBuilding,
    categoryStyle: "dark-gray",
  },
];

type SponsorshipCardProps = {
  item: Sponsorship;
};

function SponsorshipCard({ item }: SponsorshipCardProps) {
  const Icon = item.icon;

  return (
    <article className="group flex min-h-62 w-full overflow-hidden rounded-lg bg-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="relative hidden w-60 shrink-0 sm:block">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="240px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center p-6">
        {/* Optional icon */}
        <div className="mb-3 hidden">
          <Icon size={20} className="text-[#86000D]" />
        </div>

        {/* Heading */}
        <h3 className="mb-2 text-2xl font-semibold leading-8 text-[#1B1C1C]">
          {item.title}
        </h3>

        {/* Description */}
        <p className="mb-4 text-base font-normal leading-6 text-[#5B403D]">
          {item.description}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4">
          <span
            className={`
              inline-flex rounded-xl px-3 py-1
              text-xs font-medium uppercase
              tracking-[0.6px]
              ${
                item.categoryStyle === "maroon"
                  ? "bg-[#86000D]/10 text-[#86000D]"
                  : item.categoryStyle === "gray"
                    ? "bg-[#5F5E5E]/10 text-[#5F5E5E]"
                    : "bg-[#3F4141]/10 text-[#3F4141]"
              }
            `}
          >
            {item.category}
          </span>

          <Link
            href="/donate"
            className="group/link inline-flex items-center gap-2 text-sm font-semibold tracking-[0.14px] text-[#86000D]"
          >
            {item.linkText}

            <FaArrowRight
              size={12}
              className="transition-transform duration-200 group-hover/link:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function AdoptYourCause() {
  return (
    <section className="bg-[#F5F3F3] px-0 py-20 lg:py-30">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[462.67px_minmax(0,1fr)] lg:gap-16">
          {/* LEFT SIDE */}
          <div className="flex flex-col">
            <div className="lg:sticky lg:top-24">
              {/* Eyebrow */}
              <p className="mb-2 text-xs font-medium uppercase tracking-[1.2px] text-[#5F5E5E]">
                Direct Impact
              </p>

              {/* Heading */}
              <h2 className="max-w-115.75 text-[40px] font-bold leading-12 tracking-[-0.8px] text-[#1B1C1C] sm:text-[44px] sm:leading-13 lg:text-[48px] lg:leading-14 lg:tracking-[-0.96px]">
                Adopt a cause.
                <br />
                Change a life.
              </h2>

              {/* Description */}
              <p className="mt-4 max-w-115.75 text-lg font-normal leading-7 text-[#5B403D]">
                Our sponsorship programs allow you to direct your generosity
                exactly where you feel it's needed most. Track your impact and
                receive direct reports on patient recoveries and project
                completions.
              </p>

              {/* CTA */}
              <Link
                href="/donate"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-xs bg-[#86000D] px-8 text-sm font-bold tracking-[0.14px] text-white shadow-md transition-colors duration-200 hover:bg-[#6d000a]"
              >
                Explore All Sponsorships
                <FaArrowRight size={12} />
              </Link>

              {/* Decorative Element */}
              <div className="mt-14 flex items-end gap-4 opacity-20">
                <span className="text-[48px] font-bold leading-12 tracking-[-0.96px] text-[#5F5E5E]">
                  “
                </span>

                <span className="max-w-31.75 text-2xl font-semibold leading-8 text-[#5F5E5E]">
                  Every gift creates an impact.
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-8">
            {sponsorships.map((item) => (
              <SponsorshipCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}