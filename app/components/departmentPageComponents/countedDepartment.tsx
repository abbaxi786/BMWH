import Image from "next/image";
import Link from "next/link";
import {
    FaArrowRight,
    FaHospital,
} from "react-icons/fa";

import {
    getDepartmentsWithLimit,
} from "@/lib/data/department/all_department";

interface Department {
    id: number;
    name: string;
    description?: string | null;
    image_url?: string | null;
    category?: string | null;
    slug?: string | null;
}

/**
 * Get departments directly from the database function.
 *
 * No API fetch is required because this is a
 * server component.
 */
async function getDepartments(): Promise<Department[]> {
    try {
        const departments =
            await getDepartmentsWithLimit(4);

        return departments as Department[];
    } catch (error) {
        console.error(
            "Error fetching departments:",
            error
        );

        return [];
    }
}

export default async function DepartmentsSection() {
    const departments = await getDepartments();

    return (
        <section
            className="
                w-full
                bg-[#FBF9F9]

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
                                Our Departments
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
                            Specialized Care for Every Need
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
                            Explore our specialized medical departments and
                            discover comprehensive healthcare services provided
                            by our experienced medical team.
                        </p>

                    </div>


                    {/* =================================================
                        VIEW ALL BUTTON
                    ================================================= */}

                    <Link
                        href="/pages/departments"
                        className="
                            group
                            inline-flex
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

                            md:mb-1

                            lg:px-6
                            lg:py-3.5

                            2xl:px-7
                            2xl:py-4
                            2xl:text-[15px]
                        "
                    >
                        View All Departments

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
                    DEPARTMENTS
                ================================================= */}

                {departments.length > 0 ? (

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-6

                            sm:grid-cols-2

                            lg:grid-cols-4

                            xl:gap-7
                            2xl:gap-8
                        "
                    >

                        {departments.map((department) => (

                            <Link
                                key={department.id}
                                href={`/pages/departments/department/${department.slug}`}
                                className="
                                    group
                                    flex
                                    h-full
                                    flex-col
                                    overflow-hidden
                                    rounded-2xl
                                    bg-white

                                    shadow-sm
                                    ring-1
                                    ring-gray-100

                                    transition-all
                                    duration-300

                                    hover:-translate-y-1
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
                                        aspect-[4/3]
                                        w-full
                                        shrink-0
                                        overflow-hidden
                                        bg-gray-100

                                        2xl:aspect-[4/3]
                                    "
                                >

                                    {department.image_url ? (

                                        <Image
                                            src={department.image_url}
                                            alt={department.name}
                                            fill
                                            sizes="
                                                (max-width: 640px) 100vw,
                                                (max-width: 1024px) 50vw,
                                                (max-width: 1536px) 25vw,
                                                25vw
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
                                            "
                                        >
                                            <FaHospital
                                                className="
                                                    text-5xl
                                                    text-gray-300

                                                    2xl:text-6xl
                                                "
                                            />
                                        </div>

                                    )}


                                    {/* Category */}

                                    {department.category && (

                                        <div
                                            className="
                                                absolute
                                                left-4
                                                top-4

                                                rounded-full
                                                bg-white/95

                                                px-3
                                                py-1

                                                text-xs
                                                font-semibold
                                                text-[#911824]

                                                shadow-sm

                                                2xl:left-5
                                                2xl:top-5
                                                2xl:px-4
                                                2xl:py-1.5
                                                2xl:text-sm
                                            "
                                        >
                                            {department.category}
                                        </div>

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
                                        p-5

                                        xl:p-6
                                        2xl:p-7
                                    "
                                >

                                    {/* Department Name */}

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
                                        {department.name}
                                    </h3>


                                    {/* Description */}

                                    {department.description && (

                                        <p
                                            className="
                                                mt-2
                                                line-clamp-3
                                                text-sm
                                                leading-6
                                                text-gray-600

                                                xl:text-[15px]
                                                xl:leading-6

                                                2xl:mt-3
                                                2xl:text-base
                                                2xl:leading-7
                                            "
                                        >
                                            {department.description}
                                        </p>

                                    )}


                                    {/* View Department */}

                                    <div
                                        className="
                                            mt-auto
                                            inline-flex
                                            items-center
                                            gap-2

                                            pt-5

                                            text-sm
                                            font-semibold
                                            text-[#911824]

                                            2xl:pt-6
                                            2xl:text-[15px]
                                        "
                                    >
                                        View Department

                                        <FaArrowRight
                                            className="
                                                transition-transform
                                                duration-300
                                                group-hover:translate-x-1
                                            "
                                        />

                                    </div>

                                </div>

                            </Link>

                        ))}

                    </div>

                ) : (

                    /* =================================================
                        EMPTY STATE
                    ================================================= */

                    <div
                        className="
                            rounded-2xl
                            bg-white
                            px-6
                            py-12
                            text-center
                            shadow-sm

                            2xl:py-16
                        "
                    >

                        <FaHospital
                            className="
                                mx-auto
                                text-4xl
                                text-gray-300

                                2xl:text-5xl
                            "
                        />

                        <p
                            className="
                                mt-4
                                text-gray-500

                                2xl:text-base
                            "
                        >
                            No departments available at the moment.
                        </p>

                    </div>

                )}

            </div>
        </section>
    );
}
