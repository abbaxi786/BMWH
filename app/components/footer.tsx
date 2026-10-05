import Link from "next/link";
import Image from "next/image";
import {
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaClock,
    FaArrowRight,
} from "react-icons/fa";

const FOOTER_LINKS = {
    hospital: [
        { label: "About Us", href: "/pages/about" },
        { label: "Departments", href: "/pages/departments" },
        { label: "Doctors", href: "/doctors" },
        { label: "Hospital Facilities", href: "/pages/facilities" },
        {
            label: "Diagnostic Services",
            href: "/pages/diagnostic-services",
        },
    ],

    patientCare: [
        { label: "Patient Care", href: "/patient-care" },
        { label: "Events & Activities", href: "/pages/event" },
        {
            label: "Success Stories",
            href: "/pages/success_stories",
        },
        { label: "Latest News", href: "/news" },
        {
            label: "Support Us",
            href: "/pages/about/#supporters",
        },
    ],
};

const SOCIAL_LINKS = [
    {
        label: "Facebook",
        href: "https://www.facebook.com/profile.php?id=61592074031243",
        icon: FaFacebookF,
    },
    {
        label: "Instagram",
        href: "https://www.instagram.com/bashirmemorialbmt?igsh=MXhxamZsOHl6andpaA==",
        icon: FaInstagram,
    },
    {
        label: "YouTube",
        href: "https://www.youtube.com/@bmwhospital",
        icon: FaYoutube,
    },
];

interface FooterColumnProps {
    title: string;
    links: {
        label: string;
        href: string;
    }[];
}

const footerContainerClass = `
    mx-auto
    w-full
    max-w-7xl
    px-5
    sm:px-8
    lg:px-10
    xl:px-12
    2xl:max-w-[1440px]
    2xl:px-16
`;

/* =========================================================
   FOOTER COLUMN
========================================================= */

