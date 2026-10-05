import Link from "next/link";
import Image from "next/image";
import {
    FaArrowRight,
    FaCheckCircle,
    FaHeartbeat,
    FaHandHoldingHeart,
    FaPeopleCarry,
    FaShieldAlt,
    FaStethoscope,
    FaUserMd,
} from "react-icons/fa";
import {
    MdHealthAndSafety,
    MdLocalHospital,
    MdOutlineMedicalServices,
} from "react-icons/md";

import LeadershipMessages from "@/app/components/AboutContent/leadership_message";
import Supporters from "@/app/components/AboutContent/supporters";
import OfficeBearers from "@/app/components/AboutContent/office_bearers";
import HealthPartners from "@/app/components/AboutContent/health_partners";
import SuccessStories from "@/app/components/AboutContent/success_stories";
import DepartmentsSection from "@/app/components/departmentPageComponents/countedDepartment";
import EventsSection from "@/app/components/landingPageComponents/events_section";

// ============================================================
// SHARED HOMEPAGE CONTAINER
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
// DUMMY DATA
// ============================================================

const aboutData = {
    title: "About Bashir Memorial Welfare Hospital",
    subtitle:
        "Compassionate healthcare with a commitment to patient welfare, dignity, and the community we serve.",

    introduction: {
        title: "Who We Are",
        description:
            "Bashir Memorial Welfare Hospital is a newly established healthcare institution committed to providing accessible, compassionate, and quality healthcare services to the community. Our goal is to create a trusted healthcare environment where every patient is treated with dignity, care, and respect.",
        descriptionTwo:
            "As a growing hospital, we are building our services around the needs of our patients while continuously working toward expanding our healthcare facilities, medical services, and welfare initiatives.",
    },

    mission:
        "To provide compassionate, accessible, and quality healthcare while placing the needs, dignity, and well-being of every patient at the heart of our services.",

    vision:
        "To become a trusted healthcare institution known for quality medical care, patient welfare, professional excellence, and meaningful service to the community.",
};

// ============================================================
// FOUNDER
// ============================================================

const founder = {
    name: "Dr. Bashir Ahmed",
    designation: "Founder & Chairman",
    image: "/images/about/founder.jpg",
    message:
        "Our vision for Bashir Memorial Welfare Hospital is to create a place where every individual can seek healthcare with confidence, dignity, and compassion. We believe that healthcare is not simply about treating illness; it is about caring for people and supporting their journey toward a healthier life.",
    biography:
        "The founder has envisioned BMWH as a growing healthcare institution dedicated to serving the community through quality medical services and patient-centered care.",
};

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
// DEPARTMENTS
// ============================================================

const departments = [
    {
        id: 1,
        name: "General Medicine",
        description:
            "Comprehensive medical care for the diagnosis, treatment, and management of common health conditions.",
        icon: <FaStethoscope />,
    },
    {
        id: 2,
        name: "General Surgery",
        description:
            "Surgical evaluation and treatment supported by professional medical and nursing care.",
        icon: <MdLocalHospital />,
    },
    {
        id: 3,
        name: "Pediatrics",
        description:
            "Healthcare services focused on the health and well-being of infants, children, and adolescents.",
        icon: <FaHeartbeat />,
    },
    {
        id: 4,
        name: "Gynecology",
        description:
            "Specialized healthcare services supporting women's health and well-being.",
        icon: <MdOutlineMedicalServices />,
    },
];

