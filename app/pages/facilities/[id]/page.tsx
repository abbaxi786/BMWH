"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

import {
    FaArrowLeft,
    FaArrowRight,
    FaHospital,
    FaCheckCircle,
    FaTag,
} from "react-icons/fa";

interface Facility {
    id: number;
    name: string;
    category?: string;
    description?: string;
    image_url?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export default function FacilityDetailPage() {
    const params = useParams();
    const id = params?.id;

    const [facility, setFacility] = useState<Facility | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchFacility = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `/api/hospital_facilities?facility_id=${id}`
                );

                console.log("Facility response:", response.data);

                if (
                    response.data.success &&
                    Array.isArray(response.data.data) &&
                    response.data.data.length > 0
                ) {
                    // API returns data as an array
                    setFacility(response.data.data[0]);
                } else {
                    setError("Facility not found.");
                }
            } catch (error) {
                console.error("Error fetching facility:", error);
                setError("Unable to load facility information.");
            } finally {
                setLoading(false);
            }
        };

        fetchFacility();
    }, [id]);

    /* =========================================================
       LOADING STATE
    ========================================================= */

    if (loading) {
        return (
            <main className="min-h-screen bg-white">

                {/* Hero Skeleton */}
                <section className="bg-linear-to-r from-white via-[#FBF9F9] to-[#911824]/15">                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="py-12 sm:py-16 lg:py-20 animate-pulse">

                        {/* Breadcrumb */}
                        <div className="h-4 w-64 rounded bg-gray-200 mb-8" />

                        {/* Label */}
                        <div className="h-5 w-40 rounded bg-gray-200 mb-5" />

                        {/* Title */}
                        <div className="h-12 w-2/3 max-w-2xl rounded bg-gray-200" />

                    </div>
                </div>
                </section>


                {/* Content Skeleton */}
                <section className="py-14 sm:py-16 lg:py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

                            {/* Image */}
                            <div className="h-75 animate-pulse rounded-2xl bg-gray-200 sm:h-100 lg:h-125" />

                            {/* Text */}
                            <div className="space-y-5 animate-pulse lg:pt-4">
                                <div className="h-4 w-40 rounded bg-gray-200" />
                                <div className="h-10 w-2/3 rounded bg-gray-200" />
                                <div className="h-5 w-full rounded bg-gray-200" />
                                <div className="h-5 w-full rounded bg-gray-200" />
                                <div className="h-5 w-5/6 rounded bg-gray-200" />
                                <div className="h-16 w-full rounded bg-gray-200 mt-8" />
                            </div>

                        </div>

                    </div>
                </section>

            </main>
        );
    }


    /* =========================================================
       ERROR STATE
    ========================================================= */

    if (error || !facility) {
        return (
            <main className="min-h-screen bg-white">

                <section className="flex min-h-[70vh] bg-linear-to-r from-white via-[#FBF9F9] to-[#911824]/15 items-center justify-center px-4">

                    <div className="w-full max-w-md text-center">

                        {/* Icon */}
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#911824]/10">
                            <FaHospital className="text-2xl text-[#911824]" />
                        </div>

                        {/* Heading */}
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Facility Not Found
                        </h1>

                        {/* Error */}
                        <p className="mt-3 text-gray-600">
                            {error ||
                                "The facility you are looking for could not be found."}
                        </p>

                        {/* Back */}
                        <Link
                            href="/pages/hospital_facilities"
                            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#911824] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#7c141f]"
                        >
                            <FaArrowLeft className="text-sm" />
                            Back to Facilities
                        </Link>

                    </div>

                </section>

            </main>
        );
    }


    /* =========================================================
       MAIN PAGE
    ========================================================= */

    return (
        <main className="min-h-screen bg-white">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="bg-linear-to-r from-white via-[#FBF9F9] to-[#911824]/15">

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="py-12 sm:py-16 lg:py-20">

                        {/* =================================================
                            BREADCRUMB
                        ================================================= */}

                        <div className="mb-7 flex flex-wrap items-center gap-2 text-sm">

                            <Link
                                href="/"
                                className="text-gray-500 transition-colors hover:text-[#911824]"
                            >
                                Home
                            </Link>

                            <span className="text-gray-400">
                                /
                            </span>

                            <Link
                                href="/pages/facilities"
                                className="text-gray-500 transition-colors hover:text-[#911824]"
                            >
                                Hospital Facilities
                            </Link>

                            <span className="text-gray-400">
                                /
                            </span>

                            <span className="font-medium text-[#911824]">
                                {facility.name}
                            </span>

                        </div>


                        {/* =================================================
                            LABEL
                        ================================================= */}

                        <div className="mb-5 flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#911824]/10">
                                <FaHospital className="text-[#911824]" />
                            </div>

                            <span className="text-sm font-semibold uppercase tracking-wider text-[#911824]">
                                Hospital Facility
                            </span>

                        </div>


                        {/* =================================================
                            TITLE + STATUS
                        ================================================= */}

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="min-w-0">

                                <h1 className="text-4xl font-bold leading-tight text-[#911824] sm:text-5xl lg:text-6xl">
                                    {facility.name}
                                </h1>

                                {facility.category && (
                                    <div className="mt-4 flex items-center gap-2 text-gray-600">

                                        <FaTag className="text-sm text-[#911824]" />

                                        <span className="text-sm font-medium sm:text-base">
                                            {facility.category}
                                        </span>

                                    </div>
                                )}

                            </div>


                            {/* Status */}
                            <span
                                className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold shadow-sm ${facility.is_active
                                        ? "border-green-200 text-green-700"
                                        : "border-gray-200 text-gray-500"
                                    }`}
                            >
                                <FaCheckCircle />

                                {facility.is_active
                                    ? "Active"
                                    : "Currently Unavailable"}
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                CONTENT
            ===================================================== */}

            <section className="py-14 sm:py-16 lg:py-20">

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">


                        {/* =================================================
                            IMAGE
                        ================================================= */}

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


                        {/* =================================================
                            INFORMATION
                        ================================================= */}

                        <div className="lg:pt-4">

                            {/* Small Heading */}
                            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#911824]">
                                About This Facility
                            </p>


                            {/* Facility Name */}
                            <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                                {facility.name}
                            </h2>


                            {/* Category */}
                            {facility.category && (
                                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#911824]/5 px-4 py-2 text-sm font-medium text-[#911824]">
                                    <FaTag className="text-xs" />
                                    {facility.category}
                                </div>
                            )}


                            {/* Description */}
                            {facility.description ? (

                                <div className="mt-7">

                                    <p className="whitespace-pre-line text-base leading-8 text-gray-600 sm:text-lg">
                                        {facility.description}
                                    </p>

                                </div>

                            ) : (

                                <p className="mt-7 leading-7 text-gray-500">
                                    More information about this facility will
                                    be available soon.
                                </p>

                            )}


                            {/* =================================================
                                STATUS CARD
                            ================================================= */}

                            <div className="mt-8 flex items-center gap-3 rounded-xl border border-gray-100 bg-[#FBF9F9] p-4">

                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${facility.is_active
                                            ? "bg-green-100"
                                            : "bg-gray-100"
                                        }`}
                                >
                                    <FaCheckCircle
                                        className={
                                            facility.is_active
                                                ? "text-green-600"
                                                : "text-gray-400"
                                        }
                                    />
                                </div>


                                <div>

                                    <p className="text-xs uppercase tracking-wide text-gray-500">
                                        Facility Status
                                    </p>

                                    <p
                                        className={`font-semibold ${facility.is_active
                                                ? "text-green-700"
                                                : "text-gray-500"
                                            }`}
                                    >
                                        {facility.is_active
                                            ? "Currently Available"
                                            : "Currently Unavailable"}
                                    </p>

                                </div>

                            </div>


                            {/* =================================================
                                BACK BUTTON
                            ================================================= */}

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


            {/* =====================================================
                CTA
            ===================================================== */}

            <section className="bg-[#911824]">

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="flex flex-col gap-7 py-14 sm:py-16 md:flex-row md:items-center md:justify-between">

                        {/* Text */}
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


                        {/* Button */}
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

