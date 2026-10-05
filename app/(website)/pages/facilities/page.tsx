import Image from "next/image";
import Link from "next/link";
import Map from "@/app/components/map";
import ContactUsCard from "@/app/components/contactCard/contactCard";

import {
    FaArrowRight,
    FaHospital,
    FaCheckCircle,
} from "react-icons/fa";

import { getActiveHospitalFacilities } from "@/lib/data/hospitalFacilities/hospitalFacilties";

interface HospitalFacility {
    id: number;
    name: string;
    category: string | null;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export default async function HospitalFacilitiesPage() {
    let facilities: HospitalFacility[] = [];

    try {
        const result = await getActiveHospitalFacilities();

        facilities = result as HospitalFacility[];
    } catch (error) {
        console.error("Error fetching hospital facilities:", error);
    }

    return (
        <main className="min-h-screen bg-white">

            {/* ================= HERO ================= */}
            <section className="bg-linear-to-r from-white via-[#FBF9F9] to-[#911824]/15">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="py-16 sm:py-20 lg:py-24">

                        {/* Breadcrumbs */}
                        <div className="mb-6 flex items-center gap-2 text-sm">
                            <Link
                                href="/"
                                className="text-gray-500 transition-colors hover:text-[#911824]"
                            >
                                Home
                            </Link>

                            <span className="text-gray-400">/</span>

                            <span className="font-medium text-[#911824]">
                                Hospital Facilities
                            </span>
                        </div>

                        <div className="max-w-3xl">

                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#911824]/10">
                                    <FaHospital className="text-lg text-[#911824]" />
                                </div>

                                <span className="text-sm font-semibold uppercase tracking-wider text-[#911824]">
                                    Our Facilities
                                </span>
                            </div>

                            <h1 className="text-4xl font-bold leading-tight text-[#911824] sm:text-5xl lg:text-6xl">
                                Hospital Facilities
                            </h1>

                            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
                                Explore the facilities and services available at
                                Bashir Memorial Welfare Hospital, designed to
                                provide patients with safe, accessible, and
                                comprehensive healthcare.
                            </p>

                        </div>
                    </div>
                </div>
            </section>


            {/* ================= FACILITIES ================= */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Section Heading */}
                    <div className="mb-12 max-w-2xl">

                        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#911824]">
                            Healthcare Infrastructure
                        </p>

                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            Facilities Built Around Patient Care
                        </h2>

                        <p className="mt-4 leading-7 text-gray-600">
                            Our hospital facilities support a wide range of
                            medical needs while focusing on comfort, quality,
                            and patient-centered care.
                        </p>

                    </div>


                    {/* Error / Empty */}
                    {facilities.length === 0 ? (
                        <div className="py-16 text-center">

                            <FaHospital className="mx-auto mb-4 text-4xl text-gray-300" />

                            <h3 className="text-xl font-semibold text-gray-800">
                                No facilities available
                            </h3>

                            <p className="mt-2 text-gray-500">
                                Hospital facility information will be available
                                here soon.
                            </p>

                        </div>
                    ) : (

                        /* Facilities Grid */
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">

                            {facilities.map((facility) => (
                                <article
                                    key={facility.id}
                                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
                                >

                                    {/* Image */}
                                    <div className="relative h-56 overflow-hidden bg-gray-100 sm:h-60">

                                        {facility.image_url ? (
                                            <Image
                                                src={facility.image_url}
                                                alt={facility.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-[#911824]/5">
                                                <FaHospital className="text-5xl text-[#911824]/40" />
                                            </div>
                                        )}

                                        {/* Active Status */}
                                        {facility.is_active && (
                                            <div className="absolute left-4 top-4">
                                                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm">
                                                    <FaCheckCircle className="text-xs" />
                                                    Active
                                                </span>
                                            </div>
                                        )}

                                    </div>


                                    {/* Content */}
                                    <div className="p-6">

                                        <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-[#911824]">
                                            {facility.name}
                                        </h3>

                                        {facility.description && (
                                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                                                {facility.description}
                                            </p>
                                        )}

                                        <div className="mt-6">
                                            <Link
                                                href={`/pages/hospital-facilities/${facility.id}`}
                                                className="inline-flex items-center gap-2 text-sm font-semibold text-[#911824] transition-all hover:gap-3"
                                            >
                                                View Facility

                                                <FaArrowRight className="text-xs" />
                                            </Link>
                                        </div>

                                    </div>
                                </article>
                            ))}

                        </div>
                    )}

                </div>
            </section>


            {/* ================= BOTTOM CTA ================= */}
            <section className="bg-[#911824]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col gap-8 py-14 sm:py-16 lg:py-20 md:flex-row md:items-center md:justify-between">

                        <div className="max-w-2xl">

                            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/80">
                                Patient-Centered Healthcare
                            </p>

                            <h2 className="text-3xl font-bold text-white sm:text-4xl">
                                Need more information?
                            </h2>

                            <p className="mt-4 leading-7 text-white/80">
                                Contact our team to learn more about our
                                facilities, services, and available healthcare
                                support.
                            </p>

                        </div>

                        <Link
                            href="/pages/contact"
                            className="inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-white px-6 py-3.5 font-semibold text-[#911824] transition-colors hover:bg-gray-100"
                        >
                            Contact Us
                            <FaArrowRight />
                        </Link>

                    </div>

                </div>
            </section>

            <ContactUsCard />

            <Map />

        </main>
    );
}