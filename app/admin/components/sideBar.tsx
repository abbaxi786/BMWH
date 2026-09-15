"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { useAuth } from "@/app/context/context";
import { useRouter } from "next/navigation";

import {
    FiGrid,
    FiUsers,
    FiUser,
    FiBriefcase,
    FiActivity,
    FiImage,
    FiFileText,
    FiCalendar,
    FiHeart,
    FiAward,
    FiUserCheck,
    FiSettings,
    FiLogOut,
    FiExternalLink,
} from "react-icons/fi";

type NavItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
};

type NavSection = {
    title: string;
    items: NavItem[];
};

const sections: NavSection[] = [
    {
        title: "Main",
        items: [
            {
                label: "Dashboard",
                href: "/admin",
                icon: <FiGrid size={16} />,
            },
        ],
    },

    {
        title: "Content Management",
        items: [
            {
                label: "Departments",
                href: "/admin/departments",
                icon: <FiBriefcase size={16} />,
            },
            {
                label: "Doctors",
                href: "/admin/doctors",
                icon: <FiUser size={16} />,
            },
            {
                label: "Department Services",
                href: "/admin/department_services",
                icon: <FiActivity size={16} />,
            },
            {
                label: "Diagnostic Services",
                href: "/admin/diagnostic_services",
                icon: <FiActivity size={16} />,
            },
            {
                label: "Hospital Facilities",
                href: "/admin/hospital_facilities",
                icon: <FiImage size={16} />,
            },
            {
                label: "News & Updates",
                href: "/admin/news_updates",
                icon: <FiFileText size={16} />,
            },
            {
                label: "Events",
                href: "/admin/events",
                icon: <FiCalendar size={16} />,
            },
            {
                label: "Success Stories",
                href: "/admin/success_stories",
                icon: <FiHeart size={16} />,
            },
            {
                label: "Achievements & Awards",
                href: "/admin/achievements",
                icon: <FiAward size={16} />,
            },
        ],
    },

    {
        title: "People & Organization",
        items: [
            {
                label: "President",
                href: "/admin/president",
                icon: <FiUserCheck size={20} />,
            },
        ],
    },

    {
        title: "Support & Partners",
        items: [
            {
                label: "Supporters",
                href: "/admin/supporters",
                icon: <FiUsers size={18} />,
            },
            {
                label: "Health Partners",
                href: "/admin/health_partners",
                icon: <FiHeart size={16} />,
            },
            {
                label: "Donations",
                href: "/admin/donations",
                icon: <FiHeart size={16} />,
            },
        ],
    },

    {
        title: "Website",
        items: [
            {
                label: "Website Settings",
                href: "/admin/settings",
                icon: <FiSettings size={18} />,
            },
            {
                label: "Admin Profile",
                href: "/admin/profile",
                icon: <FiUser size={16} />,
            },
        ],
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter()

    // Get authentication state and logout function
    const { isAuthenticated, logout } = useAuth();

    // Don't show sidebar when admin is not authenticated
    if (!isAuthenticated) {
        return null;
    }

    // =========================
    // Logout Handler
    // =========================
    const handleLogout = async () => {
        await logout();
        router.push("/admin/log-in")

    };

    return (
        <aside className="flex h-screen w-65 flex-col overflow-y-auto border-r border-[#E0BFBD]/40 bg-white">

            {/* =========================
                LOGO HEADER
            ========================== */}
            <div className="flex h-15 min-h-15 shrink-0 items-center border-b border-[#E0BFBD]/30 px-4">

                <Link
                    href="/admin"
                    className="flex min-w-0 w-full items-center gap-2"
                >
                    {/* Logo */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                        <Image
                            src="/logo.png"
                            alt="Bashir Memorial Welfare Hospital"
                            width={36}
                            height={36}
                            className="h-9 w-9 object-contain p-1"
                            priority
                        />
                    </div>

                    {/* Hospital Name */}
                    <div className="min-w-0 flex-1">
                        <div
                            className="
                                truncate
                                text-[16px]
                                font-semibold
                                leading-5
                                tracking-[-0.15px]
                                text-[#911824]
                                sm:text-[17px]
                            "
                            title="Bashir Memorial Welfare Hospital"
                        >
                            Bashir Memorial
                        </div>

                        <div className="truncate text-[11px] font-medium leading-4 text-[#584140]">
                            Welfare Hospital
                        </div>
                    </div>
                </Link>
            </div>

            {/* =========================
                NAVIGATION
            ========================== */}
            <nav className="flex flex-1 flex-col gap-3 px-2 py-3">

                {sections.map((section) => (
                    <div
                        key={section.title}
                        className="flex flex-col gap-1"
                    >
                        {/* Section Title */}
                        <div className="px-2 text-[11px] font-bold uppercase leading-3.5 tracking-[0.66px] text-[#584140]">
                            {section.title}
                        </div>

                        {/* Links */}
                        <div className="flex flex-col">
                            {section.items.map((item) => {
                                const active =
                                    pathname === item.href ||
                                    (item.href !== "/admin" &&
                                        pathname.startsWith(
                                            `${item.href}/`
                                        ));

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                                            group
                                            flex
                                            h-9
                                            min-w-0
                                            items-center
                                            gap-2
                                            rounded-xs
                                            px-2
                                            text-[14px]
                                            font-medium
                                            leading-5
                                            transition-colors

                                            ${active
                                                ? "border-r-4 border-[#911824] bg-[rgba(254,215,210,0.4)] text-[#911824]"
                                                : "text-[#584140] hover:bg-[rgba(254,215,210,0.2)] hover:text-[#911824]"
                                            }
                                        `}
                                    >
                                        {/* Icon */}
                                        <span
                                            className={`
                                                shrink-0

                                                ${active
                                                    ? "text-[#911824]"
                                                    : "text-[#584140] group-hover:text-[#911824]"
                                                }
                                            `}
                                        >
                                            {item.icon}
                                        </span>

                                        {/* Text */}
                                        <span className="min-w-0 truncate">
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* =========================
                BOTTOM ADMIN CARD
            ========================== */}
            <div className="shrink-0 border-t border-[#E0BFBD]/30 bg-[rgba(239,244,255,0.5)] p-3">

                {/* Admin Card */}
                <div className="flex h-10.5 min-w-0 items-center gap-2 rounded-xs border border-[#E0BFBD]/30 bg-white px-2">

                    {/* Avatar */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#911824]">
                        <span className="text-xs font-bold text-white">
                            A
                        </span>
                    </div>

                    {/* User Information */}
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-semibold leading-3 text-[#0B1C30]">
                            Admin
                        </p>

                        <p className="mt-1 truncate text-[11px] font-bold leading-3.5 tracking-[0.66px] text-[#584140]">
                            ADMIN OFFICER
                        </p>
                    </div>

                    {/* Profile Settings */}
                    <Link
                        href="/admin/profile"
                        className="shrink-0 text-[#584140] transition-colors hover:text-[#911824]"
                    >
                        <FiSettings size={15} />
                    </Link>
                </div>

                {/* Bottom Links */}
                <div className="mt-1.75 flex items-center justify-between px-2">

                    {/* Website */}
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-1 text-[12px] font-medium text-[#584140] transition-colors hover:text-[#911824]"
                    >
                        <FiExternalLink size={12} />
                        <span>Website</span>
                    </Link>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-1 text-[12px] font-medium text-[#BA1A1A] transition-opacity hover:opacity-70"
                    >
                        <FiLogOut size={12} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}

