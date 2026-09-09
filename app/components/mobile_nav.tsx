"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";

import {
  FaCalendarCheck,
  FaFileMedical,
  FaTimes,
  FaUserMd,
} from "react-icons/fa";

import { HiMenuAlt3 } from "react-icons/hi";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineMessage } from "react-icons/md";
import { RiContactsLine } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";

/* =========================================================
   TYPES
========================================================= */

interface MobileNavChild {
  label: string;
  href: string;
}

interface MobileNavItem {
  label: string;
  href: string;
  children: MobileNavChild[];
}

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
   MOBILE NAVIGATION
========================================================= */

const mobileNavLinks: MobileNavItem[] = [
  /* =====================================================
      ABOUT US
  ===================================================== */

  {
    label: "About Us",
    href: "/pages/about",
    children: [
      {
        label: "Mission & Vision",
        href: "/pages/about#mission-vision",
      },
      {
        label: "Our Mission",
        href: "/pages/about#mission",
      },
      {
        label: "Our Vision",
        href: "/pages/about#vision",
      },
      {
        label: "Our Journey",
        href: "/pages/about#our-journey",
      },
      {
        label: "Our Compliance",
        href: "/pages/about#compliance",
      },
      {
        label: "Who We Are",
        href: "/pages/about#who-we-are",
      },
      {
        label: "Our Founders",
        href: "/pages/about#founder",
      },
      {
        label: "Patient Welfare",
        href: "/pages/about#patient-welfare",
      },
      {
        label: "Our Friends / Supporters",
        href: "/pages/about#supporters",
      },
      {
        label: "Success Stories",
        href: "/pages/about#success-stories",
      },
      {
        label: "Health Partners",
        href: "/pages/about#health-partners",
      },
      {
        label: "Events",
        href: "/pages/about#events",
      },
      {
        label: "News & Updates",
        href: "/pages/all_news_updates#all-news-updates",
      },
    ],
  },

  /* =====================================================
      CLINICAL DEPARTMENTS
  ===================================================== */

  {
    label: "Clinical Depts",
    href: "/pages/departments",
    children: [
      {
        label: "All Departments",
        href: "/pages/departments#departments",
      },
      {
        label: "Department Overview",
        href: "/pages/departments#department-overview",
      },
      {
        label: "Surgery & Allied",
        href: "/pages/departments#surgery-and-allied",
      },
      {
        label: "Internal Medicine & Allied",
        href: "/pages/departments#internal-medicine-and-allied",
      },
      {
        label: "Specialized Care",
        href: "/pages/departments#specialized-care",
      },
      {
        label: "Dentistry",
        href: "/pages/departments/department/dentistry",
      },
      {
        label: "Eye",
        href: "/pages/departments/department/eye",
      },
      {
        label: "Contact Department",
        href: "/pages/departments#department-contact",
      },
    ],
  },

  /* =====================================================
      PATIENT CARE
  ===================================================== */

  {
    label: "Patient Care",
    href: "/pages/patient_care",
    children: [
      {
        label: "Patient Care Overview",
        href: "/pages/patient_care#patient-care-overview",
      },
      {
        label: "Hospital Facilities",
        href: "/pages/patient_care#hospital-facilities",
      },
      {
        label: "Outpatient Department",
        href: "/pages/patient_care/opd",
      },
      {
        label: "Inpatient Department",
        href: "/pages/patient_care/ipd",
      },
      {
        label: "Operation Theater",
        href: "/pages/patient_care/operation-theater",
      },
      {
        label: "Support Services",
        href: "/pages/patient_care#support-services",
      },
      {
        label: "Pharmacy",
        href: "/pages/patient_care/pharmacy",
      },
      {
        label: "Cafeteria",
        href: "/pages/patient_care/cafeteria",
      },
      {
        label: "Your Healthcare Journey",
        href: "/pages/patient_care#care-journey",
      },
      {
        label: "Patient Care Contact",
        href: "/pages/patient_care#patient-care-contact",
      },
    ],
  },

  /* =====================================================
      DIAGNOSTICS
  ===================================================== */

  {
    label: "Diagnostics",
    href: "/pages/diagnostic",
    children: [
      {
        label: "Biochemistry",
        href: "/pages/diagnostic#pathology",
      },
      {
        label: "Hematology",
        href: "/pages/diagnostic#pathology",
      },
      {
        label: "Microbiology",
        href: "/pages/diagnostic#pathology",
      },
      {
        label: "Histopathology",
        href: "/pages/diagnostic#pathology",
      },
      {
        label: "X-Ray",
        href: "/pages/diagnostic#radiology-and-imaging",
      },
      {
        label: "ECG",
        href: "/pages/diagnostic#cardiac",
      },
      {
        label: "Diagnostics Overview",
        href: "/pages/diagnostic#diagnostic-overview",
      },
      {
        label: "All Diagnostic Services",
        href: "/pages/diagnostic#diagnostic-services",
      },
      {
        label: "Diagnostic Assistance",
        href: "/pages/diagnostic#diagnostic-contact",
      },
    ],
  },

  /* =====================================================
      DOCTORS
  ===================================================== */

  {
    label: "Doctors",
    href: "/pages/doctors",
    children: [
      {
        label: "Find a Doctor",
        href: "/pages/doctors#all-doctors",
      },
      {
        label: "Doctors Overview",
        href: "/pages/doctors#doctors-overview",
      },
      {
        label: "Our Consultants",
        href: "/pages/doctors#all-doctors",
      },
      {
        label: "Visiting Consultants",
        href: "/pages/doctors#all-doctors",
      },
      {
        label: "Volunteer Consultants",
        href: "/pages/doctors#all-doctors",
      },
      {
        label: "Head of Departments",
        href: "/pages/doctors#all-doctors",
      },
      {
        label: "Book an Appointment",
        href: "/book-appointment",
      },
      {
        label: "View Doctor Profiles",
        href: "/pages/doctors#all-doctors",
      },
    ],
  },

  /* =====================================================
      WELFARE
  ===================================================== */

  {
    label: "Welfare",
    href: "/pages/patient-welfare",
    children: [
      {
        label: "Zakat & Financial Assistance",
        href: "/pages/patient-welfare#zakat-financial-assistance",
      },
      {
        label: "Free Medicines",
        href: "/pages/patient-welfare#free-medicines",
      },
      {
        label: "Free Meals",
        href: "/pages/patient-welfare#free-meals",
      },
      {
        label: "Admission Process",
        href: "/pages/patient-welfare#admission-process",
      },
      {
        label: "Patient Rights & Responsibilities",
        href: "/pages/patient-welfare#patient-rights-responsibilities",
      },
      {
        label: "Information Guides",
        href: "/pages/patient-welfare#information-guides",
      },
      {
        label: "Forms & Resources",
        href: "/pages/patient-welfare#forms-resources",
      },
      {
        label: "Billing & Fees",
        href: "/pages/patient-welfare#billing-fees",
      },
      {
        label: "FAQs",
        href: "/pages/patient-welfare#faqs",
      },
      {
        label: "Request an Appointment",
        href: "/pages/patient-welfare#request-appointment",
      },
      {
        label: "View Lab Reports",
        href: "/pages/patient-welfare#view-lab-reports",
      },
      {
        label: "Patient Success Stories",
        href: "/pages/patient-welfare#patient-success-stories",
      },
      {
        label: "Patient Assistance",
        href: "/pages/patient-welfare#patient-assistance",
      },
    ],
  },

  /* =====================================================
      DONATE
  ===================================================== */

  {
    label: "Donate",
    href: "/pages/donate",
    children: [
      {
        label: "Zakat",
        href: "/pages/donate#ways-to-donate",
      },
      {
        label: "General Donation",
        href: "/pages/donate#ways-to-donate",
      },
      {
        label: "Sadaqah",
        href: "/pages/donate#ways-to-donate",
      },
      {
        label: "Fitrana",
        href: "/pages/donate#ways-to-donate",
      },
      {
        label: "Donate a Meal",
        href: "/pages/donate#what-you-can-support",
      },
      {
        label: "Donate in Kind",
        href: "/pages/donate#what-you-can-support",
      },
      {
        label: "Sponsor a Patient",
        href: "/pages/donate#what-you-can-support",
      },
      {
        label: "Sponsor Free Surgeries",
        href: "/pages/donate#what-you-can-support",
      },
      {
        label: "Support a Project",
        href: "/pages/donate#what-you-can-support",
      },
      {
        label: "Online Donation",
        href: "/pages/donate#ways-to-donate",
      },
      {
        label: "Bank Transfer",
        href: "/pages/donate#ways-to-donate",
      },
      {
        label: "Cheque or Bank Draft",
        href: "/pages/donate#ways-to-donate",
      },
    ],
  },
];

