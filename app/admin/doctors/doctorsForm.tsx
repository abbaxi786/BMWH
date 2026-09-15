"use client";

import React, {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";
import axios from "axios";
import Image from "next/image";

import type { Doctor } from "@/app/(website)/pages/doctors/page";

interface Department {
    id: number;
    name: string;
}

interface DepartmentApiResponse {
    success: boolean;
    data: Department[];
    message?: string;
}

interface DoctorApiResponse {
    success: boolean;
    message?: string;
    data?: unknown;
}

interface DoctorsFormProps {
    editDoctor?: Doctor | null;
    onSuccess: () => void;
    onCancelEdit: () => void;
}

function DoctorsForm({
    editDoctor,
    onSuccess,
    onCancelEdit,
}: DoctorsFormProps) {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loadingDepartments, setLoadingDepartments] =
        useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // New selected photo preview
    const [photoPreview, setPhotoPreview] =
        useState<string | null>(null);

    // Existing photo from Cloudinary
    const [existingPhoto, setExistingPhoto] =
        useState<string | null>(null);

    // Whether existing photo should be deleted
    const [removeExistingPhoto, setRemoveExistingPhoto] =
        useState(false);

    const [form, setForm] = useState({
        department_id: "",
        name: "",
        doctor_type: "",
        designation: "",
        specialty: "",
        qualifications: "",
        biography: "",
        expertise: "",
        profile_link: "",
        is_active: true,
        photo: null as File | null,
    });

    /*
     * Get departments for the dropdown
     */
    useEffect(() => {
        async function getDepartments() {
            try {
                setLoadingDepartments(true);

                const response =
                    await axios.get<DepartmentApiResponse>(
                        "/api/departments/only-departments"
                    );

                if (response.data.success) {
                    setDepartments(response.data.data);
                } else {
                    setError(
                        response.data.message ||
                            "Failed to load departments."
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to fetch departments:",
                    error
                );

                setError(
                    "Failed to load departments."
                );
            } finally {
                setLoadingDepartments(false);
            }
        }

        getDepartments();
    }, []);

    /*
     * =========================================
     * RESET FORM
     * =========================================
     */
    function resetForm() {
        setForm({
            department_id: "",
            name: "",
            doctor_type: "",
            designation: "",
            specialty: "",
            qualifications: "",
            biography: "",
            expertise: "",
            profile_link: "",
            is_active: true,
            photo: null,
        });

        setPhotoPreview(null);
        setExistingPhoto(null);
        setRemoveExistingPhoto(false);
        setError(null);
        setSuccess(null);

        const fileInput =
            document.getElementById(
                "doctor-photo"
            ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }
    }

    /*
     * =========================================
     * PREFILL FORM WHEN EDITING
     * =========================================
     */
    useEffect(() => {
        if (!editDoctor) {
            resetForm();
            return;
        }

        setForm({
            department_id:
                editDoctor.department_id?.toString() || "",

            name: editDoctor.name || "",

            doctor_type:
                editDoctor.doctor_type || "",

            designation:
                editDoctor.designation || "",

            specialty:
                editDoctor.specialty || "",

            qualifications:
                editDoctor.qualifications || "",

            biography:
                editDoctor.biography || "",

            expertise:
                editDoctor.expertise || "",

            profile_link:
                editDoctor.profile_link || "",

            is_active:
                editDoctor.is_active ?? true,

            photo: null,
        });

        setExistingPhoto(
            editDoctor.photo_url || null
        );

        setPhotoPreview(null);
        setRemoveExistingPhoto(false);

        setError(null);
        setSuccess(null);

        const fileInput =
            document.getElementById(
                "doctor-photo"
            ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }
    }, [editDoctor]);

    /*
     * =========================================
     * HANDLE NORMAL INPUT CHANGES
     * =========================================
     */
    function handleChange(
        e: ChangeEvent<
            HTMLInputElement |
                HTMLTextAreaElement |
                HTMLSelectElement
        >
    ) {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    /*
     * =========================================
     * HANDLE PHOTO SELECTION
     * =========================================
     */
    function handlePhotoChange(
        e: ChangeEvent<HTMLInputElement>
    ) {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setForm((previous) => ({
            ...previous,
            photo: file,
        }));

        /*
         * If a new photo is selected,
         * the old photo will automatically
         * be replaced by the API.
         */
        setRemoveExistingPhoto(false);

        const previewUrl =
            URL.createObjectURL(file);

        setPhotoPreview(previewUrl);
    }

    /*
     * =========================================
     * REMOVE NEW PHOTO
     * =========================================
     */
    function removePhoto() {
        setForm((previous) => ({
            ...previous,
            photo: null,
        }));

        setPhotoPreview(null);

        const fileInput =
            document.getElementById(
                "doctor-photo"
            ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }
    }

    /*
     * =========================================
     * REMOVE EXISTING PHOTO
     * =========================================
     */
    function removeExistingPhotoHandler() {
        setExistingPhoto(null);
        setRemoveExistingPhoto(true);
    }

    /*
     * =========================================
     * SUBMIT FORM
     * =========================================
     */
    async function handleSubmit(
        e: FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setError(null);
        setSuccess(null);

        /*
         * Basic frontend validation
         */
        if (
            !form.department_id ||
            !form.name.trim() ||
            !form.doctor_type ||
            !form.designation.trim()
        ) {
            setError(
                "Department, name, doctor type and designation are required."
            );

            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append(
                "department_id",
                form.department_id
            );

            formData.append(
                "name",
                form.name
            );

            formData.append(
                "doctor_type",
                form.doctor_type
            );

            formData.append(
                "designation",
                form.designation
            );

            formData.append(
                "specialty",
                form.specialty
            );

            formData.append(
                "qualifications",
                form.qualifications
            );

            formData.append(
                "biography",
                form.biography
            );

            formData.append(
                "expertise",
                form.expertise
            );

            formData.append(
                "profile_link",
                form.profile_link
            );

            formData.append(
                "is_active",
                String(form.is_active)
            );

            /*
             * Only append photo if a new photo
             * has been selected.
             */
            if (form.photo) {
                formData.append(
                    "photo",
                    form.photo
                );
            }

            /*
             * Only needed while editing.
             */
            if (editDoctor) {
                formData.append(
                    "remove_photo",
                    String(removeExistingPhoto)
                );
            }

            let response;

            /*
             * =========================================
             * CREATE DOCTOR
             * =========================================
             */
            if (!editDoctor) {
                response =
                    await axios.post<DoctorApiResponse>(
                        "/api/doctors",
                        formData
                    );
            }

            /*
             * =========================================
             * UPDATE DOCTOR
             * =========================================
             */
            else {
                response =
                    await axios.put<DoctorApiResponse>(
                        `/api/doctors?id=${editDoctor.id}`,
                        formData
                    );
            }

            if (response.data.success) {
                setSuccess(
                    response.data.message ||
                        (
                            editDoctor
                                ? "Doctor updated successfully."
                                : "Doctor created successfully."
                        )
                );

                /*
                 * Tell parent that operation
                 * completed successfully.
                 *
                 * Parent will:
                 * - refresh doctors
                 * - switch to doctors tab
                 * - clear edit state
                 */
                setTimeout(() => {
                    onSuccess();
                }, 500);
            }
        } catch (error) {
            console.error(
                editDoctor
                    ? "Failed to update doctor:"
                    : "Failed to create doctor:",
                error
            );

            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                        (
                            editDoctor
                                ? "Failed to update doctor."
                                : "Failed to create doctor."
                        )
                );
            } else {
                setError(
                    editDoctor
                        ? "Failed to update doctor."
                        : "Failed to create doctor."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full">

            {/* =========================================
                FORM CARD
            ========================================== */}

            <div className="rounded-xl border border-[#E0BFBD]/30 bg-white shadow-sm">

                {/* =====================================
                    FORM HEADER
                ====================================== */}

                <div className="border-b border-[#E0BFBD]/30 px-6 py-5">

                    <h2 className="text-lg font-semibold text-[#584140]">
                        {editDoctor
                            ? "Edit Doctor"
                            : "Add New Doctor"}
                    </h2>

                    <p className="mt-1 text-sm text-[#584140]/60">
                        {editDoctor
                            ? "Update the doctor's information and profile."
                            : "Add a doctor to the hospital directory."}
                    </p>

                </div>

                {/* =====================================
                    FORM
                ====================================== */}

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

                        {/* =================================
                            BASIC INFORMATION
                        ================================== */}

                        <div className="mb-8">

                            <div className="mb-4">

                                <h3 className="text-sm font-semibold text-[#584140]">
                                    Basic Information
                                </h3>

                                <p className="mt-1 text-xs text-[#584140]/50">
                                    Basic details about the doctor.
                                </p>

                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                {/* NAME */}

                                <div>

                                    <label
                                        htmlFor="name"
                                        className="mb-2 block text-sm font-medium text-[#584140]"
                                    >
                                        Doctor Name

                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Dr. Ahmed Khan"
                                        className="input input-bordered w-full border-[#E0BFBD]/50 bg-white text-[#584140] focus:border-[#911824] focus:outline-none"
                                        required
                                    />

                                </div>

                                {/* DEPARTMENT */}

                                <div>

                                    <label
                                        htmlFor="department_id"
                                        className="mb-2 block text-sm font-medium text-[#584140]"
                                    >
                                        Department

                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        id="department_id"
                                        name="department_id"
                                        value={
                                            form.department_id
                                        }
                                        onChange={handleChange}
                                        disabled={
                                            loadingDepartments
                                        }
                                        className="select select-bordered w-full border-[#E0BFBD]/50 bg-white text-[#584140] focus:border-[#911824] focus:outline-none"
                                        required
                                    >

                                        <option value="">
                                            {loadingDepartments
                                                ? "Loading departments..."
                                                : "Select department"}
                                        </option>

                                        {departments.map(
                                            (department) => (
                                                <option
                                                    key={
                                                        department.id
                                                    }
                                                    value={
                                                        department.id
                                                    }
                                                >
                                                    {
                                                        department.name
                                                    }
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>

                                {/* DOCTOR TYPE */}

                                <div>

                                    <label
                                        htmlFor="doctor_type"
                                        className="mb-2 block text-sm font-medium text-[#584140]"
                                    >
                                        Doctor Type

                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        id="doctor_type"
                                        name="doctor_type"
                                        value={
                                            form.doctor_type
                                        }
                                        onChange={handleChange}
                                        className="select select-bordered w-full border-[#E0BFBD]/50 bg-white text-[#584140] focus:border-[#911824] focus:outline-none"
                                        required
                                    >

                                        <option value="">
                                            Select doctor type
                                        </option>

                                        <option value="Consultant">
                                            Consultant
                                        </option>

                                        <option value="Specialist">
                                            Specialist
                                        </option>

                                        <option value="Senior Consultant">
                                            Senior Consultant
                                        </option>

                                        <option value="Medical Officer">
                                            Medical Officer
                                        </option>

                                        <option value="Surgeon">
                                            Surgeon
                                        </option>

                                        <option value="Visiting Consultant">
                                            Visiting Consultant
                                        </option>

                                    </select>

                                </div>

                                {/* DESIGNATION */}

                                <div>

                                    <label
                                        htmlFor="designation"
                                        className="mb-2 block text-sm font-medium text-[#584140]"
                                    >
                                        Designation

                                        <span className="ml-1 text-red-500">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="designation"
                                        name="designation"
                                        type="text"
                                        value={
                                            form.designation
                                        }
                                        onChange={handleChange}
                                        placeholder="e.g. Consultant Surgeon"
                                        className="input input-bordered w-full border-[#E0BFBD]/50 bg-white text-[#584140] focus:border-[#911824] focus:outline-none"
                                        required
                                    />

                                </div>

                                {/* SPECIALTY */}

                                <div className="md:col-span-2">

                                    <label
                                        htmlFor="specialty"
                                        className="mb-2 block text-sm font-medium text-[#584140]"
                                    >
                                        Specialty
                                    </label>

                                    <input
                                        id="specialty"
                                        name="specialty"
                                        type="text"
                                        value={
                                            form.specialty
                                        }
                                        onChange={handleChange}
                                        placeholder="e.g. General & Laparoscopic Surgery"
                                        className="input input-bordered w-full border-[#E0BFBD]/50 bg-white text-[#584140] focus:border-[#911824] focus:outline-none"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* =================================
                            PROFESSIONAL INFORMATION
                        ================================== */}

                        <div className="mb-8">

                            <div className="mb-4">

                                <h3 className="text-sm font-semibold text-[#584140]">
                                    Professional Information
                                </h3>

                                <p className="mt-1 text-xs text-[#584140]/50">
                                    Qualifications and professional background.
                                </p>

                            </div>

                            <div className="space-y-5">

                                {/* QUALIFICATIONS */}

                                <div>

                                    <label
                                        htmlFor="qualifications"
                                        className="mb-2 block text-sm font-medium text-[#584140]"
                                    >
                                        Qualifications
                                    </label>

                                    <textarea
                                        id="qualifications"
                                        name="qualifications"
                                        value={
                                            form.qualifications
                                        }
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="e.g. MBBS, FCPS, MRCS"
                                        className="textarea textarea-bordered w-full border-[#E0BFBD]/50 bg-white text-[#584140] focus:border-[#911824] focus:outline-none"
                                    />

                                </div>

                                {/* EXPERTISE */}

                                <div>

                                    <label
                                        htmlFor="expertise"
                                        className="mb-2 block text-sm font-medium text-[#584140]"
                                    >
                                        Expertise
                                    </label>

                                    <textarea
                                        id="expertise"
                                        name="expertise"
                                        value={
                                            form.expertise
                                        }
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Describe the doctor's areas of expertise..."
                                        className="textarea textarea-bordered w-full border-[#E0BFBD]/50 bg-white text-[#584140] focus:border-[#911824] focus:outline-none"
                                    />

                                </div>

                                {/* BIOGRAPHY */}

                                <div>

                                    <label
                                        htmlFor="biography"
                                        className="mb-2 block text-sm font-medium text-[#584140]"
                                    >
                                        Biography
                                    </label>

                                    <textarea
                                        id="biography"
                                        name="biography"
                                        value={
                                            form.biography
                                        }
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="Write a short biography of the doctor..."
                                        className="textarea textarea-bordered w-full border-[#E0BFBD]/50 bg-white text-[#584140] focus:border-[#911824] focus:outline-none"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* =================================
                            PROFILE INFORMATION
                        ================================== */}

                        <div className="mb-8">

                            <div className="mb-4">

                                <h3 className="text-sm font-semibold text-[#584140]">
                                    Profile Information
                                </h3>

                                <p className="mt-1 text-xs text-[#584140]/50">
                                    Profile image and public profile link.
                                </p>

                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                {/* PHOTO */}

                                <div>

                                    <label
                                        htmlFor="doctor-photo"
                                        className="mb-2 block text-sm font-medium text-[#584140]"
                                    >
                                        Doctor Photo
                                    </label>

                                    <input
                                        id="doctor-photo"
                                        name="photo"
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handlePhotoChange
                                        }
                                        className="file-input file-input-bordered w-full border-[#E0BFBD]/50 bg-white text-[#584140]"
                                    />

                                    <p className="mt-2 text-xs text-[#584140]/50">
                                        Upload a professional doctor photograph.
                                    </p>

                                    {/* =================================
                                        EXISTING PHOTO
                                    ================================== */}

                                    {existingPhoto &&
                                        !photoPreview && (
                                            <div className="mt-4">

                                                <p className="mb-2 text-xs font-medium text-[#584140]/70">
                                                    Current Photo
                                                </p>

                                                <div className="flex items-start gap-4">

                                                    <div className="relative h-28 w-28 overflow-hidden rounded-lg border border-[#E0BFBD]/40">

                                                        <Image
                                                            src={
                                                                existingPhoto
                                                            }
                                                            alt="Current doctor photo"
                                                            fill
                                                            className="object-cover"
                                                        />

                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            removeExistingPhotoHandler
                                                        }
                                                        className="btn btn-sm border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                                                    >
                                                        Remove
                                                    </button>

                                                </div>

                                            </div>
                                        )}

                                    {/* =================================
                                        NEW PHOTO PREVIEW
                                    ================================== */}

                                    {photoPreview && (
                                        <div className="mt-4">

                                            <p className="mb-2 text-xs font-medium text-[#584140]/70">
                                                New Photo
                                            </p>

                                            <div className="flex items-start gap-4">

                                                <div className="relative h-28 w-28 overflow-hidden rounded-lg border border-[#E0BFBD]/40">

                                                    <Image
                                                        src={
                                                            photoPreview
                                                        }
                                                        alt="New doctor preview"
                                                        fill
                                                        className="object-cover"
                                                    />

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        removePhoto
                                                    }
                                                    className="btn btn-sm border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                                                >
                                                    Remove
                                                </button>

                                            </div>

                                        </div>
                                    )}

                                    {/* PHOTO REMOVED MESSAGE */}

                                    {editDoctor &&
                                        !existingPhoto &&
                                        !photoPreview &&
                                        removeExistingPhoto && (
                                            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                                                The current photo will be removed when you save the doctor.
                                            </div>
                                        )}

                                </div>

                                {/* PROFILE LINK */}

                                <div>

                                    <label
                                        htmlFor="profile_link"
                                        className="mb-2 block text-sm font-medium text-[#584140]"
                                    >
                                        Profile Link
                                    </label>

                                    <input
                                        id="profile_link"
                                        name="profile_link"
                                        type="text"
                                        value={
                                            form.profile_link
                                        }
                                        onChange={handleChange}
                                        placeholder="/pages/doctors/dr-ahmed-khan"
                                        className="input input-bordered w-full border-[#E0BFBD]/50 bg-white text-[#584140] focus:border-[#911824] focus:outline-none"
                                    />

                                    <p className="mt-2 text-xs text-[#584140]/50">
                                        Public URL/path for the doctor's profile.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* =================================
                            STATUS
                        ================================== */}

                        <div className="border-t border-[#E0BFBD]/30 pt-6">

                            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                                <div>

                                    <h3 className="text-sm font-semibold text-[#584140]">
                                        Doctor Status
                                    </h3>

                                    <p className="mt-1 text-xs text-[#584140]/50">
                                        Active doctors are visible on the website.
                                    </p>

                                </div>

                                <label className="flex cursor-pointer items-center gap-3">

                                    <span className="text-sm text-[#584140]">
                                        {form.is_active
                                            ? "Active"
                                            : "Inactive"}
                                    </span>

                                    <input
                                        type="checkbox"
                                        checked={
                                            form.is_active
                                        }
                                        onChange={(e) =>
                                            setForm(
                                                (
                                                    previous
                                                ) => ({
                                                    ...previous,
                                                    is_active:
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

                    {/* =========================================
                        FORM FOOTER
                    ========================================== */}

                    <div className="flex flex-col-reverse gap-3 border-t border-[#E0BFBD]/30 bg-[#FBF9F9] px-6 py-4 sm:flex-row sm:items-center sm:justify-end">

                        {/* CANCEL EDIT */}

                        {editDoctor && (
                            <button
                                type="button"
                                onClick={onCancelEdit}
                                disabled={loading}
                                className="btn border-[#E0BFBD]/50 bg-white text-[#584140] hover:bg-[#FBF9F9]"
                            >
                                Cancel
                            </button>
                        )}

                        {/* RESET */}

                        {!editDoctor && (
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={loading}
                                className="btn border-[#E0BFBD]/50 bg-white text-[#584140] hover:bg-[#FBF9F9]"
                            >
                                Reset
                            </button>
                        )}

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn border-[#911824] bg-[#911824] text-white hover:bg-[#86000D]"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" />

                                    {editDoctor
                                        ? "Updating..."
                                        : "Creating..."}
                                </>
                            ) : editDoctor ? (
                                "Update Doctor"
                            ) : (
                                "Create Doctor"
                            )}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default DoctorsForm;