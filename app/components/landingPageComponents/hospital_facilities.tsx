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

    if(facilities.length===0){
        return null
    }

    return (
        <section
            className="
                w-full
                bg-white

                py-16
                sm:py-20
                lg:py-24
                xl:py-28
                2xl:py-32
            "
        >
            <div
                className="
                    mx-auto
                    w-full

                    max-w-7xl
                    2xl:max-w-[1440px]
                    3xl:max-w-[1600px]

                    px-5
                    sm:px-8
                    lg:px-10
                    xl:px-12
                    2xl:px-16
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        mb-10
                        flex
                        flex-col
                        gap-6

                        md:mb-12
                        md:flex-row
                        md:items-end
                        md:justify-between

                        xl:mb-14

                        2xl:mb-16
                    "
                >

                    {/* Header Content */}

                    <div
                        className="
                            max-w-2xl

                            2xl:max-w-3xl
                        "
                    >

                        {/* Section Label */}

                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                gap-3

                                2xl:mb-4
                            "
                        >

                            <div
                                className="
                                    h-1
                                    w-7
                                    bg-[#86000D]

                                    sm:w-8

                                    2xl:w-10
                                "
                            />

                            <p
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[1.2px]
                                    text-[#86000D]

                                    sm:text-sm
                                    sm:tracking-[1.4px]

                                    2xl:text-[15px]
                                    2xl:tracking-[1.6px]
                                "
                            >
                                Our Facilities
                            </p>

                        </div>


                        {/* Heading */}

                        <h2
                            className="
                                text-[28px]
                                font-bold
                                leading-9
                                tracking-[-0.28px]
                                text-[#1B1C1C]

                                sm:text-[32px]
                                sm:leading-10

                                lg:text-[36px]
                                lg:leading-[1.2]

                                xl:text-[40px]
                                xl:leading-[1.18]

                                2xl:text-[46px]
                                2xl:leading-[1.15]
                                2xl:tracking-[-0.5px]
                            "
                        >
                            Healthcare Facilities
                        </h2>


                        {/* Description */}

                        <p
                            className="
                                mt-4
                                max-w-2xl
                                text-sm
                                leading-6
                                text-[#5B403D]

                                sm:text-base
                                sm:leading-7

                                lg:text-[17px]
                                lg:leading-7

                                xl:text-[18px]
                                xl:leading-8

                                2xl:max-w-3xl
                                2xl:text-[18px]
                                2xl:leading-8
                            "
                        >
                            Our facilities are designed to provide patients
                            with accessible, reliable, and quality healthcare
                            in a comfortable environment.
                        </p>

                    </div>


                    {/* =================================================
                        DESKTOP VIEW ALL
                    ================================================= */}

                    <Link
                        href="/pages/facilities"
                        className="
                            group
                            hidden
                            w-fit
                            shrink-0
                            items-center
                            gap-2
                            rounded-full

                            border
                            border-[#911824]

                            px-5
                            py-3

                            text-sm
                            font-semibold
                            text-[#911824]

                            transition-all
                            duration-300

                            hover:bg-[#911824]
                            hover:text-white

                            md:inline-flex
                            md:mb-1

                            lg:px-6
                            lg:py-3.5

                            2xl:px-7
                            2xl:py-4
                            2xl:text-[15px]
                        "
                    >
                        View All Facilities

                        <FaArrowRight
                            className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                            "
                        />

                    </Link>

                </div>


                {/* =================================================
                    LOADING SKELETON
                ================================================= */}

                {loading && (

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-6

                            sm:grid-cols-2

                            lg:grid-cols-3

                            xl:gap-7

                            2xl:gap-8
                        "
                    >

                        {[1, 2, 3].map((item) => (

                            <div
                                key={item}
                                className="
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    bg-white

                                    animate-pulse

                                    2xl:rounded-[20px]
                                "
                            >

                                {/* Image Skeleton */}

                                <div
                                    className="
                                        h-56
                                        bg-gray-200

                                        lg:h-64

                                        xl:h-72

                                        2xl:h-80
                                    "
                                />

                                {/* Content Skeleton */}

                                <div
                                    className="
                                        space-y-4
                                        p-6

                                        2xl:p-7
                                    "
                                >

                                    <div
                                        className="
                                            h-5
                                            w-2/3
                                            rounded
                                            bg-gray-200

                                            2xl:h-6
                                        "
                                    />

                                    <div
                                        className="
                                            h-4
                                            rounded
                                            bg-gray-200
                                        "
                                    />

                                    <div
                                        className="
                                            h-4
                                            w-5/6
                                            rounded
                                            bg-gray-200
                                        "
                                    />

                                </div>

                            </div>

                        ))}

                    </div>

                )}


                {/* =================================================
                    FACILITIES
                ================================================= */}

                {!loading && facilities.length > 0 && (

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-6

                            sm:grid-cols-2

                            lg:grid-cols-3

                            xl:gap-7

                            2xl:gap-8
                        "
                    >

                        {facilities.map((facility) => (

                            <article
                                key={facility.id}
                                className="
                                    group
                                    flex
                                    h-full
                                    flex-col
                                    overflow-hidden
                                    rounded-2xl

                                    border
                                    border-gray-200

                                    bg-white

                                    shadow-sm

                                    transition-all
                                    duration-300

                                    hover:-translate-y-1
                                    hover:border-[#911824]/20
                                    hover:shadow-xl

                                    2xl:rounded-[20px]
                                "
                            >

                                {/* =================================================
                                    IMAGE
                                ================================================= */}

                                <div
                                    className="
                                        relative
                                        h-56
                                        w-full
                                        shrink-0
                                        overflow-hidden
                                        bg-gray-100

                                        lg:h-64

                                        xl:h-72

                                        2xl:h-80
                                    "
                                >

                                    {facility.image_url ? (

                                        <Image
                                            src={facility.image_url}
                                            alt={facility.name}
                                            fill
                                            sizes="
                                                (max-width: 640px) 100vw,
                                                (max-width: 1024px) 50vw,
                                                (max-width: 1536px) 33vw,
                                                33vw
                                            "
                                            className="
                                                object-cover
                                                transition-transform
                                                duration-500
                                                group-hover:scale-105
                                            "
                                        />

                                    ) : (

                                        <div
                                            className="
                                                flex
                                                h-full
                                                w-full
                                                items-center
                                                justify-center
                                                bg-[#911824]/5
                                            "
                                        >
                                            <FaHospital
                                                className="
                                                    text-5xl
                                                    text-[#911824]/40

                                                    2xl:text-6xl
                                                "
                                            />
                                        </div>

                                    )}


                                    {/* =================================================
                                        STATUS
                                    ================================================= */}

                                    {facility.status && (

                                        <span
                                            className="
                                                absolute
                                                left-4
                                                top-4

                                                inline-flex
                                                items-center
                                                gap-2

                                                rounded-full
                                                bg-white/95

                                                px-3
                                                py-1.5

                                                text-xs
                                                font-semibold
                                                text-green-700

                                                shadow-sm

                                                2xl:left-5
                                                2xl:top-5
                                                2xl:px-4
                                                2xl:py-2
                                                2xl:text-sm
                                            "
                                        >

                                            <FaCheckCircle
                                                className="text-xs 2xl:text-sm"
                                            />

                                            {facility.status}

                                        </span>

                                    )}

                                </div>


                                {/* =================================================
                                    CONTENT
                                ================================================= */}

                                <div
                                    className="
                                        flex
                                        flex-1
                                        flex-col
                                        p-6

                                        xl:p-6

                                        2xl:p-7
                                    "
                                >

                                    {/* Facility Name */}

                                    <h3
                                        className="
                                            text-xl
                                            font-bold
                                            leading-7
                                            text-gray-900

                                            transition-colors
                                            duration-300

                                            group-hover:text-[#911824]

                                            2xl:text-[22px]
                                            2xl:leading-8
                                        "
                                    >
                                        {facility.name}
                                    </h3>


                                    {/* Description */}

                                    {facility.description && (

                                        <p
                                            className="
                                                mt-3
                                                line-clamp-3
                                                text-sm
                                                leading-6
                                                text-gray-600

                                                xl:text-[15px]
                                                xl:leading-6

                                                2xl:text-base
                                                2xl:leading-7
                                            "
                                        >
                                            {facility.description}
                                        </p>

                                    )}


                                    {/* Learn More */}

                                    <Link
                                        href={`/pages/facilities/${facility.id}`}
                                        className="
                                            group/link
                                            mt-auto
                                            inline-flex
                                            items-center
                                            gap-2

                                            pt-5

                                            text-sm
                                            font-semibold
                                            text-[#911824]

                                            transition-all
                                            duration-300

                                            hover:gap-3

                                            2xl:pt-6
                                            2xl:text-[15px]
                                        "
                                    >
                                        Learn More

                                        <FaArrowRight
                                            className="
                                                text-xs
                                                transition-transform
                                                duration-300
                                                group-hover/link:translate-x-1

                                                2xl:text-sm
                                            "
                                        />

                                    </Link>

                                </div>

                            </article>

                        ))}

                    </div>

                )}


                {/* =================================================
                    NO FACILITIES
                ================================================= */}

                {!loading && facilities.length === 0 && (

                    <div
                        className="
                            py-12
                            text-center

                            2xl:py-16
                        "
                    >

                        <FaHospital
                            className="
                                mx-auto
                                mb-4
                                text-4xl
                                text-gray-300

                                2xl:text-5xl
                            "
                        />

                        <p
                            className="
                                text-gray-500

                                2xl:text-base
                            "
                        >
                            No facilities are currently available.
                        </p>

                    </div>

                )}


                {/* =================================================
                    MOBILE VIEW ALL
                ================================================= */}

                <div
                    className="
                        mt-8
                        flex
                        justify-center

                        md:hidden
                    "
                >

                    <Link
                        href="/pages/facilities"
                        className="
                            group
                            inline-flex
                            items-center
                            gap-2

                            rounded-full

                            bg-[#911824]

                            px-5
                            py-3

                            text-sm
                            font-semibold
                            text-white

                            transition-all
                            duration-300

                            hover:bg-[#7c141f]
                        "
                    >
                        View All Facilities

                        <FaArrowRight
                            className="
                                text-sm
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                            "
                        />

                    </Link>

                </div>

            </div>
        </section>
    );
}