
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

function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full max-w-full bg-[rgba(251,249,249,0.95)] shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-sm">

      {/* TOP UTILITY BAR */}
      <div className="w-full border-b border-[rgba(228,190,186,0.3)] bg-[#F5F3F3]">
        <div className="mx-auto flex min-h-9 w-full max-w-7xl items-center justify-between gap-3 px-3 min-[400px]:px-5 sm:px-8 lg:px-10 xl:px-12 2xl:max-w-[1440px] 2xl:px-16">

          {/* LEFT SIDE */}
          <div className="min-w-0 flex-1">

            {/* DESKTOP UTILITY LINKS */}
            <ul className="hidden min-w-0 items-center gap-3 text-xs font-medium tracking-[0.24px] text-[#5B403D] min-[1180px]:flex min-[1250px]:gap-4">
              {utilityLinks.map(({ label, href, icon: Icon }) => (
                <li key={href} className="min-w-0 shrink">
                  <Link
                    href={href}
                    className="flex min-w-0 items-center gap-1 whitespace-nowrap transition-colors hover:text-[#86000D]"
                  >
                    <Icon size={12} className="shrink-0" />
                    <span className="truncate">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* TABLET / MOBILE UTILITY LINKS */}
            <div className="flex min-w-0 items-center gap-2 min-[400px]:gap-3 min-[1180px]:hidden">

              <Link
                href="/pages/doctors"
                aria-label="Find a doctor"
                className="flex min-w-0 shrink items-center gap-1 text-xs font-medium text-[#5B403D] hover:text-[#86000D]"
              >
                <FaUserMd size={12} className="shrink-0" />
                <span className="hidden min-[321px]:inline sm:hidden">Doctor</span>
                <span className="hidden sm:inline">Find a doctor</span>
              </Link>

              <Link
                href="/book-appointment"
                aria-label="Book Appointment"
                className="flex min-w-0 shrink items-center gap-1 text-xs font-medium text-[#5B403D] hover:text-[#86000D]"
              >
                <FaCalendarCheck size={12} className="shrink-0" />
                <span className="hidden min-[321px]:inline sm:hidden">Book</span>
                <span className="hidden sm:inline">Book Appointment</span>
              </Link>

              <Link
                href="/pages/lab_test"
                aria-label="Lab Tests"
                className="flex min-w-0 shrink items-center gap-1 text-xs font-medium text-[#5B403D] hover:text-[#86000D]"
              >
                <FaFlask size={12} className="shrink-0" />
                <span className="hidden min-[321px]:inline sm:hidden">Lab</span>
                <span className="hidden sm:inline">Lab Tests</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION */}
      <div className="relative z-[101] h-[68px] w-full sm:h-20">
        <div className="relative z-[102] mx-auto flex h-full w-full max-w-7xl min-w-0 items-center justify-between gap-1 px-2 min-[400px]:gap-2 min-[400px]:px-4 sm:gap-4 sm:px-8 lg:px-10 xl:px-12 2xl:max-w-[1440px] 2xl:px-16 min-[1180px]:gap-5">

          {/* HOSPITAL LOGO AND NAME */}
          <Link
            href="/"
            className="flex min-w-0 flex-1 items-center gap-1.5 min-[400px]:gap-2 sm:gap-3 min-[1180px]:flex-none"
          >
            <Image
              src="/logo.png"
              alt="Bashir Memorial Welfare Hospital Logo"
              width={48}
              height={48}
              priority
              className="h-9 w-9 shrink-0 object-contain min-[400px]:h-10 min-[400px]:w-10 sm:h-12 sm:w-12"
            />

            <div className="flex min-w-0 flex-col">
              <h1 className="whitespace-nowrap text-[10px] font-bold leading-[14px] tracking-tight text-[#86000D] min-[360px]:text-[11px] min-[400px]:text-[13px] sm:text-base sm:leading-5">
                Bashir Memorial
              </h1>

              <h2 className="whitespace-nowrap text-[10px] font-semibold leading-[14px] tracking-tight text-zinc-600 min-[360px]:text-[11px] min-[400px]:text-[13px] sm:text-base sm:leading-5">
                Welfare Hospital
              </h2>

              
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <DesktopMegaMenu />

          {/* RIGHT SIDE */}
          <div className="flex shrink-0 items-center gap-1 min-[400px]:gap-1.5 sm:gap-3">

            {/* DONATE BUTTON */}
            <Link
              href="/pages/donate"
              aria-label="Donate now"
              className="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#86000D] px-2 text-[10px] font-bold leading-none text-white shadow-sm transition-all duration-200 hover:bg-[#72000A] hover:shadow-md active:scale-[0.97] min-[360px]:h-9 min-[360px]:gap-1.5 min-[360px]:px-2.5 min-[400px]:px-3 min-[400px]:text-[11px] sm:h-10 sm:w-[120px] sm:gap-2 sm:text-xs min-[1180px]:h-[42px] min-[1180px]:w-[130px]"
            >
              <CiHeart className="shrink-0" size={16} strokeWidth={1.5} />

              <span className="hidden min-[360px]:inline">
                Donate Now
              </span>

              <span className="min-[360px]:hidden">
                Donate
              </span>
            </Link>

            {/* MOBILE / TABLET MENU */}
            <div className="relative flex shrink-0 min-[1180px]:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Nav;
