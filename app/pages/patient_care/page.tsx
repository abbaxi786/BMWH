import Link from "next/link";
import {
    FaArrowRight,
    FaBriefcaseMedical,
    FaCheckCircle,
    FaChevronRight,
    FaClipboardList,
    FaEye,
    FaHeart,
    FaHospital,
    FaIdCard,
    FaPhoneAlt,
    FaShieldAlt,
    FaUtensils,
    FaWheelchair,
} from "react-icons/fa";

const patientResources = [
    {
        title: "Admission Process",
        description:
            "Learn about the steps, documents, and information required when being admitted to BMWH.",
        action: "View admission guide",
        icon: FaClipboardList,
    },
    {
        title: "Patient Rights",
        description:
            "Every patient deserves respectful, safe, confidential, and compassionate care throughout their stay.",
        action: "Know your rights",
        icon: FaShieldAlt,
    },
    {
        title: "Visitor Policy",
        description:
            "Understand visiting hours and guidelines designed to maintain a safe and comfortable environment.",
        action: "View visitor policy",
        icon: FaEye,
    },
    {
        title: "Discharge Process",
        description:
            "Find out what to expect before leaving the hospital, including instructions and follow-up care.",
        action: "View discharge guide",
        icon: FaCheckCircle,
    },
];

const supportServices = [
    {
        title: "Patient Meals",
        description:
            "Nutritionally balanced, free meals provided daily for all admitted ward patients, planned by certified dietitians to aid recovery.",
        meta: "Served 3x Daily",
        icon: FaUtensils,
    },
    {
        title: "Mobility Support",
        description:
            "Free access to wheelchairs, walkers, and temporary mobility aids for use within the hospital premises and at home for eligible patients.",
        meta: "Request at Reception",
        icon: FaWheelchair,
    },
    {
        title: "Counseling",
        description:
            "Pro-bono psychological support and counseling services for patients facing chronic illness, trauma, or difficult diagnoses.",
        meta: "By Appointment",
        icon: FaHeart,
    },
];

