"use client";

import {
    ChangeEvent,
    FormEvent,
    useState,
} from "react";
import Image from "next/image";
import axios from "axios";
import {
    FaPlus,
    FaTimes,
    FaImage,
} from "react-icons/fa";

interface AddAchievementFormProps {
    onClose: () => void;
    onSuccess: (achievement: AchievementAward) => void;
}

export interface AchievementAward {
    id: number;
    title: string;
    type: string;
    description: string | null;
    image_url: string | null;
    award_date: string | null;
    issuing_organization: string | null;
    website_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface AddFormData {
    title: string;
    type: string;
    description: string;
    award_date: string;
    issuing_organization: string;
    website_url: string;
    is_active: boolean;
}

export default function AddAchievementForm({
    onClose,
    onSuccess,
}: AddAchievementFormProps) {
    const [form, setForm] =
        useState<AddFormData>({
            title: "",
            type: "",
            description: "",
            award_date: "",
            issuing_organization: "",
            website_url: "",
            is_active: true,
        });

    const [image, setImage] =
        useState<File | null>(null);

    const [imagePreview, setImagePreview] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    function handleChange(
        event: ChangeEvent<
            HTMLInputElement |
                HTMLTextAreaElement |
                HTMLSelectElement
        >
    ) {
        const {
            name,
            value,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function handleActiveChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        setForm((previous) => ({
            ...previous,
            is_active:
                event.target.checked,
        }));
    }

    function handleImageChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {
            alert(
                "Image must be less than 5MB."
            );

            event.target.value = "";
            return;
        }

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {
            alert(
                "Please select a valid image."
            );

            event.target.value = "";
            return;
        }

        if (imagePreview) {
            URL.revokeObjectURL(
                imagePreview
            );
        }

        const preview =
            URL.createObjectURL(file);

        setImage(file);
        setImagePreview(preview);
    }

    function resetForm() {
        if (imagePreview) {
            URL.revokeObjectURL(
                imagePreview
            );
        }

        setForm({
            title: "",
            type: "",
            description: "",
            award_date: "",
            issuing_organization: "",
            website_url: "",
            is_active: true,
        });

        setImage(null);
        setImagePreview(null);
        setError("");
    }

    function handleClose() {
        if (loading) {
            return;
        }

        resetForm();
        onClose();
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");

        if (!form.title.trim()) {
            setError(
                "Achievement/Award title is required."
            );

            return;
        }

        if (!form.type.trim()) {
            setError(
                "Achievement/Award type is required."
            );

            return;
        }

        try {
            setLoading(true);

            const formData =
                new FormData();

            formData.append(
                "title",
                form.title.trim()
            );

            formData.append(
                "type",
                form.type.trim()
            );

            formData.append(
                "description",
                form.description.trim()
            );

            formData.append(
                "award_date",
                form.award_date
            );

            formData.append(
                "issuing_organization",
                form.issuing_organization.trim()
            );

            formData.append(
                "website_url",
                form.website_url.trim()
            );

            formData.append(
                "is_active",
                String(form.is_active)
            );

            if (image) {
                formData.append(
                    "image",
                    image
                );
            }

            const response =
                await axios.post(
                    "/api/acheivement_awards",
                    formData
                );

            if (
                response.data.success
            ) {
                const newAchievement =
                    response.data.data;

                onSuccess(
                    newAchievement
                );

                resetForm();
                onClose();
            } else {
                setError(
                    response.data.message ||
                        "Failed to create achievement."
                );
            }
        } catch (error) {
            console.error(
                "Error creating achievement:",
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
                        "Failed to create achievement."
                );
            } else {
                setError(
                    "Failed to create achievement."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-3xl">

                {/* Header */}
                <div className="flex items-start justify-between gap-4">

                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#911824]/10 text-[#911824]">
                                <FaPlus />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-[#584140]">
                                    Add Achievement
                                </h3>

                                <p className="mt-1 text-sm text-[#584140]/60">
                                    Add a new hospital achievement,
                                    award or recognition.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleClose
                        }
                        disabled={loading}
                        className="btn btn-sm btn-circle btn-ghost"
                    >
                        <FaTimes />
                    </button>

                </div>

                {/* Error */}
                {error && (
                    <div className="mt-5 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="mt-6 space-y-5"
                >

                    {/* Title + Type */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Title */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-[#584140]">
                                    Title
                                    <span className="ml-1 text-error">
                                        *
                                    </span>
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
                                placeholder="e.g. Best Hospital Award"
                                className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                                required
                            />
                        </div>

                        {/* Type */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-[#584140]">
                                    Type
                                    <span className="ml-1 text-error">
                                        *
                                    </span>
                                </span>
                            </label>

                            <select
                                name="type"
                                value={
                                    form.type
                                }
                                onChange={
                                    handleChange
                                }
                                className="select select-bordered w-full focus:border-[#911824] focus:outline-none"
                                required
                            >
                                <option value="">
                                    Select type
                                </option>

                                <option value="award">
                                    Award
                                </option>

                                <option value="achievement">
                                    Achievement
                                </option>

                                <option value="recognition">
                                    Recognition
                                </option>

                                <option value="certification">
                                    Certification
                                </option>

                                <option value="accreditation">
                                    Accreditation
                                </option>

                                <option value="milestone">
                                    Milestone
                                </option>

                                <option value="other">
                                    Other
                                </option>
                            </select>
                        </div>

                    </div>

                    {/* Organization + Date */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Organization */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-[#584140]">
                                    Issuing Organization
                                </span>
                            </label>

                            <input
                                type="text"
                                name="issuing_organization"
                                value={
                                    form.issuing_organization
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Punjab Healthcare Commission"
                                className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                            />
                        </div>

                        {/* Award Date */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-[#584140]">
                                    Award Date
                                </span>
                            </label>

                            <input
                                type="date"
                                name="award_date"
                                value={
                                    form.award_date
                                }
                                onChange={
                                    handleChange
                                }
                                className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                            />
                        </div>

                    </div>

                    {/* Website */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-[#584140]">
                                Website URL
                            </span>
                        </label>

                        <input
                            type="url"
                            name="website_url"
                            value={
                                form.website_url
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="https://example.com"
                            className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                        />
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
                            rows={4}
                            placeholder="Describe this achievement or award..."
                            className="textarea textarea-bordered w-full resize-y focus:border-[#911824] focus:outline-none"
                        />
                    </div>

                    {/* Image */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-[#584140]">
                                Achievement Image
                            </span>
                        </label>

                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={
                                handleImageChange
                            }
                            className="file-input file-input-bordered w-full"
                        />

                        <p className="mt-2 text-xs text-[#584140]/50">
                            PNG, JPG, JPEG or WebP.
                            Maximum size: 5MB.
                        </p>

                        {/* Preview */}
                        {imagePreview && (
                            <div className="mt-4">
                                <p className="mb-2 text-sm font-medium text-[#584140]">
                                    Image Preview
                                </p>

                                <div className="relative h-36 w-full overflow-hidden rounded-xl border border-base-200 bg-[#FBF9F9] sm:w-52">
                                    <Image
                                        src={
                                            imagePreview
                                        }
                                        alt="Achievement preview"
                                        fill
                                        sizes="208px"
                                        className="object-contain p-3"
                                    />
                                </div>
                            </div>
                        )}

                        {!imagePreview && (
                            <div className="mt-4 flex h-24 w-full items-center justify-center rounded-xl border border-dashed border-base-300 bg-[#FBF9F9] text-[#584140]/40 sm:w-52">
                                <div className="text-center">
                                    <FaImage className="mx-auto text-xl" />

                                    <p className="mt-1 text-xs">
                                        No image selected
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Active */}
                    <div className="rounded-xl border border-base-200 bg-[#FBF9F9] p-4">

                        <label className="flex cursor-pointer items-center justify-between gap-4">

                            <div>
                                <p className="font-medium text-[#584140]">
                                    Active Achievement
                                </p>

                                <p className="mt-1 text-sm text-[#584140]/60">
                                    Active records are
                                    displayed on the
                                    public website.
                                </p>
                            </div>

                            <input
                                type="checkbox"
                                checked={
                                    form.is_active
                                }
                                onChange={
                                    handleActiveChange
                                }
                                className="toggle border-[#911824] bg-white checked:bg-[#911824]"
                            />

                        </label>

                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col-reverse gap-3 border-t border-base-200 pt-5 sm:flex-row sm:justify-end">

                        <button
                            type="button"
                            onClick={
                                handleClose
                            }
                            disabled={loading}
                            className="btn btn-outline"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn border-[#911824] bg-[#911824] text-white hover:border-[#86000D] hover:bg-[#86000D]"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm" />

                                    Adding...
                                </>
                            ) : (
                                <>
                                    <FaPlus />

                                    Add Achievement
                                </>
                            )}
                        </button>

                    </div>

                </form>

            </div>

            <div
                className="modal-backdrop"
                onClick={() => {
                    if (!loading) {
                        handleClose();
                    }
                }}
            />
        </div>
    );
}