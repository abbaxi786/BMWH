import axios from "axios";
import DoctorCard from "@/app/components/departmentPageComponents/DoctorCard";
import Link from "next/link";

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
    profile_link: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    department_name: string;
}

interface ApiResponse {
    success: boolean;
    data: Doctor[];
    message?: string;
}

function createDepartmentId(department: string) {
    return department
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function Doctors() {
    let doctors: Doctor[] = [];

    try {
        const response = await axios.get<ApiResponse>(
            "http://localhost:3000/api/doctors/all_doctors"
        );

        if (response.data.success) {
            doctors = response.data.data;
        }
    } catch (error) {
        console.error("Error fetching doctors:", error);
    }

    const activeDoctors = doctors.filter(
        (doctor) => doctor.is_active
    );

    const doctorsByDepartment = activeDoctors.reduce(
        (groups, doctor) => {
            const department = doctor.department_name || "Other";

            if (!groups[department]) {
                groups[department] = [];
            }

            groups[department].push(doctor);

            return groups;
        },
        {} as Record<string, Doctor[]>
    );

    return (
        <main
            id="doctors-page"
            className="min-h-screen animate-fade-in-up bg-white"
        >

            {/* =====================================================
                PAGE HERO
            ====================================================== */}

            <section
                id="doctors-overview"
                className="relative min-h-105 scroll-mt-28 overflow-hidden bg-white text-black"
                style={{
                    backgroundImage: "url('/images/ourDoctor.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center right",
                }}
            >

                {/* White gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-white via-white/95 to-white/10" />

                {/* Bottom subtle fade */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white/30 to-transparent" />

                {/* Content */}
                <div className="relative z-10 mx-auto flex min-h-105 max-w-7xl items-center px-6 py-16 md:px-8 md:py-20">

                    <div className="max-w-3xl">

                        {/* Breadcrumbs */}
                        <div className="breadcrumbs mb-8 text-sm">
                            <ul>
                                <li>
                                    <Link
                                        href="/"
                                        className="text-black/60 transition-colors hover:text-[#86000D]"
                                    >
                                        Home
                                    </Link>
                                </li>

                                <li>
                                    <span className="font-medium text-black">
                                        Doctors
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Label */}
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-0.5 w-10 bg-[#86000D]" />

                            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#86000D]">
                                Medical Team
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl font-bold tracking-tight text-[#1B1C1C] md:text-5xl lg:text-6xl">
                            Our Doctors
                        </h1>

                        {/* Description */}
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#3F4141]">
                            Meet our experienced medical professionals dedicated
                            to providing compassionate and quality healthcare to
                            our patients.
                        </p>

                    </div>
                </div>
            </section>


            {/* =====================================================
                DOCTORS
            ====================================================== */}

            <section
                id="all-doctors"
                className="scroll-mt-28 py-16 md:py-20"
            >

                <div className="mx-auto max-w-7xl px-6">

                    {activeDoctors.length === 0 ? (

                        <div className="py-16 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#86000D]/10">

                                <span className="text-2xl font-bold text-[#86000D]">
                                    !
                                </span>

                            </div>

                            <h2 className="mt-5 text-2xl font-bold text-gray-900">
                                No Doctors Available
                            </h2>

                            <p className="mt-2 text-gray-600">
                                There are currently no doctors available.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-20">

                            {Object.entries(doctorsByDepartment).map(
                                ([departmentName, departmentDoctors]) => {

                                    const departmentId =
                                        createDepartmentId(departmentName);

                                    return (
                                        <section
                                            key={departmentName}
                                            id={departmentId}
                                            className="scroll-mt-28"
                                        >

                                            {/* =================================
                                                DEPARTMENT HEADING
                                            ================================= */}

                                            <div className="mb-10">

                                                <div className="flex items-center gap-3">

                                                    <span className="h-0.5 w-10 bg-[#86000D]" />

                                                    <span className="text-sm font-semibold uppercase tracking-[0.15em] text-[#86000D]">
                                                        Medical Department
                                                    </span>

                                                </div>

                                                <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                                                    {departmentName}
                                                </h2>

                                                <div className="mt-4 h-1 w-16 bg-[#86000D]" />

                                            </div>


                                            {/* =================================
                                                DOCTOR CARDS
                                            ================================= */}

                                            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">

                                                {departmentDoctors.map(
                                                    (doctor) => (
                                                        <DoctorCard
                                                            key={doctor.id}
                                                            doctor={doctor}
                                                        />
                                                    )
                                                )}

                                            </div>

                                        </section>
                                    );
                                }
                            )}

                        </div>

                    )}

                </div>
            </section>


            {/* =====================================================
                CTA
            ====================================================== */}

            <section
                id="doctors-cta"
                className="scroll-mt-28 bg-[#86000D] py-16"
            >

                <div className="mx-auto max-w-5xl px-6 text-center">

                    <h2 className="text-3xl font-bold text-white md:text-4xl">
                        Need Medical Assistance?
                    </h2>

                    <p className="mt-4 text-lg text-white/85">
                        Our medical team is ready to provide the care
                        and support you need.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">

                        <a
                            href="/contact"
                            className="btn border-white bg-white text-[#86000D] hover:border-gray-100 hover:bg-gray-100"
                        >
                            Contact Us
                        </a>

                        <a
                            href="/appointments"
                            className="btn btn-outline border-white text-white hover:bg-white hover:text-[#86000D]"
                        >
                            Book an Appointment
                        </a>

                    </div>

                </div>
            </section>

        </main>
    );
}

export default Doctors;