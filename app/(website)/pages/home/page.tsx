import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { FaCalendarCheck, FaUserDoctor } from "react-icons/fa6";

import ImpactStats from "@/app/components/landingPageComponents/impactStates";
import AboutSection from "@/app/components/landingPageComponents/aboutsection";
import NewsUpdates from "@/app/components/landingPageComponents/latestNewsSection";
import Map from "@/app/components/map";
import ContactUsCard from "@/app/components/contactCard/contactCard";
import DepartmentsSection from "@/app/components/departmentPageComponents/countedDepartment";
import SuccessStories from "@/app/components/AboutContent/success_stories";
import EventsSection from "@/app/components/landingPageComponents/events_section";
import TopFacilities from "@/app/components/landingPageComponents/hospital_facilities";

interface NewsUpdate {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string | null;
  category: string;
  published_at: string;
}

export default async function Home() {
  let updates: NewsUpdate[] = [];

  try {
    const response = await axios.get(
      `${process.env.BACKEND_URL}/api/new_updates/top-three-news`
    );
    updates = response.data.data;
  } catch (error) {
    console.error("Failed to fetch news updates:", error);
  }

  return (
    <main className="w-full overflow-x-hidden animate-fade-in-up">
      {/* HERO + IMPACT STATS CONTAINER */}
      <section className="w-full bg-[#FBF9F9]">
        {/* HERO BANNER */}
        <section
          className="
            relative
            z-0
            min-h-155
            w-full
            overflow-hidden
            bg-[#F5F3F3]
            sm:min-h-150
            md:min-h-155
            lg:h-150
            lg:min-h-0
            xl:h-155
          "
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              loading="eager"
              src="/images/banner.jpeg"
              alt="Bashir Memorial Welfare Hospital"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          {/* Gradient Overlay */}
          <div
            className="
              absolute
              inset-0
              bg-[linear-gradient(90deg,rgba(251,249,249,0.97)_0%,rgba(251,249,249,0.90)_42%,rgba(251,249,249,0.45)_75%,rgba(251,249,249,0.10)_100%)]
              max-md:bg-[linear-gradient(180deg,rgba(251,249,249,0.96)_0%,rgba(251,249,249,0.88)_48%,rgba(251,249,249,0.45)_100%)]
            "
          />

          {/* Hero Content */}
          <div
            className="
              relative
              z-10
              flex
              min-h-155
              w-full
              items-center
              px-5
              py-16
              sm:px-8
              sm:py-20
              md:px-10
              lg:h-full
              lg:min-h-0
              lg:px-12
              xl:px-16
              2xl:px-20
            "
          >
            <div
              className="
                flex
                w-full
                max-w-2xl
                flex-col
                items-start
                gap-4
                lg:max-w-147.5
                xl:max-w-155
              "
            >
              {/* Badge */}
              <div
                className="
                  rounded-full
                  bg-[rgba(175,16,26,0.1)]
                  px-3
                  py-1
                  sm:px-4
                  sm:py-1.5
                "
              >
                <span
                  className="
                    text-[10px]
                    font-medium
                    leading-4
                    tracking-[0.2px]
                    text-[#86000D]
                    sm:text-xs
                    sm:tracking-[0.24px]
                  "
                >
                  Compassionate Care. Stronger Communities.
                </span>
              </div>

              {/* Heading */}
              <h1
                className="
                  max-w-2xl
                  text-[34px]
                  font-bold
                  leading-[1.12]
                  tracking-[-0.6px]
                  text-[#1B1C1C]
                  sm:text-[40px]
                  md:text-[44px]
                  lg:text-[48px]
                  lg:leading-[1.15]
                  lg:tracking-[-0.96px]
                  xl:text-[52px]
                "
              >
                Compassionate Healthcare.
                <br />
                Serving the Community.
              </h1>

              {/* Description */}
              <p
                className="
                  max-w-xl
                  text-sm
                  leading-6
                  text-[#5B403D]
                  sm:text-base
                  sm:leading-7
                  md:text-lg
                "
              >
                Bashir Memorial Welfare Hospital is committed to providing
                quality healthcare to everyone, regardless of their financial
                status.
              </p>

              {/* Action Buttons */}
              <div
                className="
                  flex
                  w-full
                  flex-col
                  gap-3
                  pt-2
                  sm:w-auto
                  sm:flex-row
                  sm:items-center
                  sm:gap-4
                "
              >
                <Link
                  href="/book-appointment"
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    bg-[#86000D]
                    px-5
                    text-sm
                    font-semibold
                    leading-5
                    text-white
                    shadow-[0_1px_2px_rgba(0,0,0,0.05)]
                    transition-opacity
                    hover:opacity-90
                    sm:w-auto
                    sm:px-6
                  "
                >
                  <FaCalendarCheck size={15} />
                  <span>Book an Appointment</span>
                </Link>

                <Link
                  href="/doctors"
                  className="
                    flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    bg-[#EFEDED]
                    px-5
                    text-sm
                    font-semibold
                    leading-5
                    text-[#1B1C1C]
                    shadow-[0_1px_2px_rgba(0,0,0,0.05)]
                    transition-colors
                    hover:bg-[#e5e2e2]
                    sm:w-auto
                    sm:px-6
                  "
                >
                  <FaUserDoctor size={17} className="text-[#86000D]" />
                  <span>Find a Doctor</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* IMPACT STATS OVERLAY */}
        <div
          className="
            relative
            z-10
            -mt-20
            px-4
            pb-20
            sm:-mt-20
            sm:px-6
            sm:pb-24
            md:-mt-20
            md:px-8
            lg:-mt-24
            lg:px-10
            xl:px-12
          "
        >
          <ImpactStats />
        </div>
      </section>

      <AboutSection />
      <DepartmentsSection />
      <TopFacilities />
      <EventsSection />
      <SuccessStories />
      <NewsUpdates updates={updates} />
      <ContactUsCard />
      <Map />
    </main>
  );
}