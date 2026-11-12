
import DoctorCard from "@/app/components/departmentPageComponents/DoctorCard";
import Link from "next/link";
import type { Metadata } from "next";

import { getActiveDoctors } from "@/lib/data/doctors/doctors";

/* =====================================================
   SEO METADATA
===================================================== */

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "";

const PAGE_URL = `${SITE_URL}/pages/doctors`;

export const metadata: Metadata = {
    title: "Our Doctors | Experienced Medical Specialists | Bashir Memorial Welfare Hospital",

    description:
        "Meet the experienced doctors and medical specialists at Bashir Memorial Welfare Hospital, dedicated to providing compassionate and quality healthcare.",

    alternates: {
        canonical: SITE_URL
            ? PAGE_URL
            : "/pages/doctors",
    },

    openGraph: {
        title: "Our Doctors | Bashir Memorial Welfare Hospital",

        description:
            "Meet our experienced medical professionals dedicated to providing quality healthcare.",

        url: SITE_URL
            ? PAGE_URL
            : "/pages/doctors",

        siteName: "Bashir Memorial Welfare Hospital",

        type: "website",
    },

    twitter: {
        card: "summary",
        title: "Our Doctors | Bashir Memorial Welfare Hospital",
        description:
            "Meet our experienced medical professionals dedicated to providing quality healthcare.",
    },
};

/* =====================================================
   ISR CACHING
===================================================== */

export const revalidate = 86400;

/* =====================================================
   TYPES
===================================================== */

export interface Doctor {
    id: number;
    department_id: number;
    name: string;
    doctor_type: string;
    designation: string;
    specialty: string;
    qualifications: string;
    biography: string;
    expertise: string;
    photo_url: string | null;
    profile_link: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    department_name: string;
}

/* =====================================================
   HELPERS
===================================================== */

