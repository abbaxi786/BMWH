import Link from "next/link";
import Image from "next/image";
import {
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaArrowRight,
} from "react-icons/fa";

const FOOTER_LINKS = {
    hospital: [
        { label: "About Us", href: "/pages/about" },
        { label: "Departments", href: "/pages/departments" },
        { label: "Doctors", href: "/doctors" },
        { label: "Hospital Facilities", href: "/pages/facilities" },
        { label: "Diagnostic Services", href: "/pages/diagnostic-services" },
    ],

    patientCare: [
        { label: "Patient Care", href: "/patient-care" },
        { label: "Events & Activities", href: "/pages/event" },
        { label: "Success Stories", href: "/pages/success_stories" },
        { label: "Latest News", href: "/news" },
        { label: "Support Us", href: "/pages/about/#supporters" },
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

function FooterColumn({ title, links }: FooterColumnProps) {
    return (
        <nav
            aria-label={title}
            className="flex flex-col gap-2"
        >
            <h3 className="mb-1 text-base font-normal uppercase tracking-[0.8px] text-[#911824]">
                {title}
            </h3>

            <div className="flex flex-col gap-2">
                {links.map(({ label, href }) => (
                    <Link
                        key={href}
                        href={href}
                        className="text-base leading-6 text-[#5B403D] transition-colors duration-200 hover:text-[#86000D]"
                    >
                        {label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

function SocialLinks() {
    return (
        <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-5 w-5 items-center justify-center text-[#911824] transition-opacity duration-200 hover:opacity-70"
                >
                    <Icon size={18} />
                </Link>
            ))}
        </div>
    );
}

function ContactInformation() {
    return (
        <div className="flex flex-col gap-2">
            <h3 className="mb-1 text-base font-normal uppercase tracking-[0.8px] text-[#911824]">
                Contact Us
            </h3>

            <address className="flex flex-col gap-2 text-base leading-6 text-[#5B403D] not-italic">
                <span>Main Highway Road, Welfare Estate</span>

                <a
                    href="mailto:info@bmwhospital.org"
                    className="transition-colors duration-200 hover:text-[#86000D]"
                >
                    info@bmwhospital.org
                </a>

                <a
                    href="tel:+922134567890"
                    className="transition-colors duration-200 hover:text-[#86000D]"
                >
                    +92 21 34567890
                </a>
            </address>

            <a
                href="/pages/contact#location"
                className="mt-2 flex items-center gap-1 text-base font-bold text-[#911824] transition-opacity duration-200 hover:opacity-70"
            >
                <FaMapMarkerAlt size={13} />
                <span>Get Directions</span>
            </a>
        </div>
    );
}

function HospitalIntroduction() {
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-start gap-4">
                <Link
                    href="/"
                    aria-label="Bashir Memorial Welfare Hospital"
                >
                    <Image
                        loading="eager"
                        src="/logo.png"
                        alt="Bashir Memorial Welfare Hospital logo"
                        width={48}
                        height={48}
                        priority
                        className="h-12 w-12 object-contain"
                    />
                </Link>

                <p className="max-w-70.5 text-base leading-6 text-[#5B403D]">
                    Bashir Memorial Welfare Hospital (BMWH) is committed to
                    providing world-class healthcare to all, regardless of
                    their financial status.
                </p>

                <SocialLinks />
            </div>
        </div>
    );
}

function FooterBottom() {
    return (
        <div className="border-t border-[#e4beba]/30 bg-[#EFEDED]">
            <div className="flex min-h-12.25 w-full flex-col items-center justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center">
                <p className="text-xs font-medium leading-4 tracking-[0.24px] text-[#5B403D]">
                    © 2026{" "}
                    <span className="text-[#911824]">
                        Bashir Memorial Welfare Hospital
                    </span>
                    . All rights reserved.
                </p>

                <nav
                    aria-label="Legal navigation"
                    className="flex items-center gap-4"
                >
                    <Link
                        href="/privacy-policy"
                        className="text-xs font-medium leading-4 tracking-[0.24px] text-[#5B403D] transition-colors duration-200 hover:text-[#86000D]"
                    >
                        Privacy Policy
                    </Link>

                    <span className="h-3 w-px bg-[#e4beba]" />

                    <Link
                        href="/terms"
                        className="text-xs font-medium leading-4 tracking-[0.24px] text-[#5B403D] transition-colors duration-200 hover:text-[#86000D]"
                    >
                        Terms of Use
                    </Link>

                    <span className="h-3 w-px bg-[#e4beba]" />

                    <Link
                        href="/sitemap"
                        className="text-xs font-medium leading-4 tracking-[0.24px] text-[#5B403D] transition-colors duration-200 hover:text-[#86000D]"
                    >
                        Sitemap
                    </Link>
                </nav>
            </div>
        </div>
    );
}

export default function Footer() {
    return (
        <footer className="w-full border-t border-[#e4beba]/30 bg-white">
            {/* Main Footer */}
            <div className="w-full px-5 py-5">
                <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                    <HospitalIntroduction />

                    <FooterColumn
                        title="Hospital"
                        links={FOOTER_LINKS.hospital}
                    />

                    <FooterColumn
                        title="Patient Care"
                        links={FOOTER_LINKS.patientCare}
                    />

                    <ContactInformation />
                </div>
            </div>

            {/* Bottom */}
            <FooterBottom />
        </footer>
    );
}