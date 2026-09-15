"use client";

import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import axios from "axios";

import type { DepartmentService } from "./departmentServicesList";

interface Department {
    id: number;
    name: string;
}

interface DepartmentServiceFormData {
    department_id: string;
    name: string;
    description: string;
    is_active: boolean;
}

interface DepartmentFacilityFormProps {
    editService?: DepartmentService | null;
    onSuccess: () => void;
    onCancelEdit: () => void;
}

function DepartmentFacilityForm({
    editService,
    onSuccess,
    onCancelEdit,
}: DepartmentFacilityFormProps) {
    const isEditMode = !!editService;

    const [departments, setDepartments] =
        useState<Department[]>([]);

    const [form, setForm] =
        useState<DepartmentServiceFormData>({
            department_id: "",
            name: "",
            description: "",
            is_active: true,
        });

    const [image, setImage] =
        useState<File | null>(null);

    /*
     * Existing image from Cloudinary.
     * This is different from imagePreview because
     * imagePreview is used for a newly selected file.
     */
    const [existingImage, setExistingImage] =
        useState<string | null>(null);

    const [imagePreview, setImagePreview] =
        useState<string | null>(null);

    const [removeExistingImage, setRemoveExistingImage] =
        useState(false);

    const [loadingDepartments, setLoadingDepartments] =
        useState(true);

    const [loading, setLoading] =
        useState(false);

    const [success, setSuccess] =
        useState("");

    const [error, setError] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | Get Departments
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        async function getDepartments() {
            try {
                setLoadingDepartments(true);
                setError("");

                const response = await axios.get(
                    "/api/departments"
                );

                if (response.data.success) {
                    setDepartments(response.data.data);
                } else {
                    setError(
                        response.data.message ||
                            "Failed to fetch departments."
                    );
                }
            } catch (error: any) {
                console.error(error);

                setError(
                    error?.response?.data?.message ||
                        "Failed to fetch departments."
                );
            } finally {
                setLoadingDepartments(false);
            }
        }

        getDepartments();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Populate Form When Editing
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (editService) {
            setForm({
                department_id: String(
                    editService.department_id
                ),
                name: editService.name || "",
                description:
                    editService.description || "",
                is_active: editService.is_active,
            });

            setExistingImage(
                editService.image_url || null
            );

            setImage(null);
            setImagePreview(null);
            setRemoveExistingImage(false);

            setSuccess("");
            setError("");
        } else {
            /*
             * When switching from edit mode back to
             * add mode, clear everything.
             */
            setForm({
                department_id: "",
                name: "",
                description: "",
                is_active: true,
            });

            setExistingImage(null);
            setImage(null);
            setImagePreview(null);
            setRemoveExistingImage(false);
        }
    }, [editService]);

    /*
    |--------------------------------------------------------------------------
    | Cleanup Object URL
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    /*
    |--------------------------------------------------------------------------
    | Handle Inputs
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
    | Handle Status
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

        if (!file) return;

        // Maximum 5MB
        if (file.size > 5 * 1024 * 1024) {
            setError(
                "Image size must be less than 5MB."
            );

            e.target.value = "";
            return;
        }

        // Check image type
        if (!file.type.startsWith("image/")) {
            setError(
                "Please select a valid image."
            );

            e.target.value = "";
            return;
        }

        /*
         * If user selects a new image, it will replace
         * the existing Cloudinary image.
         */
        setImage(file);

        setRemoveExistingImage(false);

        setImagePreview(
            URL.createObjectURL(file)
        );

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | Remove Selected/New Image
    |--------------------------------------------------------------------------
    */

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);

        const fileInput =
            document.getElementById(
                "service-image"
            ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }

        /*
         * If editing an existing service, removing the
         * displayed image means we want to remove the
         * existing Cloudinary image.
         */
        if (isEditMode && existingImage) {
            setRemoveExistingImage(true);
        }

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | Remove Existing Cloudinary Image
    |--------------------------------------------------------------------------
    */

    const handleRemoveExistingImage = () => {
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

    const resetForm = () => {
        setForm({
            department_id: "",
            name: "",
            description: "",
            is_active: true,
        });

        setImage(null);
        setExistingImage(null);
        setImagePreview(null);
        setRemoveExistingImage(false);

        const fileInput =
            document.getElementById(
                "service-image"
            ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | Cancel Edit
    |--------------------------------------------------------------------------
    */

    const handleCancel = () => {
        setImage(null);
        setImagePreview(null);
        setExistingImage(null);
        setRemoveExistingImage(false);

        onCancelEdit();
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
            |----------------------------------------------------------------------
            | Validation
            |----------------------------------------------------------------------
            */

            if (!form.department_id) {
                setError(
                    "Please select a department."
                );
                return;
            }

            if (!form.name.trim()) {
                setError(
                    "Service name is required."
                );
                return;
            }

            /*
            |----------------------------------------------------------------------
            | FormData
            |----------------------------------------------------------------------
            */

            const formData = new FormData();

            formData.append(
                "department_id",
                form.department_id
            );

            formData.append(
                "name",
                form.name.trim()
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
             * New image
             */
            if (image) {
                formData.append(
                    "image",
                    image
                );
            }

            /*
             * Only send remove_image during edit mode.
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
            |----------------------------------------------------------------------
            | API Request
            |----------------------------------------------------------------------
            */

            let response;

            if (isEditMode) {
                response = await axios.put(
                    `/api/department_services?id=${editService.id}`,
                    formData
                );
            } else {
                response = await axios.post(
                    "/api/department_services",
                    formData
                );
            }

            /*
            |----------------------------------------------------------------------
            | Success
            |----------------------------------------------------------------------
            */

            if (response.data.success) {
                setSuccess(
                    isEditMode
                        ? "Department service updated successfully."
                        : "Department service created successfully."
                );

                /*
                 * Tell parent component that the operation
                 * completed successfully.
                 */
                onSuccess();
            } else {
                setError(
                    response.data.message ||
                        `Failed to ${
                            isEditMode
                                ? "update"
                                : "create"
                        } department service.`
                );
            }
        } catch (error: any) {
            console.error(error);

            setError(
                error?.response?.data?.message ||
                    `Failed to ${
                        isEditMode
                            ? "update"
                            : "create"
                    } department service.`
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
                            ? "Edit Department Service"
                            : "Add Department Service"}
                    </h2>

                    <p className="mt-1 text-sm text-[#584140]/60">
                        {isEditMode
                            ? "Update the department service information."
                            : "Add a service provided by a specific hospital department."}
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

                    {/* Department + Service Name */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Department */}
                        <div className="form-control">

                            <label className="label">
                                <span className="label-text font-medium text-[#584140]">
                                    Department
                                </span>
                            </label>

                            <select
                                name="department_id"
                                value={
                                    form.department_id
                                }
                                onChange={
                                    handleChange
                                }
                                className="select select-bordered w-full focus:border-[#911824] focus:outline-none"
                                disabled={
                                    loading ||
                                    loadingDepartments
                                }
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

                        {/* Service Name */}
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
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. General Surgery"
                                className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                                disabled={loading}
                            />

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
                            placeholder="Enter service description..."
                            className="textarea textarea-bordered min-h-32 w-full focus:border-[#911824] focus:outline-none"
                            disabled={loading}
                        />

                        <label className="label">

                            <span className="label-text-alt text-[#584140]/50">
                                Describe the service provided
                                by this department.
                            </span>

                            <span className="label-text-alt text-[#584140]/50">
                                {
                                    form.description
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
                                Service Image
                            </span>

                            <span className="label-text-alt text-[#584140]/50">
                                Optional · Max 5MB
                            </span>

                        </label>

                        <input
                            id="service-image"
                            type="file"
                            accept="image/*"
                            onChange={
                                handleImageChange
                            }
                            className="file-input file-input-bordered w-full"
                            disabled={loading}
                        />

                        {/* Existing Cloudinary Image */}
                        {existingImage &&
                            !imagePreview &&
                            !removeExistingImage && (
                                <div className="mt-4">

                                    <div className="relative w-fit">

                                        <img
                                            src={
                                                existingImage
                                            }
                                            alt="Current service"
                                            className="h-40 w-64 rounded-xl object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                handleRemoveExistingImage
                                            }
                                            className="btn btn-circle btn-sm absolute right-2 top-2 bg-white text-red-600 shadow-md hover:bg-red-50"
                                            disabled={
                                                loading
                                            }
                                            aria-label="Remove existing image"
                                        >
                                            ✕
                                        </button>

                                    </div>

                                    <p className="mt-2 text-xs text-[#584140]/60">
                                        Current service image
                                    </p>

                                </div>
                            )}

                        {/* New Image Preview */}
                        {imagePreview && (
                            <div className="mt-4">

                                <div className="relative w-fit">

                                    <img
                                        src={
                                            imagePreview
                                        }
                                        alt="Service preview"
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
                                        {image.name}
                                    </p>
                                )}

                            </div>
                        )}

                        {/* Image removed message */}
                        {isEditMode &&
                            removeExistingImage &&
                            !imagePreview && (
                                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
                                    <p className="text-sm text-red-700">
                                        The current image will
                                        be removed when you
                                        save the service.
                                    </p>
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
                                    Active services are visible
                                    on the public website.
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
                                disabled={loading}
                            />

                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col-reverse justify-end gap-3 border-t border-base-200 pt-6 sm:flex-row">

                        {/* Cancel Edit */}
                        {isEditMode ? (
                            <button
                                type="button"
                                onClick={
                                    handleCancel
                                }
                                className="btn btn-ghost"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={
                                    resetForm
                                }
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
                            disabled={
                                loading ||
                                loadingDepartments
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
                                "Update Service"
                            ) : (
                                "Create Service"
                            )}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

export default DepartmentFacilityForm;