function createDepartmentId(department: string) {
    return department
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/* =====================================================
   PAGE
===================================================== */

async function Doctors() {

    // Fetch active doctors.
    // Database errors are allowed to reach the error boundary.
    const doctors = (await getActiveDoctors()) as Doctor[];

    /* =====================================================
       GROUP DOCTORS BY DEPARTMENT
    ===================================================== */

    const doctorsByDepartment = doctors.reduce(
        (groups, doctor) => {
            const department = doctor.department_name || "Other";

            if (!groups[department]) {
                groups[department] = [];
            }

            groups[department].push(doctor);

            return groups;
        },
        {} as Record<string, Doctor[]>
    );

    /* =====================================================
       STRUCTURED DATA
    ===================================================== */

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",

        name: "Our Doctors",

        description:
            "Meet the experienced doctors and medical specialists at Bashir Memorial Welfare Hospital.",

        url: PAGE_URL || "/pages/doctors",

        isPartOf: {
            "@type": "WebSite",
            name: "Bashir Memorial Welfare Hospital",
            ...(SITE_URL && {
                url: SITE_URL,
            }),
        },

        mainEntity: {
            "@type": "ItemList",

            name: "Medical Professionals",

            numberOfItems: doctors.length,

            itemListElement: doctors.map((doctor, index) => ({
                "@type": "ListItem",

                position: index + 1,

                item: {
                    "@type": "Physician",

                    name: doctor.name,

                    ...(doctor.designation && {
                        jobTitle: doctor.designation,
                    }),

                    ...(doctor.specialty && {
                        medicalSpecialty: doctor.specialty,
                    }),

                    ...(doctor.qualifications && {
                        hasCredential: doctor.qualifications,
                    }),

                    ...(doctor.photo_url && {
                        image: doctor.photo_url,
                    }),

                    url: SITE_URL
                        ? `${SITE_URL}/pages/doctors/doctor_view/${doctor.id}`
                        : `/pages/doctors/doctor_view/${doctor.id}`,

                    worksFor: {
                        "@type": "Hospital",
                        name: "Bashir Memorial Welfare Hospital",
                    },

                    memberOf: {
                        "@type": "MedicalOrganization",
                        name: doctor.department_name || "Other",
                    },
                },
            })),
        },
    };

    return (
        <main
            id="doctors-page"
            className="min-h-screen animate-fade-in-up bg-white"
        >

            {/* =====================================================
                STRUCTURED DATA
            ====================================================== */}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData).replace(
                        /</g,
                        "\\u003c"
                    ),
                }}
            />

            {/* =====================================================
                PAGE HERO
            ====================================================== */}

            <section
                id="doctors-overview"
                className="relative min-h-105 scroll-mt-28 overflow-hidden bg-white text-black"
                style={{
                    backgroundImage: "url('/images/ourDoctor.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center right",
                }}
            >
                {/* White gradient overlay */}

                <div className="absolute inset-0 bg-linear-to-r from-white via-white/95 to-white/10" />

                {/* Bottom subtle fade */}

                <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white/30 to-transparent" />

                {/* Content */}

                <div className="relative z-10 mx-auto flex min-h-105 max-w-7xl items-center px-6 py-16 md:px-8 md:py-20">
                    <div className="max-w-3xl">

                        {/* Breadcrumbs */}

                        <div className="breadcrumbs mb-8 text-sm">
                            <ul>
                                <li>
                                    <Link
                                        href="/"
                                        className="text-black/60 transition-colors hover:text-[#86000D]"
                                    >
                                        Home
                                    </Link>
                                </li>

                                <li>
                                    <span className="font-medium text-black">
                                        Doctors
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Label */}

                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-0.5 w-10 bg-[#86000D]" />

                            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#86000D]">
                                Medical Team
                            </span>
                        </div>

                        {/* Heading */}

                        <h1 className="text-4xl font-bold tracking-tight text-[#1B1C1C] md:text-5xl lg:text-6xl">
                            Our Doctors
                        </h1>

                        {/* Description */}

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#3F4141]">
                            Meet our experienced medical professionals
                            dedicated to providing compassionate and quality
                            healthcare to our patients.
                        </p>

                    </div>
                </div>
            </section>

            {/* =====================================================
                DOCTORS
            ====================================================== */}

            <section
                id="all-doctors"
                className="scroll-mt-28 py-16 md:py-20"
            >
                <div className="mx-auto max-w-7xl px-6">

                    {doctors.length === 0 ? (
                        <div className="py-16 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#86000D]/10">
                                <span className="text-2xl font-bold text-[#86000D]">
                                    !
                                </span>
                            </div>

                            <h2 className="mt-5 text-2xl font-bold text-gray-900">
                                No Doctors Available
                            </h2>

                            <p className="mt-2 text-gray-600">
                                There are currently no doctors available.
                            </p>

                        </div>
                    ) : (
                        <div className="space-y-20">

                            {Object.entries(doctorsByDepartment).map(
                                ([departmentName, departmentDoctors]) => {

                                    const departmentId =
                                        createDepartmentId(departmentName);

                                    return (
                                        <section
                                            key={departmentName}
                                            id={departmentId}
                                            className="scroll-mt-28"
                                        >

                                            {/* Department Heading */}

                                            <div className="mb-10">

                                                <div className="flex items-center gap-3">
                                                    <span className="h-0.5 w-10 bg-[#86000D]" />

                                                    <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[#86000D]">
                                                        Medical Department
                                                    </span>
                                                </div>

                                                <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                                                    {departmentName}
                                                </h2>

                                                <div className="mt-4 h-1 w-16 bg-[#86000D]" />

                                            </div>

                                            {/* Doctor Cards */}

                                            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">

                                                {departmentDoctors.map((doctor) => (
                                                    <Link
                                                        key={doctor.id}
                                                        href={`/pages/doctors/doctor_view/${doctor.id}`}
                                                        className="block"
                                                    >
                                                        <DoctorCard doctor={doctor} />
                                                    </Link>
                                                ))}

                                            </div>

                                        </section>
                                    );
                                }
                            )}

                        </div>
                    )}

                </div>
            </section>

            {/* =====================================================
                CTA
            ====================================================== */}

            <section
                id="doctors-cta"
                className="scroll-mt-28 bg-[#86000D] py-16"
            >
                <div className="mx-auto max-w-5xl px-6 text-center">

                    <h2 className="text-3xl font-bold text-white md:text-4xl">
                        Need Medical Assistance?
                    </h2>

                    <p className="mt-4 text-lg text-white/85">
                        Our medical team is ready to provide the care and
                        support you need.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">

                        <Link
                            href="/contact"
                            className="btn border-white bg-white text-[#86000D] hover:border-gray-100 hover:bg-gray-100"
                        >
                            Contact Us
                        </Link>

                        <Link
                            href="/appointments"
                            className="btn btn-outline border-white text-white hover:bg-white hover:text-[#86000D]"
                        >
                            Book an Appointment
                        </Link>

                    </div>

                </div>
            </section>

        </main>
    );
}

export default Doctors;
