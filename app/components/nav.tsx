import Link from "next/link";
import Image from "next/image";

import { IoPersonOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";

import {
  FaUserMd,
  FaCalendarCheck,
  FaFileMedical,
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
            max-w-[1440px]
            items-center
            justify-between
            gap-3
            px-2
            min-[321px]:px-3
            sm:px-5
            min-[1180px]:px-8
          "
        >
          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="min-w-0 flex-1">
            {/* Desktop utility links */}

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

            {/* Tablet / Mobile utility links */}

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
              {/* Find doctor */}

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

              {/* Appointment */}

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
            </div>
          </div>

          {/* =================================================
              DONATE
          ================================================= */}

          <div className="flex shrink-0 justify-center">
            <Link
              href="/pages/donate"
              className="
                flex
                h-7
                shrink-0
                items-center
                justify-center
                gap-1
                rounded-md
                bg-[#86000D]
                px-3
                text-[10px]
                font-bold
                tracking-[0.15px]
                text-white
                transition-opacity
                hover:opacity-90
                min-[321px]:text-xs
                sm:w-[135px]
              "
            >
              <CiHeart
                size={14}
                className="shrink-0"
              />

              <span className="hidden min-[321px]:inline">
                Donate now
              </span>

              <span className="min-[321px]:hidden">
                Donate
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN NAVIGATION
      ===================================================== */}

      <div
        className="
          relative
          z-[101]
          h-[72px]
          w-full
          px-2
          min-[321px]:px-3
          sm:h-20
          sm:px-5
          min-[1180px]:px-8
        "
      >
        <div
          className="
            relative
            z-[102]
            mx-auto
            flex
            h-full
            w-full
            max-w-[1440px]
            min-w-0
            items-center
            justify-between
            gap-3
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
                    leading-[14px]
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

              Starts at 1180px.
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
            "
          >
            {/* Desktop profile */}

            <Link
              href="/profile"
              aria-label="Profile"
              className="
                hidden
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#86000D]
                text-white
                shadow-[0_1px_2px_rgba(0,0,0,0.05)]
                transition-opacity
                hover:opacity-90
                min-[1180px]:flex
              "
            >
              <IoPersonOutline size={16} />
            </Link>

            {/* Mobile / tablet menu */}

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