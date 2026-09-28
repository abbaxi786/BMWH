"use client";

import React from "react";
import {
    FaArrowRight,
    FaBriefcase,
    FaUserTie,
} from "react-icons/fa";

const officeBearers = [
    {
        name: "Sohaib Afzal",
        designation: "President",
    },
    {
        name: "Shahzaib Afzal",
        designation: "Vice President-I",
    },
    {
        name: "Ambar Sohaib",
        designation: "Vice President-II",
    },
    {
        name: "Shayan Sohaib",
        designation: "General Secretary",
    },
    {
        name: "Zohaib Afzal",
        designation: "Finance Secretary",
    },
    {
        name: "Muhammad Abdullah Sohaib",
        designation: "Joint Secretary",
    },
    {
        name: "Muhammad Ayan",
        designation: "Printing & Publication Secretary",
    },
];

function OfficeBearers() {
    return (
        <section className="bg-[#FBF9F9] py-20 lg:py-28">
            <div className="mx-auto max-w-275 px-6 lg:px-10">

                {/* ==================================================
                    SECTION HEADER
                ================================================== */}

                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-[#911824]">
                        Leadership & Management
                    </p>

                    <h2 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                        Office Bearers & General Body
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-gray-600">
                        Meet the office bearers who contribute to the
                        administration, development, and welfare mission of
                        Bashir Memorial Welfare Hospital.
                    </p>
                </div>

                {/* ==================================================
                    OFFICE BEARERS
                ================================================== */}

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {officeBearers.map((person, index) => (
                        <div
                            key={person.name}
                            className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#911824]/30 hover:shadow-xl ${
                                index === 0
                                    ? "sm:col-span-2 lg:col-span-1"
                                    : ""
                            }`}
                        >
                            {/* Decorative element */}

                            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#911824]/5 transition duration-300 group-hover:scale-125" />

                            {/* Icon */}

                            <div className="relative mb-6 flex items-center justify-between">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#911824]/10 text-xl text-[#911824] transition duration-300 group-hover:bg-[#911824] group-hover:text-white">
                                    <FaUserTie />
                                </div>

                                <span className="text-xs font-bold text-gray-300">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                            </div>

                            {/* Person Information */}

                            <div className="relative">
                                <h3 className="text-lg font-bold text-gray-900 transition group-hover:text-[#911824]">
                                    {person.name}
                                </h3>

                                <div className="mt-2 flex items-start gap-2">
                                    <FaBriefcase
                                        className="mt-1 shrink-0 text-xs text-[#911824]"
                                    />

                                    <p className="text-sm font-medium leading-6 text-[#911824]">
                                        {person.designation}
                                    </p>
                                </div>
                            </div>

                            {/* Bottom line */}

                            <div className="mt-6 h-px w-full bg-gray-100" />

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-xs text-gray-400">
                                    Bashir Memorial Welfare Hospital
                                </span>

                                <FaArrowRight
                                    className="text-xs text-gray-300 transition duration-300 group-hover:translate-x-1 group-hover:text-[#911824]"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* ==================================================
                    INFORMATION NOTE
                ================================================== */}

                <div className="mt-10 rounded-2xl border border-[#911824]/10 bg-white p-6 shadow-sm md:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#911824]/10 text-lg text-[#911824]">
                            <FaBriefcase />
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900">
                                Working Together for Better Healthcare
                            </h3>

                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Our leadership and management team works
                                together to support the hospital's mission,
                                patient welfare, and service to the community.
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}

export default OfficeBearers;