"use client";

import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import type { Doctor } from "@/app/(website)/pages/doctors/page";
import DoctorViewModal from "./doctorViewModal";

interface DoctorsListProps {
    doctors: Doctor[];
    onEdit: (doctor: Doctor) => void;
    onRefresh: () => void;
}

function DoctorsList({
    doctors,
    onEdit,
}: DoctorsListProps) {
    // Currently selected doctor for the View modal
    const [selectedDoctor, setSelectedDoctor] =
        useState<Doctor | null>(null);

    // Doctor selected for deletion
    const [deleteDoctor, setDeleteDoctor] =
        useState<Doctor | null>(null);

    const [deleting, setDeleting] =
        useState(false);

    /*
    |--------------------------------------------------------------------------
    | Delete Doctor
    |--------------------------------------------------------------------------
    */

    async function handleDelete() {
        if (!deleteDoctor) {
            return;
        }

        try {
            setDeleting(true);

            await axios.delete(
                `/api/doctor?id=${deleteDoctor.id}`
            );

            /*
             * IMPORTANT:
             *
             * DoctorsList receives doctors from its parent.
             * Therefore, after deletion we reload the page so
             * the parent fetches the updated doctor list.
             */
            window.location.reload();

        } catch (error: any) {
            console.error(error);

            alert(
                error?.response?.data?.message ||
                    "Failed to delete doctor."
            );
        } finally {
            setDeleting(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Empty
    |--------------------------------------------------------------------------
    */

    if (doctors.length === 0) {
        return (
            <div className="rounded-box bg-base-100 p-8 text-center shadow-md">
                <p className="text-sm text-[#584140]">
                    No doctors found.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="w-full">
                <ul className="list bg-base-100 rounded-box shadow-md">

                    {/* Header */}
                    <li className="p-4 pb-2">
                        <div className="flex items-center justify-between">

                            <div>
                                <h2 className="text-lg font-semibold text-[#584140]">
                                    Doctors
                                </h2>

                                <p className="text-xs opacity-60">
                                    Hospital doctors
                                </p>
                            </div>

                            <div className="badge badge-outline">
                                {doctors.length} Doctors
                            </div>

                        </div>
                    </li>

                    {/* Doctors */}
                    {doctors.map((doctor) => (
                        <li
                            key={doctor.id}
                            className="list-row"
                        >

                            {/* Doctor Image */}
                            <div>
                                {doctor.photo_url ? (
                                    <Image
                                        src={doctor.photo_url}
                                        alt={doctor.name}
                                        width={48}
                                        height={48}
                                        className="size-12 rounded-box object-cover"
                                    />
                                ) : (
                                    <div className="flex size-12 items-center justify-center rounded-box bg-base-200">
                                        <span className="text-lg font-semibold text-[#911824]">
                                            {doctor.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Doctor Information */}
                            <div className="min-w-0">

                                <div className="font-semibold text-[#584140]">
                                    {doctor.name}
                                </div>

                                <div className="text-xs uppercase font-semibold opacity-60">
                                    {doctor.designation}
                                </div>

                                {doctor.department_name && (
                                    <div className="mt-1 text-xs text-[#911824]">
                                        {doctor.department_name}
                                    </div>
                                )}

                            </div>

                            {/* Qualification */}
                            <p className="list-col-wrap text-xs opacity-70">
                                {doctor.qualifications ||
                                    "No qualification provided"}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-1 whitespace-nowrap">

                                {/* View Button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedDoctor(doctor)
                                    }
                                    className="btn btn-square btn-ghost text-[#911824]"
                                    title="View doctor"
                                    aria-label={`View ${doctor.name}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="size-[1.2em]"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />

                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="3"
                                        />
                                    </svg>
                                </button>

                                {/* Edit Button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        onEdit(doctor)
                                    }
                                    className="btn btn-square btn-ghost"
                                    title="Edit doctor"
                                    aria-label={`Edit ${doctor.name}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="size-[1.2em]"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 20h9"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                                        />
                                    </svg>
                                </button>

                                {/* Delete Button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setDeleteDoctor(doctor)
                                    }
                                    className="btn btn-square btn-ghost text-red-600"
                                    title="Delete doctor"
                                    aria-label={`Delete ${doctor.name}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="size-[1.2em]"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 6h18"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8 6V4h8v2"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19 6l-1 14H6L5 6"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10 11v5"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14 11v5"
                                        />
                                    </svg>
                                </button>

                            </div>
                        </li>
                    ))}

                </ul>
            </div>

            {/* Doctor View Modal */}
            <DoctorViewModal
                doctor={selectedDoctor}
                onClose={() =>
                    setSelectedDoctor(null)
                }
            />

            {/* Delete Confirmation Modal */}
            {deleteDoctor && (
                <div className="modal modal-open">

                    <div className="modal-box">

                        <h3 className="text-lg font-bold text-[#584140]">
                            Delete Doctor?
                        </h3>

                        <p className="py-4 text-sm text-[#584140]/80">
                            Do you want to delete{" "}
                            <span className="font-semibold text-[#911824]">
                                "{deleteDoctor.name}"
                            </span>
                            ?
                        </p>

                        <p className="text-sm text-red-600">
                            This action cannot be undone.
                        </p>

                        <div className="modal-action">

                            {/* Cancel */}
                            <button
                                type="button"
                                className="btn"
                                disabled={deleting}
                                onClick={() =>
                                    setDeleteDoctor(null)
                                }
                            >
                                Cancel
                            </button>

                            {/* Delete */}
                            <button
                                type="button"
                                className="btn bg-red-600 text-white hover:bg-red-700"
                                disabled={deleting}
                                onClick={handleDelete}
                            >
                                {deleting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete"
                                )}
                            </button>

                        </div>

                    </div>

                    {/* Backdrop */}
                    <div
                        className="modal-backdrop"
                        onClick={() => {
                            if (!deleting) {
                                setDeleteDoctor(null);
                            }
                        }}
                    />

                </div>
            )}
        </>
    );
}

export default DoctorsList;