import Link from "next/link";
import Image from "next/image";

import { MdOutlineMessage } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { RiContactsLine } from "react-icons/ri";
import { HiMenuAlt3 } from "react-icons/hi";

import {
    FaUserMd,
    FaCalendarCheck,
    FaFileMedical,
} from "react-icons/fa";

function Nav() {
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

    const navLinks = [
        {
            label: "About BMWH",
            href: "/pages/about",
        },
        {
            label: "Clinical Depts",
            href: "/pages/departments",
        },
        {
            label: "Patient Care",
            href: "/pages/patient_care",
        },
        {
            label: "Diagnostics",
            href: "/pages/diagnostic",
        },
        {
            label: "Doctors",
            href: "/pages/doctors",
        },
        {
            label: "Welfare",
            href: "/pages/welfare",
        },
        {
            label: "Donate",
            href: "/pages/donate",
        },
    ];

    return (
        <header className="sticky top-0 z-[100] w-full animate-fade-in-down bg-[rgba(251,249,249,0.95)] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">

            {/* =====================================================
                TOP UTILITY BAR
            ===================================================== */}
            <div className="border-b border-[rgba(228,190,186,0.3)] bg-[#F5F3F3]">
                <div className="mx-auto flex min-h-10 items-center justify-between px-4 sm:px-5 min-[930px]:px-8">

                    {/* =================================================
                        DESKTOP UTILITY LINKS
                    ================================================= */}
                    <ul className="hidden items-center gap-4 text-xs font-medium tracking-[0.24px] text-[#5B403D] min-[930px]:flex">
                        {utilityLinks.map(
                            ({ label, href, icon: Icon }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="flex items-center gap-1 transition-colors hover:text-[#86000D]"
                                    >
                                        <Icon size={12} />
                                        <span>{label}</span>
                                    </Link>
                                </li>
                            )
                        )}
                    </ul>


                    {/* =================================================
                        MOBILE UTILITY LINKS
                    ================================================= */}
                    <div className="flex items-center gap-3 min-[930px]:hidden">

                        <Link
                            href="/pages/doctors"
                            className="flex items-center gap-1 text-xs font-medium text-[#5B403D] transition-colors hover:text-[#86000D]"
                        >
                            <FaUserMd size={12} />

                            <span className="hidden sm:inline">
                                Find a doctor
                            </span>

                            <span className="sm:hidden">
                                Doctors
                            </span>
                        </Link>


                        <Link
                            href="/book-appointment"
                            className="flex items-center gap-1 text-xs font-medium text-[#5B403D] transition-colors hover:text-[#86000D]"
                        >
                            <FaCalendarCheck size={12} />

                            <span className="hidden sm:inline">
                                Book Appointment
                            </span>

                            <span className="sm:hidden">
                                Appointment
                            </span>
                        </Link>

                    </div>


                    {/* =================================================
                        DONATE
                    ================================================= */}
                    <Link
                        href="/pages/donate"
                        className="flex h-7 items-center justify-center gap-1 bg-[#86000D] px-4 text-xs font-bold tracking-[0.24px] text-white transition-opacity hover:opacity-90 sm:h-6 sm:w-33.75"
                    >
                        <CiHeart size={14} />
                        <span>Donate now</span>
                    </Link>

                </div>
            </div>


            {/* =====================================================
                MAIN NAVIGATION
            ===================================================== */}
            <div className="h-20 px-4 sm:px-5 min-[930px]:px-8">

                <div className="mx-auto flex h-full items-center justify-between">

                    {/* =================================================
                        LOGO
                    ================================================= */}
                    <Link
                        href="/"
                        className="shrink-0"
                    >
                        <div className="flex items-center gap-3 sm:gap-4">

                            <Image
                                loading="eager"
                                src="/logo.png"
                                alt="Bashir Memorial Welfare Hospital Logo"
                                width={48}
                                height={48}
                                className="h-11 w-11 object-contain sm:h-12 sm:w-12"
                            />

                            <div className="flex flex-col">

                                <h1 className="text-base font-normal leading-4 text-[#86000D]">
                                    BMWH
                                </h1>

                                <h2 className="text-[10px] font-medium uppercase leading-4 tracking-[1px] text-[#5F5E5E] sm:text-xs sm:tracking-[1.2px]">
                                    Hospital & Welfare
                                </h2>

                            </div>

                        </div>
                    </Link>


                    {/* =================================================
                        DESKTOP NAVIGATION
                    ================================================= */}
                    <ul className="hidden h-full items-center gap-3 min-[930px]:flex min-[1100px]:gap-4 2xl:gap-6">

                        {navLinks.map(({ label, href }) => (
                            <li key={label}>
                                <Link
                                    href={href}
                                    className="flex items-center whitespace-nowrap text-sm font-semibold leading-5 tracking-[0.14px] text-[#5B403D] transition-colors hover:text-[#86000D]"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}

                    </ul>


                    {/* =================================================
                        DESKTOP PROFILE
                    ================================================= */}
                    <Link
                        href="/profile"
                        aria-label="Profile"
                        className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#86000D] text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-opacity hover:opacity-90 min-[930px]:flex"
                    >
                        <IoPersonOutline size={14} />
                    </Link>


                    {/* =================================================
                        MOBILE CONTROLS
                    ================================================= */}
                    <div className="flex items-center gap-2 min-[930px]:hidden">

                        {/* =================================================
                            MOBILE PROFILE
                        ================================================= */}
                        <Link
                            href="/profile"
                            aria-label="Profile"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#86000D] text-white shadow-sm transition-opacity hover:opacity-90 sm:h-10 sm:w-10"
                        >
                            <IoPersonOutline size={14} />
                        </Link>


                        {/* =================================================
                            DAISYUI DRAWER
                        ================================================= */}
                        <div className="drawer drawer-end w-auto">

                            {/* Drawer Toggle */}
                            <input
                                id="mobile-navigation-drawer"
                                type="checkbox"
                                className="drawer-toggle"
                            />


                            {/* =================================================
                                MENU BUTTON
                            ================================================= */}
                            <div className="drawer-content">

                                <label
                                    htmlFor="mobile-navigation-drawer"
                                    aria-label="Open navigation menu"
                                    className="btn flex h-9 min-h-0 w-9 cursor-pointer items-center justify-center rounded-xl border-none bg-white p-0 text-[#86000D] shadow-sm hover:bg-gray-100 sm:h-10 sm:w-10"
                                >
                                    <HiMenuAlt3 size={21} />
                                </label>

                            </div>


                            {/* =================================================
                                DRAWER SIDEBAR
                            ================================================= */}
                            <div className="drawer-side z-100">

                                {/* =================================================
                                    OVERLAY
                                ================================================= */}
                                <label
                                    htmlFor="mobile-navigation-drawer"
                                    aria-label="Close navigation menu"
                                    className="drawer-overlay"
                                />


                                {/* =================================================
                                    SIDEBAR
                                ================================================= */}
                                <aside className="min-h-full w-[85%] max-w-sm bg-white shadow-2xl">

                                    {/* =================================================
                                        SIDEBAR HEADER
                                    ================================================= */}
                                    <div className="flex h-20 items-center justify-between border-b border-gray-100 px-5">

                                        <Link
                                            href="/"
                                            className="flex items-center gap-3"
                                        >
                                            <Image
                                                src="/logo.png"
                                                alt="Bashir Memorial Welfare Hospital Logo"
                                                width={42}
                                                height={42}
                                                className="h-10 w-10 object-contain"
                                            />

                                            <div className="flex flex-col">

                                                <span className="text-sm font-medium text-[#86000D]">
                                                    BMWH
                                                </span>

                                                <span className="text-[9px] font-medium uppercase tracking-[1px] text-[#5F5E5E]">
                                                    Hospital & Welfare
                                                </span>

                                            </div>
                                        </Link>


                                        {/* =================================================
                                            CLOSE BUTTON
                                        ================================================= */}
                                        <label
                                            htmlFor="mobile-navigation-drawer"
                                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-[#F5F3F3] text-lg text-[#5B403D] transition-colors hover:bg-[#86000D] hover:text-white"
                                        >
                                            ×
                                        </label>

                                    </div>


                                    {/* =================================================
                                        SIDEBAR CONTENT
                                    ================================================= */}
                                    <div className="flex h-[calc(100vh-80px)] flex-col overflow-y-auto">

                                        {/* =================================================
                                            MAIN NAVIGATION
                                        ================================================= */}
                                        <div className="px-4 py-5">

                                            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-gray-400">
                                                Main Navigation
                                            </p>


                                            <ul className="flex flex-col gap-1">

                                                {navLinks.map(
                                                    ({ label, href }) => (
                                                        <li key={label}>

                                                            <Link
                                                                href={href}
                                                                className="flex items-center rounded-xl px-3 py-3 text-sm font-medium text-[#5B403D] transition-colors hover:bg-[#86000D]/5 hover:text-[#86000D]"
                                                            >
                                                                {label}
                                                            </Link>

                                                        </li>
                                                    )
                                                )}

                                            </ul>

                                        </div>


                                        {/* =================================================
                                            DIVIDER
                                        ================================================= */}
                                        <div className="mx-5 border-t border-gray-100" />


                                        {/* =================================================
                                            QUICK ACCESS
                                        ================================================= */}
                                        <div className="px-4 py-5">

                                            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[1.5px] text-gray-400">
                                                Quick Access
                                            </p>


                                            <ul className="flex flex-col gap-1">

                                                {utilityLinks.map(
                                                    ({
                                                        label,
                                                        href,
                                                        icon: Icon,
                                                    }) => (
                                                        <li key={label}>

                                                            <Link
                                                                href={href}
                                                                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#5B403D] transition-colors hover:bg-[#86000D]/5 hover:text-[#86000D]"
                                                            >
                                                                <Icon
                                                                    size={16}
                                                                    className="shrink-0"
                                                                />

                                                                <span>
                                                                    {label}
                                                                </span>

                                                            </Link>

                                                        </li>
                                                    )
                                                )}

                                            </ul>

                                        </div>


                                        {/* =================================================
                                            DIVIDER
                                        ================================================= */}
                                        <div className="mx-5 border-t border-gray-100" />


                                        {/* =================================================
                                            SIDEBAR FOOTER
                                        ================================================= */}
                                        <div className="mt-auto p-5">

                                            {/* Donate */}
                                            <Link
                                                href="/pages/donate"
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#86000D] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                                            >
                                                <CiHeart size={19} />
                                                Donate Now
                                            </Link>


                                            {/* Profile */}
                                            <Link
                                                href="/profile"
                                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#86000D]/20 px-5 py-3 text-sm font-medium text-[#86000D] transition-colors hover:bg-[#86000D]/5"
                                            >
                                                <IoPersonOutline size={17} />
                                                My Profile
                                            </Link>

                                        </div>

                                    </div>

                                </aside>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default Nav;