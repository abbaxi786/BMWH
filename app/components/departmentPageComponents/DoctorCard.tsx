"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Doctor {
    id: number;
    name: string;
    doctor_type: string;
    designation: string;
    specialty: string;
    qualifications: string;
    biography: string;
    expertise: string;
    profile_link: string;
    photo_url: string | null;
    is_active: boolean;
}

interface DoctorCardProps {
    doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
    const [imageError, setImageError] = useState(false);

    const hasImage =
        doctor.photo_url &&
        doctor.photo_url.trim() !== "" &&
        !imageError;

    const firstLetter = doctor.name?.trim().charAt(0).toUpperCase() || "?";

    return (
        <div
            className="group border border-gray-200 rounded-xl overflow-hidden
                       hover:shadow-lg hover:border-[#86000D]/30
                       transition-all duration-300"
        >
            {/* Doctor Photo */}
            <div className="h-48 bg-[#86000D]/5 flex items-center justify-center">

                {hasImage ? (
                    <Image
                        src={doctor.photo_url!}
                        alt={doctor.name}
                        width={144}
                        height={144}
                        className="w-36 h-36 rounded-full object-cover
                                   border-4 border-white shadow-md"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div
                        className="w-28 h-28 rounded-full bg-white
                                   border-4 border-[#86000D]/10
                                   flex items-center justify-center
                                   shadow-sm"
                    >
                        <span className="text-4xl font-bold text-[#86000D]">
                            {firstLetter}
                        </span>
                    </div>
                )}

            </div>

            {/* Doctor Details */}
            <div className="p-6 text-center">

                <h3 className="text-xl font-bold text-gray-900">
                    {doctor.name}
                </h3>

                {doctor.designation && (
                    <p className="mt-2 text-[#86000D] font-semibold">
                        {doctor.designation}
                    </p>
                )}

                {doctor.specialty && (
                    <p className="mt-1 text-sm text-gray-500">
                        {doctor.specialty}
                    </p>
                )}

                {doctor.qualifications && (
                    <p className="mt-4 text-sm text-gray-600">
                        {doctor.qualifications}
                    </p>
                )}

                {doctor.profile_link && (
                    <Link
                        href={"/pages/doctors/doctor_view/" + doctor.id}
                        className="inline-flex items-center gap-2 mt-5
                                   text-[#86000D] font-semibold
                                   hover:gap-3 transition-all"
                    >
                        View Profile
                        <span>→</span>
                    </Link>
                )}

            </div>
        </div>
    );
}

