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

const containerClass = `
    mx-auto
    w-full
    max-w-7xl
    px-5
    sm:px-8
    lg:px-10
    xl:px-12
    2xl:max-w-[1440px]
    2xl:px-16
    3xl:max-w-[1600px]
`;

function OfficeBearers() {
    return (
        <section
            id="office-bearers"
            className="
                scroll-mt-28
                w-full
                bg-[#FBF9F9]
                py-16
                sm:py-20
                lg:py-24
                xl:py-28
                2xl:py-32
            "
        >
            <div className={containerClass}>

                {/* ==================================================
                    SECTION HEADER
                ================================================== */}

                <div
                    className="
                        mx-auto
                        mb-12
                        max-w-3xl
                        text-center
                        sm:mb-14
                        lg:mb-16
                        xl:mb-18
                        2xl:mb-20
                    "
                >
                    <div className="mb-4 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-[#911824] sm:text-sm">
                        <span className="h-0.5 w-7 bg-[#911824] sm:w-8" />

                        Leadership & Management

                        <span className="h-0.5 w-7 bg-[#911824] sm:w-8" />
                    </div>

                    <h2
                        className="
                            text-3xl
                            font-bold
                            leading-tight
                            text-[#1B1C1C]
                            sm:text-4xl
                            lg:text-5xl
                            xl:text-[3.25rem]
                            2xl:text-[3.5rem]
                        "
                    >
                        Office Bearers & General Body
                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-5
                            max-w-2xl
                            text-sm
                            leading-7
                            text-[#5B403D]
                            sm:text-base
                            lg:mt-6
                            lg:leading-8
                        "
                    >
                        Meet the office bearers who contribute to the
                        administration, development, and welfare mission of
                        Bashir Memorial Welfare Hospital.
                    </p>
                </div>

                {/* ==================================================
                    OFFICE BEARERS
                ================================================== */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-5
                        sm:grid-cols-2
                        sm:gap-6
                        lg:grid-cols-3
                        lg:gap-7
                        xl:gap-8
                        2xl:gap-9
                    "
                >
                    {officeBearers.map((person, index) => (
                        <article
                            key={person.name}
                            className={`
                                group
                                relative
                                flex
                                min-h-61.25
                                flex-col
                                overflow-hidden
                                rounded-2xl
                                border
                                border-[#E4BEBA]/40
                                bg-white
                                p-6
                                shadow-[0_6px_25px_rgba(134,0,13,0.04)]
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:border-[#911824]/30
                                hover:shadow-[0_12px_35px_rgba(134,0,13,0.10)]
                                sm:min-h-63.75
                                sm:p-7
                                lg:min-h-66.25
                                lg:p-7
                                xl:min-h-70
                                xl:p-8
                                2xl:min-h-75
                                2xl:p-9
                                ${
                                    index === 0
                                        ? "sm:col-span-2 lg:col-span-1"
                                        : ""
                                }
                            `}
                        >
                            {/* Decorative Circle */}

                            <div
                                className="
                                    absolute
                                    -right-10
                                    -top-10
                                    h-28
                                    w-28
                                    rounded-full
                                    bg-[#911824]/5
                                    transition-transform
                                    duration-500
                                    group-hover:scale-125
                                "
                            />

                            {/* ==================================================
                                TOP ROW
                            ================================================== */}

                            <div className="relative flex items-center justify-between">
                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[#911824]/10
                                        text-lg
                                        text-[#911824]
                                        transition-all
                                        duration-300
                                        group-hover:bg-[#911824]
                                        group-hover:text-white
                                        sm:h-14
                                        sm:w-14
                                        sm:text-xl
                                    "
                                >
                                    <FaUserTie aria-hidden="true" />
                                </div>

                                <span
                                    className="
                                        text-xs
                                        font-bold
                                        tracking-wider
                                        text-gray-300
                                        transition-colors
                                        group-hover:text-[#911824]/30
                                    "
                                >
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                            </div>

                            {/* ==================================================
                                PERSON INFORMATION
                            ================================================== */}

                            <div className="relative mt-6">
                                <h3
                                    className="
                                        text-lg
                                        font-bold
                                        leading-snug
                                        text-[#1B1C1C]
                                        transition-colors
                                        group-hover:text-[#911824]
                                        sm:text-xl
                                    "
                                >
                                    {person.name}
                                </h3>

                                <div className="mt-3 flex items-start gap-2.5">
                                    <FaBriefcase
                                        aria-hidden="true"
                                        className="
                                            mt-1
                                            shrink-0
                                            text-xs
                                            text-[#911824]
                                        "
                                    />

                                    <p
                                        className="
                                            text-sm
                                            font-semibold
                                            leading-6
                                            text-[#911824]
                                            sm:text-[15px]
                                        "
                                    >
                                        {person.designation}
                                    </p>
                                </div>
                            </div>

                            {/* ==================================================
                                BOTTOM AREA
                            ================================================== */}

                            <div className="mt-auto pt-6">
                                <div className="h-px w-full bg-[#E4BEBA]/40" />

                                <div className="mt-4 flex items-center justify-between gap-4">
                                    <span
                                        className="
                                            text-[10px]
                                            leading-5
                                            text-[#8A7774]
                                            sm:text-xs
                                        "
                                    >
                                        Bashir Memorial Welfare Hospital
                                    </span>

                                    {/* <FaArrowRight
                                        aria-hidden="true"
                                        className="
                                            shrink-0
                                            text-xs
                                            text-gray-300
                                            transition-all
                                            duration-300
                                            group-hover:translate-x-1
                                            group-hover:text-[#911824]
                                        "
                                    /> */}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* ==================================================
                    INFORMATION NOTE
                ================================================== */}

                <div
                    className="
                        mt-8
                        rounded-2xl
                        border
                        border-[#E4BEBA]/40
                        bg-white
                        p-5
                        shadow-[0_6px_25px_rgba(134,0,13,0.04)]
                        sm:mt-10
                        sm:p-6
                        lg:mt-12
                        lg:p-8
                        xl:p-9
                        2xl:p-10
                    "
                >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">

                        {/* Icon */}

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#911824]/10
                                text-lg
                                text-[#911824]
                                sm:h-14
                                sm:w-14
                                sm:text-xl
                            "
                        >
                            <FaBriefcase aria-hidden="true" />
                        </div>

                        {/* Content */}

                        <div className="min-w-0">
                            <h3
                                className="
                                    text-lg
                                    font-bold
                                    text-[#1B1C1C]
                                    sm:text-xl
                                "
                            >
                                Working Together for Better Healthcare
                            </h3>

                            <p
                                className="
                                    mt-1
                                    max-w-4xl
                                    text-sm
                                    leading-7
                                    text-[#5B403D]
                                    sm:mt-2
                                    sm:text-[15px]
                                    sm:leading-7
                                "
                            >
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