"use client";

import Image from "next/image";
import type { Doctor } from "@/app/(website)/pages/doctors/page";

interface DoctorViewModalProps {
doctor: Doctor | null;
onClose: () => void;
}

function DoctorViewModal({
doctor,
onClose,
}: DoctorViewModalProps) {
if (!doctor) {
return null;
}


return (
    <dialog
        open
        className="modal modal-bottom sm:modal-middle"
    >
        <div className="modal-box w-11/12 max-w-4xl p-0 overflow-y-scroll">

            {/* Header */}
            <div className="flex items-center justify-between bg-[#911824] px-6 py-4 text-white">
                <div>
                    <h3 className="text-lg font-semibold">
                        Doctor Details
                    </h3>

                    <p className="text-xs opacity-80">
                        Complete doctor information
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/10"
                    aria-label="Close"
                >
                    ✕
                </button>
            </div>

            {/* Content */}
            <div className="p-6">

                {/* Doctor Profile */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                    {/* Image */}
                    <div className="shrink-0">
                        {doctor.photo_url ? (
                            <Image
                                src={doctor.photo_url}
                                alt={doctor.name}
                                width={120}
                                height={120}
                                className="size-28 rounded-xl object-cover"
                            />
                        ) : (
                            <div className="flex size-28 items-center justify-center rounded-xl bg-[#f8e8e9]">
                                <span className="text-4xl font-bold text-[#911824]">
                                    {doctor.name
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Main Information */}
                    <div className="min-w-0">
                        <h2 className="text-2xl font-bold text-[#584140]">
                            {doctor.name}
                        </h2>

                        <p className="mt-1 font-medium text-[#911824]">
                            {doctor.designation || "No designation provided"}
                        </p>

                        {doctor.department_name && (
                            <p className="mt-1 text-sm text-[#584140]/70">
                                {doctor.department_name}
                            </p>
                        )}

                        <div className="mt-3">
                            <span
                                className={`badge ${
                                    doctor.is_active
                                        ? "badge-success"
                                        : "badge-error"
                                }`}
                            >
                                {doctor.is_active
                                    ? "Active"
                                    : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="divider" />

                {/* Details Grid */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    {/* Doctor Type */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                            Doctor Type
                        </p>

                        <p className="mt-1 text-sm text-[#584140]">
                            {doctor.doctor_type || "Not provided"}
                        </p>
                    </div>

                    {/* Department */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                            Department
                        </p>

                        <p className="mt-1 text-sm text-[#584140]">
                            {doctor.department_name || "Not provided"}
                        </p>
                    </div>

                    {/* Designation */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                            Designation
                        </p>

                        <p className="mt-1 text-sm text-[#584140]">
                            {doctor.designation || "Not provided"}
                        </p>
                    </div>

                    {/* Specialty */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                            Specialty
                        </p>

                        <p className="mt-1 text-sm text-[#584140]">
                            {doctor.specialty || "Not provided"}
                        </p>
                    </div>

                    {/* Qualifications */}
                    <div className="md:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                            Qualifications
                        </p>

                        <p className="mt-1 whitespace-pre-line text-sm text-[#584140]">
                            {doctor.qualifications || "Not provided"}
                        </p>
                    </div>

                    {/* Expertise */}
                    <div className="md:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                            Expertise
                        </p>

                        <p className="mt-1 whitespace-pre-line text-sm text-[#584140]">
                            {doctor.expertise || "Not provided"}
                        </p>
                    </div>

                    {/* Biography */}
                    <div className="md:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                            Biography
                        </p>

                        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#584140]">
                            {doctor.biography || "No biography provided"}
                        </p>
                    </div>

                    {/* Profile Link */}
                    <div className="md:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                            Profile Link
                        </p>

                        {doctor.profile_link ? (
                            <a
                                href={doctor.profile_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 block break-all text-sm text-[#911824] hover:underline"
                            >
                                {doctor.profile_link}
                            </a>
                        ) : (
                            <p className="mt-1 text-sm text-[#584140]">
                                Not provided
                            </p>
                        )}
                    </div>

                    {/* Doctor ID */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                            Doctor ID
                        </p>

                        <p className="mt-1 text-sm text-[#584140]">
                            {doctor.id}
                        </p>
                    </div>

                    {/* Status */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                            Status
                        </p>

                        <p className="mt-1 text-sm text-[#584140]">
                            {doctor.is_active
                                ? "Active"
                                : "Inactive"}
                        </p>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-base-200 bg-base-50 px-6 py-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="btn bg-[#911824] text-white hover:bg-[#760f19]"
                >
                    Close
                </button>
            </div>
        </div>

        {/* Click outside */}
        <form
            method="dialog"
            className="modal-backdrop"
            onClick={onClose}
        >
            <button type="button">close</button>
        </form>
    </dialog>
);


}

export default DoctorViewModal;
