import Link from "next/link";
import {
    FaArrowRight,
    FaBed,
    FaBriefcaseMedical,
    FaBuilding,
    FaHospital,
    FaPhoneAlt,
    FaProcedures,
    FaUtensils,
    FaUserMd,
} from "react-icons/fa";

const hospitalFacilities = [
    {
        title: "Outpatient Department",
        shortTitle: "OPD",
        description:
            "Our Outpatient Department provides consultation, examination, diagnosis, and treatment services for patients who do not require hospital admission.",
        icon: FaUserMd,
        href: "/patient-care/opd",
        meta: "Outpatient Services",
    },
    {
        title: "Inpatient Department",
        shortTitle: "IPD",
        description:
            "Our inpatient facilities provide a safe and supportive environment for patients who require admission, observation, treatment, and continued medical care.",
        icon: FaBed,
        href: "/patient-care/ipd",
        meta: "Inpatient Services",
    },
    {
        title: "Operation Theater",
        shortTitle: "OT",
        description:
            "Our Operation Theater provides a controlled and appropriately equipped environment for surgical procedures and operative care.",
        icon: FaProcedures,
        href: "/patient-care/operation-theater",
        meta: "Surgical Services",
    },
];

const supportServices = [
    {
        title: "Pharmacy",
        description:
            "Our pharmacy supports patients by providing prescribed medicines and pharmaceutical services as part of their healthcare journey.",
        icon: FaBriefcaseMedical,
        href: "/patient-care/pharmacy",
    },
    {
        title: "Cafeteria",
        description:
            "Our cafeteria provides food and refreshments for patients, attendants, visitors, and hospital staff in a convenient setting.",
        icon: FaUtensils,
        href: "/patient-care/cafeteria",
    },
];

