import Link from "next/link";
import {
    FaArrowRight,
    FaCheckCircle,
    FaHeartbeat,
    FaHandHoldingHeart,
    FaPeopleCarry,
    FaShieldAlt,
} from "react-icons/fa";

import WhoWeAre from "@/app/components/AboutContent/WhoWeAre";
import LeadershipMessages from "@/app/components/AboutContent/leadership_message";
import Supporters from "@/app/components/AboutContent/supporters";
import OfficeBearers from "@/app/components/AboutContent/office_bearers";
import HealthPartners from "@/app/components/AboutContent/health_partners";
import SuccessStories from "@/app/components/AboutContent/success_stories";
import DepartmentsSection from "@/app/components/departmentPageComponents/countedDepartment";
import EventsSection from "@/app/components/landingPageComponents/events_section";
import AboutOverview from "@/app/components/AboutContent/banner_section";
import MissionVision from "@/app/components/AboutContent/MissionVision";
import FounderMessage from "@/app/components/AboutContent/FounderMessage";
import ComplianceCertificates from "@/app/components/AboutContent/complaince";
import TimelineHistory from "@/app/components/AboutContent/timeline_history";


export const revalidate = 86400;


// ============================================================
// SHARED CONTAINER
// ============================================================

const containerClass = `
    mx-auto
    w-full
    max-w-7xl
    px-5
    sm:px-8
    lg:px-10
    xl:px-12
    2xl:max-w-[1440px]
    2xl:px-16
    3xl:max-w-[1600px]
`;

// ============================================================
// PATIENT WELFARE
// ============================================================

const welfareItems = [
    {
        icon: <FaHandHoldingHeart />,
        title: "Compassionate Care",
        description:
            "We believe every patient deserves respectful, compassionate, and dignified treatment.",
    },
    {
        icon: <FaPeopleCarry />,
        title: "Patient Support",
        description:
            "Our approach places the needs and well-being of patients and their families at the center of care.",
    },
    {
        icon: <FaHeartbeat />,
        title: "Accessible Healthcare",
        description:
            "We aim to make essential healthcare services more accessible to the communities we serve.",
    },
    {
        icon: <FaShieldAlt />,
        title: "Patient Dignity",
        description:
            "We are committed to protecting the privacy, dignity, safety, and rights of every patient.",
    },
];

// ============================================================
// HOSPITAL JOURNEY
// Keep these milestones accurate to the hospital's history.
// ============================================================

const journey = [
    {
        year: "2026",
        title: "Hospital Established",
        description:
            "Bashir Memorial Welfare Hospital begins its journey to serve the healthcare needs of the community.",
    },
    {
        year: "2026",
        title: "Healthcare Services Launched",
        description:
            "Initial healthcare services and departments become available to patients.",
    },
    {
        year: "2026",
        title: "Community Engagement",
        description:
            "BMWH begins engaging with the community through healthcare and awareness initiatives.",
    },
];

// ============================================================
// ABOUT PAGE
// ============================================================