function FooterColumn({
    title,
    links,
}: FooterColumnProps) {
    return (
        <nav
            aria-label={title}
            className="
                min-w-0
                flex-1
                basis-full
                sm:basis-[45%]
                lg:basis-[21%]
                xl:basis-[18%]
            "
        >
            <h3
                className="
                    mb-4
                    text-base
                    font-semibold
                    uppercase
                    tracking-[0.8px]
                    text-[#E11D2E]
                "
            >
                {title}
            </h3>

            <div className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                    <Link
                        key={href}
                        href={href}
                        className="
                            w-fit
                            text-[15px]
                            leading-6
                            text-zinc-300
                            transition-colors
                            duration-200
                            hover:text-[#E11D2E]
                        "
                    >
                        {label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

/* =========================================================
   SOCIAL LINKS
========================================================= */

function SocialLinks() {
    return (
        <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(
                ({ label, href, icon: Icon }) => (
                    <Link
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-zinc-700
                            bg-zinc-800
                            text-[#E11D2E]
                            transition-all
                            duration-200
                            hover:border-[#E11D2E]
                            hover:bg-[#911824]
                            hover:text-white
                        "
                    >
                        <Icon size={14} />
                    </Link>
                )
            )}
        </div>
    );
}

/* =========================================================
   HOSPITAL INTRODUCTION
========================================================= */

function HospitalIntroduction() {
    return (
        <div
            className="
                min-w-0
                flex-1
                basis-full
                sm:basis-[45%]
                lg:basis-[23%]
                xl:basis-[21%]
            "
        >
            <div className="flex flex-col items-start gap-4">
                <Link
                    href="/"
                    aria-label="Bashir Memorial Welfare Hospital"
                    className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-xl
                        bg-white
                        p-1.5
                        shadow-md
                    "
                >
                    <Image
                        loading="eager"
                        src="/logo.png"
                        alt="Bashir Memorial Welfare Hospital logo"
                        width={48}
                        height={48}
                        priority
                        className="
                            h-12
                            w-12
                            object-contain
                        "
                    />
                </Link>

                <p
                    className="
                        max-w-[285px]
                        text-[15px]
                        leading-6
                        text-zinc-300
                    "
                >
                    Bashir Memorial Welfare Hospital
                    (BMWH) is committed to providing
                    world-class healthcare to all,
                    regardless of their financial status.
                </p>

                <SocialLinks />
            </div>
        </div>
    );
}

/* =========================================================
   CONTACT INFORMATION
========================================================= */

function ContactInformation() {
    return (
        <div
            className="
                min-w-0
                flex-1
                basis-full
                sm:basis-[45%]
                lg:basis-[23%]
                xl:basis-[21%]
            "
        >
            {/* Contact Us Heading - Internal Link */}
            <Link
                href="/pages/contact"
                className="
                    group
                    mb-4
                    inline-flex
                    items-center
                    gap-2
                "
                aria-label="Contact Us"
            >
                <h3
                    className="
                        text-base
                        font-semibold
                        uppercase
                        tracking-[0.8px]
                        text-[#E11D2E]
                        transition-colors
                        duration-200
                        group-hover:text-white
                    "
                >
                    Contact Us
                </h3>

                <FaArrowRight
                    size={10}
                    className="
                        text-[#E11D2E]
                        transition-all
                        duration-200
                        group-hover:translate-x-1
                        group-hover:text-white
                    "
                />
            </Link>

            <div className="flex flex-col gap-4">

                {/* Address */}
                <div className="flex items-start gap-3">
                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#911824]/20
                            text-[#E11D2E]
                        "
                    >
                        <FaMapMarkerAlt size={14} />
                    </div>

                    <div className="min-w-0">
                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-zinc-500
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
                                text-white
                            "
                        >
                            Bashir Memorial Welfare Hospital
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                leading-5
                                text-zinc-300
                            "
                        >
                            Lahore, Punjab, Pakistan
                        </p>
                    </div>
                </div>

                {/* Phone */}
                <a
                    href="tel:+924211234567"
                    aria-label="Call Bashir Memorial Welfare Hospital"
                    className="
                        group
                        flex
                        items-start
                        gap-3
                    "
                >
                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#911824]/20
                            text-[#E11D2E]
                            transition-all
                            duration-200
                            group-hover:bg-[#E11D2E]
                            group-hover:text-white
                        "
                    >
                        <FaPhoneAlt size={13} />
                    </div>

                    <div className="min-w-0">
                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-zinc-500
                            "
                        >
                            Phone
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                font-semibold
                                text-white
                                transition-colors
                                duration-200
                                group-hover:text-[#E11D2E]
                            "
                        >
                            +92 42 112 345 67
                        </p>
                    </div>
                </a>

                {/* Email */}
                <a
                    href="mailto:info@bmwh.org"
                    aria-label="Email Bashir Memorial Welfare Hospital"
                    className="
                        group
                        flex
                        items-start
                        gap-3
                    "
                >
                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#911824]/20
                            text-[#E11D2E]
                            transition-all
                            duration-200
                            group-hover:bg-[#E11D2E]
                            group-hover:text-white
                        "
                    >
                        <FaEnvelope size={13} />
                    </div>

                    <div className="min-w-0">
                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-zinc-500
                            "
                        >
                            Email
                        </p>

                        <p
                            className="
                                mt-1
                                break-all
                                text-sm
                                font-semibold
                                text-white
                                transition-colors
                                duration-200
                                group-hover:text-[#E11D2E]
                            "
                        >
                            info@bmwh.org
                        </p>
                    </div>
                </a>

                {/* Hours */}
                <div className="flex items-start gap-3">
                    <div
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#911824]/20
                            text-[#E11D2E]
                        "
                    >
                        <FaClock size={13} />
                    </div>

                    <div className="min-w-0">
                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-zinc-500
                            "
                        >
                            Visiting & Inquiry Hours
                        </p>

                        <p
                            className="
                                mt-1
                                text-sm
                                font-semibold
                                text-white
                            "
                        >
                            Monday – Saturday
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-sm
                                text-zinc-300
                            "
                        >
                            9:00 AM – 5:00 PM
                        </p>
                    </div>
                </div>

                {/* Get Directions */}
                <a
                    href="https://www.google.com/maps/dir/?api=1&destination=31.558139,74.3089297"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        group
                        inline-flex
                        w-fit
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-[#E11D2E]
                        transition-all
                        duration-200
                        hover:gap-3
                        hover:text-white
                    "
                >
                    <FaMapMarkerAlt size={12} />
                    <span>Get Directions</span>
                    <FaArrowRight
                        size={11}
                        className="
                            transition-transform
                            duration-200
                            group-hover:translate-x-1
                        "
                    />
                </a>

            </div>
        </div>
    );
}

/* =========================================================
   FOOTER BOTTOM
========================================================= */

function FooterBottom() {
    return (
        <div
            className="
                border-t
                border-zinc-800
                bg-zinc-950
            "
        >
            <div
                className={`
                    ${footerContainerClass}

                    flex
                    min-h-[49px]
                    flex-col
                    items-center
                    justify-between
                    gap-3
                    py-4

                    sm:flex-row
                    sm:items-center
                `}
            >
                {/* Copyright */}
                <p
                    className="
                        text-center
                        text-xs
                        font-medium
                        leading-4
                        tracking-[0.24px]
                        text-zinc-400
                        sm:text-left
                    "
                >
                    © 2026{" "}
                    <span className="text-[#E11D2E]">
                        Bashir Memorial Welfare Hospital
                    </span>
                    . All rights reserved.
                </p>

                {/* Legal Links */}
                <nav
                    aria-label="Legal navigation"
                    className="
                        flex
                        flex-wrap
                        items-center
                        justify-center
                        gap-4
                        sm:justify-end
                    "
                >
                    <Link
                        href="/privacy-policy"
                        className="
                            text-xs
                            font-medium
                            leading-4
                            tracking-[0.24px]
                            text-zinc-400
                            transition-colors
                            duration-200
                            hover:text-[#E11D2E]
                        "
                    >
                        Privacy Policy
                    </Link>

                    <span
                        className="
                            hidden
                            h-3
                            w-px
                            bg-zinc-700
                            sm:block
                        "
                    />

                    <Link
                        href="/terms"
                        className="
                            text-xs
                            font-medium
                            leading-4
                            tracking-[0.24px]
                            text-zinc-400
                            transition-colors
                            duration-200
                            hover:text-[#E11D2E]
                        "
                    >
                        Terms of Use
                    </Link>

                    <span
                        className="
                            hidden
                            h-3
                            w-px
                            bg-zinc-700
                            sm:block
                        "
                    />

                    <Link
                        href="/sitemap"
                        className="
                            text-xs
                            font-medium
                            leading-4
                            tracking-[0.24px]
                            text-zinc-400
                            transition-colors
                            duration-200
                            hover:text-[#E11D2E]
                        "
                    >
                        Sitemap
                    </Link>
                </nav>
            </div>
        </div>
    );
}

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
    return (
        <footer
            className="
                w-full
                border-t
                border-zinc-800
                bg-zinc-900
                text-white
            "
        >
            {/* =====================================================
                MAIN FOOTER
            ===================================================== */}

            <div className="w-full py-10 sm:py-12 lg:py-14">
                <div
                    className={`
                        ${footerContainerClass}

                        flex
                        flex-wrap
                        items-start
                        gap-x-8
                        gap-y-10

                        lg:gap-x-8
                        xl:gap-x-10
                    `}
                >
                    {/* 1. HOSPITAL INTRODUCTION */}
                    <HospitalIntroduction />

                    {/* 2. HOSPITAL LINKS */}
                    <FooterColumn
                        title="Hospital"
                        links={FOOTER_LINKS.hospital}
                    />

                    {/* 3. PATIENT CARE */}
                    <FooterColumn
                        title="Patient Care"
                        links={FOOTER_LINKS.patientCare}
                    />

                    {/* 4. CONTACT INFORMATION */}
                    <ContactInformation />
                </div>
            </div>

            {/* =====================================================
                FOOTER BOTTOM
            ===================================================== */}

            <FooterBottom />
        </footer>
    );
}
