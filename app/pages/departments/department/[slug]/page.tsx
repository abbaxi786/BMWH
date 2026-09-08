import React from "react";
import axios from "axios";
import Link from "next/link";
import DoctorCard from "@/app/components/departmentPageComponents/DoctorCard";
import Image from "next/image";

interface PageProps {
    params: Promise<{ slug: string }>;
}

interface Doctor {
    id: number;
    name: string;
    doctor_type: string;
    designation: string;
    specialty: string;
    qualifications: string;
    biography: string;
    expertise: string;
    profile_link: string;
    photo_url: string | null;
    is_active: boolean;
}

interface Service {
    id: number;
    name: string;
    description: string;
    image_url: string | null;
    is_active: boolean;
}

interface Department {
    department_id: number;
    department_name: string;
    department_category: string;
    department_description: string;
    department_slug: string;
    department_image: string | null;
    department_active: boolean;
    doctors: Doctor[];
    services: Service[];
}

interface ApiResponse {
    success: boolean;
    data: Department;
    message?: string;
}

async function Department({ params }: PageProps) {
    const { slug } = await params;

    let department: Department | null = null;

    try {
        const response = await axios.get<ApiResponse>(
            "http://localhost:3000/api/departments/department/",
            {
                params: {
                    slug: slug,
                },
            }
        );

        if (response.data.success) {
            department = response.data.data;
        }
    } catch (error) {
        console.error("Failed to fetch department:", error);
    }

    // =========================================================
    // DEPARTMENT NOT FOUND
    // =========================================================

    if (!department) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center px-6 animate-fade-in-up">
                <div className="text-center max-w-md">

                    <div
                        className="w-16 h-16 mx-auto rounded-full
                                   bg-[#86000D]/10
                                   flex items-center justify-center"
                    >
                        <span className="text-[#86000D] text-2xl font-bold">
                            !
                        </span>
                    </div>

                    <h1 className="mt-6 text-3xl font-bold text-gray-900">
                        Department Not Found
                    </h1>

                    <p className="mt-3 text-gray-600 leading-7">
                        The department you are looking for could not be found
                        or may no longer be available.
                    </p>

                    <Link
                        href="/departments"
                        className="inline-block mt-6 px-6 py-3
                                   bg-[#86000D] text-white
                                   rounded-md font-semibold
                                   hover:bg-[#6f000a]
                                   transition"
                    >
                        View Departments
                    </Link>

                </div>
            </main>
        );
    }

    return (
        <main className="bg-white animate-fade-in-up">

            {/* =====================================================
                HERO SECTION
            ===================================================== */}

            <section className="relative bg-[#86000D] overflow-hidden">

                {/* Decorative circles */}

                <div
                    className="absolute -right-32 -top-32
                               w-96 h-96 rounded-full
                               bg-white/5"
                />

                <div
                    className="absolute -left-32 -bottom-32
                               w-96 h-96 rounded-full
                               bg-white/5"
                />

                <div className="relative max-w-7xl mx-auto px-6">

                    {/* =================================================
                        BREADCRUMB
                    ================================================= */}

                    <nav
                        aria-label="Breadcrumb"
                        className="pt-6 pb-2"
                    >
                        <ol className="flex items-center flex-wrap gap-2 text-sm">

                            {/* Home */}

                            <li>
                                <Link
                                    href="/"
                                    className="text-white/70
                                               hover:text-white
                                               transition"
                                >
                                    Home
                                </Link>
                            </li>

                            <li
                                className="text-white/40"
                                aria-hidden="true"
                            >
                                /
                            </li>

                            {/* Departments */}

                            <li>
                                <Link
                                    href="/pages/departments"
                                    className="text-white/70
                                               hover:text-white
                                               transition"
                                >
                                    Departments
                                </Link>
                            </li>

                            <li
                                className="text-white/40"
                                aria-hidden="true"
                            >
                                /
                            </li>

                            {/* Current Department */}

                            <li
                                className="text-white font-medium"
                                aria-current="page"
                            >
                                {department.department_name}
                            </li>

                        </ol>
                    </nav>

                    {/* =================================================
                        HERO CONTENT
                    ================================================= */}

                    <div
                        className="grid grid-cols-1 lg:grid-cols-2
                                   gap-12 items-center
                                   py-14 lg:py-18"
                    >

                        {/* =================================================
                            HERO TEXT
                        ================================================= */}

                        <div className="text-white">

                            <div className="flex items-center gap-3 mb-5">

                                <div className="w-10 h-0.5 bg-white" />

                                <span
                                    className="uppercase tracking-[0.2em]
                                               text-sm font-semibold"
                                >
                                    {department.department_category}
                                </span>

                            </div>

                            <h1
                                className="text-4xl md:text-5xl lg:text-6xl
                                           font-bold leading-tight"
                            >
                                {department.department_name}
                            </h1>

                            <p
                                className="mt-6 text-white/85
                                           text-lg leading-8 max-w-xl"
                            >
                                {department.department_description}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">

                                <a
                                    href="#services"
                                    className="px-6 py-3
                                               bg-white text-[#86000D]
                                               rounded-md font-semibold
                                               hover:bg-gray-100
                                               transition"
                                >
                                    Our Services
                                </a>

                                <a
                                    href="#doctors"
                                    className="px-6 py-3
                                               border border-white
                                               text-white
                                               rounded-md font-semibold
                                               hover:bg-white
                                               hover:text-[#86000D]
                                               transition"
                                >
                                    Meet Our Doctors
                                </a>

                            </div>

                        </div>

                        {/* =================================================
                            HERO IMAGE
                        ================================================= */}

                        <div className="relative">

                            <div
                                className="absolute -inset-3
                                           border border-white/20
                                           rounded-2xl"
                            />

                            <div
                                className="relative h-80 md:h-100
                                           rounded-xl overflow-hidden
                                           bg-white/10"
                            >

                                {department.department_image ? (

                                    <Image
                                        src={department.department_image}
                                        alt={department.department_name}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        className="object-cover"
                                        priority
                                    />

                                ) : (

                                    <div
                                        className="w-full h-full
                                                   flex items-center
                                                   justify-center"
                                    >
                                        <div className="text-center">

                                            <div
                                                className="w-24 h-24 mx-auto
                                                           rounded-full
                                                           bg-white/10
                                                           flex items-center
                                                           justify-center"
                                            >
                                                <span
                                                    className="text-4xl
                                                               font-bold
                                                               text-white/70"
                                                >
                                                    {department.department_name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            </div>

                                            <p className="mt-4 text-white/60">
                                                No image available
                                            </p>

                                        </div>
                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* =====================================================
                QUICK INFORMATION
            ===================================================== */}

            <section className="border-b border-gray-200 bg-white">

                <div className="max-w-7xl mx-auto px-6">

                    <div className="grid grid-cols-1 sm:grid-cols-3">

                        {/* Doctors */}

                        <div
                            className="py-7 text-center
                                       border-b sm:border-b-0
                                       sm:border-r border-gray-200"
                        >
                            <p className="text-3xl font-bold text-[#86000D]">
                                {department.doctors.length}
                            </p>

                            <p className="mt-1 text-gray-600">
                                Medical Professionals
                            </p>
                        </div>

                        {/* Services */}

                        <div
                            className="py-7 text-center
                                       border-b sm:border-b-0
                                       sm:border-r border-gray-200"
                        >
                            <p className="text-3xl font-bold text-[#86000D]">
                                {department.services.length}
                            </p>

                            <p className="mt-1 text-gray-600">
                                Medical Services
                            </p>
                        </div>

                        {/* Patient Support */}

                        <div className="py-7 text-center">

                            <p className="text-3xl font-bold text-[#86000D]">
                                24/7
                            </p>

                            <p className="mt-1 text-gray-600">
                                Patient Support
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            {/* =====================================================
                SERVICES
            ===================================================== */}

            <section
                id="services"
                className="py-20 bg-gray-50"
            >

                <div className="max-w-7xl mx-auto px-6">

                    {/* Section Heading */}

                    <div className="max-w-2xl">

                        <div className="flex items-center gap-3">

                            <span className="w-10 h-0.5 bg-[#86000D]" />

                            <span
                                className="text-[#86000D]
                                           font-semibold
                                           uppercase tracking-wider
                                           text-sm"
                            >
                                What We Offer
                            </span>

                        </div>

                        <h2
                            className="mt-4 text-3xl md:text-4xl
                                       font-bold text-gray-900"
                        >
                            Our Medical Services
                        </h2>

                        <p
                            className="mt-4 text-gray-600 leading-7"
                        >
                            Our department provides a range of specialized
                            healthcare services designed to meet the needs
                            of our patients.
                        </p>

                    </div>

                    {/* Services */}

                    {department.services.length > 0 ? (

                        <div
                            className="mt-12 grid grid-cols-1
                                       md:grid-cols-2 lg:grid-cols-3
                                       gap-7"
                        >

                            {department.services.map((service) => (

                                <div
                                    key={service.id}
                                    className="group bg-white
                                               border border-gray-200
                                               rounded-xl overflow-hidden
                                               hover:border-[#86000D]/30
                                               hover:shadow-lg
                                               transition-all duration-300"
                                >

                                    {/* Service Image */}

                                    {service.image_url ? (
                                        <div className="relative h-52 overflow-hidden">
                                            <Image
                                                src={service.image_url}
                                                alt={service.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-52 bg-[#86000D]/5 flex items-center justify-center">
                                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
                                                <span className="text-3xl font-bold text-[#86000D]">
                                                    {service.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Service Details */}

                                    <div className="p-6">

                                        <div
                                            className="w-10 h-1
                                                       bg-[#86000D]
                                                       mb-4"
                                        />

                                        <h3
                                            className="text-xl font-bold
                                                       text-gray-900"
                                        >
                                            {service.name}
                                        </h3>

                                        {service.description && (

                                            <p
                                                className="mt-3
                                                           text-gray-600
                                                           leading-7"
                                            >
                                                {service.description}
                                            </p>

                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div
                            className="mt-10 py-12
                                       text-center
                                       border border-dashed
                                       border-gray-300
                                       rounded-xl"
                        >
                            <p className="text-gray-500">
                                No services are currently available.
                            </p>
                        </div>

                    )}

                </div>

            </section>

            {/* =====================================================
                DOCTORS
            ===================================================== */}

            <section
                id="doctors"
                className="py-20 bg-white"
            >

                <div className="max-w-7xl mx-auto px-6">

                    {/* Section Heading */}

                    <div className="text-center max-w-2xl mx-auto">

                        <div
                            className="flex justify-center
                                       items-center gap-3"
                        >

                            <span className="w-10 h-0.5 bg-[#86000D]" />

                            <span
                                className="text-[#86000D]
                                           font-semibold
                                           uppercase
                                           tracking-wider
                                           text-sm"
                            >
                                Medical Team
                            </span>

                            <span className="w-10 h-0.5 bg-[#86000D]" />

                        </div>

                        <h2
                            className="mt-4 text-3xl md:text-4xl
                                       font-bold text-gray-900"
                        >
                            Our Doctors
                        </h2>

                        <p
                            className="mt-4 text-gray-600 leading-7"
                        >
                            Meet our experienced healthcare professionals
                            committed to delivering quality medical care.
                        </p>

                    </div>

                    {/* Doctors */}

                    {department.doctors.length > 0 ? (

                        <div
                            className="mt-12 grid grid-cols-1
                                       sm:grid-cols-2 lg:grid-cols-3
                                       gap-7"
                        >

                            {department.doctors.map((doctor) => (

                                <DoctorCard
                                    key={doctor.id}
                                    doctor={doctor}
                                />

                            ))}

                        </div>

                    ) : (

                        <div
                            className="mt-10 py-12
                                       text-center
                                       border border-dashed
                                       border-gray-300
                                       rounded-xl"
                        >
                            <p className="text-gray-500">
                                No doctors are currently available.
                            </p>
                        </div>

                    )}

                </div>

            </section>

            {/* =====================================================
                CALL TO ACTION
            ===================================================== */}

            <section className="py-16 bg-[#86000D]">

                <div
                    className="max-w-5xl mx-auto
                               px-6 text-center"
                >

                    <h2
                        className="text-3xl md:text-4xl
                                   font-bold text-white"
                    >
                        Your Health Matters to Us
                    </h2>

                    <p
                        className="mt-4 text-white/85
                                   text-lg max-w-2xl mx-auto"
                    >
                        Our dedicated healthcare professionals are here
                        to provide compassionate and quality medical care.
                    </p>

                    <div
                        className="mt-8 flex flex-wrap
                                   justify-center gap-4"
                    >

                        <Link
                            href="/contact"
                            className="px-8 py-3
                                       bg-white text-[#86000D]
                                       rounded-md font-semibold
                                       hover:bg-gray-100
                                       transition"
                        >
                            Contact Us
                        </Link>

                        <Link
                            href="/appointments"
                            className="px-8 py-3
                                       border border-white
                                       text-white rounded-md
                                       font-semibold
                                       hover:bg-white
                                       hover:text-[#86000D]
                                       transition"
                        >
                            Book an Appointment
                        </Link>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default Department;

