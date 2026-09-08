import Link from "next/link";
import Image from "next/image";
import {
    FaArrowRight,
    FaCheckCircle,
    FaChevronRight,
    FaHeartbeat,
    FaHandHoldingHeart,
    FaHospital,
    FaMedal,
    FaPeopleCarry,
    FaShieldAlt,
    FaStethoscope,
    FaUserMd,
} from "react-icons/fa";
import {
    MdHealthAndSafety,
    MdLocalHospital,
    MdOutlineEmojiEvents,
    MdOutlineMedicalServices,
} from "react-icons/md";
import Supporters from "@/app/components/AboutContent/supporters";
import HealthPartners from "@/app/components/AboutContent/health_partners";
import SuccessStories from "@/app/components/AboutContent/success_stories";
import DepartmentsSection from "@/app/components/departmentPageComponents/countedDepartment";
import EventsSection from "@/app/components/landingPageComponents/events_section";


// ============================================================
// DUMMY DATA
// Replace these objects with backend/API data later.
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
// ACHIEVEMENTS / JOURNEY
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



const recentEvents = [
    {
        id: 1,
        title: "Community Health Awareness Program",
        date: "15 August 2026",
        location: "BMWH Hospital",
        description:
            "A community-focused healthcare awareness initiative aimed at promoting better health practices.",
        image: "/images/events/event-1.jpg",
    },
    {
        id: 2,
        title: "Medical Awareness Camp",
        date: "05 July 2026",
        location: "BMWH Hospital",
        description:
            "An awareness and healthcare initiative designed to connect the community with medical professionals.",
        image: "/images/events/event-2.jpg",
    },
    {
        id: 3,
        title: "Healthcare Community Gathering",
        date: "20 June 2026",
        location: "BMWH Hospital",
        description:
            "A community gathering bringing healthcare professionals and members of the community together.",
        image: "/images/events/event-3.jpg",
    },
];


// ============================================================
// PAGE
// ============================================================

