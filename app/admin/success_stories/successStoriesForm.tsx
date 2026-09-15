"use client";

import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import axios from "axios";

interface SuccessStoryFormData {
    title: string;
    summary: string;
    content: string;
    patient_name: string;
    patient_age: string;
    category: string;
    story_date: string;
    is_featured: boolean;
}

function SuccessStoriesForm() {
    const [form, setForm] =
        useState<SuccessStoryFormData>({
            title: "",
            summary: "",
            content: "",
            patient_name: "",
            patient_age: "",
            category: "",
            story_date: "",
            is_featured: false,
        });

    const [image, setImage] =
        useState<File | null>(null);

    const [imagePreview, setImagePreview] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [success, setSuccess] =
        useState("");

    const [error, setError] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | Cleanup object URL
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(
                    imagePreview
                );
            }
        };
    }, [imagePreview]);

    /*
    |--------------------------------------------------------------------------
    | Handle normal inputs
    |--------------------------------------------------------------------------
    */

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {
        const {
            name,
            value,
        } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | Handle featured toggle
    |--------------------------------------------------------------------------
    */

    const handleFeaturedChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        setForm((previous) => ({
            ...previous,
            is_featured:
                e.target.checked,
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
        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }

        /*
        | Validate image type
        */

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {
            setError(
                "Please select a valid image."
            );

            e.target.value = "";
            return;
        }

        /*
        | Validate image size
        */

        if (
            file.size >
            5 * 1024 * 1024
        ) {
            setError(
                "Image size must be less than 5MB."
            );

            e.target.value = "";
            return;
        }

        /*
        | Remove previous preview URL
        */

        if (imagePreview) {
            URL.revokeObjectURL(
                imagePreview
            );
        }

        setImage(file);

        setImagePreview(
            URL.createObjectURL(file)
        );

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | Remove image
    |--------------------------------------------------------------------------
    */

    const removeImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(
                imagePreview
            );
        }

        setImage(null);
        setImagePreview(null);

        const fileInput =
            document.getElementById(
                "success-story-image"
            ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | Reset form
    |--------------------------------------------------------------------------
    */

    const resetForm = () => {
        if (imagePreview) {
            URL.revokeObjectURL(
                imagePreview
            );
        }

        setForm({
            title: "",
            summary: "",
            content: "",
            patient_name: "",
            patient_age: "",
            category: "",
            story_date: "",
            is_featured: false,
        });

        setImage(null);
        setImagePreview(null);

        const fileInput =
            document.getElementById(
                "success-story-image"
            ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }

        setError("");
    };

    /*
    |--------------------------------------------------------------------------
    | Submit form
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        /*
        | Validate title
        */

        if (!form.title.trim()) {
            setError(
                "Title is required."
            );
            return;
        }

        /*
        | Validate content
        */

        if (!form.content.trim()) {
            setError(
                "Content is required."
            );
            return;
        }

        /*
        | Validate patient age
        */

        if (form.patient_age) {
            const age =
                Number(
                    form.patient_age
                );

            if (
                Number.isNaN(age) ||
                age < 0 ||
                age > 150
            ) {
                setError(
                    "Please enter a valid patient age between 0 and 150."
                );

                return;
            }
        }

        /*
        | Validate image again before submitting
        */

        if (image) {
            if (
                !image.type.startsWith(
                    "image/"
                )
            ) {
                setError(
                    "Please select a valid image."
                );

                return;
            }

            if (
                image.size >
                5 * 1024 * 1024
            ) {
                setError(
                    "Image size must be less than 5MB."
                );

                return;
            }
        }

        setLoading(true);

        try {
            const formData =
                new FormData();

            /*
            | Required fields
            */

            formData.append(
                "title",
                form.title.trim()
            );

            formData.append(
                "content",
                form.content.trim()
            );

            /*
            | Optional text fields
            */

            formData.append(
                "summary",
                form.summary.trim()
            );

            formData.append(
                "patient_name",
                form.patient_name.trim()
            );

            formData.append(
                "patient_age",
                form.patient_age
            );

            formData.append(
                "category",
                form.category.trim()
            );

            /*
            | Story date
            */

            if (form.story_date) {
                formData.append(
                    "story_date",
                    form.story_date
                );
            }

            /*
            | Featured
            */

            formData.append(
                "is_featured",
                String(
                    form.is_featured
                )
            );

            /*
            | Image
            */

            if (image) {
                formData.append(
                    "image",
                    image
                );
            }

            /*
            | Send request
            */

            const response =
                await axios.post(
                    "/api/success_stories",
                    formData
                );

            if (
                response.data?.success
            ) {
                /*
                | Reset fields first
                */

                resetForm();

                setSuccess(
                    "Success story created successfully."
                );
            } else {
                setError(
                    response.data?.message ||
                        "Failed to create success story."
                );
            }
        } catch (error: unknown) {
            console.error(
                "Create success story error:",
                error
            );

            if (
                axios.isAxiosError(
                    error
                )
            ) {
                setError(
                    error.response?.data
                        ?.message ||
                        "Failed to create success story."
                );
            } else {
                setError(
                    "Something went wrong while creating the success story."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="rounded-box bg-base-100 shadow-md">

                {/* =====================================================
                    Header
                ====================================================== */}

                <div className="border-b border-base-200 p-6">
                    <h2 className="text-lg font-semibold text-[#584140]">
                        Add Success Story
                    </h2>

                    <p className="mt-1 text-sm text-[#584140]/60">
                        Add a patient story or healthcare
                        success story to the hospital website.
                    </p>
                </div>

                {/* =====================================================
                    Form
                ====================================================== */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="space-y-6 p-6"
                >

                    {/* =================================================
                        Messages
                    ================================================== */}

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

                    {/* =================================================
                        Title
                    ================================================== */}

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-[#584140]">
                                Story Title
                            </span>
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={
                                form.title
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="e.g. A Journey Back to Health"
                            className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                            disabled={
                                loading
                            }
                            required
                        />
                    </div>

                    {/* =================================================
                        Patient Information
                    ================================================== */}

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                        {/* Patient Name */}

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-[#584140]">
                                    Patient Name
                                </span>
                            </label>

                            <input
                                type="text"
                                name="patient_name"
                                value={
                                    form.patient_name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Patient name"
                                className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                                disabled={
                                    loading
                                }
                            />
                        </div>

                        {/* Patient Age */}

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-[#584140]">
                                    Patient Age
                                </span>
                            </label>

                            <input
                                type="number"
                                name="patient_age"
                                value={
                                    form.patient_age
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                max="150"
                                placeholder="Age"
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

                                <option value="treatment">
                                    Treatment
                                </option>

                                <option value="surgery">
                                    Surgery
                                </option>

                                <option value="emergency">
                                    Emergency
                                </option>

                                <option value="recovery">
                                    Recovery
                                </option>

                                <option value="welfare">
                                    Welfare
                                </option>

                                <option value="general">
                                    General
                                </option>

                                <option value="other">
                                    Other
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* =================================================
                        Story Date
                    ================================================== */}

                    <div className="form-control max-w-md">
                        <label className="label">
                            <span className="label-text font-medium text-[#584140]">
                                Story Date
                            </span>
                        </label>

                        <input
                            type="date"
                            name="story_date"
                            value={
                                form.story_date
                            }
                            onChange={
                                handleChange
                            }
                            className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                            disabled={
                                loading
                            }
                        />
                    </div>

                    {/* =================================================
                        Summary
                    ================================================== */}

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-[#584140]">
                                Summary
                            </span>
                        </label>

                        <textarea
                            name="summary"
                            value={
                                form.summary
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Short summary of the success story..."
                            className="textarea textarea-bordered min-h-24 w-full focus:border-[#911824] focus:outline-none"
                            disabled={
                                loading
                            }
                        />

                        <label className="label">
                            <span className="label-text-alt text-[#584140]/50">
                                Short description displayed
                                in story cards.
                            </span>

                            <span className="label-text-alt text-[#584140]/50">
                                {
                                    form.summary
                                        .length
                                }{" "}
                                characters
                            </span>
                        </label>
                    </div>

                    {/* =================================================
                        Full Story
                    ================================================== */}

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-[#584140]">
                                Full Story
                            </span>
                        </label>

                        <textarea
                            name="content"
                            value={
                                form.content
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Write the complete success story..."
                            className="textarea textarea-bordered min-h-64 w-full focus:border-[#911824] focus:outline-none"
                            disabled={
                                loading
                            }
                            required
                        />

                        <label className="label">
                            <span className="label-text-alt text-[#584140]/50">
                                Full story content.
                            </span>

                            <span className="label-text-alt text-[#584140]/50">
                                {
                                    form.content
                                        .length
                                }{" "}
                                characters
                            </span>
                        </label>
                    </div>

                    {/* =================================================
                        Image
                    ================================================== */}

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-[#584140]">
                                Story Image
                            </span>

                            <span className="label-text-alt text-[#584140]/50">
                                Optional · Max 5MB
                            </span>
                        </label>

                        <input
                            id="success-story-image"
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

                        {imagePreview && (
                            <div className="mt-4">
                                <div className="relative w-fit">

                                    <img
                                        src={
                                            imagePreview
                                        }
                                        alt="Success story preview"
                                        className="h-48 w-80 rounded-xl object-cover"
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
                    </div>

                    {/* =================================================
                        Featured
                    ================================================== */}

                    <div className="rounded-xl border border-base-200 bg-base-50 p-4">
                        <div className="flex items-center justify-between gap-4">

                            <div>
                                <p className="font-medium text-[#584140]">
                                    Featured Story
                                </p>

                                <p className="mt-1 text-xs text-[#584140]/60">
                                    Featured stories can appear
                                    in highlighted sections on
                                    the website.
                                </p>
                            </div>

                            <input
                                type="checkbox"
                                checked={
                                    form.is_featured
                                }
                                onChange={
                                    handleFeaturedChange
                                }
                                className="toggle border-[#911824] bg-base-200 checked:bg-[#911824]"
                                disabled={
                                    loading
                                }
                            />
                        </div>
                    </div>

                    {/* =================================================
                        Buttons
                    ================================================== */}

                    <div className="flex flex-col-reverse justify-end gap-3 border-t border-base-200 pt-6 sm:flex-row">

                        <button
                            type="button"
                            onClick={
                                resetForm
                            }
                            className="btn btn-ghost"
                            disabled={
                                loading
                            }
                        >
                            Reset
                        </button>

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
                                    Creating...
                                </>
                            ) : (
                                "Create Story"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SuccessStoriesForm;