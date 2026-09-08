import DoctorSchedule from "@/app/components/doctors/schedule";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  FaBriefcaseMedical,
  FaChevronRight,
  FaGraduationCap,
  FaStethoscope,
  FaUserDoctor,
} from "react-icons/fa6";
import { MdVerified } from "react-icons/md";

interface Doctor {
  id: number;
  department_id: number;
  name: string;
  doctor_type: string;
  designation: string;
  specialty: string;
  qualifications: string;
  biography: string;
  expertise: string;
  photo_url: string | null;
  profile_link: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  department_name: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function DoctorView({ params }: PageProps) {
  const { id } = await params;

  let doctor: Doctor | null = null;

  try {
    const response = await axios.get(
      `${process.env.BACKEND_URL}/api/doctors`,
      {
        params: {
          id,
        },
      }
    );

    doctor = response.data.data;

    console.log("Fetched doctor:", doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
  }

  /* =====================================================
     DOCTOR NOT FOUND
  ====================================================== */

  if (!doctor) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#911824]/10">
              <FaUserDoctor className="text-4xl text-[#911824]" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Doctor Not Found
            </h1>

            <p className="mt-3 text-gray-500">
              We could not find the doctor you are looking for.
            </p>

            <Link
              href="/pages/doctors"
              className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#911824] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#75131d]"
            >
              Back to Doctors
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* =====================================================
     EXPERTISE
  ====================================================== */

  const expertise = doctor.expertise
    ? doctor.expertise
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  return (
    <main className="min-h-screen bg-white animate-fade-in-up">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 text-sm"
          >
            <Link
              href="/"
              className="font-medium text-gray-500 transition hover:text-[#911824]"
            >
              Home
            </Link>

            <FaChevronRight className="text-[10px] text-gray-400" />

            <Link
              href="/pages/doctors"
              className="font-medium text-gray-500 transition hover:text-[#911824]"
            >
              Doctors
            </Link>

            <FaChevronRight className="text-[10px] text-gray-400" />

            <span className="font-medium text-gray-500">
              {doctor.department_name}
            </span>

            <FaChevronRight className="text-[10px] text-gray-400" />

            <span
              className="max-w-50 truncate font-semibold text-[#911824]"
              aria-current="page"
            >
              {doctor.name}
            </span>
          </nav>

          {/* Doctor Hero Card */}
          <div className="grid overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:grid-cols-[390px_1fr]">

            {/* Doctor Image */}
            <div className="relative min-h-105 bg-gray-100 lg:min-h-125">

              {doctor.photo_url ? (
                <Image
                  src={doctor.photo_url}
                  alt={doctor.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 390px"
                />
              ) : (
                <div className="flex h-full min-h-105 items-center justify-center">
                  <FaUserDoctor className="text-8xl text-gray-300" />
                </div>
              )}

            </div>

            {/* Doctor Information */}
            <div className="flex flex-col justify-center px-7 py-10 sm:px-10 lg:px-14">

              {/* Doctor Type + Availability */}
              <div className="mb-5 flex flex-wrap items-center gap-3">

                <span className="rounded-full bg-[#911824]/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#911824]">
                  {doctor.doctor_type}
                </span>

                {doctor.is_active && (
                  <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
                    <MdVerified className="text-base" />
                    Available
                  </span>
                )}

              </div>

              {/* Name */}
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                {doctor.name}
              </h1>

              {/* Designation */}
              <p className="mt-4 text-xl font-medium text-[#911824]">
                {doctor.designation}
              </p>

              {/* Specialty */}
              {doctor.specialty && (
                <div className="mt-7 flex items-center gap-3 text-gray-600">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#911824]/10">
                    <FaStethoscope className="text-[#911824]" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Specialty
                    </p>

                    <p className="font-semibold text-gray-800">
                      {doctor.specialty}
                    </p>
                  </div>

                </div>
              )}

              {/* Qualifications */}
              {doctor.qualifications && (
                <div className="mt-4 flex items-start gap-3 text-gray-600">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#911824]/10">
                    <FaGraduationCap className="text-[#911824]" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Qualifications
                    </p>

                    <p className="font-semibold leading-6 text-gray-800">
                      {doctor.qualifications}
                    </p>
                  </div>

                </div>
              )}

              {/* CTA */}
              <div className="mt-9 flex flex-wrap gap-3">

                <button className="rounded-md bg-[#911824] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#75131d]">
                  Book an Appointment
                </button>

                <a
                  href="#about-doctor"
                  className="rounded-md border border-gray-300 px-7 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-[#911824] hover:text-[#911824]"
                >
                  View Profile
                </a>

              </div>

            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid gap-10 lg:grid-cols-[1fr_350px]">

          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="space-y-8">

            {/* About Doctor */}
            <div
              id="about-doctor"
              className="border-b border-gray-200 pb-9"
            >

              <div className="mb-6 flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#911824]/10">
                  <FaUserDoctor className="text-xl text-[#911824]" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    About the Doctor
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Professional background
                  </p>
                </div>

              </div>

              <p className="max-w-4xl text-base leading-8 text-gray-600">
                {doctor.biography}
              </p>

            </div>


            {/* Areas of Expertise */}
            {expertise.length > 0 && (
              <div className="border-b border-gray-200 pb-9">

                <div className="mb-6 flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#911824]/10">
                    <FaBriefcaseMedical className="text-xl text-[#911824]" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Areas of Expertise
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Clinical specialties and expertise
                    </p>
                  </div>

                </div>

                <div className="flex flex-wrap gap-3">

                  {expertise.map((item, index) => (
                    <span
                      key={`${item}-${index}`}
                      className="rounded-md border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-[#911824]/30 hover:bg-[#911824]/5 hover:text-[#911824]"
                    >
                      {item}
                    </span>
                  ))}

                </div>

              </div>
            )}


            {/* Doctor Schedule */}
            <DoctorSchedule doctorId={doctor.id} />


            {/* Qualifications */}
            <div>

              <div className="mb-6 flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#911824]/10">
                  <FaGraduationCap className="text-xl text-[#911824]" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Qualifications
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Education and professional qualifications
                  </p>
                </div>

              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">

                <p className="font-medium leading-7 text-gray-700">
                  {doctor.qualifications}
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="space-y-6">

            {/* Professional Details */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <h3 className="text-xl font-bold text-gray-900">
                Professional Details
              </h3>

              <div className="my-5 h-px bg-gray-200" />

              <div className="space-y-5">

                {/* Specialty */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Specialty
                  </p>

                  <p className="mt-1.5 font-semibold text-gray-800">
                    {doctor.specialty || "Not specified"}
                  </p>
                </div>

                {/* Doctor Type */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Doctor Type
                  </p>

                  <p className="mt-1.5 font-semibold text-gray-800">
                    {doctor.doctor_type}
                  </p>
                </div>

                {/* Designation */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Designation
                  </p>

                  <p className="mt-1.5 font-semibold leading-6 text-gray-800">
                    {doctor.designation}
                  </p>
                </div>

                {/* Department */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Department
                  </p>

                  <p className="mt-1.5 font-semibold text-gray-800">
                    {doctor.department_name || "Not specified"}
                  </p>
                </div>

              </div>
            </div>


            {/* Appointment CTA */}
            <div className="rounded-xl bg-[#911824] p-7 text-white">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                <FaStethoscope className="text-xl" />
              </div>

              <h3 className="text-2xl font-bold">
                Need Medical Care?
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/75">
                Schedule a consultation with {doctor.name} and receive
                professional medical care from our experienced team.
              </p>

              <button className="mt-6 w-full rounded-md bg-white px-5 py-3.5 text-sm font-bold text-[#911824] transition hover:bg-gray-100">
                Book an Appointment
              </button>

            </div>

          </aside>

        </div>
      </section>

    </main>
  );
}

export default DoctorView;