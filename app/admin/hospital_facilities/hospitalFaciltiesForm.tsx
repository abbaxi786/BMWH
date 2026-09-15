"use client";

import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import axios from "axios";

import type { HospitalFacility } from "./hospitalFacilitiesList";

interface HospitalFacilitiesFormProps {
    editFacility: HospitalFacility | null;
    onSuccess: () => void;
    onCancelEdit: () => void;
}

interface HospitalFacilityFormData {
    name: string;
    category: string;
    description: string;
    is_active: boolean;
}

function HospitalFacilitiesForm({
    editFacility,
    onSuccess,
    onCancelEdit,
}: HospitalFacilitiesFormProps) {
    const isEditMode = !!editFacility;

    const [form, setForm] =
        useState<HospitalFacilityFormData>({
            name: "",
            category: "",
            description: "",
            is_active: true,
        });

    /*
    |--------------------------------------------------------------------------
    | New image selected by the user
    |--------------------------------------------------------------------------
    */
    const [image, setImage] =
        useState<File | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Preview of newly selected image
    |--------------------------------------------------------------------------
    */
    const [imagePreview, setImagePreview] =
        useState<string | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Existing Cloudinary image
    |--------------------------------------------------------------------------
    */
    const [existingImage, setExistingImage] =
        useState<string | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Whether existing image should be removed
    |--------------------------------------------------------------------------
    */
    const [removeExistingImage, setRemoveExistingImage] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [success, setSuccess] =
        useState("");

    const [error, setError] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | Populate form when editing
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        if (editFacility) {
            setForm({
                name: editFacility.name || "",
                category: editFacility.category || "",
                description:
                    editFacility.description || "",
                is_active: editFacility.is_active,
            });

            setExistingImage(
                editFacility.image_url || null
            );

            setImage(null);
            setImagePreview(null);
            setRemoveExistingImage(false);

            setError("");
            setSuccess("");

            const fileInput =
                document.getElementById(
                    "facility-image"
                ) as HTMLInputElement | null;

            if (fileInput) {
                fileInput.value = "";
            }
        } else {
            resetForm();
        }
    }, [editFacility]);

    /*
    |--------------------------------------------------------------------------
    | Input Change
    |--------------------------------------------------------------------------
    */
    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | Active Status
    |--------------------------------------------------------------------------
    */
    const handleActiveChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        setForm((previous) => ({
            ...previous,
            is_active: e.target.checked,
        }));

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | Image Change
    |--------------------------------------------------------------------------
    */
    const handleImageChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError(
                "Image size must be less than 5MB."
            );

            e.target.value = "";
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError(
                "Please select a valid image."
            );

            e.target.value = "";
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Revoke previous preview URL
        |--------------------------------------------------------------------------
        */
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImage(file);

        setImagePreview(
            URL.createObjectURL(file)
        );

        /*
        |--------------------------------------------------------------------------
        | If a new image is selected, don't remove the new image.
        |--------------------------------------------------------------------------
        */
        setRemoveExistingImage(false);

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | Remove Image
    |--------------------------------------------------------------------------
    |
    | In edit mode:
    | - If a new image exists, remove the new preview.
    | - Otherwise mark existing Cloudinary image for deletion.
    |
    |--------------------------------------------------------------------------
    */
    const removeImage = () => {
        /*
        |--------------------------------------------------------------------------
        | Remove newly selected image
        |--------------------------------------------------------------------------
        */
        if (image) {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }

            setImage(null);
            setImagePreview(null);

            const fileInput =
                document.getElementById(
                    "facility-image"
                ) as HTMLInputElement | null;

            if (fileInput) {
                fileInput.value = "";
            }

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Remove existing image
        |--------------------------------------------------------------------------
        */
        if (isEditMode && existingImage) {
            setRemoveExistingImage(true);
            setExistingImage(null);

            setError("");
            setSuccess("");
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Reset Form
    |--------------------------------------------------------------------------
    */
    const resetForm = () => {
        setForm({
            name: "",
            category: "",
            description: "",
            is_active: true,
        });

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImage(null);
        setImagePreview(null);

        setExistingImage(null);
        setRemoveExistingImage(false);

        setError("");
        setSuccess("");

        const fileInput =
            document.getElementById(
                "facility-image"
            ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */
    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            /*
            |--------------------------------------------------------------------------
            | Validation
            |--------------------------------------------------------------------------
            */
            if (!form.name.trim()) {
                setError(
                    "Facility name is required."
                );
                return;
            }

            if (!form.category.trim()) {
                setError(
                    "Facility category is required."
                );
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Build FormData
            |--------------------------------------------------------------------------
            */
            const formData = new FormData();

            formData.append(
                "name",
                form.name.trim()
            );

            formData.append(
                "category",
                form.category.trim()
            );

            formData.append(
                "description",
                form.description.trim()
            );

            formData.append(
                "is_active",
                String(form.is_active)
            );

            /*
            |--------------------------------------------------------------------------
            | Add new image if selected
            |--------------------------------------------------------------------------
            */
            if (image) {
                formData.append(
                    "image",
                    image
                );
            }

            /*
            |--------------------------------------------------------------------------
            | Tell API to remove existing image
            |--------------------------------------------------------------------------
            |
            | Only send this when editing and there is no replacement image.
            |
            |--------------------------------------------------------------------------
            */
            if (
                isEditMode &&
                removeExistingImage &&
                !image
            ) {
                formData.append(
                    "remove_image",
                    "true"
                );
            }

            /*
            |--------------------------------------------------------------------------
            | ADD
            |--------------------------------------------------------------------------
            */
            if (!isEditMode) {
                const response =
                    await axios.post(
                        "/api/hospital_facilities",
                        formData
                    );

                if (
                    response.data.success
                ) {
                    resetForm();

                    /*
                    |--------------------------------------------------------------------------
                    | Tell parent to return to list
                    |--------------------------------------------------------------------------
                    */
                    onSuccess();
                    return;
                }

                setError(
                    response.data.message ||
                        "Failed to create hospital facility."
                );

                return;
            }

            /*
            |--------------------------------------------------------------------------
            | EDIT
            |--------------------------------------------------------------------------
            */
            const response =
                await axios.put(
                    `/api/hospital_facilities?facility_id=${editFacility.id}`,
                    formData
                );

            if (response.data.success) {
                /*
                |--------------------------------------------------------------------------
                | Tell parent edit was successful
                |--------------------------------------------------------------------------
                */
                onSuccess();

                return;
            }

            setError(
                response.data.message ||
                    "Failed to update hospital facility."
            );
        } catch (error: any) {
            console.error(
                "Hospital facility submit error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    (isEditMode
                        ? "Failed to update hospital facility."
                        : "Failed to create hospital facility.")
            );
        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Cancel Edit
    |--------------------------------------------------------------------------
    */
    const handleCancel = () => {
        if (loading) {
            return;
        }

        if (isEditMode) {
            onCancelEdit();
        } else {
            resetForm();
        }
    };

    return (
        <div className="w-full">
            <div className="rounded-box bg-base-100 shadow-md">

                {/* Header */}
                <div className="border-b border-base-200 p-6">
                    <h2 className="text-lg font-semibold text-[#584140]">
                        {isEditMode
                            ? "Edit Hospital Facility"
                            : "Add Hospital Facility"}
                    </h2>

                    <p className="mt-1 text-sm text-[#584140]/60">
                        {isEditMode
                            ? "Update the hospital facility information and image."
                            : "Add a facility or infrastructure available at the hospital."}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 p-6"
                >

                    {/* Messages */}
                    {success && (
                        <div className="alert alert-success text-sm">
                            <span>
                                {success}
                            </span>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error text-sm">
                            <span>
                                {error}
                            </span>
                        </div>
                    )}

                    {/* Name + Category */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-[#584140]">
                                    Facility Name
                                </span>
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    form.name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Emergency Department"
                                className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                                disabled={
                                    loading
                                }
                            />
                        </div>

                        {/* Category */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-[#584140]">
                                    Category
                                </span>
                            </label>

                            <select
                                name="category"
                                value={
                                    form.category
                                }
                                onChange={
                                    handleChange
                                }
                                className="select select-bordered w-full focus:border-[#911824] focus:outline-none"
                                disabled={
                                    loading
                                }
                            >
                                <option value="">
                                    Select category
                                </option>

                                <option value="clinical">
                                    Clinical
                                </option>

                                <option value="emergency">
                                    Emergency
                                </option>

                                <option value="diagnostic">
                                    Diagnostic
                                </option>

                                <option value="surgical">
                                    Surgical
                                </option>
                                <option value="critical">
                                    Critical
                                </option>

                                <option value="patient-care">
                                    Patient Care
                                </option>

                                <option value="support">
                                    Support
                                </option>

                                <option value="infrastructure">
                                    Infrastructure
                                </option>

                                <option value="other">
                                    Other
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-[#584140]">
                                Description
                            </span>
                        </label>

                        <textarea
                            name="description"
                            value={
                                form.description
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter facility description..."
                            className="textarea textarea-bordered min-h-32 w-full focus:border-[#911824] focus:outline-none"
                            disabled={
                                loading
                            }
                        />

                        <label className="label">
                            <span className="label-text-alt text-[#584140]/50">
                                Describe the
                                facility and
                                its purpose.
                            </span>

                            <span className="label-text-alt text-[#584140]/50">
                                {
                                    form
                                        .description
                                        .length
                                }{" "}
                                characters
                            </span>
                        </label>
                    </div>

                    {/* Image */}
                    <div className="form-control">

                        <label className="label">
                            <span className="label-text font-medium text-[#584140]">
                                Facility Image
                            </span>

                            <span className="label-text-alt text-[#584140]/50">
                                Optional · Max
                                5MB
                            </span>
                        </label>

                        <input
                            id="facility-image"
                            type="file"
                            accept="image/*"
                            onChange={
                                handleImageChange
                            }
                            className="file-input file-input-bordered w-full"
                            disabled={
                                loading
                            }
                        />

                        {/* Existing Image */}
                        {existingImage &&
                            !imagePreview && (
                                <div className="mt-4">
                                    <p className="mb-2 text-xs font-medium text-[#584140]/60">
                                        Current
                                        Image
                                    </p>

                                    <div className="relative w-fit">
                                        <img
                                            src={
                                                existingImage
                                            }
                                            alt="Current facility"
                                            className="h-40 w-64 rounded-xl object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                removeImage
                                            }
                                            className="btn btn-circle btn-sm absolute right-2 top-2 bg-white text-red-600 shadow-md hover:bg-red-50"
                                            disabled={
                                                loading
                                            }
                                            aria-label="Remove current image"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}

                        {/* New Image Preview */}
                        {imagePreview && (
                            <div className="mt-4">
                                <p className="mb-2 text-xs font-medium text-[#584140]/60">
                                    New Image
                                </p>

                                <div className="relative w-fit">
                                    <img
                                        src={
                                            imagePreview
                                        }
                                        alt="New facility preview"
                                        className="h-40 w-64 rounded-xl object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            removeImage
                                        }
                                        className="btn btn-circle btn-sm absolute right-2 top-2 bg-white text-red-600 shadow-md hover:bg-red-50"
                                        disabled={
                                            loading
                                        }
                                        aria-label="Remove image"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {image && (
                                    <p className="mt-2 text-xs text-[#584140]/60">
                                        {
                                            image.name
                                        }
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Image marked for removal */}
                        {isEditMode &&
                            removeExistingImage &&
                            !imagePreview && (
                                <div className="mt-4 rounded-lg bg-red-50 p-3">
                                    <p className="text-sm text-red-600">
                                        Existing image
                                        will be
                                        removed when
                                        you save.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRemoveExistingImage(
                                                false
                                            );
                                            setExistingImage(
                                                editFacility?.image_url ||
                                                    null
                                            );
                                        }}
                                        className="mt-2 text-xs font-medium text-[#911824] underline"
                                        disabled={
                                            loading
                                        }
                                    >
                                        Keep existing
                                        image
                                    </button>
                                </div>
                            )}
                    </div>

                    {/* Status */}
                    <div className="rounded-xl border border-base-200 bg-base-50 p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-medium text-[#584140]">
                                    Facility Status
                                </p>

                                <p className="mt-1 text-xs text-[#584140]/60">
                                    Active facilities
                                    are visible on
                                    the public
                                    website.
                                </p>
                            </div>

                            <input
                                type="checkbox"
                                name="is_active"
                                checked={
                                    form.is_active
                                }
                                onChange={
                                    handleActiveChange
                                }
                                className="toggle border-[#911824] bg-base-200 checked:bg-[#911824]"
                                disabled={
                                    loading
                                }
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col-reverse justify-end gap-3 border-t border-base-200 pt-6 sm:flex-row">

                        {/* Cancel / Reset */}
                        <button
                            type="button"
                            onClick={
                                handleCancel
                            }
                            className="btn btn-ghost"
                            disabled={
                                loading
                            }
                        >
                            {isEditMode
                                ? "Cancel"
                                : "Reset"}
                        </button>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="btn bg-[#911824] text-white hover:bg-[#760f19]"
                            disabled={
                                loading
                            }
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" />

                                    {isEditMode
                                        ? "Updating..."
                                        : "Creating..."}
                                </>
                            ) : isEditMode ? (
                                "Update Facility"
                            ) : (
                                "Create Facility"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default HospitalFacilitiesForm;
