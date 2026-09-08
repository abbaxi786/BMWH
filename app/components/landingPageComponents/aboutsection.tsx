import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaRegHospital } from "react-icons/fa6";

export default function AboutSection() {
    return (
        <section className="w-full  bg-[#FBF9F9] py-16 sm:py-20 lg:py-24">

            <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-12">

                <div
                    className="
                        grid
                        w-full
                        grid-cols-1
                        items-center
                        gap-12

                        md:gap-14

                        lg:grid-cols-2
                        lg:gap-12

                        xl:gap-16
                    "
                >

                    {/* =================================================
                        LEFT CONTENT
                    ================================================= */}
                    <div
                        className="
                            flex
                            flex-col
                            items-start
                            gap-4

                            lg:pr-6
                            xl:pr-10
                        "
                    >

                        {/* Section Label */}
                        <div className="flex items-center gap-2">

                            <div className="h-1 w-7 bg-[#86000D] sm:w-8" />

                            <span
                                className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-[1.2px]
                                    text-[#86000D]

                                    sm:text-sm
                                    sm:tracking-[1.4px]
                                "
                            >
                                About BMWH
                            </span>

                        </div>


                        {/* Heading */}
                        <h2
                            className="
                                max-w-xl
                                text-[28px]
                                font-bold
                                leading-9
                                tracking-[-0.28px]
                                text-[#1B1C1C]

                                sm:text-[32px]
                                sm:leading-10

                                lg:text-[34px]

                                xl:text-[36px]
                            "
                        >
                            A Legacy of Care & Clinical Excellence
                        </h2>


                        {/* Paragraph */}
                        <p
                            className="
                                max-w-xl
                                text-sm
                                leading-6
                                text-[#5B403D]

                                sm:text-base
                            "
                        >
                            Established with a vision to provide state-of-the-art
                            medical facilities to the underprivileged, Bashir Memorial
                            Welfare Hospital stands as a beacon of hope. Our
                            comprehensive clinical departments and dedicated staff
                            ensure that every patient receives the highest standard
                            of care.
                        </p>


                        {/* Paragraph */}
                        <p
                            className="
                                max-w-xl
                                text-sm
                                leading-6
                                text-[#5B403D]

                                sm:text-base
                            "
                        >
                            Through transparent practices, community outreach, and
                            continuous medical innovation, we bridge the gap between
                            quality healthcare and affordability.
                        </p>


                        {/* Button */}
                        <div className="pt-2">

                            <Link
                                href="/pages/about"
                                className="
                                    inline-flex
                                    h-11
                                    items-center
                                    justify-center
                                    gap-2
                                    bg-[#FBF9F9]
                                    px-5
                                    text-sm
                                    font-semibold
                                    leading-5
                                    tracking-[0.14px]
                                    text-[#1B1C1C]
                                    shadow-[0_1px_2px_rgba(0,0,0,0.05)]
                                    transition-colors
                                    duration-200
                                    hover:bg-[#EFEDED]

                                    sm:px-6
                                "
                            >
                                <span>Learn More About BMWH</span>

                                <FaArrowRight size={12} />

                            </Link>

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT IMAGE
                    ================================================= */}
                    <div className="relative w-full">

                        {/* Decorative Background - Top Left */}
                        <div
                            className="
                                absolute
                                -left-4
                                -top-4
                                h-20
                                w-20
                                rounded-xl
                                bg-[rgba(134,0,13,0.1)]
                                blur-[18px]

                                sm:-left-6
                                sm:-top-6
                                sm:h-28
                                sm:w-28

                                lg:-left-8
                                lg:-top-8
                                lg:h-32
                                lg:w-32
                            "
                        />


                        {/* Decorative Background - Bottom Right */}
                        <div
                            className="
                                absolute
                                -bottom-4
                                -right-4
                                h-24
                                w-24
                                rounded-xl
                                bg-[rgba(95,94,94,0.1)]
                                blur-[18px]

                                sm:-bottom-6
                                sm:-right-6
                                sm:h-32
                                sm:w-32

                                lg:-bottom-8
                                lg:-right-8
                                lg:h-40
                                lg:w-40
                            "
                        />


                        {/* =================================================
                            IMAGE CONTAINER
                        ================================================= */}
                        <div
                            className="
                                relative
                                z-10
                                h-70
                                w-full
                                overflow-hidden
                                rounded-lg
                                bg-[#EFEDED]
                                shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]

                                sm:h-90

                                md:h-100

                                lg:h-105

                                xl:h-110
                            "
                        >

                            <Image
                                src="/images/buildingImage.jpeg"
                                alt="Bashir Memorial Welfare Hospital"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                                className="object-cover"
                            />

                        </div>


                        {/* =================================================
                            FLOATING HOSPITAL CARD
                        ================================================= */}
                        <div
                            className="
                                absolute
                                -bottom-5
                                left-3
                                z-20
                                flex
                                min-h-18
                                w-[calc(100%-24px)]
                                items-center
                                gap-3
                                rounded-lg
                                bg-[#FBF9F9]
                                p-3
                                shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]

                                sm:-bottom-6
                                sm:left-5
                                sm:w-70
                                sm:gap-4
                                sm:p-4

                                md:left-6

                                lg:-bottom-6
                                lg:left-6
                            "
                        >

                            {/* Icon */}
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[rgba(134,0,13,0.1)]

                                    sm:h-12
                                    sm:w-12
                                "
                            >
                                <FaRegHospital
                                    size={20}
                                    className="text-[#86000D] sm:h-5.5 sm:w-5.5"
                                />
                            </div>


                            {/* Stat */}
                            <div className="flex min-w-0 flex-col">

                                <span
                                    className="
                                        text-[10px]
                                        font-medium
                                        uppercase
                                        leading-4
                                        tracking-[0.5px]
                                        text-[#5B403D]

                                        sm:text-xs
                                        sm:tracking-[0.6px]
                                    "
                                >
                                    Hospital
                                </span>

                                <span
                                    className="
                                        truncate
                                        text-lg
                                        font-semibold
                                        leading-7
                                        text-[#1B1C1C]

                                        sm:text-2xl
                                        sm:leading-8
                                    "
                                >
                                    With Best Care
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}