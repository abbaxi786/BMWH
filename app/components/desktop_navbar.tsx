"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaArrowRight } from "react-icons/fa";

interface MegaMenuItem {
  label: string;
  href: string;
}

interface MegaMenuColumn {
  title: string;
  items: MegaMenuItem[];
}

interface MegaMenu {
  label: string;
  href: string;
  columns: MegaMenuColumn[];
}

const megaMenus: MegaMenu[] = [
  /* =====================================================
      ABOUT BMWH
  ===================================================== */
  {
    label: "About Us",
    href: "/pages/about",
    columns: [
      {
        title: "Our Purpose",
        items: [
          { label: "Mission & Vision", href: "/pages/about#mission-vision" },
          { label: "Our Mission", href: "/pages/about#mission" },
          { label: "Our Vision", href: "/pages/about#vision" },
          { label: "Our Journey", href: "/pages/about#our-journey" },
          { label: "Our Compliance", href: "/pages/about#compliance" },
        ],
      },
      {
        title: "Leadership & Governance",
        items: [
          { label: "Who We Are", href: "/pages/about#who-we-are" },
          { label: "Our Founders", href: "/pages/about#founder" },
          { label: "Patient Welfare", href: "/pages/about#patient-welfare" },
          {
            label: "Our Friends / Supporters",
            href: "/pages/about#supporters",
          },
        ],
      },
      {
        title: "Our Impact",
        items: [
          { label: "Success Stories", href: "/pages/about#success-stories" },
          { label: "Health Partners", href: "/pages/about#health-partners" },
          { label: "Events", href: "/pages/about#events" },
          {
            label: "News & Updates",
            href: "/pages/all_news_updates#all-news-updates",
          },
        ],
      },
    ],
  },

  /* =====================================================
      CLINICAL DEPARTMENTS
  ===================================================== */
  {
    label: "Clinical Depts",
    href: "/pages/departments",
    columns: [
      {
        title: "Clinical Departments",
        items: [
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
        ],
      },
      {
        title: "Surgery & Allied",
        items: [
          {
            label: "Dentistry",
            href: "/pages/departments/department/dentistry",
          },
          {
            label: "Eye",
            href: "/pages/departments/department/eye",
          },
        ],
      },
      {
        title: "Department Assistance",
        items: [
          {
            label: "Contact Department",
            href: "/pages/departments#department-contact",
          },
        ],
      },
    ],
  },

  /* =====================================================
      PATIENT CARE
  ===================================================== */
  {
    label: "Patient Care",
    href: "/pages/patient_care",
    columns: [
      {
        title: "Hospital Facilities",
        items: [
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
        ],
      },
      {
        title: "Support Services",
        items: [
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
        ],
      },
      {
        title: "Patient Journey",
        items: [
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
    ],
  },

  /* =====================================================
      DIAGNOSTICS
  ===================================================== */
  {
    label: "Diagnostics",
    href: "/pages/diagnostic",
    columns: [
      {
        title: "Pathology",
        items: [
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
        ],
      },
      {
        title: "Radiology & Imaging",
        items: [
          {
            label: "X-Ray",
            href: "/pages/diagnostic#radiology-and-imaging",
          },
        ],
      },
      {
        title: "Cardiac",
        items: [
          {
            label: "ECG",
            href: "/pages/diagnostic#cardiac",
          },
        ],
      },
      {
        title: "Diagnostic Services",
        items: [
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
    ],
  },

  /* =====================================================
      DOCTORS
  ===================================================== */
  {
    label: "Doctors",
    href: "/pages/doctors",
    columns: [
      {
        title: "Find a Doctor",
        items: [
          {
            label: "Find a Doctor",
            href: "/pages/doctors#all-doctors",
          },
          {
            label: "Doctors Overview",
            href: "/pages/doctors#doctors-overview",
          },
        ],
      },
      {
        title: "Our Medical Team",
        items: [
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
        ],
      },
      {
        title: "Appointments",
        items: [
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
    ],
  },

  /* =====================================================
      PATIENT WELFARE
  ===================================================== */
  {
    label: "Welfare",
    href: "/pages/welfare",
    columns: [
      {
        title: "Financial & Community Support",
        items: [
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
        ],
      },
      {
        title: "Patient Resources",
        items: [
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
        ],
      },
      {
        title: "Online Services",
        items: [
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
    ],
  },

  /* =====================================================
      DONATE
  ===================================================== */
  {
    label: "Donate",
    href: "/pages/donate",
    columns: [
      {
        title: "Ways to Give",
        items: [
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
        ],
      },
      {
        title: "What You Can Support",
        items: [
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
        ],
      },
      {
        title: "How to Donate",
        items: [
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
    ],
  },
];

export default function DesktopMegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = (label: string) => {
    cancelClose();
    setActiveMenu(label);
  };

  const closeMenu = () => {
    cancelClose();

    closeTimer.current = setTimeout(() => {
      setActiveMenu(null);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    };
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className="
        relative
        z-1002
        hidden
        min-w-0
        flex-1
        justify-center
        min-[1180px]:flex
      "
    >
      <ul
        className="
          relative
          z-1002
          flex
          min-w-0
          max-w-full
          items-center
          justify-center
          gap-3
          min-[1220px]:gap-4
          min-[1350px]:gap-5
          2xl:gap-6
        "
      >
        {megaMenus.map((menu) => {
          const isActive = activeMenu === menu.label;

          return (
            <li
              key={menu.label}
              className="relative shrink-0"
              onMouseEnter={() => openMenu(menu.label)}
              onMouseLeave={closeMenu}
            >
              <Link
                href={menu.href}
                onClick={() => {
                  cancelClose();
                  setActiveMenu(null);
                }}
                className={`
                  flex
                  items-center
                  gap-1
                  whitespace-nowrap
                  text-[13px]
                  font-semibold
                  leading-5
                  tracking-[0.1px]
                  transition-colors
                  min-[1220px]:text-sm
                  ${
                    isActive
                      ? "text-[#86000D]"
                      : "text-[#5B403D] hover:text-[#86000D]"
                  }
                `}
              >
                {menu.label}

                <FaChevronDown
                  className={`
                    text-[8px]
                    transition-transform
                    ${isActive ? "rotate-180" : ""}
                  `}
                />
              </Link>

              {isActive && (
                <div
                  className="
                    pointer-events-auto
                    fixed
                    left-0
                    right-0
                    top-26
                    z-100000
                    flex
                    justify-center
                    px-4
                    min-[1180px]:px-6
                  "
                  onMouseEnter={cancelClose}
                  onMouseLeave={closeMenu}
                >
                  {/* Invisible hover bridge */}
                  <div
                    className="
                      absolute
                      left-0
                      right-0
                      -top-2
                      h-3
                    "
                  />

                  {/* Mega menu */}
                  <div
                    className="
                      relative
                      z-100001
                      w-full
                      max-w-262.5
                      min-h-[50vh]
                      max-h-[60vh]
                      overflow-x-hidden
                      overflow-y-auto
                      rounded-b-xl
                      border
                      border-[#E4BEBA]/40
                      bg-white
                      shadow-[0_18px_50px_rgba(0,0,0,0.16)]
                    "
                  >
                    {/* Top accent */}
                    <div className="h-1 w-full bg-[#86000D]" />

                    {/* Columns */}
                    <div className="grid grid-cols-3 gap-0 p-6">
                      {menu.columns.map((column, index) => (
                        <div
                          key={column.title}
                          className={`
                            min-w-0
                            px-5
                            ${
                              index !== 0
                                ? "border-l border-[#E4BEBA]/30"
                                : ""
                            }
                          `}
                        >
                          <h3
                            className="
                              mb-4
                              text-[11px]
                              font-bold
                              uppercase
                              tracking-[1.2px]
                              text-[#86000D]
                            "
                          >
                            {column.title}
                          </h3>

                          <ul className="flex flex-col gap-1.5">
                            {column.items.map((item) => (
                              <li key={`${item.href}-${item.label}`}>
                                <Link
                                  href={item.href}
                                  onClick={() => {
                                    cancelClose();
                                    setActiveMenu(null);
                                  }}
                                  className="
                                    group
                                    flex
                                    min-w-0
                                    items-center
                                    justify-between
                                    gap-3
                                    rounded-lg
                                    px-3
                                    py-2.5
                                    text-[13px]
                                    font-medium
                                    leading-5
                                    text-[#5B403D]
                                    transition-all
                                    duration-150
                                    hover:bg-[#86000D]/5
                                    hover:text-[#86000D]
                                  "
                                >
                                  <span className="min-w-0">
                                    {item.label}
                                  </span>

                                  <FaArrowRight
                                    className="
                                      shrink-0
                                      text-[10px]
                                      opacity-0
                                      transition-all
                                      duration-150
                                      group-hover:translate-x-1
                                      group-hover:opacity-100
                                    "
                                  />
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

