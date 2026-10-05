import Link from "next/link";
import Image from "next/image";

import { CiHeart } from "react-icons/ci";

import {
    FaUserMd,
    FaCalendarCheck,
    FaFileMedical,
    FaFlask,
} from "react-icons/fa";

import { MdOutlineMessage } from "react-icons/md";
import { RiContactsLine } from "react-icons/ri";

import MobileMenu from "./mobile_nav";
import DesktopMegaMenu from "./desktop_navbar";

/* =========================================================
   NAVIGATION DATA
========================================================= */

const utilityLinks = [
    {
        label: "Find a doctor",
        href: "/pages/doctors",
        icon: FaUserMd,
    },
    {
        label: "Book Appointment",
        href: "/book-appointment",
        icon: FaCalendarCheck,
    },
    {
        label: "Lab Tests",
        href: "/pages/lab_test",
        icon: FaFlask,
    },
    {
        label: "View Lab Reports",
        href: "/lab-reports",
        icon: FaFileMedical,
    },
    {
        label: "Whatsapp Assistance",
        href: "/pages/contact#whatsapp_assistance",
        icon: MdOutlineMessage,
    },
    {
        label: "Contact Us",
        href: "/pages/contact",
        icon: RiContactsLine,
    },
];

/* =========================================================
   NAVBAR
   Server Component / SSR
========================================================= */