// ============================================================
// JOURNEY
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
// PAGE
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
            {/* ==================================================
                HERO
            ================================================== */}

            <section
                id="about-overview"
                className="
                    relative
                    scroll-mt-28
                    overflow-hidden
                    bg-white
                    py-16
                    sm:py-20
                    lg:py-24
                    xl:py-28
                    2xl:py-32
                "
            >
                <div className={containerClass}>
                    <div
                        className="
                            grid
                            w-full
                            items-center
                            gap-10
                            lg:grid-cols-2
                            lg:gap-14
                            xl:gap-16
                            2xl:gap-20
                        "
                    >
                        {/* Content */}

                        <div className="max-w-2xl">
                            <div
                                className="
                                    mb-4
                                    flex
                                    items-center
                                    gap-2
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.2em]
                                    text-[#911824]
                                    sm:text-xs
                                "
                            >
                                <span className="h-px w-8 bg-[#911824] sm:w-10" />

                                <span>About BMWH</span>
                            </div>

                            <h1
                                className="
                                    text-4xl
                                    font-bold
                                    leading-[1.1]
                                    tracking-tight
                                    text-[#1B1C1C]
                                    sm:text-5xl
                                    lg:text-[52px]
                                    xl:text-[58px]
                                    2xl:text-[64px]
                                "
                            >
                                Caring for People,
                                <span className="block text-[#911824]">
                                    Serving the Community
                                </span>
                            </h1>

                            <p
                                className="
                                    mt-5
                                    max-w-2xl
                                    text-base
                                    leading-7
                                    text-[#5B403D]
                                    sm:mt-6
                                    sm:text-lg
                                    sm:leading-8
                                    xl:text-[19px]
                                "
                            >
                                {aboutData.subtitle}
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
                                <Link
                                    href="/pages/contact"
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        bg-[#911824]
                                        px-6
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition-all
                                        duration-300
                                        hover:bg-[#7d1420]
                                        focus:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-[#911824]
                                        focus-visible:ring-offset-2
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
                                    href="/pages/departments"
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        border
                                        border-[#D9D0CE]
                                        px-6
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-[#5B403D]
                                        transition-all
                                        duration-300
                                        hover:border-[#911824]
                                        hover:bg-[#911824]
                                        hover:text-white
                                        focus:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-[#911824]
                                        focus-visible:ring-offset-2
                                        sm:px-7
                                        sm:py-3.5
                                    "
                                >
                                    Our Departments
                                </Link>
                            </div>
                        </div>

                        {/* Image */}

                        <div className="relative">
                            <div
                                className="
                                    relative
                                    h-[300px]
                                    w-full
                                    overflow-hidden
                                    rounded-2xl
                                    bg-gray-100
                                    sm:h-[380px]
                                    lg:h-[440px]
                                    xl:h-[500px]
                                    2xl:h-[560px]
                                "
                            >
                                <Image
                                    src="/images/buildingImage.jpeg"
                                    alt="Bashir Memorial Welfare Hospital"
                                    fill
                                    sizes="
                                    (max-width: 1024px) 100vw,
                                    (max-width: 1536px) 50vw,
                                    680px
                                "
                                    className="object-cover"
                                />
                            </div>

                            {/* Floating Card */}

                            <div
                                className="
                                    absolute
                                    -bottom-5
                                    left-4
                                    hidden
                                    rounded-xl
                                    bg-white
                                    p-4
                                    shadow-xl
                                    sm:block
                                    lg:-left-6
                                    lg:p-5
                                "
                            >
                                <div className="flex items-center gap-3 lg:gap-4">
                                    <div
                                        className="
                                            flex
                                            h-11
                                            w-11
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-[#911824]/10
                                            text-lg
                                            text-[#911824]
                                            lg:h-12
                                            lg:w-12
                                            lg:text-xl
                                        "
                                    >
                                        <FaHeartbeat aria-hidden="true" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-[#1B1C1C]">
                                            Patient-Centered
                                        </p>

                                        <p className="text-xs text-[#6B5A58]">
                                            Healthcare & Welfare
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================================================
                WHO WE ARE
            ================================================== */}

            <section
                id="who-we-are"
                className="
                    scroll-mt-28
                    bg-[#FBF9F9]
                    py-16
                    sm:py-20
                    lg:py-24
                    xl:py-28
                    2xl:py-32
                "
            >
                <div className={containerClass}>
                    <div
                        className="
                            grid
                            gap-8
                            lg:grid-cols-[0.8fr_1.2fr]
                            lg:gap-14
                            xl:gap-20
                        "
                    >
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <span className="h-px w-8 bg-[#911824]" />

                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#911824] sm:text-xs">
                                    Who We Are
                                </p>
                            </div>

                            <h2
                                className="
                                    max-w-xl
                                    text-3xl
                                    font-bold
                                    leading-tight
                                    tracking-tight
                                    text-[#1B1C1C]
                                    sm:text-4xl
                                    lg:text-[42px]
                                    xl:text-[46px]
                                "
                            >
                                A growing hospital with a clear purpose
                            </h2>
                        </div>

                        <div
                            className="
                                space-y-5
                                text-base
                                leading-7
                                text-[#5B403D]
                                sm:text-[17px]
                                sm:leading-8
                            "
                        >
                            <p>
                                {aboutData.introduction.description}
                            </p>

                            <p>
                                {aboutData.introduction.descriptionTwo}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================================================
                MISSION & VISION
            ================================================== */}

            <section
                id="mission-vision"
                className="
                    scroll-mt-28
                    bg-white
                    py-16
                    sm:py-20
                    lg:py-24
                    xl:py-28
                    2xl:py-32
                "
            >
                <div className={containerClass}>
                    <div className="mb-10 text-center sm:mb-12">
                        <div className="mb-3 flex items-center justify-center gap-2">
                            <span className="h-px w-8 bg-[#911824]" />

                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#911824] sm:text-xs">
                                What Guides Us
                            </p>

                            <span className="h-px w-8 bg-[#911824]" />
                        </div>

                        <h2
                            className="
                                text-3xl
                                font-bold
                                tracking-tight
                                text-[#1B1C1C]
                                sm:text-4xl
                                lg:text-[42px]
                                xl:text-[46px]
                            "
                        >
                            Our Mission & Vision
                        </h2>
                    </div>

                    <div className="grid gap-5 sm:gap-6 lg:grid-cols-2 xl:gap-8">
                        {/* Mission */}

                        <div
                            id="mission"
                            className="
                                scroll-mt-28
                                min-h-70
                                border
                                border-[#E7DEDC]
                                bg-[#FBF9F9]
                                p-7
                                sm:p-8
                                lg:p-10
                                xl:min-h-80
                            "
                        >
                            <div
                                className="
                                    mb-6
                                    flex
                                    h-13
                                    w-13
                                    items-center
                                    justify-center
                                    bg-[#911824]
                                    text-xl
                                    text-white
                                    sm:h-14
                                    sm:w-14
                                    sm:text-2xl
                                "
                            >
                                <FaHeartbeat aria-hidden="true" />
                            </div>

                            <h3 className="mb-4 text-2xl font-bold text-[#1B1C1C]">
                                Our Mission
                            </h3>

                            <p className="leading-7 text-[#5B403D] sm:leading-8">
                                {aboutData.mission}
                            </p>
                        </div>

                        {/* Vision */}

                        <div
                            id="vision"
                            className="
                                scroll-mt-28
                                min-h-70
                                bg-[#911824]
                                p-7
                                text-white
                                sm:p-8
                                lg:p-10
                                xl:min-h-80
                            "
                        >
                            <div
                                className="
                                    mb-6
                                    flex
                                    h-13
                                    w-13
                                    items-center
                                    justify-center
                                    bg-white/10
                                    text-xl
                                    sm:h-14
                                    sm:w-14
                                    sm:text-2xl
                                "
                            >
                                <MdHealthAndSafety aria-hidden="true" />
                            </div>

                            <h3 className="mb-4 text-2xl font-bold">
                                Our Vision
                            </h3>

                            <p className="leading-7 text-white/80 sm:leading-8">
                                {aboutData.vision}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================================================
                FOUNDER MESSAGE
            ================================================== */}

            <section
                id="founder"
                className="
                    scroll-mt-28
                    bg-[#FBF9F9]
                    py-16
                    sm:py-20
                    lg:py-24
                    xl:py-28
                    2xl:py-32
                "
            >
                <div className={containerClass}>
                    <div
                        className="
                            grid
                            items-center
                            gap-10
                            lg:grid-cols-[0.75fr_1.25fr]
                            lg:gap-14
                            xl:gap-20
                        "
                    >
                        {/* Founder Image */}

                        <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
                            <div
                                className="
                                    relative
                                    aspect-4/5
                                    w-full
                                    overflow-hidden
                                    bg-gray-100
                                "
                            >
                                <Image
                                    src={founder.image}
                                    alt={founder.name}
                                    fill
                                    sizes="
                                        (max-width: 1024px) 100vw,
                                        (max-width: 1536px) 35vw,
                                        450px
                                    "
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Message */}

                        <div className="max-w-3xl">
                            <div className="mb-3 flex items-center gap-2">
                                <span className="h-px w-8 bg-[#911824]" />

                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#911824] sm:text-xs">
                                    From Our Founder
                                </p>
                            </div>

                            <h2
                                className="
                                    mb-6
                                    text-3xl
                                    font-bold
                                    leading-tight
                                    tracking-tight
                                    text-[#1B1C1C]
                                    sm:text-4xl
                                    lg:text-[42px]
                                    xl:text-[46px]
                                "
                            >
                                A vision built around people
                            </h2>

                            <blockquote
                                className="
                                    border-l-4
                                    border-[#911824]
                                    pl-5
                                    text-base
                                    italic
                                    leading-7
                                    text-[#5B403D]
                                    sm:pl-6
                                    sm:text-lg
                                    sm:leading-8
                                "
                            >
                                “{founder.message}”
                            </blockquote>

                            <div className="mt-6">
                                <h3 className="font-bold text-[#1B1C1C]">
                                    {founder.name}
                                </h3>

                                <p className="mt-1 text-sm text-[#911824]">
                                    {founder.designation}
                                </p>
                            </div>

                            <Link
                                href="/about/founder"
                                className="
                                    mt-6
                                    inline-flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-semibold
                                    text-[#911824]
                                    transition-all
                                    duration-300
                                    hover:gap-3
                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-[#911824]
                                    focus-visible:ring-offset-2
                                "
                            >
                                Read More About Our Founder

                                <FaArrowRight
                                    aria-hidden="true"
                                    size={13}
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================================================
                LEADERSHIP
            ================================================== */}

            <section
                id="leadership"
                className="scroll-mt-28"
            >
                <LeadershipMessages />
            </section>

            {/* ==================================================
                OFFICE BEARERS
            ================================================== */}

            <section
                id="office-bearers"
                className="scroll-mt-28"
            >
                <OfficeBearers />
            </section>

            {/* ==================================================
                PATIENT WELFARE
            ================================================== */}

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

            {/* ==================================================
                DEPARTMENTS
            ================================================== */}

            <section
                id="departments"
                className="scroll-mt-28"
            >
                <DepartmentsSection />
            </section>

            {/* ==================================================
                OUR JOURNEY
            ================================================== */}

            <section
                id="our-journey"
                className="
                    scroll-mt-28
                    bg-[#FBF9F9]
                    py-16
                    sm:py-20
                    lg:py-24
                    xl:py-28
                    2xl:py-32
                "
            >
                <div className={containerClass}>
                    <div className="mb-10 text-center sm:mb-14">
                        <div className="mb-3 flex items-center justify-center gap-2">
                            <span className="h-px w-8 bg-[#911824]" />

                            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#911824] sm:text-xs">
                                Our Journey
                            </p>

                            <span className="h-px w-8 bg-[#911824]" />
                        </div>

                        <h2
                            className="
                                text-3xl
                                font-bold
                                tracking-tight
                                text-[#1B1C1C]
                                sm:text-4xl
                                lg:text-[42px]
                                xl:text-[46px]
                            "
                        >
                            Building Our Future
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#5B403D] sm:text-base">
                            As a newly established hospital, every step marks
                            the beginning of our journey toward serving the
                            community better.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}

                        <div
                            aria-hidden="true"
                            className="
                                absolute
                                left-1/2
                                top-0
                                hidden
                                h-full
                                w-px
                                -translate-x-1/2
                                bg-[#E1D8D6]
                                md:block
                            "
                        />

                        <div className="space-y-10 xl:space-y-14">
                            {journey.map((item, index) => (
                                <div
                                    key={`${item.year}-${index}`}
                                    className="
                                        relative
                                        grid
                                        items-center
                                        gap-8
                                        md:grid-cols-2
                                        md:gap-16
                                    "
                                >
                                    {/* Left / Right Content */}

                                    <div
                                        className={
                                            index % 2 === 0
                                                ? "md:text-right"
                                                : "md:order-2 md:text-left"
                                        }
                                    >
                                        <span className="text-sm font-bold text-[#911824]">
                                            {item.year}
                                        </span>

                                        <h3 className="mt-2 text-xl font-bold text-[#1B1C1C] xl:text-2xl">
                                            {item.title}
                                        </h3>

                                        <p className="mt-3 text-sm leading-7 text-[#5B403D] sm:text-base">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Timeline Point */}

                                    <div
                                        className={`
                                            hidden
                                            md:flex
                                            ${index % 2 === 0
                                                ? "justify-start"
                                                : "order-1 justify-end"
                                            }
                                        `}
                                    >
                                        <div
                                            className="
                                                relative
                                                z-10
                                                flex
                                                h-12
                                                w-12
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-[#911824]
                                                text-white
                                                shadow-lg
                                                ring-8
                                                ring-[#FBF9F9]
                                            "
                                        >
                                            <FaCheckCircle
                                                aria-hidden="true"
                                                size={16}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================================================
                SUCCESS STORIES
            ================================================== */}

            <section
                id="success-stories"
                className="scroll-mt-28"
            >
                <SuccessStories />
            </section>

            {/* ==================================================
                SUPPORTERS
            ================================================== */}

            <section
                id="supporters"
                className="scroll-mt-28"
            >
                <Supporters />
            </section>

            {/* ==================================================
                HEALTH PARTNERS
            ================================================== */}

            <section
                id="health-partners"
                className="scroll-mt-28"
            >
                <HealthPartners />
            </section>

            {/* ==================================================
                EVENTS
            ================================================== */}

            <section
                id="events"
                className="scroll-mt-28"
            >
                <EventsSection />
            </section>

            {/* ==================================================
                COMPLIANCE
            ================================================== */}

            <section
                id="compliance"
                className="
                    scroll-mt-28
                    bg-white
                    py-16
                    sm:py-20
                    lg:py-24
                    xl:py-28
                "
            >
                <div className={containerClass}>
                    <div
                        className="
                            flex
                            flex-col
                            items-start
                            justify-between
                            gap-6
                            border
                            border-[#E7DEDC]
                            bg-[#FBF9F9]
                            p-7
                            sm:p-8
                            md:flex-row
                            md:items-center
                            lg:p-10
                            xl:p-12
                        "
                    >
                        <div className="flex items-start gap-5">
                            <div
                                className="
                                    hidden
                                    h-14
                                    w-14
                                    shrink-0
                                    items-center
                                    justify-center
                                    bg-[#911824]/10
                                    text-2xl
                                    text-[#911824]
                                    sm:flex
                                "
                            >
                                <FaShieldAlt aria-hidden="true" />
                            </div>

                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#911824] sm:text-xs">
                                    Our Standards
                                </p>

                                <h2
                                    className="
                                        mt-2
                                        text-2xl
                                        font-bold
                                        text-[#1B1C1C]
                                        sm:text-3xl
                                    "
                                >
                                    Committed to Safe & Ethical Healthcare
                                </h2>

                                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5B403D] sm:text-base">
                                    BMWH is committed to maintaining high
                                    standards of patient safety, dignity,
                                    privacy, ethical practice, and quality
                                    healthcare.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/compliance"
                            className="
                                inline-flex
                                shrink-0
                                items-center
                                gap-2
                                bg-[#911824]
                                px-6
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                transition-all
                                duration-300
                                hover:bg-[#7d1420]
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-[#911824]
                                focus-visible:ring-offset-2
                            "
                        >
                            View Compliance

                            <FaArrowRight
                                aria-hidden="true"
                                size={13}
                            />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ==================================================
                FINAL CTA
            ================================================== */}

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