export default function PatientCare() {
    return (
        <main className="min-h-screen bg-[#FBF9F9] pt-30 animate-fade-in-up">
            <div className="mx-auto w-full max-w-7xl px-5 py-4 sm:px-8 lg:px-10 lg:pb-8">

                {/* ================= HEADER ================= */}
                <section className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[1.4px] text-[#86000D]">
                            Welfare & Assistance
                        </p>

                        <h1 className="text-4xl font-bold tracking-[-0.96px] text-[#1B1C1C] sm:text-5xl">
                            Patient Care
                        </h1>

                        <p className="mt-4 text-base leading-7 text-[#5B403D] sm:text-lg">
                            BMWH is committed to providing comprehensive support
                            beyond medical treatment. Explore our financial
                            assistance programs, community services, and
                            essential patient resources.
                        </p>
                    </div>

                    <div className="shrink-0">
                        <Link
                            href="/contact"
                            className="btn h-11 min-h-11 rounded bg-[#86000D] px-8 text-sm font-semibold text-white shadow-md hover:bg-[#70000a]"
                        >
                            <FaPhoneAlt className="text-[14px]" />
                            Contact Patient Services
                        </Link>
                    </div>
                </section>

                {/* ================= SUPPORT GRID ================= */}
                <section className="mt-12">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {/* Main Highlight Card */}
                        <div className="relative overflow-hidden rounded-lg bg-[#EFEDED] shadow-sm lg:col-span-2">
                            <div className="relative h-75 sm:h-79">

                                {/* Background */}
                                <div className="absolute inset-0 bg-[url('/images/patient-care.jpg')] bg-cover bg-center mix-blend-multiply opacity-90" />

                                {/* Fallback background */}
                                <div className="absolute inset-0 bg-linear-to-br from-[#5B403D] to-[#86000D] opacity-80" />

                                {/* Gradient */}
                                <div className="absolute inset-0 bg-linear-to-t from-[#303031] via-[#303031]/70 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                                    <div className="mb-2 flex items-center gap-2">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                                            <FaHospital className="text-[#FFDAD6]" />
                                        </div>

                                        <span className="text-sm font-semibold uppercase tracking-[0.7px] text-[#FFDAD6]">
                                            Patient Assistance
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-bold text-white sm:text-[32px] sm:leading-10">
                                        Comprehensive Financial Aid
                                    </h2>

                                    <p className="mt-2 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
                                        Financial assistance is available for
                                        eligible patients who require support
                                        with hospital treatment and essential
                                        healthcare services.
                                    </p>

                                    <div className="mt-4">
                                        <Link
                                            href="/patient-care/financial-assistance"
                                            className="inline-flex items-center gap-2 rounded border border-[#E4BEBA] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                                        >
                                            Learn about financial assistance
                                            <FaArrowRight className="text-xs" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Free Dispensary */}
                        <div className="relative overflow-hidden rounded-lg bg-[#86000D] p-6 shadow-md sm:p-8">
                            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-xl bg-white/10 blur-xl" />

                            <div className="relative flex h-full flex-col justify-between">
                                <div>
                                    <div className="flex h-12 w-12 items-center justify-center rounded bg-white/20">
                                        <FaBriefcaseMedical className="text-xl text-white" />
                                    </div>

                                    <h2 className="mt-4 text-2xl font-semibold text-white">
                                        Free Dispensary
                                    </h2>

                                    <p className="mt-2 text-base leading-6 text-white/90">
                                        Providing essential medications at no
                                        cost to deserving outpatients and
                                        post-discharge patients through our
                                        community pharmacy program.
                                    </p>
                                </div>

                                <Link
                                    href="/patient-care/free-dispensary"
                                    className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white hover:underline"
                                >
                                    Learn more
                                    <FaArrowRight className="text-xs" />
                                </Link>
                            </div>
                        </div>

                        {/* Secondary Support Cards */}
                        {supportServices.map((service) => {
                            const Icon = service.icon;

                            return (
                                <div
                                    key={service.title}
                                    className="rounded-lg bg-[#E9E8E8] p-6 sm:p-8"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded bg-[#FBF9F9] shadow-sm">
                                        <Icon className="text-xl text-[#86000D]" />
                                    </div>

                                    <h3 className="mt-4 text-2xl font-semibold text-[#1B1C1C]">
                                        {service.title}
                                    </h3>

                                    <p className="mt-2 text-base leading-6 text-[#5B403D]">
                                        {service.description}
                                    </p>

                                    <p className="mt-4 text-sm font-semibold tracking-[0.14px] text-[#5F5E5E]">
                                        {service.meta}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ================= SEPARATOR ================= */}
                <div className="my-8 h-px w-full bg-[#E4BEBA]/30" />

                {/* ================= PATIENT RESOURCES ================= */}
                <section>
                    <div className="mb-8 flex items-center gap-4">
                        <h2 className="shrink-0 text-2xl font-bold tracking-[-0.32px] text-[#1B1C1C] sm:text-[32px] sm:leading-10">
                            Patient Resources
                        </h2>

                        <div className="h-px flex-1 bg-[#E4BEBA]/50" />
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {patientResources.map((resource) => {
                            const Icon = resource.icon;

                            return (
                                <article
                                    key={resource.title}
                                    className="rounded-lg border border-[#E4BEBA]/20 bg-[#FBF9F9] p-4 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-xl bg-[#EFEDED]">
                                            <Icon className="text-lg text-[#5F5E5E]" />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="text-2xl font-semibold leading-8 text-[#1B1C1C]">
                                                {resource.title}
                                            </h3>

                                            <p className="mt-1 text-base leading-6 text-[#5B403D]">
                                                {resource.description}
                                            </p>

                                            <Link
                                                href={`/patient-care/${resource.title
                                                    .toLowerCase()
                                                    .replaceAll(" ", "-")}`}
                                                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold tracking-[0.14px] text-[#86000D] hover:underline"
                                            >
                                                {resource.action}
                                                <FaChevronRight className="text-[10px]" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* ================= QUICK CONTACT ================= */}
                <section className="mt-10 rounded-lg bg-[#EFEDED] p-6 sm:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FBF9F9]">
                                    <FaIdCard className="text-[#86000D]" />
                                </div>

                                <h2 className="text-xl font-semibold text-[#1B1C1C]">
                                    Need Help?
                                </h2>
                            </div>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5B403D]">
                                Our patient services team can help you
                                understand available assistance programs,
                                hospital procedures, and other patient
                                resources.
                            </p>
                        </div>

                        <Link
                            href="/contact"
                            className="btn h-11 min-h-11 rounded bg-[#86000D] px-7 text-sm font-semibold text-white hover:bg-[#70000a]"
                        >
                            Contact Us
                            <FaArrowRight className="text-xs" />
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}