export default function PatientCare() {
    return (
        <main className="min-h-screen bg-[#FBF9F9] pt-30 animate-fade-in-up">

            <div className="mx-auto w-full max-w-7xl px-5 py-4 sm:px-8 lg:px-10 lg:pb-10">

                {/* ================= HEADER ================= */}

                <section
                    id="patient-care-overview"
                    className="scroll-mt-28 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
                >
                    <div className="max-w-3xl">

                        <p className="mb-2 text-sm font-semibold uppercase tracking-[1.4px] text-[#86000D]">
                            Patient Care
                        </p>

                        <h1 className="text-4xl font-bold tracking-[-0.96px] text-[#1B1C1C] sm:text-5xl">
                            Quality Care, Every Step of the Way
                        </h1>

                        <p className="mt-4 text-base leading-7 text-[#5B403D] sm:text-lg">
                            BMWH provides essential healthcare facilities and
                            services designed to support patients throughout
                            their treatment journey. Explore our hospital
                            facilities and services available to patients and
                            their attendants.
                        </p>

                    </div>

                    <div className="shrink-0">

                        <Link
                            href="/contact"
                            className="btn h-11 min-h-11 rounded bg-[#86000D] px-7 text-sm font-semibold text-white shadow-md hover:bg-[#70000a]"
                        >
                            <FaPhoneAlt className="text-[14px]" />
                            Contact Us
                        </Link>

                    </div>
                </section>


                {/* ================= HOSPITAL FACILITIES ================= */}

                <section
                    id="hospital-facilities"
                    className="mt-12 scroll-mt-28"
                >

                    <div className="mb-8 flex items-end gap-4">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-[1px] text-[#86000D]">
                                Hospital Facilities
                            </p>

                            <h2 className="mt-1 text-2xl font-bold tracking-[-0.32px] text-[#1B1C1C] sm:text-[32px] sm:leading-10">
                                Facilities for Your Care
                            </h2>

                        </div>

                        <div className="mb-2 hidden h-px flex-1 bg-[#E4BEBA]/50 sm:block" />

                    </div>


                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {hospitalFacilities.map((facility) => {

                            const Icon = facility.icon;

                            return (
                                <Link
                                    key={facility.title}
                                    href={facility.href}
                                    className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-[#E4BEBA]/20 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-8"
                                >

                                    {/* Decorative element */}
                                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#86000D]/5 transition-transform duration-500 group-hover:scale-125" />

                                    <div className="relative">

                                        {/* Icon */}
                                        <div className="flex h-14 w-14 items-center justify-center rounded bg-[#EFEDED]">
                                            <Icon className="text-2xl text-[#86000D]" />
                                        </div>

                                        {/* Label */}
                                        <p className="mt-6 text-xs font-semibold uppercase tracking-[1px] text-[#86000D]">
                                            {facility.shortTitle}
                                        </p>

                                        {/* Title */}
                                        <h3 className="mt-1 text-2xl font-semibold leading-8 text-[#1B1C1C]">
                                            {facility.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="mt-3 text-base leading-6 text-[#5B403D]">
                                            {facility.description}
                                        </p>

                                        {/* Meta */}
                                        <p className="mt-5 text-sm font-semibold tracking-[0.14px] text-[#5F5E5E]">
                                            {facility.meta}
                                        </p>

                                        {/* Action */}
                                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#86000D]">
                                            Explore facility

                                            <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>

                                    </div>

                                </Link>
                            );

                        })}

                    </div>

                </section>


                {/* ================= SEPARATOR ================= */}

                <div className="my-10 h-px w-full bg-[#E4BEBA]/30" />


                {/* ================= SUPPORT SERVICES ================= */}

                <section
                    id="support-services"
                    className="scroll-mt-28"
                >

                    <div className="mb-8 flex items-end gap-4">

                        <div>

                            <p className="text-sm font-semibold uppercase tracking-[1px] text-[#86000D]">
                                Support Services
                            </p>

                            <h2 className="mt-1 text-2xl font-bold tracking-[-0.32px] text-[#1B1C1C] sm:text-[32px] sm:leading-10">
                                Services That Support Your Care
                            </h2>

                        </div>

                        <div className="mb-2 hidden h-px flex-1 bg-[#E4BEBA]/50 sm:block" />

                    </div>


                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        {supportServices.map((service) => {

                            const Icon = service.icon;

                            return (
                                <Link
                                    key={service.title}
                                    href={service.href}
                                    className="group flex h-full flex-col rounded-lg bg-[#EFEDED] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-8"
                                >

                                    <div className="flex h-14 w-14 items-center justify-center rounded bg-[#FBF9F9] shadow-sm">
                                        <Icon className="text-2xl text-[#86000D]" />
                                    </div>

                                    <h3 className="mt-5 text-2xl font-semibold text-[#1B1C1C]">
                                        {service.title}
                                    </h3>

                                    <p className="mt-2 max-w-2xl text-base leading-6 text-[#5B403D]">
                                        {service.description}
                                    </p>

                                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#86000D]">
                                        Explore service

                                        <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>

                                </Link>
                            );

                        })}

                    </div>

                </section>


                {/* ================= CARE JOURNEY ================= */}

                <section
                    id="care-journey"
                    className="mt-10 scroll-mt-28 overflow-hidden rounded-lg bg-[#86000D]"
                >

                    <div className="relative p-6 sm:p-8 lg:p-10">

                        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

                        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                            <div className="max-w-3xl">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded bg-white/15">
                                        <FaHospital className="text-lg text-white" />
                                    </div>

                                    <p className="text-sm font-semibold uppercase tracking-[1px] text-[#FFDAD6]">
                                        Your Healthcare Journey
                                    </p>

                                </div>

                                <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                                    Comprehensive Hospital Care
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-white/85 sm:text-base">
                                    From outpatient consultations to inpatient
                                    treatment and surgical care, BMWH provides
                                    essential hospital facilities supported by
                                    pharmacy and other patient services.
                                </p>

                            </div>


                            <Link
                                href="/pages/doctors"
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded border border-[#E4BEBA] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Find a Doctor

                                <FaArrowRight className="text-xs" />
                            </Link>

                        </div>

                    </div>

                </section>


                {/* ================= QUICK CONTACT ================= */}

                <section
                    id="patient-care-contact"
                    className="mt-8 scroll-mt-28 rounded-lg bg-[#EFEDED] p-6 sm:p-8"
                >

                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                        <div className="flex gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FBF9F9]">
                                <FaBuilding className="text-[#86000D]" />
                            </div>

                            <div>

                                <h2 className="text-xl font-semibold text-[#1B1C1C]">
                                    Need Information About Our Facilities?
                                </h2>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5B403D]">
                                    Contact BMWH to learn more about our
                                    facilities, available services, and
                                    current hospital arrangements.
                                </p>

                            </div>

                        </div>


                        <Link
                            href="/pages/contact"
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