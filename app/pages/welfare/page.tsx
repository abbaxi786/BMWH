import Link from "next/link";
import {
    FaArrowRight,
    FaBookOpen,
    FaBriefcaseMedical,
    FaChevronRight,
    FaClipboardList,
    FaFileAlt,
    FaHeart,
    FaHospitalUser,
    FaIdCard,
    FaQuestionCircle,
    FaShieldAlt,
    FaStethoscope,
    FaUtensils,
    FaWallet,
    FaFileMedical,
} from "react-icons/fa";

/* =========================
   FINANCIAL & COMMUNITY SUPPORT
========================= */

const supportServices = [
    {
        title: "Zakat & Financial Assistance",
        description:
            "Financial assistance is available for eligible and deserving patients who require support with treatment and essential healthcare services.",
        action: "Learn about financial assistance",
        href: "/patient-welfare/zakat-financial-assistance",
        icon: FaWallet,
        featured: true,
    },
    {
        title: "Free Medicines",
        description:
            "Essential medicines are provided free of cost to eligible and deserving patients through our welfare and community support programs.",
        action: "Learn more",
        href: "/patient-welfare/free-medicines",
        icon: FaBriefcaseMedical,
    },
    {
        title: "Free Meals",
        description:
            "Free meals may be provided to patients and attendants who require support during their hospital stay.",
        action: "Learn more",
        href: "/patient-welfare/free-meals",
        icon: FaUtensils,
    },
];

/* =========================
   PATIENT RESOURCES
========================= */

const patientResources = [
    {
        title: "Admission Process",
        description:
            "Understand the admission procedure, required documents, registration steps, and important information for patients.",
        action: "View admission guide",
        href: "/patient-welfare/admission-process",
        icon: FaClipboardList,
    },
    {
        title: "Patient Rights & Responsibilities",
        description:
            "Learn about your rights, responsibilities, privacy, safety, and the respectful care you can expect at BMWH.",
        action: "Know your rights",
        href: "/patient-welfare/patient-rights",
        icon: FaShieldAlt,
    },
    {
        title: "Information Guides",
        description:
            "Access useful information and guidance to help patients and attendants understand hospital services and procedures.",
        action: "View information guides",
        href: "/patient-welfare/information-guides",
        icon: FaBookOpen,
    },
    {
        title: "Forms & Resources",
        description:
            "Find patient forms, applications, and other resources that may be required during your hospital journey.",
        action: "View forms & resources",
        href: "/patient-welfare/forms-resources",
        icon: FaFileAlt,
    },
    {
        title: "Billing & Fees",
        description:
            "Find information about applicable hospital charges, fees, billing procedures, and payment-related guidance.",
        action: "View billing information",
        href: "/patient-welfare/billing-fees",
        icon: FaIdCard,
    },
    {
        title: "Frequently Asked Questions",
        description:
            "Find answers to common questions about patient services, admission, assistance programs, and hospital procedures.",
        action: "View FAQs",
        href: "/patient-welfare/faqs",
        icon: FaQuestionCircle,
    },
];

/* =========================
   ONLINE SERVICES
========================= */

const onlineServices = [
    {
        title: "Request an Appointment",
        description:
            "Request an appointment with a doctor or healthcare service through our online patient services.",
        action: "Request appointment",
        href: "/appointments",
        icon: FaStethoscope,
    },
    {
        title: "View Lab Reports",
        description:
            "Access your available laboratory reports online and stay informed about your diagnostic results.",
        action: "View lab reports",
        href: "/lab-reports",
        icon: FaFileMedical,
    },
];

/* =========================
   PATIENT STORIES
========================= */

const patientStories = [
    {
        title: "Patient Success Stories",
        description:
            "Read stories that highlight the experiences, recovery, and impact of compassionate healthcare at BMWH.",
        action: "View success stories",
        href: "/patient-welfare/success-stories",
        icon: FaHeart,
    },
];