function Nav() {
    return (
        <header
            className="
                sticky
                top-0
                z-50
                w-full
                max-w-full
                bg-[rgba(251,249,249,0.95)]
                shadow-[0_1px_8px_rgba(0,0,0,0.04)]
                backdrop-blur-sm
            "
        >
            {/* =====================================================
                TOP UTILITY BAR
            ===================================================== */}

            <div
                className="
                    w-full
                    border-b
                    border-[rgba(228,190,186,0.3)]
                    bg-[#F5F3F3]
                "
            >
                <div
                    className="
                        mx-auto
                        flex
                        min-h-9
                        w-full
                        max-w-7xl
                        items-center
                        justify-between
                        gap-3
                        px-5
                        sm:px-8
                        lg:px-10
                        xl:px-12
                        2xl:max-w-[1440px]
                        2xl:px-16
                    "
                >
                    {/* =================================================
                        LEFT SIDE
                    ================================================= */}

                    <div className="min-w-0 flex-1">
                        {/* =================================================
                            DESKTOP UTILITY LINKS

                            Visible from 1180px
                        ================================================= */}

                        <ul
                            className="
                                hidden
                                min-w-0
                                items-center
                                gap-3
                                text-xs
                                font-medium
                                tracking-[0.24px]
                                text-[#5B403D]
                                min-[1180px]:flex
                                min-[1250px]:gap-4
                            "
                        >
                            {utilityLinks.map(
                                ({ label, href, icon: Icon }) => (
                                    <li
                                        key={href}
                                        className="min-w-0 shrink"
                                    >
                                        <Link
                                            href={href}
                                            className="
                                                flex
                                                min-w-0
                                                items-center
                                                gap-1
                                                whitespace-nowrap
                                                transition-colors
                                                hover:text-[#86000D]
                                            "
                                        >
                                            <Icon
                                                size={12}
                                                className="shrink-0"
                                            />

                                            <span className="truncate">
                                                {label}
                                            </span>
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>

                        {/* =================================================
                            TABLET / MOBILE UTILITY LINKS

                            Hidden from 1180px and above
                        ================================================= */}

                        <div
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-2
                                min-[321px]:gap-3
                                min-[1180px]:hidden
                            "
                        >
                            {/* =================================================
                                FIND DOCTOR
                            ================================================= */}

                            <Link
                                href="/pages/doctors"
                                aria-label="Find a doctor"
                                className="
                                    flex
                                    min-w-0
                                    shrink
                                    items-center
                                    gap-1
                                    text-xs
                                    font-medium
                                    text-[#5B403D]
                                    transition-colors
                                    hover:text-[#86000D]
                                "
                            >
                                <FaUserMd
                                    size={12}
                                    className="shrink-0"
                                />

                                <span className="hidden min-[321px]:inline sm:hidden">
                                    Doctor
                                </span>

                                <span className="hidden sm:inline">
                                    Find a doctor
                                </span>
                            </Link>

                            {/* =================================================
                                BOOK APPOINTMENT
                            ================================================= */}

                            <Link
                                href="/book-appointment"
                                aria-label="Book Appointment"
                                className="
                                    flex
                                    min-w-0
                                    shrink
                                    items-center
                                    gap-1
                                    text-xs
                                    font-medium
                                    text-[#5B403D]
                                    transition-colors
                                    hover:text-[#86000D]
                                "
                            >
                                <FaCalendarCheck
                                    size={12}
                                    className="shrink-0"
                                />

                                <span className="hidden min-[321px]:inline sm:hidden">
                                    Book
                                </span>

                                <span className="hidden sm:inline">
                                    Book Appointment
                                </span>
                            </Link>

                            {/* =================================================
                                LAB TESTS
                            ================================================= */}

                            <Link
                                href="/pages/lab_test"
                                aria-label="Lab Tests"
                                className="
                                    flex
                                    min-w-0
                                    shrink
                                    items-center
                                    gap-1
                                    text-xs
                                    font-medium
                                    text-[#5B403D]
                                    transition-colors
                                    hover:text-[#86000D]
                                "
                            >
                                <FaFlask
                                    size={12}
                                    className="shrink-0"
                                />

                                <span className="hidden min-[321px]:inline sm:hidden">
                                    Lab
                                </span>

                                <span className="hidden sm:inline">
                                    Lab Tests
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================================
                MAIN NAVIGATION
            ===================================================== */}

            <div
                className="
                    relative
                    z-101
                    h-18
                    w-full
                    sm:h-20
                "
            >
                <div
                    className="
                        relative
                        z-102
                        mx-auto
                        flex
                        h-full
                        w-full
                        max-w-7xl
                        min-w-0
                        items-center
                        justify-between
                        gap-3
                        px-5
                        sm:gap-4
                        sm:px-8
                        lg:px-10
                        xl:px-12
                        2xl:max-w-360
                        2xl:px-16
                        min-[1180px]:gap-5
                    "
                >
                    {/* =================================================
                        LOGO
                    ================================================= */}

                    <Link
                        href="/"
                        className="
                            min-w-0
                            shrink
                            overflow-hidden
                        "
                    >
                        <div
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-2
                                min-[321px]:gap-3
                                sm:gap-4
                            "
                        >
                            <Image
                                loading="eager"
                                src="/logo.png"
                                alt="Bashir Memorial Welfare Hospital Logo"
                                width={48}
                                height={48}
                                className="
                                            h-9
                                            w-9
                                            shrink-0
                                            object-contain
                                            aspect-square

                                            min-[321px]:h-10
                                            min-[321px]:w-10

                                            sm:h-12
                                            sm:w-12
                                        "
                            />
                            <div
                                className="
                                    min-w-0
                                    overflow-hidden
                                "
                            >
                                <h1
                                    className="
                                        truncate
                                        text-[12px]
                                        font-bold
                                        leading-3.5
                                        text-[#86000D]
                                        min-[321px]:text-sm
                                        min-[321px]:leading-4
                                        sm:text-base
                                        sm:leading-5
                                    "
                                >
                                    Bashir Memorial
                                </h1>

                                <h2
                                    className="
                                        mt-0.5
                                        truncate
                                        text-[8px]
                                        font-medium
                                        uppercase
                                        leading-3
                                        tracking-[0.7px]
                                        text-[#5F5E5E]
                                        min-[321px]:text-[9px]
                                        min-[321px]:tracking-[1px]
                                        sm:text-xs
                                        sm:tracking-[1.2px]
                                    "
                                >
                                    Welfare Hospital
                                </h2>
                            </div>
                        </div>
                    </Link>

                    {/* =================================================
                        DESKTOP NAVIGATION

                        Starts at 1180px
                    ================================================= */}

                    <DesktopMegaMenu />

                    {/* =================================================
                        RIGHT SIDE
                    ================================================= */}

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-2
                            sm:gap-3
                        "
                    >
                        {/* =================================================
                            DONATE BUTTON

                            Now part of the MAIN NAVIGATION
                        ================================================= */}

                        <Link
                            href="/pages/donate"
                            aria-label="Donate now"
                            className="
        inline-flex
        h-9
        shrink-0
        items-center
        justify-center
        gap-1.5
        rounded-lg
        bg-[#86000D]
        px-2.5
        text-[10px]
        font-bold
        leading-none
        tracking-[0.1px]
        text-white
        shadow-[0_1px_3px_rgba(0,0,0,0.08)]
        transition-all
        duration-200
        hover:bg-[#72000A]
        hover:shadow-md
        active:scale-[0.97]

        min-[321px]:h-9.5
        min-[321px]:gap-1.5
        min-[321px]:px-3
        min-[321px]:text-[11px]

        sm:h-10
        sm:w-30
        sm:gap-2
        sm:px-3.5
        sm:text-xs

        md:w-31.25

        min-[1180px]:h-10.5
        min-[1180px]:w-32.5
    "
                        >
                            <CiHeart
                                className="shrink-0"
                                size={16}
                                strokeWidth={1.5}
                            />

                            <span className="hidden min-[321px]:inline">
                                Donate Now
                            </span>

                            <span className="min-[321px]:hidden">
                                Donate
                            </span>
                        </Link>

                        {/* =================================================
                            MOBILE / TABLET MENU
                        ================================================= */}

                        <div
                            className="
                                relative
                                flex
                                shrink-0
                                min-[1180px]:hidden
                            "
                        >
                            <MobileMenu />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Nav;