/* =========================================================
   MOBILE MENU
========================================================= */

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  /* =====================================================
     BODY SCROLL LOCK
  ===================================================== */

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* =====================================================
     ESCAPE KEY
  ===================================================== */

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  /* =====================================================
     CLOSE MENU
  ===================================================== */

  const closeMenu = () => {
    setIsOpen(false);
    setOpenSection(null);
  };

  /* =====================================================
     TOGGLE SECTION
  ===================================================== */

  const toggleSection = (label: string) => {
    setOpenSection((current) =>
      current === label ? null : label
    );
  };

  return (
    <>
      {/* =====================================================
          MOBILE CONTROLS
      ===================================================== */}

      <div className="flex shrink-0 items-center gap-2">
        {/* Profile */}

        <Link
          href="/profile"
          aria-label="Profile"
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-[#86000D]
            text-white
            shadow-sm
            transition-opacity
            hover:opacity-90
            sm:h-10
            sm:w-10
          "
        >
          <IoPersonOutline size={14} />
        </Link>

        {/* Hamburger */}

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            border-0
            bg-white
            p-0
            text-[#86000D]
            shadow-sm
            transition-colors
            hover:bg-gray-100
            sm:h-10
            sm:w-10
          "
        >
          <HiMenuAlt3 size={20} />
        </button>
      </div>

      {/* =====================================================
          OVERLAY
      ===================================================== */}

      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={`
          fixed
          inset-0
          z-[140]
          bg-black/40
          transition-opacity
          duration-300
          ${
            isOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}

      <aside
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className={`
          fixed
          right-0
          top-0
          z-[150]
          flex
          h-[100dvh]
          w-[min(88vw,390px)]
          max-w-full
          flex-col
          bg-white
          shadow-2xl
          transition-transform
          duration-300
          ease-in-out
          ${
            isOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            h-20
            shrink-0
            items-center
            justify-between
            border-b
            border-gray-100
            px-4
            sm:px-5
          "
        >
          {/* Logo */}

          <Link
            href="/"
            onClick={closeMenu}
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >
            <Image
              src="/logo.png"
              alt="Bashir Memorial Welfare Hospital Logo"
              width={42}
              height={42}
              priority
              className="
                h-9
                w-9
                shrink-0
                object-contain
                sm:h-10
                sm:w-10
              "
            />

            <div className="flex min-w-0 flex-col">
              <span
                className="
                  text-sm
                  font-bold
                  leading-4
                  text-[#86000D]
                "
              >
                Bashir Memorial
              </span>

              <span
                className="
                  text-sm
                  font-bold
                  leading-4
                  text-[#86000D]
                "
              >
                Welfare Hospital
              </span>

              <span
                className="
                  mt-1
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[1px]
                  text-[#5F5E5E]
                "
              >
                Hospital & Welfare
              </span>
            </div>
          </Link>

          {/* Close */}

          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close navigation menu"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#F5F3F3]
              text-[#5B403D]
              transition-colors
              hover:bg-[#86000D]
              hover:text-white
            "
          >
            <FaTimes size={15} />
          </button>
        </div>

        {/* =================================================
            SCROLLABLE CONTENT

            IMPORTANT:
            This is the ONLY element responsible for
            scrolling inside the mobile drawer.
        ================================================= */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
            overscroll-contain
            touch-pan-y
            [-webkit-overflow-scrolling:touch]
          "
        >
          {/* =================================================
              MAIN NAVIGATION
          ================================================= */}

          <div className="px-4 py-5">
            <p
              className="
                mb-3
                px-3
                text-[10px]
                font-bold
                uppercase
                tracking-[1.5px]
                text-gray-400
              "
            >
              Main Navigation
            </p>

            <ul className="flex flex-col gap-1">
              {mobileNavLinks.map((item) => {
                const isSectionOpen =
                  openSection === item.label;

                return (
                  <li key={item.label}>
                    <div className="overflow-hidden rounded-xl">
                      {/* Parent row */}

                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="
                            flex
                            min-h-[46px]
                            min-w-0
                            flex-1
                            items-center
                            px-3
                            py-3
                            text-sm
                            font-medium
                            text-[#5B403D]
                            transition-colors
                            hover:bg-[#86000D]/5
                            hover:text-[#86000D]
                          "
                        >
                          <span className="truncate">
                            {item.label}
                          </span>
                        </Link>

                        <button
                          type="button"
                          aria-label={`Toggle ${item.label}`}
                          aria-expanded={isSectionOpen}
                          onClick={() =>
                            toggleSection(item.label)
                          }
                          className="
                            flex
                            h-[46px]
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            text-[#86000D]
                          "
                        >
                          <FaChevronDown
                            className={`
                              text-xs
                              transition-transform
                              duration-200
                              ${
                                isSectionOpen
                                  ? "rotate-180"
                                  : ""
                              }
                            `}
                          />
                        </button>
                      </div>

                      {/* Children */}

                      <div
                        className={`
                          grid
                          transition-[grid-template-rows]
                          duration-200
                          ease-in-out
                          ${
                            isSectionOpen
                              ? "grid-rows-[1fr]"
                              : "grid-rows-[0fr]"
                          }
                        `}
                      >
                        <div className="overflow-hidden">
                          <div
                            className="
                              ml-3
                              border-l
                              border-[#E4BEBA]/40
                              pb-2
                              pl-3
                            "
                          >
                            {item.children.map((child) => (
                              <Link
                                key={`${child.href}-${child.label}`}
                                href={child.href}
                                onClick={closeMenu}
                                className="
                                  flex
                                  min-h-[40px]
                                  items-center
                                  rounded-lg
                                  px-3
                                  py-2
                                  text-xs
                                  font-medium
                                  text-[#5B403D]
                                  transition-colors
                                  hover:bg-[#86000D]/5
                                  hover:text-[#86000D]
                                "
                              >
                                <span className="min-w-0">
                                  {child.label}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
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
            <p
              className="
                mb-3
                px-3
                text-[10px]
                font-bold
                uppercase
                tracking-[1.5px]
                text-gray-400
              "
            >
              Quick Access
            </p>

            <ul className="flex flex-col gap-1">
              {utilityLinks.map(
                ({ label, href, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={closeMenu}
                      className="
                        flex
                        min-h-[46px]
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-sm
                        font-medium
                        text-[#5B403D]
                        transition-colors
                        hover:bg-[#86000D]/5
                        hover:text-[#86000D]
                        active:bg-[#86000D]/10
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-[#86000D]/5
                          text-[#86000D]
                        "
                      >
                        <Icon size={15} />
                      </span>

                      <span className="truncate">
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
              FOOTER ACTIONS
          ================================================= */}

          <div className="p-5">
            <Link
              href="/pages/donate"
              onClick={closeMenu}
              className="
                flex
                min-h-[46px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#86000D]
                px-5
                py-3
                text-sm
                font-semibold
                text-white
                transition-opacity
                hover:opacity-90
                active:opacity-80
              "
            >
              <CiHeart size={19} />
              <span>Donate Now</span>
            </Link>

            <Link
              href="/profile"
              onClick={closeMenu}
              className="
                mt-3
                flex
                min-h-[46px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#86000D]/20
                px-5
                py-3
                text-sm
                font-medium
                text-[#86000D]
                transition-colors
                hover:bg-[#86000D]/5
              "
            >
              <IoPersonOutline size={17} />
              <span>My Profile</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}