export default function PatientWelfare() {
    return (
        <main
            id="patient-welfare-page"
            className="min-h-screen bg-[#FBF9F9] pt-30 animate-fade-in-up"
        >
            <div className="mx-auto w-full max-w-7xl px-5 py-4 sm:px-8 lg:px-10 lg:pb-10">

                {/* ================= HEADER ================= */}

                <section
                    id="patient-welfare-overview"
                    className="scroll-mt-28 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
                >
                    <div className="max-w-3xl">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[1.4px] text-[#86000D]">
                            Patient Welfare
                        </p>

                        <h1 className="text-4xl font-bold tracking-[-0.96px] text-[#1B1C1C] sm:text-5xl">
                            Supporting Patients Beyond Treatment
                        </h1>

                        <p className="mt-4 text-base leading-7 text-[#5B403D] sm:text-lg">
                            BMWH is committed to helping patients access quality
                            healthcare with dignity and compassion. Explore
                            financial assistance, patient resources, online
                            services, and support available to patients and
                            their families.
                        </p>
                    </div>

                    <div className="shrink-0">
                        <Link
                            href="/contact"
                            className="btn h-11 min-h-11 rounded bg-[#86000D] px-7 text-sm font-semibold text-white shadow-md hover:bg-[#70000a]"
                        >
                            Get Assistance
                            <FaArrowRight className="text-xs" />
                        </Link>
                    </div>
                </section>

                {/* ================= FINANCIAL & COMMUNITY SUPPORT ================= */}

                <section
                    id="financial-community-support"
                    className="mt-12 scroll-mt-28"
                >
                    <div className="mb-8 flex items-center gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[1px] text-[#86000D]">
                                Financial & Community Support
                            </p>

                            <h2 className="mt-1 text-2xl font-bold tracking-[-0.32px] text-[#1B1C1C] sm:text-[32px] sm:leading-10">
                                Helping Patients in Need
                            </h2>
                        </div>

                        <div className="hidden h-px flex-1 bg-[#E4BEBA]/50 sm:block" />
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {supportServices.map((service) => {
                            const Icon = service.icon;

                            if (service.featured) {
                                return (
                                    <div
                                        id="zakat-financial-assistance"
                                        key={service.title}
                                        className="relative scroll-mt-28 overflow-hidden rounded-lg bg-[#86000D] p-6 shadow-md sm:p-8 lg:col-span-1"
                                    >
                                        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

                                        <div className="relative flex h-full flex-col justify-between">
                                            <div>
                                                <div className="flex h-12 w-12 items-center justify-center rounded bg-white/20">
                                                    <Icon className="text-xl text-white" />
                                                </div>

                                                <h3 className="mt-5 text-2xl font-semibold text-white">
                                                    {service.title}
                                                </h3>

                                                <p className="mt-3 text-base leading-6 text-white/90">
                                                    {service.description}
                                                </p>
                                            </div>

                                            <Link
                                                href={service.href}
                                                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white hover:underline"
                                            >
                                                {service.action}
                                                <FaArrowRight className="text-xs" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    id={
                                        service.title === "Free Medicines"
                                            ? "free-medicines"
                                            : "free-meals"
                                    }
                                    key={service.title}
                                    href={service.href}
                                    className="group scroll-mt-28 rounded-lg bg-[#E9E8E8] p-6 transition hover:-translate-y-1 hover:shadow-md sm:p-8"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded bg-[#FBF9F9] shadow-sm">
                                        <Icon className="text-xl text-[#86000D]" />
                                    </div>

                                    <h3 className="mt-5 text-2xl font-semibold text-[#1B1C1C]">
                                        {service.title}
                                    </h3>

                                    <p className="mt-2 text-base leading-6 text-[#5B403D]">
                                        {service.description}
                                    </p>

                                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#86000D]">
                                        {service.action}

                                        <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* ================= SEPARATOR ================= */}

                <div className="my-10 h-px w-full bg-[#E4BEBA]/30" />

                {/* ================= PATIENT RESOURCES ================= */}

                <section
                    id="patient-resources"
                    className="scroll-mt-28"
                >
                    <div className="mb-8 flex items-center gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[1px] text-[#86000D]">
                                Patient Resources
                            </p>

                            <h2 className="mt-1 text-2xl font-bold tracking-[-0.32px] text-[#1B1C1C] sm:text-[32px] sm:leading-10">
                                Information You Can Rely On
                            </h2>
                        </div>

                        <div className="hidden h-px flex-1 bg-[#E4BEBA]/50 sm:block" />
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {patientResources.map((resource) => {
                            const Icon = resource.icon;

                            const resourceIdMap: Record<string, string> = {
                                "Admission Process": "admission-process",
                                "Patient Rights & Responsibilities":
                                    "patient-rights-responsibilities",
                                "Information Guides": "information-guides",
                                "Forms & Resources": "forms-resources",
                                "Billing & Fees": "billing-fees",
                                "Frequently Asked Questions": "faqs",
                            };

                            return (
                                <Link
                                    id={resourceIdMap[resource.title]}
                                    key={resource.title}
                                    href={resource.href}
                                    className="group scroll-mt-28 rounded-lg border border-[#E4BEBA]/20 bg-[#FBF9F9] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFEDED]">
                                            <Icon className="text-lg text-[#86000D]" />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="text-xl font-semibold leading-7 text-[#1B1C1C] sm:text-2xl">
                                                {resource.title}
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-[#5B403D] sm:text-base">
                                                {resource.description}
                                            </p>

                                            <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold tracking-[0.14px] text-[#86000D]">
                                                {resource.action}

                                                <FaChevronRight className="text-[10px] transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* ================= SEPARATOR ================= */}

                <div className="my-10 h-px w-full bg-[#E4BEBA]/30" />

                {/* ================= ONLINE SERVICES ================= */}

                <section
                    id="online-services"
                    className="scroll-mt-28"
                >
                    <div className="mb-8 flex items-center gap-4">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[1px] text-[#86000D]">
                                Online Services
                            </p>

                            <h2 className="mt-1 text-2xl font-bold tracking-[-0.32px] text-[#1B1C1C] sm:text-[32px] sm:leading-10">
                                Access Services Online
                            </h2>
                        </div>

                        <div className="hidden h-px flex-1 bg-[#E4BEBA]/50 sm:block" />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {onlineServices.map((service) => {
                            const Icon = service.icon;

                            const serviceId =
                                service.title === "Request an Appointment"
                                    ? "request-appointment"
                                    : "view-lab-reports";

                            return (
                                <Link
                                    id={serviceId}
                                    key={service.title}
                                    href={service.href}
                                    className="group flex scroll-mt-28 flex-col rounded-lg bg-[#EFEDED] p-6 transition hover:-translate-y-1 hover:shadow-md sm:p-8"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded bg-[#FBF9F9] shadow-sm">
                                        <Icon className="text-xl text-[#86000D]" />
                                    </div>

                                    <h3 className="mt-5 text-2xl font-semibold text-[#1B1C1C]">
                                        {service.title}
                                    </h3>

                                    <p className="mt-2 text-base leading-6 text-[#5B403D]">
                                        {service.description}
                                    </p>

                                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#86000D]">
                                        {service.action}

                                        <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* ================= PATIENT STORIES ================= */}

                <section
                    id="patient-success-stories"
                    className="mt-10 scroll-mt-28"
                >
                    {patientStories.map((story) => {
                        const Icon = story.icon;

                        return (
                            <Link
                                key={story.title}
                                href={story.href}
                                className="group relative block overflow-hidden rounded-lg bg-[#86000D] p-6 shadow-md sm:p-8"
                            >
                                <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

                                <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                    <div className="flex gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-white/20">
                                            <Icon className="text-xl text-white" />
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold uppercase tracking-[1px] text-[#FFDAD6]">
                                                Patient Stories
                                            </p>

                                            <h2 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                                                {story.title}
                                            </h2>

                                            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                                                {story.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-white">
                                        {story.action}

                                        <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </section>

                {/* ================= QUICK ASSISTANCE ================= */}

                <section
                    id="patient-assistance"
                    className="mt-10 scroll-mt-28 rounded-lg bg-[#EFEDED] p-6 sm:p-8"
                >
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FBF9F9]">
                                    <FaHospitalUser className="text-[#86000D]" />
                                </div>

                                <h2 className="text-xl font-semibold text-[#1B1C1C]">
                                    Need Patient Assistance?
                                </h2>
                            </div>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5B403D]">
                                Our patient services team can guide you regarding
                                financial assistance, patient resources,
                                hospital procedures, and available welfare
                                services.
                            </p>
                        </div>

                        <Link
                            href="/contact"
                            className="btn h-11 min-h-11 rounded bg-[#86000D] px-7 text-sm font-semibold text-white hover:bg-[#70000a]"
                        >
                            Contact Patient Services
                            <FaArrowRight className="text-xs" />
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}