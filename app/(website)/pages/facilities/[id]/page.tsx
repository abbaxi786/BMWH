
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    FaArrowLeft,
    FaArrowRight,
    FaHospital,
    FaCheckCircle,
    FaTag,
} from "react-icons/fa";

import {
    getActiveHospitalFacilityById,
} from "@/lib/data/hospitalFacilities/hospitalFacilties";

interface PageProps {
    params: Promise<{ id: string }>;
}

export const dynamic = "force-static";

export default async function FacilityDetailPage({
    params,
}: PageProps) {
    const { id } = await params;
    const facilityId = Number(id);

    if (!Number.isInteger(facilityId) || facilityId <= 0) {
        notFound();
    }

    let facility;

    try {
        facility = await getActiveHospitalFacilityById(facilityId);
    } catch (error) {
        console.error("Error fetching hospital facility:", error);
        throw new Error("Unable to load hospital facility.");
    }

    if (!facility) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
            {/* HERO */}
            <section className="bg-linear-to-r from-white via-[#FBF9F9] to-[#911824]/15">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="py-12 sm:py-16 lg:py-20">
                        {/* Breadcrumb */}
                        <nav
                            aria-label="Breadcrumb"
                            className="mb-7 flex flex-wrap items-center gap-2 text-sm"
                        >
                            <Link
                                href="/"
                                className="text-gray-500 hover:text-[#911824]"
                            >
                                Home
                            </Link>

                            <span className="text-gray-400">/</span>

                            <Link
                                href="/pages/facilities"
                                className="text-gray-500 hover:text-[#911824]"
                            >
                                Hospital Facilities
                            </Link>

                            <span className="text-gray-400">/</span>

                            <span className="font-medium text-[#911824]">
                                {facility.name}
                            </span>
                        </nav>

                        {/* Heading */}
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#911824]/10">
                                <FaHospital className="text-[#911824]" />
                            </div>

                            <span className="text-sm font-semibold uppercase tracking-wider text-[#911824]">
                                Hospital Facility
                            </span>
                        </div>

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                                <h1 className="text-4xl font-bold leading-tight text-[#911824] sm:text-5xl lg:text-6xl">
                                    {facility.name}
                                </h1>

                                {facility.category && (
                                    <div className="mt-4 flex items-center gap-2 text-gray-600">
                                        <FaTag className="text-sm text-[#911824]" />
                                        <span>{facility.category}</span>
                                    </div>
                                )}
                            </div>

                            <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-sm font-semibold text-green-700 shadow-sm">
                                <FaCheckCircle />
                                Available
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="py-14 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
                        {/* Facility Image */}
                        <div className="relative h-75 w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm sm:h-100 lg:h-125">
                            {facility.image_url ? (
                                <Image
                                    src={facility.image_url}
                                    alt={`${facility.name} - Bashir Memorial Welfare Hospital`}
                                    fill
                                    priority
                                    unoptimized
                                    className="object-cover transition-transform duration-500 hover:scale-105"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-[#911824]/5">
                                    <FaHospital className="text-7xl text-[#911824]/30" />
                                </div>
                            )}
                        </div>

                        {/* Facility Information */}
                        <div className="lg:pt-4">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#911824]">
                                About This Facility
                            </p>

                            <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                                {facility.name}
                            </h2>

                            {facility.category && (
                                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#911824]/5 px-4 py-2 text-sm font-medium text-[#911824]">
                                    <FaTag className="text-xs" />
                                    {facility.category}
                                </div>
                            )}

                            <div className="mt-7">
                                {facility.description ? (
                                    <p className="whitespace-pre-line text-base leading-8 text-gray-600 sm:text-lg">
                                        {facility.description}
                                    </p>
                                ) : (
                                    <p className="leading-7 text-gray-500">
                                        More information about this facility
                                        will be available soon.
                                    </p>
                                )}
                            </div>

                            {/* Availability */}
                            <div className="mt-8 flex items-center gap-3 rounded-xl border border-gray-100 bg-[#FBF9F9] p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                                    <FaCheckCircle className="text-green-600" />
                                </div>

                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500">
                                        Facility Status
                                    </p>
                                    <p className="font-semibold text-green-700">
                                        Currently Available
                                    </p>
                                </div>
                            </div>

                            {/* Back Button */}
                            <div className="mt-8">
                                <Link
                                    href="/pages/hospital_facilities"
                                    className="inline-flex items-center gap-2 rounded-lg border border-[#911824] px-5 py-3 font-semibold text-[#911824] transition-all hover:bg-[#911824] hover:text-white"
                                >
                                    <FaArrowLeft className="text-sm" />
                                    All Facilities
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-[#911824]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-7 py-14 sm:py-16 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-2xl">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/80">
                                Need Assistance?
                            </p>

                            <h2 className="text-3xl font-bold text-white sm:text-4xl">
                                Have questions about our facilities?
                            </h2>

                            <p className="mt-4 leading-7 text-white/80">
                                Contact our hospital team for more information
                                about our facilities and available services.
                            </p>
                        </div>

                        <Link
                            href="/pages/contact"
                            className="inline-flex shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-white px-6 py-3.5 font-semibold text-[#911824] transition-colors hover:bg-gray-100"
                        >
                            Contact Us
                            <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