export default function AboutPage() {
    return (
        <main
            id="about"
            className="
            w-full
            overflow-x-hidden
            bg-[#FBF9F9]
                text-[#1B1C1C]
                animate-fade-in-up
            "
            >
            {/* HERO */}
            <AboutOverview />

            {/* WHO WE ARE */}
            <WhoWeAre />

            {/* MISSION & VISION */}
            <MissionVision />

            {/* FOUNDER MESSAGE */}
            <FounderMessage />

            {/* LEADERSHIP MESSAGES */}
            <section
                id="leadership"
                className="scroll-mt-28"
            >
                <LeadershipMessages />
            </section>


            
            {/* OUR JOURNEY TIMELINE */}
            <section>
                <TimelineHistory/>
            </section>

            {/* OFFICE BEARERS */}
            <section
                id="office-bearers"
                className="scroll-mt-28"
            >
                <OfficeBearers />
            </section>

            {/* PATIENT WELFARE */}
            <section
                id="patient-welfare"
                className="
                    scroll-mt-28
                    bg-[#911824]
                    py-16
                    text-white
                    sm:py-20
                    lg:py-24
                    xl:py-28
                    2xl:py-32
                "
            >
                <div className={containerClass}>
                    <div className="mb-10 max-w-3xl sm:mb-14">
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-px w-8 bg-white/70" />

                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 sm:text-xs">
                                Our Commitment
                            </p>
                        </div>

                        <h2
                            className="
                                text-3xl
                                font-bold
                                leading-tight
                                sm:text-4xl
                                lg:text-[42px]
                                xl:text-[46px]
                            "
                        >
                            Patient Welfare at the Heart of Our Care
                        </h2>

                        <p className="mt-5 text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
                            At BMWH, healthcare goes beyond diagnosis and
                            treatment. We believe that every patient deserves
                            dignity, compassion, respect, and support throughout
                            their healthcare journey.
                        </p>
                    </div>

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-5
                            sm:grid-cols-2
                            sm:gap-6
                            lg:grid-cols-4
                            xl:gap-7
                            2xl:gap-8
                        "
                    >
                        {welfareItems.map((item) => (
                            <article
                            key={item.title}
                            className="
                                    min-h-57.5
                                    border
                                    border-white/10
                                    bg-white/10
                                    p-6
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:bg-white/[0.14]
                                    sm:p-7
                                    xl:min-h-62.5
                                    "
                            >
                                <div
                                    aria-hidden="true"
                                    className="mb-5 text-3xl text-white"
                                >
                                    {item.icon}
                                </div>

                                <h3 className="mb-3 text-lg font-bold">
                                    {item.title}
                                </h3>

                                <p className="text-sm leading-7 text-white/70">
                                    {item.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* DEPARTMENTS */}
            <section
                id="departments"
                className="scroll-mt-28"
            >
                <DepartmentsSection />
            </section>

            {/* SUCCESS STORIES */}
            <section
                id="success-stories"
                className="scroll-mt-28"
            >
                <SuccessStories />
            </section>

            {/* SUPPORTERS */}
            <section
                id="supporters"
                className="scroll-mt-28"
            >
                <Supporters />
            </section>

            {/* HEALTH PARTNERS */}
            <section
                id="health-partners"
                className="scroll-mt-28"
            >
                <HealthPartners />
            </section>

            {/* EVENTS */}
            <section
                id="events"
                className="scroll-mt-28"
            >
                <EventsSection />
            </section>

            {/* COMPLIANCE CERTIFICATES */}
            <section
                id="compliance"
                className="scroll-mt-28"
            >
                <ComplianceCertificates />
            </section>

            {/* FINAL CALL TO ACTION */}
            <section
                id="about-cta"
                className="
                    scroll-mt-28
                    bg-[#911824]
                    py-16
                    text-white
                    sm:py-20
                    lg:py-24
                    xl:py-28
                    2xl:py-32
                "
            >
                <div className={containerClass}>
                    <div className="mx-auto max-w-3xl text-center">
                        <h2
                            className="
                                text-3xl
                                font-bold
                                leading-tight
                                sm:text-4xl
                                lg:text-[42px]
                                xl:text-[46px]
                            "
                        >
                            Healthcare With Compassion
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
                            Whether you need medical care, want to support our
                            mission, or simply want to learn more about BMWH,
                            we are here to help.
                        </p>

                        <div className="mt-7 flex flex-wrap justify-center gap-3 sm:mt-8 sm:gap-4">
                            <Link
                                href="/contact"
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    bg-white
                                    px-6
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-[#911824]
                                    transition-all
                                    duration-300
                                    hover:bg-gray-100
                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-white
                                    focus-visible:ring-offset-2
                                    focus-visible:ring-offset-[#911824]
                                    sm:px-7
                                    sm:py-3.5
                                "
                            >
                                Contact Us
                                <FaArrowRight
                                    aria-hidden="true"
                                    size={13}
                                />
                            </Link>

                            <Link
                                href="/donate"
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    border
                                    border-white/40
                                    px-6
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition-all
                                    duration-300
                                    hover:bg-white
                                    hover:text-[#911824]
                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-white
                                    focus-visible:ring-offset-2
                                    focus-visible:ring-offset-[#911824]
                                    sm:px-7
                                    sm:py-3.5
                                "
                            >
                                Support Our Mission
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
