"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    FiEye,
    FiEdit2,
    FiTrash2,
    FiStar,
    FiX,
} from "react-icons/fi";

export interface SuccessStory {
    id: number;
    title: string;
    summary: string | null;
    content: string;
    image_url: string | null;
    patient_name: string | null;
    patient_age: number | null;
    category: string | null;
    story_date: string | null;
    is_featured: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

function SuccessStoriesList() {
    const [stories, setStories] =
        useState<SuccessStory[]>([]);

    const [selectedStory, setSelectedStory] =
        useState<SuccessStory | null>(null);

    const [editingStory, setEditingStory] =
        useState<SuccessStory | null>(null);

    const [deletingStory, setDeletingStory] =
        useState<SuccessStory | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    // ============================================================
    // Edit form state
    // ============================================================

    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [patientName, setPatientName] = useState("");
    const [patientAge, setPatientAge] = useState("");
    const [category, setCategory] = useState("");
    const [storyDate, setStoryDate] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [image, setImage] = useState<File | null>(null);

    // ============================================================
    // Fetch stories
    // ============================================================

    const getSuccessStories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "/api/success_stories/all"
            );

            if (response.data.success) {
                setStories(response.data.data);
            } else {
                setError(
                    response.data.message ||
                    "Failed to fetch success stories."
                );
            }
        } catch (error: any) {
            console.error(error);

            setError(
                error?.response?.data?.message ||
                "Failed to fetch success stories."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSuccessStories();
    }, []);

    // ============================================================
    // Format date
    // ============================================================

    const formatDate = (
        date: string | null
    ) => {
        if (!date) {
            return "No date";
        }

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );
    };

    // ============================================================
    // Open edit modal
    // ============================================================

    const openEditModal = (
        story: SuccessStory
    ) => {
        setEditingStory(story);

        setTitle(story.title || "");
        setSummary(story.summary || "");
        setContent(story.content || "");
        setPatientName(
            story.patient_name || ""
        );
        setPatientAge(
            story.patient_age !== null
                ? String(story.patient_age)
                : ""
        );
        setCategory(
            story.category || ""
        );

        setStoryDate(
            story.story_date
                ? story.story_date.split("T")[0]
                : ""
        );

        setIsFeatured(
            story.is_featured
        );

        setIsActive(
            story.is_active
        );

        setImage(null);

        setError("");
    };

    // ============================================================
    // Update story
    // ============================================================

    const handleUpdate = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!editingStory) {
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccessMessage("");

            const formData = new FormData();

            formData.append(
                "title",
                title
            );

            formData.append(
                "summary",
                summary
            );

            formData.append(
                "content",
                content
            );

            formData.append(
                "patient_name",
                patientName
            );

            formData.append(
                "patient_age",
                patientAge
            );

            formData.append(
                "category",
                category
            );

            formData.append(
                "story_date",
                storyDate
            );

            formData.append(
                "is_featured",
                isFeatured
                    ? "true"
                    : "false"
            );

            formData.append(
                "is_active",
                isActive
                    ? "true"
                    : "false"
            );

            // Only send image if a new one was selected
            if (image) {
                formData.append(
                    "image",
                    image
                );
            }

            const response =
                await axios.put(
                    `/api/success_stories/${editingStory.id}`,
                    formData
                );

            if (response.data.success) {
                const updatedStory =
                    response.data.data;

                // Update list without refetching
                setStories((previous) =>
                    previous.map(
                        (story) =>
                            story.id ===
                            updatedStory.id
                                ? updatedStory
                                : story
                    )
                );

                setSuccessMessage(
                    "Success story updated successfully."
                );

                setEditingStory(null);
                setImage(null);
            }

        } catch (error: any) {
            console.error(error);

            setError(
                error?.response?.data?.message ||
                "Failed to update success story."
            );
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // Delete story
    // ============================================================

    const handleDelete = async () => {
        if (!deletingStory) {
            return;
        }

        try {
            setDeleting(true);
            setError("");
            setSuccessMessage("");

            const response =
                await axios.delete(
                    `/api/success_stories/${deletingStory.id}`
                );

            if (response.data.success) {
                // Remove deleted story from state
                setStories((previous) =>
                    previous.filter(
                        (story) =>
                            story.id !==
                            deletingStory.id
                    )
                );

                setSuccessMessage(
                    "Success story deleted successfully."
                );

                setDeletingStory(null);
            }

        } catch (error: any) {
            console.error(error);

            setError(
                error?.response?.data?.message ||
                "Failed to delete success story."
            );
        } finally {
            setDeleting(false);
        }
    };

    // ============================================================
    // Loading
    // ============================================================

    if (loading) {
        return (
            <div className="flex w-full justify-center py-12">
                <span className="loading loading-spinner loading-md text-[#911824]" />
            </div>
        );
    }

    return (
        <>
            <div className="w-full">

                {/* Error */}
                {error && (
                    <div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-600">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                            className="text-red-600"
                        >
                            <FiX size={18} />
                        </button>
                    </div>
                )}

                {/* Success */}
                {successMessage && (
                    <div className="mb-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">
                        <p className="text-sm text-green-700">
                            {successMessage}
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setSuccessMessage("")
                            }
                            className="text-green-700"
                        >
                            <FiX size={18} />
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!error &&
                    stories.length === 0 && (
                        <div className="rounded-box bg-base-100 p-8 text-center shadow-md">
                            <p className="text-sm text-[#584140]/70">
                                No success stories found.
                            </p>
                        </div>
                    )}

                {/* List */}
                {stories.length > 0 && (
                    <ul className="list bg-base-100 rounded-box shadow-md">

                        {/* Header */}
                        <li className="p-4 pb-2">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-[#584140]">
                                        Success Stories
                                    </h2>

                                    <p className="mt-1 text-xs text-[#584140]/60">
                                        Manage patient success stories and testimonials.
                                    </p>
                                </div>

                                <div className="badge badge-outline shrink-0">
                                    {stories.length} Stories
                                </div>
                            </div>
                        </li>

                        {/* Stories */}
                        {stories.map(
                            (story) => (
                                <li
                                    key={story.id}
                                    className="list-row"
                                >

                                    {/* Image */}
                                    <div>
                                        {story.image_url ? (
                                            <Image
                                                src={
                                                    story.image_url
                                                }
                                                alt={
                                                    story.title
                                                }
                                                width={
                                                    72
                                                }
                                                height={
                                                    56
                                                }
                                                className="h-14 w-18 rounded-box object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-14 w-18 items-center justify-center rounded-box bg-[#f8e8e9]">
                                                <span className="text-xl font-semibold text-[#911824]">
                                                    {story.title
                                                        ?.charAt(
                                                            0
                                                        )
                                                        .toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="truncate font-semibold text-[#584140]">
                                                {
                                                    story.title
                                                }
                                            </span>

                                            {story.is_featured && (
                                                <FiStar
                                                    size={
                                                        14
                                                    }
                                                    className="shrink-0 text-[#911824]"
                                                    fill="currentColor"
                                                />
                                            )}
                                        </div>

                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                                            {story.category && (
                                                <span className="text-[#911824]">
                                                    {
                                                        story.category
                                                    }
                                                </span>
                                            )}

                                            {story.patient_name && (
                                                <span className="text-[#584140]/50">
                                                    {
                                                        story.patient_name
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <p className="list-col-wrap text-xs opacity-70">
                                        {story.summary ||
                                            story.content?.slice(
                                                0,
                                                120
                                            ) ||
                                            "No summary provided"}
                                    </p>

                                    {/* Status + Actions */}
                                    <div className="flex shrink-0 items-center justify-end gap-1 whitespace-nowrap">

                                        <span
                                            className={`badge badge-sm mr-2 ${
                                                story.is_active
                                                    ? "badge-success"
                                                    : "badge-error"
                                            }`}
                                        >
                                            {story.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

                                        {/* View */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSelectedStory(
                                                    story
                                                )
                                            }
                                            className="btn btn-square btn-ghost text-[#911824]"
                                            title="View story"
                                            aria-label={`View ${story.title}`}
                                        >
                                            <FiEye
                                                size={
                                                    18
                                                }
                                            />
                                        </button>

                                        {/* Edit */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditModal(
                                                    story
                                                )
                                            }
                                            className="btn btn-square btn-ghost text-[#584140]"
                                            title="Edit story"
                                            aria-label={`Edit ${story.title}`}
                                        >
                                            <FiEdit2
                                                size={
                                                    18
                                                }
                                            />
                                        </button>

                                        {/* Delete */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDeletingStory(
                                                    story
                                                )
                                            }
                                            className="btn btn-square btn-ghost text-red-600"
                                            title="Delete story"
                                            aria-label={`Delete ${story.title}`}
                                        >
                                            <FiTrash2
                                                size={
                                                    18
                                                }
                                            />
                                        </button>
                                    </div>
                                </li>
                            )
                        )}
                    </ul>
                )}
            </div>

            {/* ======================================================
                VIEW MODAL
            ====================================================== */}

            {selectedStory && (
                <dialog
                    open
                    className="modal modal-bottom sm:modal-middle"
                >
                    <div className="modal-box max-w-3xl">

                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">

                                    {selectedStory.is_featured && (
                                        <FiStar
                                            size={
                                                18
                                            }
                                            className="shrink-0 text-[#911824]"
                                            fill="currentColor"
                                        />
                                    )}

                                    <h3 className="text-xl font-bold text-[#584140]">
                                        {
                                            selectedStory.title
                                        }
                                    </h3>
                                </div>

                                <p className="mt-1 text-sm text-[#584140]/60">
                                    Patient Success Story
                                </p>
                            </div>

                            <span
                                className={`badge ${
                                    selectedStory.is_active
                                        ? "badge-success"
                                        : "badge-error"
                                }`}
                            >
                                {selectedStory.is_active
                                    ? "Active"
                                    : "Inactive"}
                            </span>
                        </div>

                        {/* Image */}
                        {selectedStory.image_url && (
                            <div className="mt-5">
                                <Image
                                    src={
                                        selectedStory.image_url
                                    }
                                    alt={
                                        selectedStory.title
                                    }
                                    width={
                                        1000
                                    }
                                    height={
                                        500
                                    }
                                    className="h-64 w-full rounded-xl object-cover"
                                />
                            </div>
                        )}

                        {/* Information */}
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Patient
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {selectedStory.patient_name ||
                                        "Not specified"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Age
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {selectedStory.patient_age !==
                                    null
                                        ? `${selectedStory.patient_age} years`
                                        : "Not specified"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Category
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {selectedStory.category ||
                                        "Uncategorized"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Story Date
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {formatDate(
                                        selectedStory.story_date
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Story ID
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    #
                                    {
                                        selectedStory.id
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Featured
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {selectedStory.is_featured
                                        ? "Yes"
                                        : "No"}
                                </p>
                            </div>
                        </div>

                        {/* Summary */}
                        {selectedStory.summary && (
                            <div className="mt-5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Summary
                                </p>

                                <p className="mt-2 text-sm leading-6 text-[#584140]/80">
                                    {
                                        selectedStory.summary
                                    }
                                </p>
                            </div>
                        )}

                        {/* Content */}
                        <div className="mt-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                Story
                            </p>

                            <div className="mt-2 max-h-64 overflow-y-auto rounded-lg bg-[#FBF9F9] p-4">
                                <p className="whitespace-pre-wrap text-sm leading-6 text-[#584140]/80">
                                    {
                                        selectedStory.content
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Close */}
                        <div className="modal-action">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedStory(
                                        null
                                    )
                                }
                                className="btn bg-[#911824] text-white hover:bg-[#760f19]"
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    <form
                        method="dialog"
                        className="modal-backdrop"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setSelectedStory(
                                    null
                                )
                            }
                        >
                            close
                        </button>
                    </form>
                </dialog>
            )}

            {/* ======================================================
                EDIT MODAL
            ====================================================== */}

            {editingStory && (
                <dialog
                    open
                    className="modal modal-bottom sm:modal-middle"
                >
                    <div className="modal-box max-w-3xl">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-base-200 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-[#584140]">
                                    Edit Success Story
                                </h3>

                                <p className="mt-1 text-sm text-[#584140]/60">
                                    Update the details of this success story.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setEditingStory(
                                        null
                                    )
                                }
                                className="btn btn-sm btn-circle btn-ghost"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={
                                handleUpdate
                            }
                            className="mt-5 space-y-5"
                        >

                            {/* Title */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-[#584140]">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(
                                            e.target.value
                                        )
                                    }
                                    className="input input-bordered w-full"
                                    placeholder="Success story title"
                                    required
                                />
                            </div>

                            {/* Summary */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-[#584140]">
                                    Summary
                                </label>

                                <textarea
                                    value={
                                        summary
                                    }
                                    onChange={(e) =>
                                        setSummary(
                                            e.target.value
                                        )
                                    }
                                    className="textarea textarea-bordered min-h-24 w-full"
                                    placeholder="Short summary"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-[#584140]">
                                    Story Content
                                </label>

                                <textarea
                                    value={
                                        content
                                    }
                                    onChange={(e) =>
                                        setContent(
                                            e.target.value
                                        )
                                    }
                                    className="textarea textarea-bordered min-h-40 w-full"
                                    placeholder="Write the full success story..."
                                    required
                                />
                            </div>

                            {/* Patient */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-[#584140]">
                                        Patient Name
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            patientName
                                        }
                                        onChange={(e) =>
                                            setPatientName(
                                                e.target.value
                                            )
                                        }
                                        className="input input-bordered w-full"
                                        placeholder="Patient name"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-[#584140]">
                                        Patient Age
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        max="150"
                                        value={
                                            patientAge
                                        }
                                        onChange={(e) =>
                                            setPatientAge(
                                                e.target.value
                                            )
                                        }
                                        className="input input-bordered w-full"
                                        placeholder="Age"
                                    />
                                </div>

                            </div>

                            {/* Category + Date */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-[#584140]">
                                        Category
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            category
                                        }
                                        onChange={(e) =>
                                            setCategory(
                                                e.target.value
                                            )
                                        }
                                        className="input input-bordered w-full"
                                        placeholder="e.g. Surgery"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-[#584140]">
                                        Story Date
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            storyDate
                                        }
                                        onChange={(e) =>
                                            setStoryDate(
                                                e.target.value
                                            )
                                        }
                                        className="input input-bordered w-full"
                                    />
                                </div>

                            </div>

                            {/* New Image */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-[#584140]">
                                    Replace Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setImage(
                                            e.target.files?.[0] ||
                                            null
                                        )
                                    }
                                    className="file-input file-input-bordered w-full"
                                />

                                {image && (
                                    <p className="mt-2 text-xs text-[#584140]/60">
                                        New image selected:{" "}
                                        {image.name}
                                    </p>
                                )}

                                {!image &&
                                    editingStory.image_url && (
                                        <p className="mt-2 text-xs text-[#584140]/60">
                                            Existing image will be kept.
                                        </p>
                                    )}
                            </div>

                            {/* Existing image preview */}
                            {editingStory.image_url && (
                                <div>
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                        Current Image
                                    </p>

                                    <Image
                                        src={
                                            editingStory.image_url
                                        }
                                        alt={
                                            editingStory.title
                                        }
                                        width={
                                            500
                                        }
                                        height={
                                            250
                                        }
                                        className="h-40 w-full rounded-lg object-cover"
                                    />
                                </div>
                            )}

                            {/* Options */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                {/* Featured */}
                                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-base-300 p-4">
                                    <div>
                                        <p className="font-medium text-[#584140]">
                                            Featured Story
                                        </p>

                                        <p className="text-xs text-[#584140]/60">
                                            Show this story as featured.
                                        </p>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={
                                            isFeatured
                                        }
                                        onChange={(e) =>
                                            setIsFeatured(
                                                e.target.checked
                                            )
                                        }
                                        className="toggle border-[#911824] bg-base-200 checked:bg-[#911824]"
                                    />
                                </label>

                                {/* Active */}
                                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-base-300 p-4">
                                    <div>
                                        <p className="font-medium text-[#584140]">
                                            Active Story
                                        </p>

                                        <p className="text-xs text-[#584140]/60">
                                            Make this story visible.
                                        </p>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={
                                            isActive
                                        }
                                        onChange={(e) =>
                                            setIsActive(
                                                e.target.checked
                                            )
                                        }
                                        className="toggle border-[#911824] bg-base-200 checked:bg-[#911824]"
                                    />
                                </label>

                            </div>

                            {/* Buttons */}
                            <div className="modal-action border-t border-base-200 pt-4">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingStory(
                                            null
                                        )
                                    }
                                    className="btn btn-ghost"
                                    disabled={
                                        saving
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn bg-[#911824] text-white hover:bg-[#760f19]"
                                    disabled={
                                        saving
                                    }
                                >
                                    {saving ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </button>

                            </div>
                        </form>
                    </div>

                    <form
                        method="dialog"
                        className="modal-backdrop"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setEditingStory(
                                    null
                                )
                            }
                        >
                            close
                        </button>
                    </form>
                </dialog>
            )}

            {/* ======================================================
                DELETE CONFIRMATION MODAL
            ====================================================== */}

            {deletingStory && (
                <dialog
                    open
                    className="modal modal-bottom sm:modal-middle"
                >
                    <div className="modal-box max-w-md">

                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
                                <FiTrash2
                                    size={20}
                                    className="text-red-600"
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-[#584140]">
                                    Delete Success Story?
                                </h3>

                                <p className="text-sm text-[#584140]/60">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-lg bg-[#FBF9F9] p-4">
                            <p className="font-medium text-[#584140]">
                                {
                                    deletingStory.title
                                }
                            </p>

                            {deletingStory.patient_name && (
                                <p className="mt-1 text-sm text-[#584140]/60">
                                    Patient:{" "}
                                    {
                                        deletingStory.patient_name
                                    }
                                </p>
                            )}
                        </div>

                        <div className="modal-action">

                            <button
                                type="button"
                                onClick={() =>
                                    setDeletingStory(
                                        null
                                    )
                                }
                                className="btn btn-ghost"
                                disabled={
                                    deleting
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleDelete
                                }
                                className="btn bg-red-600 text-white hover:bg-red-700"
                                disabled={
                                    deleting
                                }
                            >
                                {deleting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FiTrash2
                                            size={16}
                                        />
                                        Delete
                                    </>
                                )}
                            </button>

                        </div>
                    </div>

                    <form
                        method="dialog"
                        className="modal-backdrop"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setDeletingStory(
                                    null
                                )
                            }
                        >
                            close
                        </button>
                    </form>
                </dialog>
            )}
        </>
    );
}

export default SuccessStoriesList;

