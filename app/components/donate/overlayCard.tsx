import Image from "next/image";
import Link from "next/link";
import {
  FaHandHoldingHeart,
  FaHeartbeat,
  FaHandHoldingMedical,
  FaGift,
  FaArrowRight,
} from "react-icons/fa";

const donationOptions = [
  {
    title: "Zakat",
    description:
      "Fulfill your Islamic obligation and help provide critical medical treatments to eligible, deserving patients.",
    linkText: "Give Zakat",
    icon: FaHandHoldingHeart,
    accent: true,
  },
  {
    title: "General",
    description:
      "Support our daily hospital operations, vital equipment upgrades, and community outreach programs.",
    linkText: "Donate Now",
    icon: FaHandHoldingMedical,
    accent: false,
  },
  {
    title: "Sadaqah",
    description:
      "Offer voluntary charity to bring healing and relief to the sick, removing hardships and earning ongoing rewards.",
    linkText: "Give Sadaqah",
    icon: FaGift,
    accent: true,
  },
  {
    title: "Fitrana",
    description:
      "Contribute your Sadqa-e-Fitr to ensure those facing medical emergencies can celebrate with health and dignity.",
    linkText: "Give Fitrana",
    icon: FaHeartbeat,
    accent: false,
  },
];

function DonationCard({ item }: { item: any }) {
  const Icon = item.icon;

  return (
    <div
      className="
        group relative isolate flex min-h-[282.5px]
        flex-1 flex-col overflow-hidden rounded-lg
        bg-white p-6
        shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-[0px_25px_30px_-8px_rgba(0,0,0,0.15)]
      "
    >
      {/* Decorative corner */}
      <div
        className={`
          absolute -right-8 -top-8 z-0
          h-32 w-32 rounded-bl-xl
          ${
            item.accent
              ? "bg-[#86000D]/5"
              : "bg-[#5F5E5E]/5"
          }
        `}
      />

      {/* Icon */}
      <div className="relative z-10 mb-4">
        <div
          className={`
            flex h-12 w-12 items-center justify-center
            rounded-xl
            ${
              item.accent
                ? "bg-[#86000D]/10"
                : "bg-[#E9E8E8]"
            }
          `}
        >
          <Icon
            className={`
              ${
                item.accent
                  ? "text-[#86000D]"
                  : "text-[#5F5E5E]"
              }
            `}
            size={21}
          />
        </div>
      </div>

      {/* Title */}
      <h3 className="relative z-10 mb-2 text-2xl font-semibold leading-8 text-[#1B1C1C]">
        {item.title}
      </h3>

      {/* Description */}
      <p className="relative z-10 mb-4 flex-1 text-base font-normal leading-6 text-[#5B403D]">
        {item.description}
      </p>

      {/* Link */}
      <Link
        href="/donate"
        className={`
          relative z-10 inline-flex items-center gap-1
          text-sm font-semibold tracking-[0.14px]
          transition-colors duration-200
          ${
            item.accent
              ? "text-[#86000D] hover:text-[#650009]"
              : "text-[#5F5E5E] hover:text-[#3f3e3e]"
          }
        `}
      >
        {item.linkText}

        <FaArrowRight size={12} />
      </Link>
    </div>
  );
}

export default function DonationHero() {
  return (
    <section className="relative w-full">
      {/* ================= HERO ================= */}
      <div className="relative h-[600px] w-full overflow-hidden">
        {/* Background */}
        <Image
          src="/images/donatePageBanner.jpeg"
          alt="Bashir Memorial Welfare Hospital"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Left → Right gradient */}
        <div className="absolute inset-0 bg-linear-to-r from-white via-white/80 to-transparent" />

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-[#FBF9F9] via-transparent to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-[1280px] items-center px-6 sm:px-8 lg:px-10">
          <div className="flex max-w-[672px] flex-col items-start">

            {/* Label */}
            <div className="mb-4">
              <div className="flex h-8 items-center gap-2 rounded-xl bg-[#EFEDED] px-4 shadow-sm">
                <FaHandHoldingHeart
                  size={15}
                  className="text-[#86000D]"
                />

                <span className="text-xs font-medium uppercase tracking-[1.2px] text-[#86000D]">
                  Make a difference through giving
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1
              className="
                mb-4 max-w-[672px]
                text-4xl font-bold leading-tight
                tracking-[-0.72px] text-[#1B1C1C]
                sm:text-[42px]
                lg:text-[48px] lg:leading-[60px]
                lg:tracking-[-0.96px]
              "
            >
              Give the gift of healing today.
            </h1>

            {/* Description */}
            <p
              className="
                max-w-[576px]
                pb-8
                text-base font-normal leading-7
                text-[#5B403D]
                sm:text-lg
              "
            >
              Your generosity helps us provide essential healthcare,
              life-saving treatments, and compassionate care to patients
              and families who need it most.
            </p>
          </div>
        </div>
      </div>

      {/* ================= WAYS TO GIVE ================= */}
      <div className="relative z-20 mx-auto -mt-24 max-w-[1280px] px-6 sm:px-8 lg:px-10">
        <div
          className="
            grid grid-cols-1 gap-6
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {donationOptions.map((item) => (
            <DonationCard
              key={item.title}
              item={item}
            />
          ))}
        </div>
      </div>

      {/* Space after overlapping cards */}
      <div className="h-24" />
    </section>
  );
}