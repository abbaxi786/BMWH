"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
    FaArrowRight,
    FaHospital,
    FaCheckCircle,
} from "react-icons/fa";

interface Facility {
    id: number;
    name: string;
    description?: string;
    image_url?: string;
    status?: string;
}

export default function TopFacilities() {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const response = await axios.get(
                    "/api/hospital_facilities/all?is_active=true"
                );


                if (response.data.success) {
                    setFacilities(response.data.data.slice(0, 3));
                }
            } catch (error) {
                console.error("Error fetching facilities:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFacilities();
    }, []);

    return (
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Heading */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">

                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-widest text-[#911824] mb-3">
                            Our Facilities
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                            Healthcare Facilities
                        </h2>

                        <p className="mt-4 text-gray-600 leading-7">
                            Our facilities are designed to provide patients
                            with accessible, reliable, and quality healthcare
                            in a comfortable environment.
                        </p>
                    </div>

                    {/* Desktop View All */}
                    <Link
                        href="/pages/facilities"
                        className="hidden md:inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#911824] text-[#911824] font-semibold hover:bg-[#911824] hover:text-white transition-all whitespace-nowrap"
                    >
                        View All Facilities
                        <FaArrowRight className="text-sm" />
                    </Link>

                </div>


                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-gray-200 overflow-hidden animate-pulse"
                            >
                                <div className="h-56 bg-gray-200" />

                                <div className="p-6 space-y-4">
                                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                                    <div className="h-4 bg-gray-200 rounded" />
                                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                                </div>
                            </div>
                        ))}

                    </div>
                )}


                {/* Facilities */}
                {!loading && facilities.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

                        {facilities.map((facility) => (
                            <article
                                key={facility.id}
                                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                            >

                                {/* Image */}
                                <div className="relative h-56 overflow-hidden bg-gray-100">

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

                                    {facility.status && (
                                        <span className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-full text-xs font-semibold text-green-700 shadow-sm">
                                            <FaCheckCircle className="text-xs" />
                                            {facility.status}
                                        </span>
                                    )}

                                </div>


                                {/* Content */}
                                <div className="p-6">

                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#911824] transition-colors">
                                        {facility.name}
                                    </h3>

                                    {facility.description && (
                                        <p className="mt-3 text-sm text-gray-600 leading-6 line-clamp-3">
                                            {facility.description}
                                        </p>
                                    )}

                                    <Link
                                        href={`/pages/facilities/${facility.id}`}
                                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#911824] hover:gap-3 transition-all"
                                    >
                                        Learn More
                                        <FaArrowRight className="text-xs" />
                                    </Link>

                                </div>

                            </article>
                        ))}

                    </div>
                )}


                {/* No Facilities */}
                {!loading && facilities.length === 0 && (
                    <div className="py-12 text-center">
                        <FaHospital className="mx-auto text-4xl text-gray-300 mb-4" />

                        <p className="text-gray-500">
                            No facilities are currently available.
                        </p>
                    </div>
                )}


                {/* Mobile View All */}
                <div className="mt-8 flex justify-center md:hidden">
                    <Link
                        href="/pages/hospital-facilities"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#911824] text-white font-semibold hover:bg-[#7c141f] transition-all"
                    >
                        View All Facilities
                        <FaArrowRight className="text-sm" />
                    </Link>
                </div>

            </div>
        </section>
    );
}