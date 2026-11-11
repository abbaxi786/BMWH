import Image from "next/image";
import Link from "next/link";

import {
    FaArrowLeft,
    FaCalendarCheck,
    FaCheckCircle,
    FaGraduationCap,
    FaHospitalUser,
    FaStethoscope,
    FaUserMd,
} from "react-icons/fa";

import { MdEmail, MdPhone } from "react-icons/md";

import DoctorSchedule from "@/app/components/doctors/schedule";
import { getActiveDoctorById } from "@/lib/data/doctors/doctors";


export const revalidate = 86400;


type Doctor = {
    id: number;
    department_id: number;
    name: string;
    doctor_type: string;
    designation: string;
    specialty: string | null;
    qualifications: string | null;
    biography: string | null;
    expertise: string | null;
    photo_url: string | null;
    profile_link: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    department_name: string;
};

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function DoctorViewPage({ params }: PageProps) {
    const { id } = await params;
    let doctor = null

    try {
        doctor = await getActiveDoctorById(id);
    } catch (error) {
        console.error("Error fetching doctor:", error);
    }

    if (!doctor) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-lg w-full bg-white rounded-2xl shadow-md p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
                        <FaUserMd className="text-4xl text-[#911824]" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-3">
                        Doctor Not Found
                    </h1>

                    <p className="text-gray-500 mb-6">
                        The doctor you are looking for does not exist or is
                        currently unavailable.
                    </p>

                    <Link
                        href="/pages/doctors"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#911824] text-white font-semibold hover:bg-[#75131d] transition"
                    >
                        <FaArrowLeft />
                        Back to Doctors
                    </Link>
                </div>
            </main>
        );
    }

    const expertise = doctor.expertise
        ? doctor.expertise
              .split(",")
              .map((item:any) => item.trim())
              .filter(Boolean)
        : [];

    return (
        <main className="bg-gray-50 min-h-screen">
            {/* =========================
                HERO SECTION
            ========================== */}
            <section className="bg-[#911824] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    {/* Back Button */}
                    <Link
                        href="/pages/doctors"
                        className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-8 transition"
                    >
                        <FaArrowLeft />
                        Back to Doctors
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-center">
                        {/* Doctor Image */}
                        <div className="flex justify-center lg:justify-start">
                            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden bg-white/10 border-4 border-white/20 shadow-xl">
                                {doctor.photo_url ? (
                                    <Image
                                        src={doctor.photo_url}
                                        alt={doctor.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 288px, 320px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FaUserMd className="text-8xl text-white/60" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Doctor Information */}
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm">
                                    <FaUserMd />
                                    {doctor.doctor_type}
                                </span>

                                {doctor.is_active && (
                                    <span className="inline-flex items-center gap-2 bg-green-500/20 border border-green-300/30 px-4 py-2 rounded-full text-sm">
                                        <FaCheckCircle />
                                        Available
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                                {doctor.name}
                            </h1>

                            <p className="text-xl text-white/90 mb-2">
                                {doctor.designation}
                            </p>

                            {doctor.specialty && (
                                <p className="text-white/80 flex items-center gap-2 mb-6">
                                    <FaStethoscope />
                                    {doctor.specialty}
                                </p>
                            )}

                            {doctor.qualifications && (
                                <div className="flex items-start gap-3 text-white/90 mb-7">
                                    <FaGraduationCap className="mt-1 shrink-0" />
                                    <span>{doctor.qualifications}</span>
                                </div>
                            )}

                            <Link
                                href="#appointment"
                                className="inline-flex items-center gap-2 bg-white text-[#911824] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                            >
                                <FaCalendarCheck />
                                Book Appointment
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================
                MAIN CONTENT
            ========================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* =========================
                        LEFT CONTENT
                    ========================== */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Doctor */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-11 h-11 rounded-lg bg-[#911824]/10 flex items-center justify-center">
                                    <FaUserMd className="text-[#911824] text-xl" />
                                </div>

                                <h2 className="text-2xl font-bold text-gray-800">
                                    About Doctor
                                </h2>
                            </div>

                            {doctor.biography ? (
                                <p className="text-gray-600 leading-8 whitespace-pre-line">
                                    {doctor.biography}
                                </p>
                            ) : (
                                <p className="text-gray-500">
                                    No biography information is available for
                                    this doctor.
                                </p>
                            )}
                        </section>

                        {/* Expertise */}
                        {expertise.length > 0 && (
                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-11 h-11 rounded-lg bg-[#911824]/10 flex items-center justify-center">
                                        <FaStethoscope className="text-[#911824] text-xl" />
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Areas of Expertise
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {expertise.map((item:any, index:number) => (
                                        <div
                                            key={`${item}-${index}`}
                                            className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
                                        >
                                            <FaCheckCircle className="text-[#911824] shrink-0" />

                                            <span className="text-gray-700">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Schedule */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-11 h-11 rounded-lg bg-[#911824]/10 flex items-center justify-center">
                                    <FaCalendarCheck className="text-[#911824] text-xl" />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Doctor Schedule
                                    </h2>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Check the doctor's available schedule.
                                    </p>
                                </div>
                            </div>

                            <DoctorSchedule doctorId={doctor.id} />
                        </section>

                        {/* Qualifications */}
                        {doctor.qualifications && (
                            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-11 h-11 rounded-lg bg-[#911824]/10 flex items-center justify-center">
                                        <FaGraduationCap className="text-[#911824] text-xl" />
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Qualifications
                                    </h2>
                                </div>

                                <p className="text-gray-600 leading-8 whitespace-pre-line">
                                    {doctor.qualifications}
                                </p>
                            </section>
                        )}
                    </div>

                    {/* =========================
                        RIGHT SIDEBAR
                    ========================== */}
                    <aside className="space-y-6">
                        {/* Professional Details */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">
                                Professional Details
                            </h2>

                            <div className="space-y-5">
                                {/* Department */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#911824]/10 flex items-center justify-center shrink-0">
                                        <FaHospitalUser className="text-[#911824]" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Department
                                        </p>

                                        <p className="font-semibold text-gray-800 mt-1">
                                            {doctor.department_name}
                                        </p>
                                    </div>
                                </div>

                                {/* Designation */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[#911824]/10 flex items-center justify-center shrink-0">
                                        <FaUserMd className="text-[#911824]" />
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Designation
                                        </p>

                                        <p className="font-semibold text-gray-800 mt-1">
                                            {doctor.designation}
                                        </p>
                                    </div>
                                </div>

                                {/* Specialty */}
                                {doctor.specialty && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#911824]/10 flex items-center justify-center shrink-0">
                                            <FaStethoscope className="text-[#911824]" />
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Specialty
                                            </p>

                                            <p className="font-semibold text-gray-800 mt-1">
                                                {doctor.specialty}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Appointment Card */}
                        <section
                            id="appointment"
                            className="bg-[#911824] text-white rounded-2xl p-6 shadow-sm"
                        >
                            <FaCalendarCheck className="text-4xl mb-4" />

                            <h2 className="text-2xl font-bold mb-3">
                                Book an Appointment
                            </h2>

                            <p className="text-white/80 leading-7 mb-6">
                                Schedule an appointment with{" "}
                                <span className="font-semibold text-white">
                                    {doctor.name}
                                </span>{" "}
                                at our hospital.
                            </p>

                            <Link
                                href="/pages/appointments"
                                className="w-full inline-flex justify-center items-center gap-2 bg-white text-[#911824] px-5 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                            >
                                <FaCalendarCheck />
                                Make Appointment
                            </Link>
                        </section>

                        {/* Contact Card */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-5">
                                Need Assistance?
                            </h2>

                            <p className="text-gray-500 text-sm leading-6 mb-5">
                                Contact our hospital team if you need help
                                booking an appointment.
                            </p>

                            <div className="space-y-4">
                                <a
                                    href="tel:+920000000000"
                                    className="flex items-center gap-3 text-gray-700 hover:text-[#911824] transition"
                                >
                                    <MdPhone className="text-xl text-[#911824]" />
                                    <span>Contact Hospital</span>
                                </a>

                                <a
                                    href="mailto:info@bmwhospital.org.pk"
                                    className="flex items-center gap-3 text-gray-700 hover:text-[#911824] transition"
                                >
                                    <MdEmail className="text-xl text-[#911824]" />
                                    <span>
                                        info@bmwhospital.org.pk
                                    </span>
                                </a>
                            </div>
                        </section>
                    </aside>
                </div>
            </section>
        </main>
    );
}