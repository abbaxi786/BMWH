import Link from "next/link";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
    FaArrowRight,
} from "react-icons/fa";

function ContactUsCard() {
    return (
        <section
            className="
                w-full
                bg-[#FBF9F9]

                px-5
                py-12

                sm:px-8
                sm:py-14

                lg:px-10
                lg:py-16

                xl:px-12
                xl:py-20

                2xl:px-16
                2xl:py-24
            "
        >
            <div
                className="
                    mx-auto
                    w-full

                    max-w-7xl

                    2xl:max-w-[1440px]

                    3xl:max-w-[1600px]
                "
            >

                {/* =================================================
                    MAIN CONTACT CARD
                ================================================= */}

                <div
                    className="
                        relative
                        overflow-hidden

                        rounded-2xl
                        border
                        border-[#E8D7D5]

                        bg-white

                        shadow-[0_10px_35px_rgba(27,28,28,0.06)]

                        lg:rounded-3xl
                    "
                >

                    {/* =================================================
                        DECORATIVE BACKGROUND
                    ================================================= */}

                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            -right-24
                            -top-24
                            h-64
                            w-64
                            rounded-full
                            bg-[#86000D]/[0.04]
                            blur-3xl

                            2xl:h-80
                            2xl:w-80
                        "
                    />

                    <div
                        aria-hidden="true"
                        className="
                            pointer-events-none
                            absolute
                            -bottom-24
                            -left-24
                            h-64
                            w-64
                            rounded-full
                            bg-[#E4BEBA]/30
                            blur-3xl
                        "
                    />


                    <div
                        className="
                            relative
                            z-10
                            grid

                            lg:grid-cols-[0.85fr_1.15fr]
                        "
                    >

                        {/* =================================================
                            LEFT — INTRODUCTION
                        ================================================= */}

                        <div
                            className="
                                flex
                                flex-col
                                justify-center

                                p-6

                                sm:p-8

                                md:p-10

                                lg:p-12

                                xl:p-14

                                2xl:p-16
                            "
                        >

                            {/* Label */}

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2.5
                                "
                            >

                                <span
                                    aria-hidden="true"
                                    className="
                                        h-1
                                        w-7
                                        rounded-full
                                        bg-[#86000D]

                                        sm:w-8
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
                                    "
                                >
                                    Contact Us
                                </span>

                            </div>


                            {/* Heading */}

                            <h2
                                className="
                                    mt-3

                                    max-w-lg

                                    text-[28px]
                                    font-bold
                                    leading-9
                                    tracking-[-0.3px]
                                    text-[#1B1C1C]

                                    sm:text-3xl
                                    sm:leading-10

                                    lg:text-[36px]
                                    lg:leading-[1.2]

                                    xl:text-[40px]

                                    2xl:text-[44px]
                                "
                            >
                                We’re Here to Help
                            </h2>


                            {/* Description */}

                            <p
                                className="
                                    mt-4

                                    max-w-xl

                                    text-sm
                                    leading-6
                                    text-[#5B403D]

                                    sm:text-base
                                    sm:leading-7

                                    lg:text-[17px]
                                    lg:leading-7
                                "
                            >
                                Have a question about our services,
                                departments, or appointments? Get in touch
                                with Bashir Memorial Welfare Hospital.
                            </p>


                            {/* CTA */}

                            <div className="mt-6 sm:mt-7">

                                <Link
                                    href="/contact"
                                    aria-label="Contact Bashir Memorial Welfare Hospital"
                                    className="
                                        group
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2

                                        rounded-lg

                                        bg-[#86000D]
                                        px-5
                                        py-3

                                        text-sm
                                        font-semibold
                                        text-white

                                        shadow-sm

                                        transition-all
                                        duration-300

                                        hover:bg-[#6f000a]
                                        hover:shadow-md

                                        focus:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-[#86000D]
                                        focus-visible:ring-offset-2
                                    "
                                >
                                    <span>Contact Us</span>

                                    <FaArrowRight
                                        aria-hidden="true"
                                        size={12}
                                        className="
                                            transition-transform
                                            duration-300
                                            group-hover:translate-x-1
                                        "
                                    />

                                </Link>

                            </div>

                        </div>


                        {/* =================================================
                            RIGHT — CONTACT INFORMATION
                        ================================================= */}

                        <div
                            className="
                                border-t
                                border-[#E8D7D5]
                                bg-[#FBF9F9]

                                p-6

                                sm:p-8

                                md:p-10

                                lg:border-l
                                lg:border-t-0
                                lg:p-10

                                xl:p-12

                                2xl:p-14
                            "
                        >

                            {/* Heading */}

                            <div className="mb-5">

                                <h3
                                    className="
                                        text-lg
                                        font-bold
                                        text-[#1B1C1C]

                                        sm:text-xl

                                        2xl:text-2xl
                                    "
                                >
                                    Important Contact Information
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        leading-5
                                        text-[#5B403D]
                                    "
                                >
                                    Reach us through any of the following
                                    channels.
                                </p>

                            </div>


                            {/* =================================================
                                CONTACT GRID
                            ================================================= */}

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-3

                                    sm:grid-cols-2
                                    sm:gap-4

                                    xl:gap-5
                                "
                            >

                                {/* =================================================
                                    PHONE
                                ================================================= */}

                                <a
                                    href="tel:+924211234567"
                                    aria-label="Call Bashir Memorial Welfare Hospital at +92 42 112 345 67"
                                    className="
                                        group
                                        flex
                                        items-start
                                        gap-3

                                        rounded-xl
                                        border
                                        border-[#E8D7D5]
                                        bg-white

                                        p-4

                                        transition-all
                                        duration-300

                                        hover:-translate-y-0.5
                                        hover:border-[#E4BEBA]
                                        hover:shadow-[0_8px_20px_rgba(134,0,13,0.07)]

                                        focus:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-[#86000D]
                                        focus-visible:ring-offset-2
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center

                                            rounded-lg

                                            bg-[#86000D]/10
                                            text-[#86000D]

                                            transition-colors
                                            duration-300

                                            group-hover:bg-[#86000D]
                                            group-hover:text-white
                                        "
                                    >
                                        <FaPhoneAlt
                                            aria-hidden="true"
                                            size={15}
                                        />
                                    </div>


                                    <div className="min-w-0">

                                        <p
                                            className="
                                                text-xs
                                                font-medium
                                                uppercase
                                                tracking-wide
                                                text-[#7A6663]
                                            "
                                        >
                                            Phone
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                truncate
                                                text-sm
                                                font-semibold
                                                text-[#1B1C1C]

                                                group-hover:text-[#86000D]

                                                sm:text-[15px]
                                            "
                                        >
                                            +92 42 112 345 67
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                text-[#7A6663]
                                            "
                                        >
                                            Main hospital line
                                        </p>

                                    </div>

                                </a>


                                {/* =================================================
                                    EMAIL
                                ================================================= */}

                                <a
                                    href="mailto:info@bmwh.org"
                                    aria-label="Email Bashir Memorial Welfare Hospital at info@bmwh.org"
                                    className="
                                        group
                                        flex
                                        items-start
                                        gap-3

                                        rounded-xl
                                        border
                                        border-[#E8D7D5]
                                        bg-white

                                        p-4

                                        transition-all
                                        duration-300

                                        hover:-translate-y-0.5
                                        hover:border-[#E4BEBA]
                                        hover:shadow-[0_8px_20px_rgba(134,0,13,0.07)]

                                        focus:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-[#86000D]
                                        focus-visible:ring-offset-2
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center

                                            rounded-lg

                                            bg-[#86000D]/10
                                            text-[#86000D]

                                            transition-colors
                                            duration-300

                                            group-hover:bg-[#86000D]
                                            group-hover:text-white
                                        "
                                    >
                                        <FaEnvelope
                                            aria-hidden="true"
                                            size={15}
                                        />
                                    </div>


                                    <div className="min-w-0">

                                        <p
                                            className="
                                                text-xs
                                                font-medium
                                                uppercase
                                                tracking-wide
                                                text-[#7A6663]
                                            "
                                        >
                                            Email
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                truncate
                                                text-sm
                                                font-semibold
                                                text-[#1B1C1C]

                                                group-hover:text-[#86000D]

                                                sm:text-[15px]
                                            "
                                        >
                                            info@bmwh.org
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                text-[#7A6663]
                                            "
                                        >
                                            General inquiries
                                        </p>

                                    </div>

                                </a>


                                {/* =================================================
                                    ADDRESS
                                ================================================= */}

                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-3

                                        rounded-xl
                                        border
                                        border-[#E8D7D5]
                                        bg-white

                                        p-4
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center

                                            rounded-lg

                                            bg-[#86000D]/10
                                            text-[#86000D]
                                        "
                                    >
                                        <FaMapMarkerAlt
                                            aria-hidden="true"
                                            size={15}
                                        />
                                    </div>


                                    <div className="min-w-0">

                                        <p
                                            className="
                                                text-xs
                                                font-medium
                                                uppercase
                                                tracking-wide
                                                text-[#7A6663]
                                            "
                                        >
                                            Hospital Address
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                font-semibold
                                                leading-5
                                                text-[#1B1C1C]
                                            "
                                        >
                                            Bashir Memorial Welfare Hospital
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                leading-5
                                                text-[#7A6663]
                                            "
                                        >
                                            Lahore, Punjab, Pakistan
                                        </p>

                                    </div>

                                </div>


                                {/* =================================================
                                    VISITING HOURS
                                ================================================= */}

                                <div
                                    className="
                                        flex
                                        items-start
                                        gap-3

                                        rounded-xl
                                        border
                                        border-[#E8D7D5]
                                        bg-white

                                        p-4
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center

                                            rounded-lg

                                            bg-[#86000D]/10
                                            text-[#86000D]
                                        "
                                    >
                                        <FaClock
                                            aria-hidden="true"
                                            size={15}
                                        />
                                    </div>


                                    <div className="min-w-0">

                                        <p
                                            className="
                                                text-xs
                                                font-medium
                                                uppercase
                                                tracking-wide
                                                text-[#7A6663]
                                            "
                                        >
                                            Visiting & Inquiry Hours
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                font-semibold
                                                text-[#1B1C1C]
                                            "
                                        >
                                            Monday – Saturday
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-xs
                                                text-[#7A6663]
                                            "
                                        >
                                            9:00 AM – 5:00 PM
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default ContactUsCard;