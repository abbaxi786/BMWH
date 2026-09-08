import Link from "next/link";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
    FaArrowRight,
} from "react-icons/fa";

function ContactUsCard() {
    return (
        <section className="px-6 py-16 md:py-20">
            <div className="mx-auto max-w-7xl">

                <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-50 via-white to-blue-100/70 shadow-sm">

                    {/* Decorative background */}
                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-red-100/30 blur-3xl" />

                    <div className="relative z-10 grid lg:grid-cols-2">

                        {/* =================================================
                            LEFT — INTRODUCTION
                        ================================================= */}
                        <div className="p-8 md:p-12 lg:p-14">

                            {/* Label */}
                            <div className="flex items-center gap-3">

                                <span className="h-0.5 w-10 bg-[#86000D]" />

                                <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[#86000D]">
                                    Contact Us
                                </span>

                            </div>

                            {/* Heading */}
                            <h2 className="mt-4 max-w-lg text-3xl font-bold tracking-tight text-[#1B1C1C] md:text-4xl">
                                We’re Here to Help
                            </h2>

                            <p className="mt-5 max-w-xl text-lg leading-8 text-[#5B403D]">
                                Have a question about our services, departments,
                                or appointments? Get in touch with Bashir Memorial
                                Welfare Hospital.
                            </p>

                            {/* CTA */}
                            <div className="mt-8">

                                <Link
                                    href="/contact"
                                    className="btn border-[#86000D] bg-[#86000D] text-white hover:border-[#6f000a] hover:bg-[#6f000a]"
                                >
                                    Contact Us
                                    <FaArrowRight />
                                </Link>

                            </div>

                        </div>


                        {/* =================================================
                            RIGHT — CONTACT INFORMATION
                        ================================================= */}
                        <div className="bg-white/70 p-8 md:p-12 lg:p-14">

                            <h3 className="text-xl font-bold text-gray-900">
                                Important Contact Information
                            </h3>

                            <div className="mt-7 space-y-5">

                                {/* Phone */}
                                <a
                                    href="tel:+924211234567"
                                    className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-red-100 hover:shadow-md"
                                >

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#86000D]">
                                        <FaPhoneAlt />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Phone
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900 group-hover:text-[#86000D]">
                                            +92 42 112 345 67
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Main hospital line
                                        </p>
                                    </div>

                                </a>


                                {/* Email */}
                                <a
                                    href="mailto:info@bmwh.org"
                                    className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:border-red-100 hover:shadow-md"
                                >

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#86000D]">
                                        <FaEnvelope />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Email
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900 group-hover:text-[#86000D]">
                                            info@bmwh.org
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            General inquiries
                                        </p>
                                    </div>

                                </a>


                                {/* Address */}
                                <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                        <FaMapMarkerAlt />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Hospital Address
                                        </p>

                                        <p className="mt-1 font-semibold leading-6 text-gray-900">
                                            Bashir Memorial Welfare Hospital
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-gray-500">
                                            Lahore, Punjab, Pakistan
                                        </p>
                                    </div>

                                </div>


                                {/* Visiting Hours */}
                                <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                        <FaClock />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500">
                                            Visiting & Inquiry Hours
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            Monday – Saturday
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            9:00 AM – 5:00 PM
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}

export default ContactUsCard;