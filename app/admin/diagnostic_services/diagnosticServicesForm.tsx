"use client";

import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import axios from "axios";

import type { DiagnosticService } from "./diagnosticServicesList";

interface DiagnosticServicesFormProps {
    editService?: DiagnosticService | null;
    onSuccess: () => void;
    onCancelEdit: () => void;
}

interface DiagnosticServiceFormData {
    name: string;
    category: string;
    description: string;
    is_active: boolean;
}

function DiagnosticServicesForm({
    editService,
    onSuccess,
    onCancelEdit,
}: DiagnosticServicesFormProps) {

    const isEditMode = Boolean(editService);

    const [form, setForm] =
        useState<DiagnosticServiceFormData>({
            name: "",
            category: "",
            description: "",
            is_active: true,
        });

    const [image, setImage] =
        useState<File | null>(null);

    const [imagePreview, setImagePreview] =
        useState<string | null>(null);

    // Existing Cloudinary image
    const [existingImage, setExistingImage] =
        useState<string | null>(null);

    // Whether the existing image should be removed
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
    | Load data when editing
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (editService) {
            setForm({
                name: editService.name || "",
                category: editService.category || "",
                description: editService.description || "",
                is_active: editService.is_active,
            });

            setExistingImage(
                editService.image_url || null
            );

            setImage(null);
            setImagePreview(null);
            setRemoveExistingImage(false);

            setError("");
            setSuccess("");

            const fileInput =
                document.getElementById(
                    "diagnostic-image"
                ) as HTMLInputElement | null;

            if (fileInput) {
                fileInput.value = "";
            }

        } else {
            resetForm();
        }
    }, [editService]);

    /*
    |--------------------------------------------------------------------------
    | Handle input changes
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
    | Handle active status
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
    | Handle image selection
    |--------------------------------------------------------------------------
    */

    const handleImageChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

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

        setImage(file);

        setImagePreview(
            URL.createObjectURL(file)
        );

        /*
        If user selects a new image,
        we no longer want to remove the old image
        separately because the API will replace it.
        */
        setRemoveExistingImage(false);

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | Remove newly selected image
    |--------------------------------------------------------------------------
    */

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);

        const fileInput =
            document.getElementById(
                "diagnostic-image"
            ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }

        setError("");
    };

    /*
    |--------------------------------------------------------------------------
    | Remove existing Cloudinary image
    |--------------------------------------------------------------------------
    */

    const removeExisting = () => {
        setExistingImage(null);
        setRemoveExistingImage(true);

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | Reset form
    |--------------------------------------------------------------------------
    */

    const resetForm = () => {
        setForm({
            name: "",
            category: "",
            description: "",
            is_active: true,
        });

        setImage(null);
        setImagePreview(null);
        setExistingImage(null);
        setRemoveExistingImage(false);

        const fileInput =
            document.getElementById(
                "diagnostic-image"
            ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }

        setError("");
        setSuccess("");
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
            --------------------------------------------------------------
            Validation
            --------------------------------------------------------------
            */

            if (!form.name.trim()) {
                setError(
                    "Service name is required."
                );
                return;
            }

            if (!form.category.trim()) {
                setError(
                    "Service category is required."
                );
                return;
            }

            /*
            --------------------------------------------------------------
            FormData
            --------------------------------------------------------------
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
            If a new image was selected,
            send it to the API.
            */

            if (image) {
                formData.append(
                    "image",
                    image
                );
            }

            /*
            Tell PUT route whether existing image
            should be removed.
            */

            if (isEditMode) {
                formData.append(
                    "remove_image",
                    String(removeExistingImage)
                );
            }

            /*
            --------------------------------------------------------------
            ADD
            --------------------------------------------------------------
            */

            if (!isEditMode) {

                const response = await axios.post(
                    "/api/diagnostic_services",
                    formData
                );

                if (!response.data.success) {
                    setError(
                        response.data.message ||
                        "Failed to create diagnostic service."
                    );

                    return;
                }

                setSuccess(
                    "Diagnostic service created successfully."
                );

                resetForm();

                return;
            }

            /*
            --------------------------------------------------------------
            EDIT
            --------------------------------------------------------------
            */

            const response = await axios.put(
                `/api/diagnostic_services/${editService?.id}`,
                formData
            );

            if (!response.data.success) {
                setError(
                    response.data.message ||
                    "Failed to update diagnostic service."
                );

                return;
            }

            setSuccess(
                "Diagnostic service updated successfully."
            );

            /*
            Give user a moment to see success message,
            then return to list.
            */

            setTimeout(() => {
                onSuccess();
            }, 500);

        } catch (error: any) {
            console.error(error);

            setError(
                error?.response?.data?.message ||
                (
                    isEditMode
                        ? "Failed to update diagnostic service."
                        : "Failed to create diagnostic service."
                )
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">

            <div className="rounded-box bg-base-100 shadow-md">

                {/* Header */}
                <div className="border-b border-base-200 p-6">

                    <h2 className="text-lg font-semibold text-[#584140]">
                        {isEditMode
                            ? "Edit Diagnostic Service"
                            : "Add Diagnostic Service"}
                    </h2>

                    <p className="mt-1 text-sm text-[#584140]/60">
                        {isEditMode
                            ? "Update the diagnostic, laboratory, or imaging service."
                            : "Add a diagnostic, laboratory, or imaging service provided by the hospital."}
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 p-6"
                >

                    {/* Success */}
                    {success && (
                        <div className="alert alert-success text-sm">
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="alert alert-error text-sm">
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Name + Category */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Name */}
                        <div className="form-control">

                            <label className="label">
                                <span className="label-text font-medium text-[#584140]">
                                    Service Name
                                </span>
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. MRI Scan"
                                className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                                disabled={loading}
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
                                value={form.category}
                                onChange={handleChange}
                                className="select select-bordered w-full focus:border-[#911824] focus:outline-none"
                                disabled={loading}
                            >

                                <option value="">
                                    Select category
                                </option>

                                <option value="laboratory">
                                    Laboratory
                                </option>

                                <option value="radiology">
                                    Radiology
                                </option>

                                <option value="imaging">
                                    Imaging
                                </option>

                                <option value="pathology">
                                    Pathology
                                </option>

                                <option value="diagnostic">
                                    Diagnostic
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
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter diagnostic service description..."
                            className="textarea textarea-bordered min-h-32 w-full focus:border-[#911824] focus:outline-none"
                            disabled={loading}
                        />

                        <label className="label">

                            <span className="label-text-alt text-[#584140]/50">
                                Describe the diagnostic service.
                            </span>

                            <span className="label-text-alt text-[#584140]/50">
                                {form.description.length} characters
                            </span>

                        </label>

                    </div>

                    {/* Image */}
                    <div className="form-control">

                        <label className="label">

                            <span className="label-text font-medium text-[#584140]">
                                Service Image
                            </span>

                            <span className="label-text-alt text-[#584140]/50">
                                Optional · Max 5MB
                            </span>

                        </label>

                        <input
                            id="diagnostic-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file-input file-input-bordered w-full"
                            disabled={loading}
                        />

                        {/* Existing image */}
                        {existingImage && !imagePreview && (

                            <div className="mt-4">

                                <p className="mb-2 text-xs font-medium text-[#584140]/60">
                                    Current Image
                                </p>

                                <div className="relative w-fit">

                                    <img
                                        src={existingImage}
                                        alt="Current diagnostic service"
                                        className="h-40 w-64 rounded-xl object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={removeExisting}
                                        className="btn btn-circle btn-sm absolute right-2 top-2 bg-white text-red-600 shadow-md hover:bg-red-50"
                                        disabled={loading}
                                        aria-label="Remove existing image"
                                    >
                                        ✕
                                    </button>

                                </div>

                            </div>
                        )}

                        {/* New image preview */}
                        {imagePreview && (

                            <div className="mt-4">

                                <p className="mb-2 text-xs font-medium text-[#584140]/60">
                                    New Image
                                </p>

                                <div className="relative w-fit">

                                    <img
                                        src={imagePreview}
                                        alt="Diagnostic service preview"
                                        className="h-40 w-64 rounded-xl object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="btn btn-circle btn-sm absolute right-2 top-2 bg-white text-red-600 shadow-md hover:bg-red-50"
                                        disabled={loading}
                                        aria-label="Remove image"
                                    >
                                        ✕
                                    </button>

                                </div>

                                {image && (
                                    <p className="mt-2 text-xs text-[#584140]/60">
                                        {image.name}
                                    </p>
                                )}

                            </div>
                        )}

                        {/* Image removed message */}
                        {isEditMode &&
                            removeExistingImage &&
                            !imagePreview && (
                                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    Current image will be removed when you save.
                                </div>
                            )}

                    </div>

                    {/* Status */}
                    <div className="rounded-xl border border-base-200 bg-base-50 p-4">

                        <div className="flex items-center justify-between gap-4">

                            <div>

                                <p className="font-medium text-[#584140]">
                                    Service Status
                                </p>

                                <p className="mt-1 text-xs text-[#584140]/60">
                                    Active services are visible on the public website.
                                </p>

                            </div>

                            <input
                                type="checkbox"
                                name="is_active"
                                checked={form.is_active}
                                onChange={handleActiveChange}
                                className="toggle border-[#911824] bg-base-200 checked:bg-[#911824]"
                                disabled={loading}
                            />

                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col-reverse justify-end gap-3 border-t border-base-200 pt-6 sm:flex-row">

                        {/* Cancel edit */}
                        {isEditMode && (
                            <button
                                type="button"
                                onClick={onCancelEdit}
                                className="btn btn-ghost"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        )}

                        {/* Reset */}
                        {!isEditMode && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn btn-ghost"
                                disabled={loading}
                            >
                                Reset
                            </button>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="btn bg-[#911824] text-white hover:bg-[#760f19]"
                            disabled={loading}
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
                                    ? "Update Service"
                                    : "Create Service"
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default DiagnosticServicesForm;

