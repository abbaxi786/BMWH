import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
    FaArrowRight,
    FaHeartbeat,
    FaMicroscope,
    FaStethoscope,
} from "react-icons/fa";
import ContactUsCard from "@/app/components/contactCard/contactCard";

interface DiagnosticService {
    id: number;
    name: string;
    category: string;
    image_url: string;
    description: string;
    is_active: boolean;
}

interface DiagnosticApiResponse {
    success: boolean;
    data: DiagnosticService[];
    message?: string;
}

async function Diagnostic() {
    let diagnostics: DiagnosticService[] = [];

    try {
        const response = await axios.get<DiagnosticApiResponse>(
            `${process.env.BACKEND_URL}/api/diagnostic_services`
        );

        if (response.data.success) {
            diagnostics = response.data.data.filter(
                (service) => service.is_active
            );
        }
    } catch (error) {
        console.error("Error fetching diagnostic services:", error);
    }

    return (
        <main className="min-h-screen bg-white animate-fade-in-up">

            {/* =====================================================
                HERO SECTION
            ===================================================== */}
            <section
                className="relative min-h-105 overflow-hidden text-black"
                style={{
                    backgroundImage:
                        "url('https://media.istockphoto.com/id/2198730527/photo/medical-brain-scans-on-multiple-computer-screens-advanced-neuroimaging-technology-reveals.webp?a=1&b=1&s=612x612&w=0&k=20&c=rp61Iif9S7YzELKowpW9TDhp3ZX3LlB_717FKm36lys=')",
                    backgroundSize: "cover",
                    backgroundPosition: "center right",
                }}
            >
                {/* Light blue gradient */}
                <div className="absolute inset-0 bg-linear-to-r from-blue-50 via-blue-50/90 to-blue-100/30" />

                {/* Soft white layer for text readability */}
                <div className="absolute inset-0 bg-linear-to-r from-white/80 via-white/30 to-transparent" />

                {/* Bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-blue-50/50 to-transparent" />

                {/* Hero Content */}
                <div className="relative z-10 mx-auto flex min-h-105 max-w-7xl items-center px-6 py-16 md:px-8 md:py-20">

                    <div className="max-w-3xl">

                        {/* Breadcrumb */}
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
                                    <span className="font-medium text-[#86000D]">
                                        Diagnostics
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Label */}
                        <div className="mb-5 flex items-center gap-3">

                            <span className="h-0.5 w-10 bg-[#86000D]" />

                            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#86000D]">
                                Diagnostic Services
                            </span>

                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl font-bold tracking-tight text-[#86000D] md:text-5xl lg:text-6xl">
                            Diagnostics & Imaging
                        </h1>

                        {/* Description */}
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5B403D]">
                            Access reliable diagnostic and imaging services
                            supported by modern technology and professional
                            medical expertise for accurate evaluation and care.
                        </p>

                    </div>

                </div>
            </section>


            {/* =====================================================
                INTRODUCTION
            ===================================================== */}
            <section className="py-16 md:py-20">

                <div className="mx-auto max-w-7xl px-6">

                    <div className="grid items-center gap-12 lg:grid-cols-2">

                        {/* Left */}
                        <div>

                            <div className="flex items-center gap-3">

                                <span className="h-0.5 w-10 bg-[#86000D]" />

                                <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[#86000D]">
                                    Our Services
                                </span>

                            </div>

                            <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">
                                Reliable Diagnostic Care
                            </h2>

                            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
                                Our diagnostic services help healthcare
                                professionals accurately evaluate medical
                                conditions and make informed decisions about
                                patient care.
                            </p>

                            <p className="mt-4 max-w-xl leading-7 text-gray-600">
                                From medical imaging to specialized diagnostic
                                examinations, our services are designed with
                                accuracy, accessibility, and patient comfort
                                in mind.
                            </p>

                        </div>


                        {/* Right Feature Cards */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-1">

                            <div className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#86000D]">
                                    <FaMicroscope className="text-2xl" />
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900">
                                        Modern Diagnostics
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Supporting accurate clinical evaluation.
                                    </p>
                                </div>

                            </div>


                            <div className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                    <FaHeartbeat className="text-2xl" />
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900">
                                        Patient Focused
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Comfortable and accessible diagnostic care.
                                    </p>
                                </div>

                            </div>


                            <div className="flex items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                    <FaStethoscope className="text-2xl" />
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900">
                                        Clinical Support
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Helping doctors make informed decisions.
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                DIAGNOSTIC SERVICES
            ===================================================== */}
            <section className="bg-gray-50 py-16 md:py-20">

                <div className="mx-auto max-w-7xl px-6">

                    {/* Section Heading */}
                    <div className="mb-12">

                        <div className="flex items-center gap-3">

                            <span className="h-0.5 w-10 bg-[#86000D]" />

                            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[#86000D]">
                                Available Services
                            </span>

                        </div>

                        <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                            Our Diagnostic Services
                        </h2>

                        <p className="mt-4 max-w-2xl text-gray-600">
                            Explore the diagnostic services currently available
                            at Bashir Memorial Welfare Hospital.
                        </p>

                    </div>


                    {/* Services */}
                    {diagnostics.length === 0 ? (

                        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">

                                <FaStethoscope className="text-2xl text-[#86000D]" />

                            </div>

                            <h3 className="mt-5 text-2xl font-bold text-gray-900">
                                No Diagnostic Services Available
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-gray-600">
                                Diagnostic services are currently unavailable.
                                Please check back later or contact the hospital
                                for more information.
                            </p>

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">

                            {diagnostics.map((service) => (

                                <article
                                    key={service.id}
                                    className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >

                                    <Link href={`/pages/diagnostic/${service.id}`}>


                                        {/* Image */}
                                        <div className="relative h-64 overflow-hidden bg-gray-100">

                                            <Image
                                                src={service.image_url}
                                                alt={service.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />

                                            {/* Image Overlay */}
                                            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                                            {/* Category */}
                                            <div className="absolute left-5 top-5">

                                                <span className="badge border-none bg-[#86000D] px-4 py-3 text-white">
                                                    {service.category}
                                                </span>

                                            </div>

                                        </div>


                                        {/* Content */}
                                        <div className="p-6">

                                            <h3 className="text-2xl font-bold text-gray-900">
                                                {service.name}
                                            </h3>

                                            <p className="mt-3 leading-7 text-gray-600">
                                                {service.description}
                                            </p>

                                            <div className="mt-6 flex items-center justify-between">

                                                <span className="text-sm font-semibold text-[#86000D]">
                                                    Diagnostic Service
                                                </span>

                                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#86000D] transition-colors group-hover:bg-[#86000D] group-hover:text-white">
                                                    <FaArrowRight />
                                                </span>

                                            </div>

                                        </div>

                                    </Link>
                                </article>

                            ))}

                        </div>

                    )}

                </div>

            </section>


            {/* =====================================================
                CONTACT INFORMATION
            ===================================================== */}
            <ContactUsCard />


            {/* =====================================================
                CTA
            ===================================================== */}
            <section className="bg-linear-to-r from-[#86000D] to-[#a90012] py-16">

                <div className="mx-auto max-w-5xl px-6 text-center">

                    <h2 className="text-3xl font-bold text-white md:text-4xl">
                        Need a Diagnostic Service?
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/85">
                        Contact Bashir Memorial Welfare Hospital to learn more
                        about our diagnostic services and available facilities.
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

export default Diagnostic;