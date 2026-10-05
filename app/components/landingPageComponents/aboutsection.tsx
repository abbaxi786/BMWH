import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaRegHospital } from "react-icons/fa6";

export default function AboutSection() {
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
                    2xl:max-w-360
                    3xl:max-w-[1600px]

                    px-5
                    sm:px-8
                    lg:px-10
                    xl:px-12
                    2xl:px-16
                "
            >
                <div
                    className="
                        grid
                        w-full
                        grid-cols-1
                        items-center

                        gap-12
                        md:gap-14

                        lg:grid-cols-[0.9fr_1.1fr]
                        lg:gap-24

                        xl:gap-20

                        2xl:grid-cols-[0.9fr_1.1fr]
                        2xl:gap-24
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
                            gap-5

                            lg:pr-4
                            xl:pr-6
                            2xl:pr-12
                        "
                    >

                        {/* Section Label */}
                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    h-1
                                    w-7
                                    bg-[#86000D]

                                    sm:w-8

                                    2xl:w-10
                                "
                            />

                            <span
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

                                lg:text-[36px]
                                lg:leading-[1.2]

                                xl:text-[40px]
                                xl:leading-[1.18]

                                2xl:max-w-2xl
                                2xl:text-[46px]
                                2xl:leading-[1.15]
                                2xl:tracking-[-0.5px]
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
                                sm:leading-7

                                lg:text-[17px]
                                lg:leading-7

                                xl:text-[18px]
                                xl:leading-8

                                2xl:max-w-2xl
                                2xl:text-[18px]
                                2xl:leading-8
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
                                sm:leading-7

                                lg:text-[17px]
                                lg:leading-7

                                xl:text-[18px]
                                xl:leading-8

                                2xl:max-w-2xl
                                2xl:text-[18px]
                                2xl:leading-8
                            "
                        >
                            Through transparent practices, community outreach, and
                            continuous medical innovation, we bridge the gap between
                            quality healthcare and affordability.
                        </p>


                        {/* Button */}
                        <div className="pt-2 lg:pt-3 2xl:pt-5">

                            <Link
                                href="/pages/about"
                                className="
                                    inline-flex
                                    h-11
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-sm
                                    bg-white
                                    px-5
                                    text-sm
                                    font-semibold
                                    leading-5
                                    tracking-[0.14px]
                                    text-[#1B1C1C]
                                    shadow-[0_1px_2px_rgba(0,0,0,0.05)]
                                    transition-all
                                    duration-200

                                    hover:bg-[#EFEDED]
                                    hover:gap-3

                                    sm:h-12
                                    sm:px-6

                                    2xl:h-13
                                    2xl:px-7
                                    2xl:text-[15px]
                                "
                            >
                                <span>Learn More About BMWH</span>

                                <FaArrowRight
                                    size={12}
                                    className="2xl:h-3.5 2xl:w-3.5"
                                />

                            </Link>

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT IMAGE
                    ================================================= */}
                    <div
                        className="
                            relative
                            w-full

                            lg:pl-2
                            xl:pl-0
                        "
                    >

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

                                2xl:-left-10
                                2xl:-top-10
                                2xl:h-40
                                2xl:w-40
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

                                2xl:-bottom-10
                                2xl:-right-10
                                2xl:h-48
                                2xl:w-48
                            "
                        />


                        {/* =================================================
                            IMAGE CONTAINER
                        ================================================= */}
                        <div
                            className="
                                relative
                                z-10
                                w-full
                                overflow-hidden
                                rounded-lg
                                bg-[#EFEDED]

                                h-70

                                sm:h-90

                                md:h-100

                                lg:h-110

                                xl:h-125

                                2xl:h-140

                                3xl:h-[620px]

                                shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]
                            "
                        >

                            <Image
                                src="/images/buildingImage.jpeg"
                                alt="Bashir Memorial Welfare Hospital"
                                fill
                                sizes="
                                    (max-width: 768px) 100vw,
                                    (max-width: 1024px) 100vw,
                                    (max-width: 1280px) 55vw,
                                    (max-width: 1536px) 55vw,
                                    60vw
                                "
                                className="
                                    object-cover
                                    transition-transform
                                    duration-700
                                    hover:scale-[1.02]
                                "
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
                                lg:left-8
                                lg:w-80
                                lg:p-5

                                xl:left-10

                                2xl:-bottom-7
                                2xl:left-12
                                2xl:w-88
                                2xl:gap-5
                                2xl:p-5
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

                                    lg:h-14
                                    lg:w-14

                                    2xl:h-16
                                    2xl:w-16
                                "
                            >
                                <FaRegHospital
                                    size={20}
                                    className="
                                        text-[#86000D]

                                        sm:h-5.5
                                        sm:w-5.5

                                        lg:h-6
                                        lg:w-6

                                        2xl:h-7
                                        2xl:w-7
                                    "
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

                                        2xl:text-sm
                                        2xl:tracking-[0.8px]
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

                                        lg:text-[26px]

                                        2xl:text-[28px]
                                        2xl:leading-9
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