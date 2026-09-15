"use client";

import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import axios from "axios";

import type { DepartmentData } from "./departmentList";

interface DepartmentFormData {
    name: string;
    category: string;
    description: string;
    slug: string;
    is_active: boolean;
}

interface DepartmentFormProps {
    editDepartment?: DepartmentData | null;
    onSuccess: () => void;
    onCancelEdit: () => void;
}

function DepartmentForm({
    editDepartment,
    onSuccess,
    onCancelEdit,
}: DepartmentFormProps) {
    const isEditMode = Boolean(editDepartment);

    const [form, setForm] = useState<DepartmentFormData>({
        name: "",
        category: "",
        description: "",
        slug: "",
        is_active: true,
    });

    const [image, setImage] = useState<File | null>(null);

    // Preview for newly selected image
    const [imagePreview, setImagePreview] =
        useState<string | null>(null);

    // Existing Cloudinary image
    const [existingImage, setExistingImage] =
        useState<string | null>(null);

    // Whether existing image should be removed
    const [removeExistingImage, setRemoveExistingImage] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Load Department When Editing
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (editDepartment) {
            setForm({
                name: editDepartment.name || "",
                category: editDepartment.category || "",
                description: editDepartment.description || "",
                slug: editDepartment.slug || "",
                is_active: editDepartment.is_active,
            });

            setExistingImage(
                editDepartment.image_url || null
            );

            setImage(null);
            setImagePreview(null);
            setRemoveExistingImage(false);

            setSuccess("");
            setError("");
        } else {
            resetForm();
        }
    }, [editDepartment]);

    /*
    |--------------------------------------------------------------------------
    | Handle Normal Inputs
    |--------------------------------------------------------------------------
    */

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
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
    | Generate Slug From Name
    |--------------------------------------------------------------------------
    */

    const handleNameChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;

        setForm((previous) => ({
            ...previous,
            name: value,
            slug: value
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-"),
        }));

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | Handle Active Checkbox
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
    | Handle Image
    |--------------------------------------------------------------------------
    */

    const handleImageChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        // Maximum 5 MB
        if (file.size > 5 * 1024 * 1024) {
            setError(
                "Image size must be less than 5MB."
            );

            e.target.value = "";
            return;
        }

        // Only allow images
        if (!file.type.startsWith("image/")) {
            setError(
                "Please select a valid image."
            );

            e.target.value = "";
            return;
        }

        /*
         * If editing and a new image is selected,
         * the old image will be replaced.
         */
        setImage(file);
        setImagePreview(
            URL.createObjectURL(file)
        );

        // New image means don't remove separately
        setRemoveExistingImage(false);

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | Remove Newly Selected Image
    |--------------------------------------------------------------------------
    */

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);

        const fileInput = document.getElementById(
            "department-image"
        ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        };
    };

    /*
    |--------------------------------------------------------------------------
    | Remove Existing Image
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
    | Reset Form
    |--------------------------------------------------------------------------
    */

    function resetForm() {
        setForm({
            name: "",
            category: "",
            description: "",
            slug: "",
            is_active: true,
        });

        setImage(null);
        setImagePreview(null);
        setExistingImage(null);
        setRemoveExistingImage(false);

        const fileInput = document.getElementById(
            "department-image"
        ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }

        setError("");
        setSuccess("");
    }

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
                    "Department name is required."
                );
                return;
            }

            if (!form.category) {
                setError(
                    "Please select a department category."
                );
                return;
            }

            if (!form.slug.trim()) {
                setError("Slug is required.");
                return;
            }

            /*
            |--------------------------------------------------------------------------
            | Form Data
            |--------------------------------------------------------------------------
            */

            const formData = new FormData();

            formData.append(
                "name",
                form.name.trim()
            );

            formData.append(
                "category",
                form.category
            );

            formData.append(
                "description",
                form.description.trim()
            );

            formData.append(
                "slug",
                form.slug.trim()
            );

            formData.append(
                "is_active",
                String(form.is_active)
            );

            /*
            |--------------------------------------------------------------------------
            | Image
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
            | Remove Existing Image
            |--------------------------------------------------------------------------
            */

            if (isEditMode) {
                formData.append(
                    "remove_image",
                    String(removeExistingImage)
                );
            }

            /*
            |--------------------------------------------------------------------------
            | CREATE
            |--------------------------------------------------------------------------
            */

            if (!isEditMode) {
                const response = await axios.post(
                    "/api/departments",
                    formData
                );

                if (!response.data.success) {
                    setError(
                        response.data.message ||
                            "Failed to create department."
                    );

                    return;
                }

                setSuccess(
                    "Department created successfully."
                );

                resetForm();

                /*
                 * Small delay so user can see
                 * success message before returning.
                 */
                setTimeout(() => {
                    onSuccess();
                }, 700);

                return;
            }

            /*
            |--------------------------------------------------------------------------
            | EDIT
            |--------------------------------------------------------------------------
            */

            if (!editDepartment) {
                setError(
                    "Department information is missing."
                );

                return;
            }

            const response = await axios.put(
                `/api/departments/department?slug=${encodeURIComponent(
                    editDepartment.slug
                )}`,
                formData
            );

            if (!response.data.success) {
                setError(
                    response.data.message ||
                        "Failed to update department."
                );

                return;
            }

            setSuccess(
                "Department updated successfully."
            );

            /*
             * Return to list after successful update.
             */
            setTimeout(() => {
                onSuccess();
            }, 700);

        } catch (error: any) {
            console.error(error);

            setError(
                error?.response?.data?.message ||
                    (
                        isEditMode
                            ? "Failed to update department."
                            : "Failed to create department."
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
                            ? "Edit Department"
                            : "Add Department"}
                    </h2>

                    <p className="mt-1 text-sm text-[#584140]/60">
                        {isEditMode
                            ? "Update the hospital department information."
                            : "Add a new hospital department to the website."}
                    </p>

                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 p-6"
                >

                    {/* Messages */}
                    {success && (
                        <div className="alert alert-success text-sm">
                            <span>{success}</span>
                        </div>
                    )}

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
                                    Department Name
                                </span>
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleNameChange}
                                placeholder="e.g. Cardiology"
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

                                <option value="clinical">
                                    Clinical
                                </option>

                                <option value="surgical">
                                    Surgical
                                </option>

                                <option value="diagnostic">
                                    Diagnostic
                                </option>

                                <option value="support">
                                    Support
                                </option>

                                <option value="specialized-care">
                                    Specialized Care
                                </option>

                                <option value="other">
                                    Other
                                </option>
                            </select>

                        </div>

                    </div>

                    {/* Slug */}
                    <div className="form-control">

                        <label className="label">

                            <span className="label-text font-medium text-[#584140]">
                                Slug
                            </span>

                            <span className="label-text-alt opacity-50">
                                Used in the URL
                            </span>

                        </label>

                        <input
                            type="text"
                            name="slug"
                            value={form.slug}
                            onChange={handleChange}
                            placeholder="cardiology"
                            className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                            disabled={loading}
                        />

                        <label className="label">
                            <span className="label-text-alt text-[#584140]/50">
                                Example: /pages/departments/cardiology
                            </span>
                        </label>

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
                            placeholder="Enter department description..."
                            className="textarea textarea-bordered min-h-32 w-full focus:border-[#911824] focus:outline-none"
                            disabled={loading}
                        />

                        <label className="label">

                            <span className="label-text-alt opacity-50">
                                Describe the department and its services.
                            </span>

                            <span className="label-text-alt opacity-50">
                                {form.description.length} characters
                            </span>

                        </label>

                    </div>

                    {/* Image */}
                    <div className="form-control">

                        <label className="label">

                            <span className="label-text font-medium text-[#584140]">
                                Department Image
                            </span>

                            <span className="label-text-alt opacity-50">
                                Optional · Max 5MB
                            </span>

                        </label>

                        <input
                            id="department-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file-input file-input-bordered w-full"
                            disabled={loading}
                        />

                        {/* Existing Image */}
                        {isEditMode &&
                            existingImage &&
                            !imagePreview && (
                                <div className="mt-4">

                                    <div className="relative w-fit">

                                        <img
                                            src={existingImage}
                                            alt="Current department"
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

                                    <p className="mt-2 text-xs opacity-60">
                                        Current department image
                                    </p>

                                </div>
                            )}

                        {/* New Image Preview */}
                        {imagePreview && (
                            <div className="mt-4">

                                <div className="relative w-fit">

                                    <img
                                        src={imagePreview}
                                        alt="Department preview"
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
                                    <p className="mt-2 text-xs opacity-60">
                                        {image.name}
                                    </p>
                                )}

                            </div>
                        )}

                        {/* No Existing Image */}
                        {isEditMode &&
                            !existingImage &&
                            !imagePreview && (
                                <p className="mt-3 text-xs text-[#584140]/50">
                                    No department image.
                                </p>
                            )}

                    </div>

                    {/* Active */}
                    <div className="rounded-xl border border-base-200 bg-base-50 p-4">

                        <div className="flex items-center justify-between gap-4">

                            <div>
                                <p className="font-medium text-[#584140]">
                                    Department Status
                                </p>

                                <p className="mt-1 text-xs text-[#584140]/60">
                                    Active departments are visible on the
                                    public website.
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

                        {/* Cancel */}
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
                                    ? "Update Department"
                                    : "Create Department"
                            )}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

export default DepartmentForm;