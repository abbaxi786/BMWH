"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Map from "@/app/components/map";
import ContactUsCard from "@/app/components/contactCard/contactCard";
import {
    FaArrowRight,
    FaHospital,
    FaCheckCircle,
} from "react-icons/fa";

interface HospitalFacility {
    id: number;
    name: string;
    description?: string;
    image_url?: string;
    status?: string;
}

export default function HospitalFacilitiesPage() {
    const [facilities, setFacilities] = useState<HospitalFacility[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const response = await axios.get("/api/hospital_facilities");

                if (response.data.success) {
                    setFacilities(response.data.data);
                } else {
                    setError("Failed to load hospital facilities.");
                }
            } catch (err) {
                console.error("Error fetching hospital facilities:", err);
                setError("Unable to load hospital facilities.");
            } finally {
                setLoading(false);
            }
        };

        fetchFacilities();
    }, []);

    return (
        <main className="min-h-screen bg-white">

            {/* ================= HERO ================= */}
            <section className="bg-linear-to-r from-white via-[#FBF9F9] to-[#911824]/15">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="py-16 sm:py-20 lg:py-24">

                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-sm mb-6">
                            <Link
                                href="/"
                                className="text-gray-500 hover:text-[#911824] transition-colors"
                            >
                                Home
                            </Link>

                            <span className="text-gray-400">/</span>

                            <span className="text-[#911824] font-medium">
                                Hospital Facilities
                            </span>
                        </div>

                        <div className="max-w-3xl">

                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-11 h-11 rounded-full bg-[#911824]/10 flex items-center justify-center">
                                    <FaHospital className="text-[#911824] text-lg" />
                                </div>

                                <span className="text-[#911824] font-semibold uppercase tracking-wider text-sm">
                                    Our Facilities
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#911824] leading-tight">
                                Hospital Facilities
                            </h1>

                            <p className="mt-6 text-base sm:text-lg text-gray-600 leading-8 max-w-2xl">
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Section Heading */}
                    <div className="max-w-2xl mb-12">

                        <p className="text-sm font-semibold uppercase tracking-widest text-[#911824] mb-3">
                            Healthcare Infrastructure
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                            Facilities Built Around Patient Care
                        </h2>

                        <p className="mt-4 text-gray-600 leading-7">
                            Our hospital facilities support a wide range of
                            medical needs while focusing on comfort, quality,
                            and patient-centered care.
                        </p>

                    </div>


                    {/* Loading */}
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-gray-200 overflow-hidden animate-pulse"
                                >
                                    <div className="h-56 bg-gray-200"></div>

                                    <div className="p-6 space-y-4">
                                        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}


                    {/* Error */}
                    {!loading && error && (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mb-4">
                                <FaHospital className="text-red-500 text-xl" />
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900">
                                Unable to load facilities
                            </h3>

                            <p className="mt-2 text-gray-500">
                                {error}
                            </p>
                        </div>
                    )}


                    {/* Empty */}
                    {!loading && !error && facilities.length === 0 && (
                        <div className="text-center py-16">
                            <FaHospital className="mx-auto text-4xl text-gray-300 mb-4" />

                            <h3 className="text-xl font-semibold text-gray-800">
                                No facilities available
                            </h3>

                            <p className="mt-2 text-gray-500">
                                Hospital facility information will be available
                                here soon.
                            </p>
                        </div>
                    )}


                    {/* Facilities Grid */}
                    {!loading && !error && facilities.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

                            {facilities.map((facility) => (
                                <article
                                    key={facility.id}
                                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                                >

                                    {/* Image */}
                                    <div className="relative h-56 sm:h-60 overflow-hidden bg-gray-100">

                                        {facility.image_url ? (
                                            <Image
                                                src={facility.image_url}
                                                alt={facility.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#911824]/5">
                                                <FaHospital className="text-5xl text-[#911824]/40" />
                                            </div>
                                        )}

                                        {/* Status */}
                                        {facility.status && (
                                            <div className="absolute top-4 left-4">
                                                <span
                                                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                                                        facility.status.toLowerCase() === "active"
                                                            ? "bg-white text-green-700"
                                                            : "bg-white text-gray-600"
                                                    }`}
                                                >
                                                    <FaCheckCircle className="text-xs" />
                                                    {facility.status}
                                                </span>
                                            </div>
                                        )}

                                    </div>


                                    {/* Content */}
                                    <div className="p-6">

                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#911824] transition-colors">
                                            {facility.name}
                                        </h3>

                                        {facility.description && (
                                            <p className="mt-3 text-gray-600 text-sm leading-6 line-clamp-3">
                                                {facility.description}
                                            </p>
                                        )}

                                        <div className="mt-6">
                                            <Link
                                                href={`/pages/hospital-facilities/${facility.id}`}
                                                className="inline-flex items-center gap-2 text-sm font-semibold text-[#911824] hover:gap-3 transition-all"
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="py-14 sm:py-16 lg:py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-8">

                        <div className="max-w-2xl">

                            <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-3">
                                Patient-Centered Healthcare
                            </p>

                            <h2 className="text-3xl sm:text-4xl font-bold text-white">
                                Need more information?
                            </h2>

                            <p className="mt-4 text-white/80 leading-7">
                                Contact our team to learn more about our
                                facilities, services, and available healthcare
                                support.
                            </p>

                        </div>

                        <Link
                            href="/pages/contact"
                            className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-[#911824] rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
                        >
                            Contact Us
                            <FaArrowRight />
                        </Link>

                    </div>

                </div>
            </section>
            <ContactUsCard/>
            <Map/>

        </main>
    );
}