export default function AboutPage() {
    return (
        <main className="bg-[#FBF9F9] text-gray-800 animate-fade-in-up">

            {/* ==================================================
                HERO
            ================================================== */}

            <section className="relative overflow-hidden bg-white">

                <div className="mx-auto flex min-h-140 max-w-7xl items-center px-6 py-20 lg:px-10">

                    <div className="grid w-full items-center gap-14 lg:grid-cols-2">

                        {/* Content */}

                        <div>
                            <div className="mb-5 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#911824]">
                                <span className="h-0.5 w-10 bg-[#911824]" />
                                About BMWH
                            </div>

                            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
                                Caring for People,
                                <span className="block text-[#911824]">
                                    Serving the Community
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                                {aboutData.subtitle}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">

                                <Link
                                    href="/pages/contact"
                                    className="btn border-none bg-[#911824] px-7 text-white hover:bg-[#7d1420]"
                                >
                                    Contact Us
                                    <FaArrowRight />
                                </Link>

                                <Link
                                    href="/pages/departments"
                                    className="btn btn-outline border-gray-300 px-7 text-gray-700 hover:border-[#911824] hover:bg-[#911824] hover:text-white"
                                >
                                    Our Departments
                                </Link>

                            </div>
                        </div>


                        {/* Image Placeholder */}


                            <div className="relative">
                                <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl bg-gray-100">
                                    <Image
                                        src="/images/buildingImage.jpeg"
                                        alt="Bashir Memorial Welfare Hospital"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover"
                                    />
                                </div>

                            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-5 shadow-xl sm:block">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#911824]/10 text-xl text-[#911824]">
                                        <FaHeartbeat />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            Patient-Centered
                                        </p>
                                        <p className="text-xs text-gray-500">
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

            <section className="py-20 lg:py-28">

                <div className="mx-auto max-w-275 px-6 lg:px-10">

                    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">

                        <div>
                            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[#911824]">
                                Who We Are
                            </p>

                            <h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                                A growing hospital with a clear purpose
                            </h2>
                        </div>

                        <div className="space-y-5 text-[16px] leading-8 text-gray-600">
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

            <section className="bg-white py-20 lg:py-24">

                <div className="mx-auto max-w-275 px-6 lg:px-10">

                    <div className="mb-12 text-center">

                        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[#911824]">
                            What Guides Us
                        </p>

                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                            Our Mission & Vision
                        </h2>

                    </div>


                    <div className="grid gap-7 md:grid-cols-2">

                        {/* Mission */}

                        <div className="rounded-3xl bg-[#FBF9F9] p-8 md:p-10">

                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#911824] text-2xl text-white">
                                <FaHeartbeat />
                            </div>

                            <h3 className="mb-4 text-2xl font-bold text-gray-900">
                                Our Mission
                            </h3>

                            <p className="leading-8 text-gray-600">
                                {aboutData.mission}
                            </p>

                        </div>


                        {/* Vision */}

                        <div className="rounded-3xl bg-[#911824] p-8 text-white md:p-10">

                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                                <MdHealthAndSafety />
                            </div>

                            <h3 className="mb-4 text-2xl font-bold">
                                Our Vision
                            </h3>

                            <p className="leading-8 text-white/80">
                                {aboutData.vision}
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==================================================
                FOUNDER MESSAGE
            ================================================== */}

            <section className="py-20 lg:py-28">

                <div className="mx-auto max-w-275 px-6 lg:px-10">

                    <div className="grid items-center gap-12 lg:grid-cols-[0.75fr_1.25fr]">

                        {/* Founder Image */}

                        <div className="relative mx-auto w-full max-w-95">

                            <div className="aspect-4/5 overflow-hidden rounded-3xl bg-gray-100">

                                {/*
                                  Replace later with:

                                  <Image
                                      src={founder.image}
                                      alt={founder.name}
                                      fill
                                      className="object-cover"
                                  />
                                */}

                                <div className="flex h-full items-center justify-center text-center text-gray-400">
                                    <div>
                                        <FaUserMd className="mx-auto mb-4 text-5xl" />
                                        <p className="text-sm">
                                            Founder Image
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>


                        {/* Message */}

                        <div>

                            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[#911824]">
                                From Our Founder
                            </p>

                            <h2 className="mb-7 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                                A vision built around people
                            </h2>

                            <blockquote className="border-l-4 border-[#911824] pl-6 text-lg italic leading-8 text-gray-600">
                                “{founder.message}”
                            </blockquote>

                            <div className="mt-7">
                                <h3 className="font-bold text-gray-900">
                                    {founder.name}
                                </h3>

                                <p className="mt-1 text-sm text-[#911824]">
                                    {founder.designation}
                                </p>
                            </div>

                            <Link
                                href="/about/founder"
                                className="mt-7 inline-flex items-center gap-2 font-semibold text-[#911824] hover:gap-3"
                            >
                                Read More About Our Founder
                                <FaArrowRight />
                            </Link>

                        </div>

                    </div>

                </div>

            </section>


            {/* ==================================================
                PATIENT WELFARE
            ================================================== */}

            <section className="bg-[#911824] py-20 text-white lg:py-24">

                <div className="mx-auto max-w-275 px-6 lg:px-10">

                    <div className="mb-14 max-w-3xl">

                        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white/70">
                            Our Commitment
                        </p>

                        <h2 className="text-3xl font-bold md:text-4xl">
                            Patient Welfare at the Heart of Our Care
                        </h2>

                        <p className="mt-5 leading-8 text-white/75">
                            At BMWH, healthcare goes beyond diagnosis and
                            treatment. We believe that every patient deserves
                            dignity, compassion, respect, and support throughout
                            their healthcare journey.
                        </p>

                    </div>


                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {welfareItems.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-2xl border border-white/10 bg-white/10 p-6"
                            >

                                <div className="mb-5 text-3xl">
                                    {item.icon}
                                </div>

                                <h3 className="mb-3 text-lg font-bold">
                                    {item.title}
                                </h3>

                                <p className="text-sm leading-7 text-white/70">
                                    {item.description}
                                </p>

                            </div>
                        ))}

                    </div>

                </div>

            </section>


            {/* ==================================================
                DEPARTMENTS
            ================================================== */}



            {/* <section className="bg-white py-20 lg:py-24">

                <div className="mx-auto max-w-275 px-6 lg:px-10">

                    <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">

                        <div>

                            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[#911824]">
                                Healthcare Services
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                                Our Departments
                            </h2>

                            <p className="mt-4 max-w-2xl leading-7 text-gray-600">
                                Explore the healthcare departments currently
                                available at Bashir Memorial Welfare Hospital.
                            </p>

                        </div>

                        <Link
                            href="/departments"
                            className="inline-flex items-center gap-2 font-semibold text-[#911824]"
                        >
                            View All Departments
                            <FaArrowRight />
                        </Link>

                    </div>


                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {departments.map((department) => (
                            <Link
                                href={`/departments/${department.id}`}
                                key={department.id}
                                className="group rounded-2xl border border-gray-100 bg-[#FBF9F9] p-6 transition hover:-translate-y-1 hover:shadow-lg"
                            >

                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#911824]/10 text-xl text-[#911824]">
                                    {department.icon}
                                </div>

                                <h3 className="mb-3 font-bold text-gray-900">
                                    {department.name}
                                </h3>

                                <p className="text-sm leading-6 text-gray-500">
                                    {department.description}
                                </p>

                                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#911824]">
                                    Explore
                                    <FaArrowRight className="transition group-hover:translate-x-1" />
                                </div>

                            </Link>
                        ))}

                    </div>

                </div>

            </section> */}

            <DepartmentsSection/>


            {/* ==================================================
                OUR JOURNEY
            ================================================== */}

            <section className="py-20 lg:py-24">

                <div className="mx-auto max-w-275 px-6 lg:px-10">

                    <div className="mb-14 text-center">

                        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-[#911824]">
                            Our Journey
                        </p>

                        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                            Building Our Future
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
                            As a newly established hospital, every step marks
                            the beginning of our journey toward serving the
                            community better.
                        </p>

                    </div>


                    <div className="relative">

                        <div className="absolute left-4 top-0 hidden h-full w-px bg-gray-200 md:left-1/2 md:block" />

                        <div className="space-y-10">

                            {journey.map((item, index) => (
                                <div
                                    key={`${item.year}-${index}`}
                                    className={`relative grid items-center gap-8 md:grid-cols-2 ${index % 2 === 0
                                            ? ""
                                            : "md:[&>div:first-child]:order-2"
                                        }`}
                                >

                                    <div
                                        className={`${index % 2 === 0
                                                ? "md:text-right"
                                                : "md:text-left"
                                            }`}
                                    >

                                        <span className="text-sm font-bold text-[#911824]">
                                            {item.year}
                                        </span>

                                        <h3 className="mt-2 text-xl font-bold text-gray-900">
                                            {item.title}
                                        </h3>

                                        <p className="mt-3 leading-7 text-gray-600">
                                            {item.description}
                                        </p>

                                    </div>


                                    <div
                                        className={`hidden md:flex ${index % 2 === 0
                                                ? "justify-start"
                                                : "justify-end"
                                            }`}
                                    >

                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#911824] text-white shadow-lg">
                                            <FaCheckCircle />
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

        
            <SuccessStories />

            {/* ==================================================
                SUPPORTERS
            ================================================== */}

            <Supporters />


           

            {/* ==================================================
                HEALTH PARTNERS
            ================================================== */}

            
            <HealthPartners />


            {/* ==================================================
                RECENT EVENTS
            ================================================== */}

           <EventsSection/>


            {/* ==================================================
                COMPLIANCE
            ================================================== */}

            <section className="bg-white py-16">

                <div className="mx-auto max-w-225 px-6 lg:px-10">

                    <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#FBF9F9] p-8 md:flex-row md:items-center md:p-10">

                        <div className="flex items-start gap-5">

                            <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#911824]/10 text-2xl text-[#911824] sm:flex">
                                <FaShieldAlt />
                            </div>

                            <div>

                                <p className="text-sm font-bold uppercase tracking-wider text-[#911824]">
                                    Our Standards
                                </p>

                                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                                    Committed to Safe & Ethical Healthcare
                                </h2>

                                <p className="mt-3 max-w-2xl leading-7 text-gray-600">
                                    BMWH is committed to maintaining high
                                    standards of patient safety, dignity,
                                    privacy, ethical practice, and quality
                                    healthcare.
                                </p>

                            </div>

                        </div>


                        <Link
                            href="/compliance"
                            className="btn shrink-0 border-none bg-[#911824] px-6 text-white hover:bg-[#7d1420]"
                        >
                            View Compliance
                            <FaArrowRight />
                        </Link>

                    </div>

                </div>

            </section>


            {/* ==================================================
                FINAL CTA
            ================================================== */}

            <section className="bg-[#911824] py-20 text-white">

                <div className="mx-auto max-w-225 px-6 text-center">

                    <h2 className="text-3xl font-bold md:text-4xl">
                        Healthcare With Compassion
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl leading-8 text-white/75">
                        Whether you need medical care, want to support our
                        mission, or simply want to learn more about BMWH,
                        we are here to help.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">

                        <Link
                            href="/contact"
                            className="btn border-none bg-white px-7 text-[#911824] hover:bg-gray-100"
                        >
                            Contact Us
                            <FaArrowRight />
                        </Link>

                        <Link
                            href="/donate"
                            className="btn btn-outline border-white/40 px-7 text-white hover:bg-white hover:text-[#911824]"
                        >
                            Support Our Mission
                        </Link>

                    </div>

                </div>

            </section>

        </main>
    );
}