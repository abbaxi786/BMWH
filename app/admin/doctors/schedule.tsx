"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import type { Doctor } from "@/app/(website)/pages/doctors/page";

interface DoctorsApiResponse {
    success: boolean;
    data: Doctor[];
    message?: string;
}

export interface ScheduleData {
    id: number;
    doctor_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    location: string | null;
    is_available: boolean;
    created_at?: string;
    updated_at?: string;
}

interface ScheduleApiResponse {
    success: boolean;
    data: ScheduleData[];
    message?: string;
}

interface ScheduleListProps {
    onEdit?: (schedule: ScheduleData) => void;
}

function ScheduleList({
    onEdit,
}: ScheduleListProps) {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [schedules, setSchedules] = useState<ScheduleData[]>([]);

    const [selectedDoctor, setSelectedDoctor] =
        useState("");

    const [loadingDoctors, setLoadingDoctors] =
        useState(true);

    const [loadingSchedules, setLoadingSchedules] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    // Delete state
    const [deleteSchedule, setDeleteSchedule] =
        useState<ScheduleData | null>(null);

    const [deleting, setDeleting] =
        useState(false);


    /*
     * Get all doctors
     */
    useEffect(() => {
        async function getDoctors() {
            try {
                setLoadingDoctors(true);
                setError(null);

                const response =
                    await axios.get<DoctorsApiResponse>(
                        "/api/doctors/all_doctors"
                    );

                if (response.data.success) {
                    setDoctors(response.data.data);
                } else {
                    setError(
                        response.data.message ||
                            "Failed to load doctors."
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to fetch doctors:",
                    error
                );

                setError(
                    "Failed to load doctors."
                );
            } finally {
                setLoadingDoctors(false);
            }
        }

        getDoctors();
    }, []);


    /*
     * Get schedules
     *
     * We keep this function outside the useEffect
     * so we can call it again after deleting.
     */
    async function getSchedules(
        doctorId: string
    ) {
        if (!doctorId) {
            setSchedules([]);
            return;
        }

        try {
            setLoadingSchedules(true);
            setError(null);

            const response =
                await axios.get<ScheduleApiResponse>(
                    `/api/schedule?doctor_id=${doctorId}`
                );

            if (response.data.success) {
                setSchedules(response.data.data);
            } else {
                setError(
                    response.data.message ||
                        "Failed to load schedules."
                );

                setSchedules([]);
            }
        } catch (error) {
            console.error(
                "Failed to fetch schedules:",
                error
            );

            setError(
                "Failed to load schedules."
            );

            setSchedules([]);
        } finally {
            setLoadingSchedules(false);
        }
    }


    /*
     * Get schedules when doctor changes
     */
    useEffect(() => {
        if (!selectedDoctor) {
            setSchedules([]);
            return;
        }

        getSchedules(selectedDoctor);
    }, [selectedDoctor]);


    /*
     * Delete schedule
     */
    async function handleDelete() {
        if (!deleteSchedule) {
            return;
        }

        try {
            setDeleting(true);
            setError(null);

            await axios.delete(
                `/api/schedule?id=${deleteSchedule.id}`
            );

            // Close confirmation modal
            setDeleteSchedule(null);

            // Refresh schedules
            await getSchedules(selectedDoctor);

        } catch (error: any) {
            console.error(
                "Failed to delete schedule:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to delete schedule."
            );
        } finally {
            setDeleting(false);
        }
    }


    /*
     * Format time
     *
     * Example:
     * 09:00:00 -> 09:00 AM
     */
    function formatTime(time: string) {
        if (!time) {
            return "-";
        }

        const [hours, minutes] =
            time.split(":");

        const date = new Date();

        date.setHours(
            Number(hours),
            Number(minutes),
            0,
            0
        );

        return date.toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    }


    /*
     * Capitalize day
     */
    function formatDay(day: string) {
        if (!day) {
            return "-";
        }

        return (
            day.charAt(0).toUpperCase() +
            day.slice(1)
        );
    }


    /*
     * Find selected doctor
     */
    const selectedDoctorData =
        doctors.find(
            (doctor) =>
                String(doctor.id) ===
                selectedDoctor
        );


    return (
        <div className="mb-10 w-full">

            {/* HEADER */}
            <div className="m-5">
                <h2 className="text-lg font-semibold text-[#584140]">
                    Doctor Schedules
                </h2>

                <p className="mt-1 text-sm text-[#584140]/60">
                    View and manage the weekly schedules of doctors.
                </p>
            </div>


            {/* DOCTOR SELECTOR */}
            <div className="mb-6 rounded-xl border border-[#E0BFBD]/30 bg-white p-5 shadow-sm">

                <div className="max-w-xl">

                    <label
                        htmlFor="schedule-doctor"
                        className="mb-2 block text-sm font-medium text-[#584140]"
                    >
                        Select Doctor
                    </label>

                    <select
                        id="schedule-doctor"
                        value={selectedDoctor}
                        onChange={(e) =>
                            setSelectedDoctor(
                                e.target.value
                            )
                        }
                        disabled={loadingDoctors}
                        className="select select-bordered w-full border-[#E0BFBD]/50 bg-white text-[#584140] focus:border-[#911824] focus:outline-none"
                    >
                        <option value="">
                            {loadingDoctors
                                ? "Loading doctors..."
                                : "Select a doctor"}
                        </option>

                        {doctors.map((doctor) => (
                            <option
                                key={doctor.id}
                                value={doctor.id}
                            >
                                {doctor.name} —{" "}
                                {doctor.designation}
                            </option>
                        ))}
                    </select>

                </div>

            </div>


            {/* ERROR */}
            {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}


            {/* NO DOCTOR SELECTED */}
            {!selectedDoctor && !error && (
                <div className="rounded-xl border border-dashed border-[#E0BFBD]/50 bg-white px-6 py-12 text-center">

                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#911824]/10">
                        <span className="text-lg font-semibold text-[#911824]">
                            S
                        </span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#584140]">
                        Select a doctor
                    </h3>

                    <p className="mt-1 text-sm text-[#584140]/60">
                        Select a doctor above to view their weekly schedule.
                    </p>

                </div>
            )}


            {/* LOADING */}
            {selectedDoctor &&
                loadingSchedules && (
                    <div className="flex min-h-40 items-center justify-center rounded-xl border border-[#E0BFBD]/30 bg-white">

                        <div className="flex items-center gap-3">

                            <span className="loading loading-spinner loading-sm text-[#911824]" />

                            <p className="text-sm text-[#584140]/70">
                                Loading schedule...
                            </p>

                        </div>

                    </div>
                )}


            {/* SELECTED DOCTOR */}
            {selectedDoctor &&
                !loadingSchedules &&
                selectedDoctorData && (
                    <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[#E0BFBD]/30 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h3 className="text-base font-semibold text-[#584140]">
                                {selectedDoctorData.name}
                            </h3>

                            <p className="mt-1 text-sm text-[#584140]/60">
                                {
                                    selectedDoctorData.designation
                                }
                            </p>
                        </div>

                        <div className="rounded-full bg-[#911824]/10 px-3 py-1.5 text-xs font-medium text-[#911824]">
                            {schedules.length}{" "}
                            {schedules.length === 1
                                ? "Schedule"
                                : "Schedules"}
                        </div>

                    </div>
                )}


            {/* NO SCHEDULES */}
            {selectedDoctor &&
                !loadingSchedules &&
                !error &&
                schedules.length === 0 && (
                    <div className="rounded-xl border border-dashed border-[#E0BFBD]/50 bg-white px-6 py-12 text-center">

                        <h3 className="text-sm font-semibold text-[#584140]">
                            No schedules found
                        </h3>

                        <p className="mt-1 text-sm text-[#584140]/60">
                            This doctor does not have any schedules yet.
                        </p>

                    </div>
                )}


            {/* SCHEDULE TABLE */}
            {selectedDoctor &&
                !loadingSchedules &&
                schedules.length > 0 && (
                    <div className="overflow-hidden rounded-xl border border-[#E0BFBD]/30 bg-white shadow-sm">

                        {/* TABLE HEADER */}
                        <div className="border-b border-[#E0BFBD]/30 px-5 py-4">
                            <h3 className="text-sm font-semibold text-[#584140]">
                                Weekly Schedule
                            </h3>
                        </div>


                        {/* RESPONSIVE TABLE */}
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[850px]">

                                <thead>
                                    <tr className="border-b border-[#E0BFBD]/30 bg-[#FBF9F9]">

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#584140]/60">
                                            Day
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#584140]/60">
                                            Start Time
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#584140]/60">
                                            End Time
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#584140]/60">
                                            Location
                                        </th>

                                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#584140]/60">
                                            Availability
                                        </th>

                                        {/* ACTIONS */}
                                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#584140]/60">
                                            Actions
                                        </th>

                                    </tr>
                                </thead>


                                <tbody>

                                    {schedules.map(
                                        (schedule) => (
                                            <tr
                                                key={
                                                    schedule.id
                                                }
                                                className="border-b border-[#E0BFBD]/20 last:border-b-0 hover:bg-[#FBF9F9]/70"
                                            >

                                                {/* DAY */}
                                                <td className="px-5 py-4">

                                                    <span className="text-sm font-medium text-[#584140]">
                                                        {formatDay(
                                                            schedule.day_of_week
                                                        )}
                                                    </span>

                                                </td>


                                                {/* START */}
                                                <td className="px-5 py-4">

                                                    <span className="text-sm text-[#584140]">
                                                        {formatTime(
                                                            schedule.start_time
                                                        )}
                                                    </span>

                                                </td>


                                                {/* END */}
                                                <td className="px-5 py-4">

                                                    <span className="text-sm text-[#584140]">
                                                        {formatTime(
                                                            schedule.end_time
                                                        )}
                                                    </span>

                                                </td>


                                                {/* LOCATION */}
                                                <td className="px-5 py-4">

                                                    <span className="text-sm text-[#584140]/70">
                                                        {schedule.location ||
                                                            "Not specified"}
                                                    </span>

                                                </td>


                                                {/* STATUS */}
                                                <td className="px-5 py-4">

                                                    {schedule.is_available ? (
                                                        <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                                                            Available
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                                                            Unavailable
                                                        </span>
                                                    )}

                                                </td>


                                                {/* ACTIONS */}
                                                <td className="px-5 py-4">

                                                    <div className="flex justify-end gap-2">

                                                        {/* EDIT */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onEdit?.(
                                                                    schedule
                                                                )
                                                            }
                                                            className="btn btn-sm border-[#911824]/20 bg-[#911824]/5 text-[#911824] hover:border-[#911824] hover:bg-[#911824] hover:text-white"
                                                        >
                                                            Edit
                                                        </button>


                                                        {/* DELETE */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setDeleteSchedule(
                                                                    schedule
                                                                )
                                                            }
                                                            className="btn btn-sm border-red-200 bg-red-50 text-red-600 hover:border-red-600 hover:bg-red-600 hover:text-white"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>
                )}


            {/* ================================================= */}
            {/* DELETE CONFIRMATION MODAL */}
            {/* ================================================= */}

            {deleteSchedule && (
                <div className="modal modal-open">

                    <div className="modal-box max-w-md">

                        <h3 className="text-lg font-semibold text-[#584140]">
                            Delete Schedule?
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#584140]/70">
                            Are you sure you want to delete the
                            <span className="font-medium text-[#584140]">
                                {" "}
                                {formatDay(
                                    deleteSchedule.day_of_week
                                )}{" "}
                                schedule
                            </span>
                            ? This action cannot be undone.
                        </p>


                        <div className="mt-6 flex justify-end gap-3">

                            {/* CANCEL */}
                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteSchedule(null)
                                }
                                disabled={deleting}
                                className="btn btn-sm"
                            >
                                Cancel
                            </button>


                            {/* DELETE */}
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default ScheduleList;