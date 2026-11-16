
import Image from "next/image";
import Link from "next/link";
import {
    FaAmbulance,
    FaArrowRight,
    FaClock,
    FaEnvelope,
    FaFacebookF,
    FaHeart,
    FaInstagram,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaQuestionCircle,
    FaUserMd,
    FaWhatsapp,
    FaYoutube,
} from "react-icons/fa";
// import ContactForm from "@/app/components/contact/ContactForm";
import Map from "@/app/components/map";

export const revalidate = 86400;

const PTCL_NUMBER = "04237124872";
const PTCL_TEL = "+924237124872";

const WHATSAPP_NUMBER = "03053444111";
const WHATSAPP_URL = "https://wa.me/923053444111";

const HOSPITAL_ADDRESS = "14/1 Lyton Road, Lahore";

const contactInfo = [
    {
        icon: FaMapMarkerAlt,
        title: "Visit Us",
        text: HOSPITAL_ADDRESS,
        description: "Bashir Memorial Welfare Hospital, Lahore, Pakistan",
    },
    {
        icon: FaPhoneAlt,
        title: "Call Us",
        text: PTCL_NUMBER,
        description: "For general hospital enquiries",
        href: `tel:${PTCL_TEL}`,
    },
    {
        icon: FaWhatsapp,
        title: "WhatsApp",
        text: WHATSAPP_NUMBER,
        description: "Send us your enquiry on WhatsApp",
        href: WHATSAPP_URL,
    },
    {
        icon: FaEnvelope,
        title: "Email Us",
        text: "info@bmwh.org",
        description: "We will respond to your enquiry",
        href: "mailto:info@bmwh.org",
    },
];

const departments = [
    {
        icon: FaUserMd,
        title: "Appointments",
        description:
            "Contact us to enquire about doctor availability, OPD timings, and appointments.",
    },
    {
        icon: FaHeart,
        title: "Patient Care",
        description:
            "For questions about our healthcare services, facilities, and patient support.",
    },
    {
        icon: FaQuestionCircle,
        title: "General Enquiries",
        description:
            "For general information about the hospital, departments, services, and visiting.",
    },
    {
        icon: FaHeart,
        title: "Donations & Support",
        description:
            "Contact our team if you would like to support BMWH's welfare and healthcare mission.",
    },
];

const faqs = [
    {
        question: "How can I book an appointment?",
        answer:
            "You can contact the hospital through our phone number or submit the contact form. Our team can guide you regarding available doctors and OPD timings.",
    },
    {
        question: "How can I find the hospital?",
        answer:
            "Our hospital location is shown on the map below. You can also contact our reception team for directions.",
    },
    {
        question: "How can I contact a specific department?",
        answer:
            "Use the contact form and mention the department you need assistance with. Our team will direct your enquiry to the appropriate department.",
    },
    {
        question: "How can I support the hospital?",
        answer:
            "You can contact our team regarding donations, welfare support, partnerships, and other ways of contributing to BMWH.",
    },
];

