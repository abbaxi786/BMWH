"use client";

import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import DoctorsList from "./doctorsList";
import DoctorsForm from "./doctorsForm";
import ScheduleForm from "./scheduleForm";
import Schedule, {
    ScheduleData,
} from "./schedule";

import type { Doctor } from "@/app/(website)/pages/doctors/page";

import axios from "axios";


interface ApiResponse {
    success: boolean;
    data: Doctor[];
    message?: string;
}


type Tab =
    | "doctors"
    | "add-doctor"
    | "schedules"
    | "add-schedule";


function Doctors() {

    // =========================================
    // DOCTORS
    // =========================================

    const [doctors, setDoctors] =
        useState<Doctor[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);


    // =========================================
    // CURRENT TAB
    // =========================================

    const [tab, setTab] =
        useState<Tab>("doctors");


    // =========================================
    // DOCTOR EDIT STATE
    // =========================================

    const [editDoctor, setEditDoctor] =
        useState<Doctor | null>(null);


    // =========================================
    // SCHEDULE EDIT STATE
    // =========================================

    const [editSchedule, setEditSchedule] =
        useState<ScheduleData | null>(null);


    // =========================================
    // GET DOCTORS
    // =========================================

    const getDoctors = useCallback(
        async () => {
            try {
                setLoading(true);
                setError(null);

                const response =
                    await axios.get<ApiResponse>(
                        "/api/doctors/all_doctors"
                    );

                if (response.data.success) {

                    setDoctors(
                        response.data.data
                    );

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

                setLoading(false);
            }
        },
        []
    );


    // =========================================
    // LOAD DOCTORS WHEN PAGE OPENS
    // =========================================

    useEffect(() => {
        getDoctors();
    }, [getDoctors]);


    // =========================================
    // EDIT DOCTOR
    // =========================================

    function handleEdit(
        doctor: Doctor
    ) {
        setEditDoctor(doctor);

        setEditSchedule(null);

        setTab("add-doctor");
    }


    // =========================================
    // DOCTOR FORM SUCCESS
    // =========================================

    function handleFormSuccess() {

        // Clear doctor edit mode
        setEditDoctor(null);

        // Go back to doctors list
        setTab("doctors");

        // Refresh doctors
        getDoctors();
    }


    // =========================================
    // CANCEL DOCTOR EDIT
    // =========================================

    function handleCancelEdit() {

        setEditDoctor(null);

        setTab("doctors");
    }


    // =========================================
    // DOCTORS TAB
    // =========================================

    function handleDoctorsTab() {

        setEditDoctor(null);

        setEditSchedule(null);

        setTab("doctors");
    }


    // =========================================
    // ADD DOCTOR TAB
    // =========================================

    function handleAddDoctorTab() {

        setEditDoctor(null);

        setEditSchedule(null);

        setTab("add-doctor");
    }


    // =========================================
    // SCHEDULES TAB
    // =========================================

    function handleSchedulesTab() {

        // Clear doctor edit mode
        setEditDoctor(null);

        // Clear schedule edit mode
        setEditSchedule(null);

        setTab("schedules");
    }


    // =========================================
    // EDIT SCHEDULE
    // =========================================

    function handleScheduleEdit(
        schedule: ScheduleData
    ) {

        setEditSchedule(schedule);

        setEditDoctor(null);

        setTab("add-schedule");
    }


    // =========================================
    // ADD SCHEDULE TAB
    // =========================================

    function handleAddScheduleTab() {

        // Clear doctor edit mode
        setEditDoctor(null);

        // Important:
        // Clear schedule edit mode so the form
        // opens as a fresh "Add Schedule" form.
        setEditSchedule(null);

        setTab("add-schedule");
    }


    // =========================================
    // SCHEDULE FORM SUCCESS
    // =========================================

    function handleScheduleSuccess() {

        // Clear schedule edit mode
        setEditSchedule(null);

        // Return to schedule list
        setTab("schedules");
    }


    // =========================================
    // CANCEL SCHEDULE EDIT
    // =========================================

    function handleCancelScheduleEdit() {

        setEditSchedule(null);

        setTab("schedules");
    }


    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div className="flex min-h-40 items-center justify-center">
                <p className="text-sm text-[#584140]">
                    Loading doctors...
                </p>
            </div>
        );
    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {
        return (
            <div className="flex min-h-40 items-center justify-center">
                <p className="text-sm text-red-600">
                    {error}
                </p>
            </div>
        );
    }


    return (
        <div className="w-full">


            {/* =========================================
                PAGE HEADER
            ========================================== */}

            <div className="m-5">

                <h1 className="text-xl font-semibold text-[#584140]">
                    Doctors
                </h1>

                <p className="mt-1 text-sm text-[#584140]/60">
                    Manage doctors and their schedules
                </p>

            </div>


            {/* =========================================
                TABS
            ========================================== */}

            <div className="m-6 border-b border-[#E0BFBD]/30">

                <div className="flex flex-wrap gap-5">


                    {/* =================================
                        DOCTORS
                    ================================== */}

                    <button
                        type="button"
                        onClick={
                            handleDoctorsTab
                        }
                        className={`
                            relative
                            pb-3
                            text-sm
                            font-medium
                            transition-colors

                            ${
                                tab === "doctors"
                                    ? "text-[#911824]"
                                    : "text-[#584140]/60 hover:text-[#911824]"
                            }
                        `}
                    >

                        <span className="flex items-center gap-2">

                            Doctors

                            <span
                                className={`
                                    rounded-full
                                    px-2
                                    py-0.5
                                    text-[10px]

                                    ${
                                        tab === "doctors"
                                            ? "bg-[#911824]/10 text-[#911824]"
                                            : "bg-[#584140]/10 text-[#584140]/70"
                                    }
                                `}
                            >
                                {doctors.length}
                            </span>

                        </span>


                        {tab === "doctors" && (
                            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#911824]" />
                        )}

                    </button>


                    {/* =================================
                        ADD / EDIT DOCTOR
                    ================================== */}

                    <button
                        type="button"
                        onClick={
                            handleAddDoctorTab
                        }
                        className={`
                            relative
                            pb-3
                            text-sm
                            font-medium
                            transition-colors

                            ${
                                tab === "add-doctor"
                                    ? "text-[#911824]"
                                    : "text-[#584140]/60 hover:text-[#911824]"
                            }
                        `}
                    >

                        {editDoctor
                            ? "Edit Doctor"
                            : "Add Doctor"}


                        {tab === "add-doctor" && (
                            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#911824]" />
                        )}

                    </button>


                    {/* =================================
                        SCHEDULES
                    ================================== */}

                    <button
                        type="button"
                        onClick={
                            handleSchedulesTab
                        }
                        className={`
                            relative
                            pb-3
                            text-sm
                            font-medium
                            transition-colors

                            ${
                                tab === "schedules"
                                    ? "text-[#911824]"
                                    : "text-[#584140]/60 hover:text-[#911824]"
                            }
                        `}
                    >

                        Schedules


                        {tab === "schedules" && (
                            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#911824]" />
                        )}

                    </button>


                    {/* =================================
                        ADD / EDIT SCHEDULE
                    ================================== */}

                    <button
                        type="button"
                        onClick={
                            handleAddScheduleTab
                        }
                        className={`
                            relative
                            pb-3
                            text-sm
                            font-medium
                            transition-colors

                            ${
                                tab === "add-schedule"
                                    ? "text-[#911824]"
                                    : "text-[#584140]/60 hover:text-[#911824]"
                            }
                        `}
                    >

                        {editSchedule
                            ? "Edit Schedule"
                            : "Add Schedule"}


                        {tab === "add-schedule" && (
                            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#911824]" />
                        )}

                    </button>

                </div>

            </div>


            {/* =========================================
                DOCTORS LIST
            ========================================== */}

            {tab === "doctors" && (
                <DoctorsList
                    doctors={doctors}
                    onEdit={handleEdit}
                    onRefresh={getDoctors}
                />
            )}


            {/* =========================================
                ADD / EDIT DOCTOR
            ========================================== */}

            {tab === "add-doctor" && (
                <DoctorsForm
                    editDoctor={editDoctor}
                    onSuccess={
                        handleFormSuccess
                    }
                    onCancelEdit={
                        handleCancelEdit
                    }
                />
            )}


            {/* =========================================
                SCHEDULE LIST
            ========================================== */}

            {tab === "schedules" && (
                <Schedule
                    onEdit={
                        handleScheduleEdit
                    }
                />
            )}


            {/* =========================================
                ADD / EDIT SCHEDULE
            ========================================== */}

            {tab === "add-schedule" && (
                <ScheduleForm
                    editSchedule={
                        editSchedule
                    }
                    onSuccess={
                        handleScheduleSuccess
                    }
                    onCancelEdit={
                        handleCancelScheduleEdit
                    }
                />
            )}

        </div>
    );
}

export default Doctors;