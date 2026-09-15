"use client";

import React, {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";
import axios from "axios";

import type { Doctor } from "@/app/(website)/pages/doctors/page";
import type { ScheduleData } from "./schedule";

interface DoctorsApiResponse {
    success: boolean;
    data: Doctor[];
    message?: string;
}

interface ScheduleApiResponse {
    success: boolean;
    message?: string;
    data?: unknown;
}

interface ScheduleFormProps {
    editSchedule?: ScheduleData | null;
    onSuccess: () => void;
    onCancelEdit: () => void;
}

type ScheduleFormData = {
    doctor_id: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    location: string;
    is_available: boolean;
};

function ScheduleForm({
    editSchedule,
    onSuccess,
    onCancelEdit,
}: ScheduleFormProps) {
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    const [loadingDoctors, setLoadingDoctors] =
        useState(true);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [success, setSuccess] =
        useState<string | null>(null);

    const [form, setForm] =
        useState<ScheduleFormData>({
            doctor_id: "",
            day_of_week: "",
            start_time: "",
            end_time: "",
            location: "",
            is_available: true,
        });

    const isEditMode = Boolean(editSchedule);

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
     * Populate form when editing
     */
    useEffect(() => {
        if (!editSchedule) {
            setForm({
                doctor_id: "",
                day_of_week: "",
                start_time: "",
                end_time: "",
                location: "",
                is_available: true,
            });

            return;
        }

        setForm({
            doctor_id: String(
                editSchedule.doctor_id
            ),

            day_of_week:
                editSchedule.day_of_week,

            /*
             * PostgreSQL TIME can sometimes come
             * back as HH:MM:SS.
             *
             * The HTML time input expects HH:MM.
             */
            start_time:
                editSchedule.start_time?.slice(
                    0,
                    5
                ) || "",

            end_time:
                editSchedule.end_time?.slice(
                    0,
                    5
                ) || "",

            location:
                editSchedule.location || "",

            is_available:
                editSchedule.is_available,
        });

        setError(null);
        setSuccess(null);
    }, [editSchedule]);

    /*
     * Handle input changes
     */
    function handleChange(
        e: ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    /*
     * Reset form
     */
    function resetForm() {
        setForm({
            doctor_id: "",
            day_of_week: "",
            start_time: "",
            end_time: "",
            location: "",
            is_available: true,
        });

        setError(null);
        setSuccess(null);
    }

    /*
     * Submit schedule
     */
    async function handleSubmit(
        e: FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setError(null);
        setSuccess(null);

        /*
         * Frontend validation
         */
        if (
            !form.doctor_id ||
            !form.day_of_week ||
            !form.start_time ||
            !form.end_time
        ) {
            setError(
                "Doctor, day, start time and end time are required."
            );

            return;
        }

        /*
         * Make sure end time is after start time
         */
        if (
            form.end_time <=
            form.start_time
        ) {
            setError(
                "End time must be later than start time."
            );

            return;
        }

        /*
         * Edit mode must have an existing schedule ID
         */
        if (
            isEditMode &&
            !editSchedule?.id
        ) {
            setError(
                "Schedule ID is missing."
            );

            return;
        }

        try {
            setLoading(true);

            const payload = {
                doctor_id:
                    Number(form.doctor_id),

                day_of_week:
                    form.day_of_week,

                start_time:
                    form.start_time,

                end_time:
                    form.end_time,

                location:
                    form.location.trim() || null,

                is_available:
                    form.is_available,
            };

            let response;

            /*
             * EDIT
             */
            if (isEditMode) {
                response =
                    await axios.put<ScheduleApiResponse>(
                        `/api/schedule?id=${editSchedule?.id}`,
                        payload
                    );
            }

            /*
             * CREATE
             */
            else {
                response =
                    await axios.post<ScheduleApiResponse>(
                        "/api/schedule",
                        payload
                    );
            }

            if (response.data.success) {
                setSuccess(
                    response.data.message ||
                        (
                            isEditMode
                                ? "Doctor schedule updated successfully."
                                : "Doctor schedule created successfully."
                        )
                );

                /*
                 * Wait briefly so the user can see
                 * the success message, then return
                 * to the schedule list.
                 */
                setTimeout(() => {
                    onSuccess();
                }, 500);
            }
        } catch (error) {
            console.error(
                isEditMode
                    ? "Failed to update schedule:"
                    : "Failed to create schedule:",
                error
            );

            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                        (
                            isEditMode
                                ? "Failed to update schedule."
                                : "Failed to create schedule."
                        )
                );
            } else {
                setError(
                    isEditMode
                        ? "Failed to update schedule."
                        : "Failed to create schedule."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full">

            {/* PAGE HEADER */}
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-[#584140]">
                    {isEditMode
                        ? "Edit Doctor Schedule"
                        : "Add Doctor Schedule"}
                </h2>

                <p className="mt-1 text-sm text-[#584140]/60">
                    {isEditMode
                        ? "Update the doctor's weekly availability schedule."
                        : "Create a weekly availability schedule for a doctor."}
                </p>
            </div>

            {/* FORM CARD */}
            <div className="rounded-xl border border-[#E0BFBD]/30 bg-white shadow-sm">

                {/* FORM HEADER */}
                <div className="border-b border-[#E0BFBD]/30 px-6 py-5">
                    <h3 className="text-sm font-semibold text-[#584140]">
                        Schedule Information
                    </h3>

                    <p className="mt-1 text-xs text-[#584140]/50">
                        Set the doctor's working day and consultation hours.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="p-6">

                        {/* ERROR */}
                        {error && (
                            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {/* SUCCESS */}
                        {success && (
                            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                {success}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* DOCTOR */}
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="doctor_id"
                                    className="mb-2 block text-sm font-medium text-[#584140]"
                                >
                                    Doctor
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <select
                                    id="doctor_id"
                                    name="doctor_id"
                                    value={
                                        form.doctor_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        loadingDoctors
                                    }
                                    required
                                    className="select select-bordered w-full border-[#E0BFBD]/50 bg-white text-[#584140] focus:border-[#911824] focus:outline-none"
                                >
                                    <option value="">
                                        {loadingDoctors
                                            ? "Loading doctors..."
                                            : "Select a doctor"}
                                    </option>

                                    {doctors.map(
                                        (doctor) => (
                                            <option
                                                key={
                                                    doctor.id
                                                }
                                                value={
                                                    doctor.id
                                                }
                                            >
                                                {
                                                    doctor.name
                                                }{" "}
                                                —{" "}
                                                {
                                                    doctor.designation
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                                <p className="mt-2 text-xs text-[#584140]/50">
                                    Select the doctor whose schedule you want to create.
                                </p>
                            </div>

                            {/* DAY */}
                            <div>
                                <label
                                    htmlFor="day_of_week"
                                    className="mb-2 block text-sm font-medium text-[#584140]"
                                >
                                    Day of Week
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <select
                                    id="day_of_week"
                                    name="day_of_week"
                                    value={
                                        form.day_of_week
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    className="select select-bordered w-full border-[#E0BFBD]/50 bg-white text-[#584140] focus:border-[#911824] focus:outline-none"
                                >
                                    <option value="">
                                        Select day
                                    </option>

                                    <option value="monday">
                                        Monday
                                    </option>

                                    <option value="tuesday">
                                        Tuesday
                                    </option>

                                    <option value="wednesday">
                                        Wednesday
                                    </option>

                                    <option value="thursday">
                                        Thursday
                                    </option>

                                    <option value="friday">
                                        Friday
                                    </option>

                                    <option value="saturday">
                                        Saturday
                                    </option>

                                    <option value="sunday">
                                        Sunday
                                    </option>
                                </select>
                            </div>

                            {/* LOCATION */}
                            <div>
                                <label
                                    htmlFor="location"
                                    className="mb-2 block text-sm font-medium text-[#584140]"
                                >
                                    Location
                                </label>

                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={
                                        form.location
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. General Surgery OPD"
                                    className="input input-bordered w-full border-[#E0BFBD]/50 bg-white text-[#584140] focus:border-[#911824] focus:outline-none"
                                />
                            </div>

                            {/* START TIME */}
                            <div>
                                <label
                                    htmlFor="start_time"
                                    className="mb-2 block text-sm font-medium text-[#584140]"
                                >
                                    Start Time
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    id="start_time"
                                    name="start_time"
                                    type="time"
                                    value={
                                        form.start_time
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    className="input input-bordered w-full border-[#E0BFBD]/50 bg-white text-[#584140] focus:border-[#911824] focus:outline-none"
                                />
                            </div>

                            {/* END TIME */}
                            <div>
                                <label
                                    htmlFor="end_time"
                                    className="mb-2 block text-sm font-medium text-[#584140]"
                                >
                                    End Time
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                </label>

                                <input
                                    id="end_time"
                                    name="end_time"
                                    type="time"
                                    value={
                                        form.end_time
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    className="input input-bordered w-full border-[#E0BFBD]/50 bg-white text-[#584140] focus:border-[#911824] focus:outline-none"
                                />
                            </div>

                        </div>

                        {/* AVAILABILITY */}
                        <div className="mt-7 border-t border-[#E0BFBD]/30 pt-6">

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                <div>
                                    <h3 className="text-sm font-semibold text-[#584140]">
                                        Schedule Availability
                                    </h3>

                                    <p className="mt-1 text-xs text-[#584140]/50">
                                        Set whether this schedule is currently available for appointments.
                                    </p>
                                </div>

                                <label className="flex cursor-pointer items-center gap-3">

                                    <span className="text-sm font-medium text-[#584140]">
                                        {form.is_available
                                            ? "Available"
                                            : "Unavailable"}
                                    </span>

                                    <input
                                        type="checkbox"
                                        checked={
                                            form.is_available
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setForm(
                                                (
                                                    previous
                                                ) => ({
                                                    ...previous,
                                                    is_available:
                                                        e
                                                            .target
                                                            .checked,
                                                })
                                            )
                                        }
                                        className="toggle border-[#911824] bg-[#E0BFBD]/30 checked:border-[#911824] checked:bg-[#911824]"
                                    />

                                </label>

                            </div>

                        </div>

                    </div>

                    {/* FORM FOOTER */}
                    <div className="flex flex-col-reverse gap-3 border-t border-[#E0BFBD]/30 bg-[#FBF9F9] px-6 py-4 sm:flex-row sm:items-center sm:justify-end">

                        {/* CANCEL EDIT */}
                        {isEditMode && (
                            <button
                                type="button"
                                onClick={
                                    onCancelEdit
                                }
                                disabled={loading}
                                className="btn border-[#E0BFBD]/50 bg-white text-[#584140] hover:bg-[#FBF9F9]"
                            >
                                Cancel
                            </button>
                        )}

                        {/* RESET */}
                        {!isEditMode && (
                            <button
                                type="button"
                                onClick={
                                    resetForm
                                }
                                disabled={loading}
                                className="btn border-[#E0BFBD]/50 bg-white text-[#584140] hover:bg-[#FBF9F9]"
                            >
                                Reset
                            </button>
                        )}

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={
                                loading ||
                                loadingDoctors
                            }
                            className="btn border-[#911824] bg-[#911824] text-white hover:bg-[#86000D]"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" />

                                    {isEditMode
                                        ? "Updating..."
                                        : "Creating..."}
                                </>
                            ) : (
                                isEditMode
                                    ? "Update Schedule"
                                    : "Create Schedule"
                            )}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default ScheduleForm;
