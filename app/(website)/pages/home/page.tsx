import ImpactStats from "@/app/components/landingPageComponents/impactStates";
import AboutSection from "@/app/components/landingPageComponents/aboutsection";
import NewsUpdates from "@/app/components/landingPageComponents/latestNewsSection";
import DepartmentsSection from "@/app/components/departmentPageComponents/countedDepartment";
import SuccessStories from "@/app/components/AboutContent/success_stories";
import EventsSection from "@/app/components/landingPageComponents/events_section";
import TopFacilities from "@/app/components/landingPageComponents/hospital_facilities";
import AchievementsAwards from "@/app/components/landingPageComponents/achievementSection";
import HeroBanner from "@/app/components/landingPageComponents/HeroBanner";

import { getTopThreeNews } from "@/lib/data/news/news.js";

interface NewsUpdate {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    image_url: string | null;
    category: string;
    published_at: string;
}

export default async function Home() {
    let updates: NewsUpdate[] = [];

    try {
        updates = (await getTopThreeNews()) as NewsUpdate[];
    } catch (error) {
        console.error("Failed to fetch news updates:", error);
    }

    return (
        <main className="w-full overflow-x-hidden animate-fade-in-up">

            {/* =====================================================
                HERO + IMPACT STATS
            ===================================================== */}
            <section className="w-full bg-[#FBF9F9]">

                <HeroBanner />

                <div
                    className="
                        relative
                        z-10
                        -mt-16
                        pb-10

                        sm:-mt-20
                        sm:pb-20

                        md:-mt-20

                        lg:-mt-24
                        lg:pb-24

                        xl:pb-28

                        2xl:pb-32
                    "
                >
                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-7xl
                            px-5

                            sm:px-8

                            lg:px-10

                            xl:px-12

                            2xl:max-w-360
                            2xl:px-16
                        "
                    >
                        <ImpactStats />
                    </div>
                </div>

            </section>

            {/* =====================================================
                ABOUT
            ===================================================== */}
            <AboutSection />

            {/* =====================================================
                DEPARTMENTS
            ===================================================== */}
            <DepartmentsSection />

            {/* =====================================================
                FACILITIES
            ===================================================== */}
            <TopFacilities />

            {/* =====================================================
                EVENTS
            ===================================================== */}
            <EventsSection />

            {/* =====================================================
                SUCCESS STORIES
            ===================================================== */}
            <SuccessStories />

            {/* =====================================================
                ACHIEVEMENTS & AWARDS
            ===================================================== */}
            <AchievementsAwards />

            {/* =====================================================
                NEWS
            ===================================================== */}
            <NewsUpdates updates={updates} />

        </main>
    );
}