export default function ContactPage() {
    return (
        <main className="bg-[#FBF9F9] text-gray-800 animate-fade-in-up">
            {/* =========================================================
                HERO
            ========================================================= */}
            <section className="bg-[#FBF9F9]">
                <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">

                    {/* BREADCRUMB */}
                    <nav
                        aria-label="Breadcrumb"
                        className="mb-12"
                    >
                        <ol className="flex items-center gap-2 text-sm">
                            <li>
                                <Link
                                    href="/"
                                    className="font-medium text-gray-500 transition-colors hover:text-[#911824]"
                                >
                                    Home
                                </Link>
                            </li>

                            <li
                                aria-hidden="true"
                                className="text-gray-400"
                            >
                                /
                            </li>

                            <li>
                                <span className="font-semibold text-[#911824]">
                                    Contact Us
                                </span>
                            </li>
                        </ol>
                    </nav>

                    {/* HERO CONTENT */}
                    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

                        {/* LEFT CONTENT */}
                        <div className="max-w-2xl">

                            <span className="inline-flex rounded-full bg-[#911824]/10 px-4 py-2 text-sm font-semibold text-[#911824]">
                                Get In Touch
                            </span>

                            <h1 className="mt-5 text-4xl font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                                We’re Here to
                                <span className="block text-[#911824]">
                                    Help You
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 md:text-lg">
                                Whether you need information about our healthcare
                                services, want to make an appointment, need directions,
                                or would like to support our mission, our team is here
                                to assist you.
                            </p>

                            {/* ACTIONS */}
                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <a
                                    href={`tel:${PTCL_TEL}`}
                                    className="btn h-11 min-h-0 border-none bg-[#911824] px-7 text-white hover:bg-[#74131e]"
                                >
                                    <FaPhoneAlt />
                                    Call Us
                                </a>

                                <a
                                    href={WHATSAPP_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn h-11 min-h-0 border-[#911824] bg-transparent px-7 text-[#911824] hover:border-[#911824] hover:bg-[#911824] hover:text-white"
                                >
                                    <FaWhatsapp />
                                    WhatsApp Us
                                </a>
                            </div>
                        </div>

                        {/* RIGHT CONTACT CARD */}
                        <div className="w-full">
                            <div className="rounded-3xl bg-[#911824] p-7 text-white shadow-xl md:p-9 lg:p-10">

                                {/* CARD HEADER */}
                                <div className="border-b border-white/10 pb-7">
                                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60">
                                        Hospital Contact
                                    </span>

                                    <h2 className="mt-2 text-2xl font-bold leading-tight md:text-3xl">
                                        Bashir Memorial Welfare Hospital
                                    </h2>

                                    <p className="mt-3 text-sm leading-6 text-white/70">
                                        We are available to assist you with your
                                        healthcare and general enquiries.
                                    </p>
                                </div>

                                {/* CONTACT DETAILS */}
                                <div className="mt-7 space-y-6">

                                    {/* ADDRESS */}
                                    <div className="flex gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                                            <FaMapMarkerAlt />
                                        </div>

                                        <div>
                                            <p className="font-semibold">
                                                Hospital Address
                                            </p>

                                            <p className="mt-1 text-sm leading-6 text-white/70">
                                                {HOSPITAL_ADDRESS}
                                                <br />
                                                Lahore, Punjab, Pakistan
                                            </p>
                                        </div>
                                    </div>

                                    {/* PTCL */}
                                    <div className="flex gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                                            <FaPhoneAlt />
                                        </div>

                                        <div>
                                            <p className="font-semibold">
                                                General Enquiries (PTCL)
                                            </p>

                                            <a
                                                href={`tel:${PTCL_TEL}`}
                                                className="mt-1 block text-sm text-white/70 transition hover:text-white"
                                            >
                                                {PTCL_NUMBER}
                                            </a>
                                        </div>
                                    </div>

                                    {/* WHATSAPP */}
                                    <div className="flex gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                                            <FaWhatsapp />
                                        </div>

                                        <div>
                                            <p className="font-semibold">
                                                WhatsApp Assistance
                                            </p>

                                            <a
                                                href={WHATSAPP_URL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-1 block text-sm text-white/70 transition hover:text-white"
                                            >
                                                {WHATSAPP_NUMBER}
                                            </a>
                                        </div>
                                    </div>

                                    {/* EMAIL */}
                                    <div className="flex gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                                            <FaEnvelope />
                                        </div>

                                        <div>
                                            <p className="font-semibold">
                                                Email
                                            </p>

                                            <a
                                                href="mailto:info@bmwh.org"
                                                className="mt-1 block text-sm text-white/70 transition hover:text-white"
                                            >
                                                info@bmwh.org
                                            </a>
                                        </div>
                                    </div>

                                    {/* RECEPTION HOURS */}
                                    <div className="flex gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                                            <FaClock />
                                        </div>

                                        <div>
                                            <p className="font-semibold">
                                                Reception Hours
                                            </p>

                                            <p className="mt-1 text-sm text-white/70">
                                                Monday - Saturday
                                            </p>

                                            <p className="text-sm text-white/70">
                                                9:00 AM - 5:00 PM
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* EMERGENCY */}
                                <div className="mt-8 rounded-2xl bg-white/10 p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                            <FaAmbulance className="text-xl" />
                                        </div>

                                        <div>
                                            <p className="font-semibold">
                                                Emergency Services
                                            </p>

                                            <p className="mt-1 text-sm leading-6 text-white/70">
                                                For emergencies, please contact the
                                                hospital directly.
                                            </p>
                                        </div>
                                    </div>

                                    <a
                                        href={`tel:${PTCL_TEL}`}
                                        className="mt-4 block text-lg font-bold transition hover:text-white/80"
                                    >
                                        {PTCL_NUMBER}
                                    </a>

                                    <a
                                        href={WHATSAPP_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-block text-sm font-semibold text-white/80 transition hover:text-white"
                                    >
                                        WhatsApp: {WHATSAPP_NUMBER}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================================
                CONTACT INFORMATION
            ========================================================= */}
            <section id="whatsapp_assistance" className="py-16 md:py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <span className="text-sm font-semibold uppercase tracking-wider text-[#911824]">
                            Contact Information
                        </span>

                        <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                            Reach Us Easily
                        </h2>

                        <p className="mt-4 leading-7 text-gray-600">
                            Choose the most convenient way to contact Bashir Memorial
                            Welfare Hospital.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {contactInfo.map((item, index) => {
                            const Icon = item.icon;

                            const content = (
                                <>
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#911824]/10 text-[#911824]">
                                        <Icon className="text-lg" />
                                    </div>

                                    <h3 className="mt-5 text-lg font-bold text-gray-900">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 font-medium text-[#911824]">
                                        {item.text}
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        {item.description}
                                    </p>
                                </>
                            );

                            return item.href ? (
                                <a
                                    key={index}
                                    href={item.href}
                                    target={
                                        item.title === "WhatsApp"
                                            ? "_blank"
                                            : undefined
                                    }
                                    rel={
                                        item.title === "WhatsApp"
                                            ? "noopener noreferrer"
                                            : undefined
                                    }
                                    className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    {content}
                                </a>
                            ) : (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    {content}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* =========================================================
                CONTACT FORM
            ========================================================= */}
            <section id="contact-form" className="bg-white py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">

                        {/* LEFT */}
                        <div>
                            <span className="text-sm font-semibold uppercase tracking-wider text-[#911824]">
                                Send Us a Message
                            </span>

                            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                                How Can We Help You?
                            </h2>

                            <p className="mt-5 leading-7 text-gray-600">
                                Have a question about our services, doctors, appointments,
                                patient care, or hospital facilities? Send us a message and
                                our team will assist you.
                            </p>

                            <div className="mt-8 space-y-5">

                                {/* PTCL */}
                                <div className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#911824]/10 text-[#911824]">
                                        <FaPhoneAlt />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Prefer to talk?
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Call our reception team for immediate assistance.
                                        </p>

                                        <a
                                            href={`tel:${PTCL_TEL}`}
                                            className="mt-1 inline-block font-semibold text-[#911824]"
                                        >
                                            {PTCL_NUMBER}
                                        </a>
                                    </div>
                                </div>

                                {/* EMAIL */}
                                <div className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#911824]/10 text-[#911824]">
                                        <FaEnvelope />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Email support
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            For general enquiries and information.
                                        </p>

                                        <a
                                            href="mailto:info@bmwh.org"
                                            className="mt-1 inline-block font-semibold text-[#911824]"
                                        >
                                            info@bmwh.org
                                        </a>
                                    </div>
                                </div>

                                {/* WHATSAPP */}
                                <div className="flex gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#911824]/10 text-[#911824]">
                                        <FaWhatsapp />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            WhatsApp
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Send us a message through WhatsApp.
                                        </p>

                                        <a
                                            href={WHATSAPP_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 inline-block font-semibold text-[#911824]"
                                        >
                                            {WHATSAPP_NUMBER}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FORM */}
                        {/* <ContactForm /> */}
                    </div>
                </div>
            </section>

            {/* =========================================================
                DEPARTMENT HELP
            ========================================================= */}
            <section className="py-16 md:py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto mb-12 max-w-2xl text-center">
                        <span className="text-sm font-semibold uppercase tracking-wider text-[#911824]">
                            Need Assistance?
                        </span>

                        <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                            We Can Direct You
                        </h2>

                        <p className="mt-4 leading-7 text-gray-600">
                            Tell us what you need and our team will help connect you with
                            the appropriate service.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {departments.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={index}
                                    className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#911824]/10 text-[#911824]">
                                        <Icon />
                                    </div>

                                    <h3 className="mt-5 font-bold text-gray-900">
                                        {item.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-gray-600">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* =========================================================
                LOCATION / MAP
            ========================================================= */}
            <section id="location">
                <Map />
            </section>

            {/* =========================================================
                FAQ
            ========================================================= */}
            <section className="py-16 md:py-24">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <span className="text-sm font-semibold uppercase tracking-wider text-[#911824]">
                            Frequently Asked Questions
                        </span>

                        <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                            Common Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="collapse collapse-arrow rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
                            >
                                <input
                                    type="radio"
                                    name="contact-faq"
                                    defaultChecked={index === 0}
                                />

                                <div className="collapse-title pr-12 font-semibold text-gray-900">
                                    {faq.question}
                                </div>

                                <div className="collapse-content">
                                    <p className="leading-7 text-gray-600">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* =========================================================
                SOCIAL / SUPPORT
            ========================================================= */}
            <section className="bg-white py-16">
                <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#911824]/10 text-2xl text-[#911824]">
                        <FaHeart />
                    </div>

                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Stay Connected With BMWH
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
                        Follow us for hospital updates, healthcare information, community
                        activities, events, and opportunities to support our mission.
                    </p>

                    <div className="mt-7 flex justify-center gap-3">
                        <a
                            href="https://www.facebook.com/profile.php?id=61592074031243"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#911824] text-white transition hover:bg-[#74131e]"
                        >
                            <FaFacebookF />
                        </a>

                        <a
                            href="https://www.instagram.com/bashirmemorialbmt"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#911824] text-white transition hover:bg-[#74131e]"
                        >
                            <FaInstagram />
                        </a>

                        <a
                            href="https://www.youtube.com/@bmwhospital"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#911824] text-white transition hover:bg-[#74131e]"
                        >
                            <FaYoutube />
                        </a>

                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#911824] text-white transition hover:bg-[#74131e]"
                        >
                            <FaWhatsapp />
                        </a>
                    </div>
                </div>
            </section>

            {/* =========================================================
                FINAL CTA
            ========================================================= */}
            <section className="px-6 py-16 lg:px-8">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#911824] px-8 py-12 text-center text-white md:px-12 md:py-16">
                    <h2 className="text-3xl font-bold md:text-4xl">
                        Need More Information?
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/75">
                        Our team is ready to help you with questions about healthcare
                        services, appointments, patient care, donations, and hospital
                        facilities.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <a
                            href={`tel:${PTCL_TEL}`}
                            className="btn border-none bg-white px-8 text-[#911824] hover:bg-gray-100"
                        >
                            <FaPhoneAlt />
                            Call the Hospital
                        </a>

                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn border border-white bg-transparent px-8 text-white hover:bg-white hover:text-[#911824]"
                        >
                            <FaWhatsapp />
                            WhatsApp Us
                        </a>

                        <Link
                            href="/pages/patient_care"
                            className="btn btn-outline border-white px-8 text-white hover:bg-white hover:text-[#911824]"
                        >
                            Patient Care
                            <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
