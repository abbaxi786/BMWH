"use client";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";
import Image from "next/image";
import axios from "axios";
import {
    FaEye,
    FaEdit,
    FaTrash,
    FaTimes,
    FaExternalLinkAlt,
    FaCalendarAlt,
    FaBuilding,
    FaImage,
} from "react-icons/fa";

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

interface EditFormData {
    title: string;
    type: string;
    description: string;
    award_date: string;
    issuing_organization: string;
    website_url: string;
    is_active: boolean;
}

function AchievementsAwardsList() {
    const [achievements, setAchievements] =
        useState<AchievementAward[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // View
    const [selectedAchievement, setSelectedAchievement] =
        useState<AchievementAward | null>(null);

    // Edit
    const [editingAchievement, setEditingAchievement] =
        useState<AchievementAward | null>(null);

    const [editForm, setEditForm] =
        useState<EditFormData>({
            title: "",
            type: "",
            description: "",
            award_date: "",
            issuing_organization: "",
            website_url: "",
            is_active: true,
        });

    const [editImage, setEditImage] =
        useState<File | null>(null);

    const [editImagePreview, setEditImagePreview] =
        useState<string | null>(null);

    const [editLoading, setEditLoading] =
        useState(false);

    // Delete
    const [deletingAchievement, setDeletingAchievement] =
        useState<AchievementAward | null>(null);

    const [deleteLoading, setDeleteLoading] =
        useState(false);


    // --------------------------------------------------
    // Fetch achievements
    // --------------------------------------------------

    async function fetchAchievements() {
        try {
            setLoading(true);
            setError("");

            const response =
                await axios.get(
                    "/api/acheivement_awards"
                );

            console.log(response.data)

            if (response.data.success) {
                setAchievements(
                    response.data.data
                );
            } else {
                setError(
                    response.data.message ||
                        "Failed to load achievements."
                );
            }
        } catch (error) {
            console.error(
                "Error fetching achievements:",
                error
            );

            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                        "Failed to load achievements."
                );
            } else {
                setError(
                    "Failed to load achievements."
                );
            }
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        fetchAchievements();
    }, []);


    // --------------------------------------------------
    // View modal
    // --------------------------------------------------

    function openViewModal(
        achievement: AchievementAward
    ) {
        setSelectedAchievement(achievement);
    }

    function closeViewModal() {
        setSelectedAchievement(null);
    }


    // --------------------------------------------------
    // Edit modal
    // --------------------------------------------------

    function openEditModal(
        achievement: AchievementAward
    ) {
        setEditingAchievement(achievement);

        setEditForm({
            title: achievement.title || "",
            type: achievement.type || "",
            description:
                achievement.description || "",
            award_date:
                achievement.award_date
                    ? achievement.award_date.slice(0, 10)
                    : "",
            issuing_organization:
                achievement.issuing_organization ||
                "",
            website_url:
                achievement.website_url || "",
            is_active:
                achievement.is_active,
        });

        setEditImage(null);
        setEditImagePreview(
            achievement.image_url || null
        );

        setError("");
        setSuccess("");
    }

    function closeEditModal() {
        if (
            editImagePreview &&
            editImagePreview.startsWith("blob:")
        ) {
            URL.revokeObjectURL(
                editImagePreview
            );
        }

        setEditingAchievement(null);
        setEditImage(null);
        setEditImagePreview(null);
    }


    function handleEditChange(
        event: ChangeEvent<
            HTMLInputElement |
                HTMLTextAreaElement |
                HTMLSelectElement
        >
    ) {
        const { name, value } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }


    function handleEditActiveChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        setEditForm((previous) => ({
            ...previous,
            is_active:
                event.target.checked,
        }));
    }


    function handleEditImageChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const file =
            event.target.files?.[0];

        if (!file) return;

        // 5MB limit
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

        if (!file.type.startsWith("image/")) {
            alert(
                "Please select a valid image."
            );

            event.target.value = "";
            return;
        }

        // Remove previous blob preview
        if (
            editImagePreview &&
            editImagePreview.startsWith("blob:")
        ) {
            URL.revokeObjectURL(
                editImagePreview
            );
        }

        const objectUrl =
            URL.createObjectURL(file);

        setEditImage(file);
        setEditImagePreview(objectUrl);
    }


    async function handleEditSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!editingAchievement) return;

        if (!editForm.title.trim()) {
            alert(
                "Achievement/Award title is required."
            );
            return;
        }

        if (!editForm.type.trim()) {
            alert(
                "Achievement/Award type is required."
            );
            return;
        }

        try {
            setEditLoading(true);
            setError("");
            setSuccess("");

            const formData =
                new FormData();

            formData.append(
                "title",
                editForm.title.trim()
            );

            formData.append(
                "type",
                editForm.type.trim()
            );

            formData.append(
                "description",
                editForm.description.trim()
            );

            formData.append(
                "award_date",
                editForm.award_date
            );

            formData.append(
                "issuing_organization",
                editForm.issuing_organization.trim()
            );

            formData.append(
                "website_url",
                editForm.website_url.trim()
            );

            formData.append(
                "is_active",
                String(editForm.is_active)
            );

            if (editImage) {
                formData.append(
                    "image",
                    editImage
                );
            }

            const response =
                await axios.put(
                    `/api/acheivement_awards/${editingAchievement.id}`,
                    formData
                );

            if (response.data.success) {
                const updatedAchievement =
                    response.data.data;

                setAchievements(
                    (previous) =>
                        previous.map(
                            (achievement) =>
                                achievement.id ===
                                updatedAchievement.id
                                    ? updatedAchievement
                                    : achievement
                        )
                );

                // Update currently selected
                // achievement if it is open.
                if (
                    selectedAchievement?.id ===
                    updatedAchievement.id
                ) {
                    setSelectedAchievement(
                        updatedAchievement
                    );
                }

                setSuccess(
                    "Achievement/Award updated successfully."
                );

                closeEditModal();
            }
        } catch (error) {
            console.error(
                "Error updating achievement:",
                error
            );

            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                        "Failed to update achievement."
                );
            } else {
                setError(
                    "Failed to update achievement."
                );
            }
        } finally {
            setEditLoading(false);
        }
    }


    // --------------------------------------------------
    // Delete
    // --------------------------------------------------

    function openDeleteModal(
        achievement: AchievementAward
    ) {
        setDeletingAchievement(
            achievement
        );

        setError("");
        setSuccess("");
    }

    function closeDeleteModal() {
        setDeletingAchievement(null);
    }


    async function handleDelete() {
        if (!deletingAchievement) return;

        try {
            setDeleteLoading(true);
            setError("");
            setSuccess("");

            const response =
                await axios.delete(
                    `/api/acheivement_awards/${deletingAchievement.id}`
                );

            if (response.data.success) {
                const deletedId =
                    deletingAchievement.id;

                setAchievements(
                    (previous) =>
                        previous.filter(
                            (achievement) =>
                                achievement.id !==
                                deletedId
                        )
                );

                if (
                    selectedAchievement?.id ===
                    deletedId
                ) {
                    setSelectedAchievement(
                        null
                    );
                }

                setSuccess(
                    "Achievement/Award deleted successfully."
                );

                closeDeleteModal();
            }
        } catch (error) {
            console.error(
                "Error deleting achievement:",
                error
            );

            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                        "Failed to delete achievement."
                );
            } else {
                setError(
                    "Failed to delete achievement."
                );
            }
        } finally {
            setDeleteLoading(false);
        }
    }


    // --------------------------------------------------
    // Date formatting
    // --------------------------------------------------

    function formatDate(
        date: string | null
    ) {
        if (!date) return "—";

        return new Date(
            date
        ).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );
    }


    // --------------------------------------------------
    // Type formatting
    // --------------------------------------------------

    function formatType(
        type: string
    ) {
        return type
            .replace(/_/g, " ")
            .replace(
                /\b\w/g,
                (letter) =>
                    letter.toUpperCase()
            );
    }


    // --------------------------------------------------
    // Loading
    // --------------------------------------------------

    if (loading) {
        return (
            <div className="flex min-h-60 items-center justify-center rounded-xl border border-base-200 bg-white">
                <span className="loading loading-spinner loading-lg text-[#911824]" />
            </div>
        );
    }


    return (
        <>
            <div className="w-full p-6 rounded-xl border border-base-200 bg-white shadow-sm">

                {/* Header */}
                <div className="flex flex-col gap-4 border-b border-base-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-[#584140]">
                            Achievements & Awards
                        </h2>

                        <p className="mt-1 text-sm text-[#584140]/60">
                            Manage hospital achievements,
                            awards and recognitions.
                        </p>
                    </div>

                    <div className="badge badge-lg border-[#911824]/20 bg-[#911824]/10 text-[#911824]">
                        {achievements.length}{" "}
                        {achievements.length === 1
                            ? "Record"
                            : "Records"}
                    </div>
                </div>


                {/* Messages */}
                {error && (
                    <div className="mx-5 mt-5 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mx-5 mt-5 rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
                        {success}
                    </div>
                )}


                {/* Empty state */}
                {achievements.length === 0 ? (
                    <div className="flex min-h-60 flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#911824]/10 text-[#911824]">
                            <FaTrophyIcon />
                        </div>

                        <h3 className="text-lg font-semibold text-[#584140]">
                            No achievements found
                        </h3>

                        <p className="mt-1 max-w-md text-sm text-[#584140]/60">
                            Add your first achievement
                            or award to display it here.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">

                            {/* Table Head */}
                            <thead>
                                <tr className="border-b border-base-200 text-[#584140]">
                                    <th>Achievement</th>
                                    <th>Type</th>
                                    <th>Organization</th>
                                    <th>Award Date</th>
                                    <th>Status</th>
                                    <th className="text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>


                            {/* Table Body */}
                            <tbody>
                                {achievements.map(
                                    (achievement) => (
                                        <tr
                                            key={
                                                achievement.id
                                            }
                                            className="border-b border-base-200 last:border-0 hover:bg-[#FBF9F9]"
                                        >

                                            {/* Achievement */}
                                            <td>
                                                <div className="flex min-w-55 items-center gap-3">

                                                    {/* Image */}
                                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-base-200 bg-[#FBF9F9]">

                                                        {achievement.image_url ? (
                                                            <Image
                                                                src={
                                                                    achievement.image_url
                                                                }
                                                                alt={
                                                                    achievement.title
                                                                }
                                                                fill
                                                                sizes="48px"
                                                                className="object-contain p-1"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-[#911824]/40">
                                                                <FaImage />
                                                            </div>
                                                        )}
                                                    </div>


                                                    <div className="min-w-0">
                                                        <p className="truncate font-medium text-[#584140]">
                                                            {
                                                                achievement.title
                                                            }
                                                        </p>

                                                        {achievement.description && (
                                                            <p className="mt-0.5 max-w-65 truncate text-xs text-[#584140]/50">
                                                                {
                                                                    achievement.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>


                                            {/* Type */}
                                            <td>
                                                <span className="badge border-[#911824]/20 bg-[#911824]/5 text-[#911824]">
                                                    {formatType(
                                                        achievement.type
                                                    )}
                                                </span>
                                            </td>


                                            {/* Organization */}
                                            <td>
                                                <div className="flex items-center gap-2 text-sm text-[#584140]">
                                                    <FaBuilding className="text-[#911824]/60" />

                                                    <span>
                                                        {
                                                            achievement.issuing_organization ||
                                                            "—"
                                                        }
                                                    </span>
                                                </div>
                                            </td>


                                            {/* Date */}
                                            <td>
                                                <div className="flex items-center gap-2 text-sm text-[#584140]">
                                                    <FaCalendarAlt className="text-[#911824]/60" />

                                                    <span>
                                                        {formatDate(
                                                            achievement.award_date
                                                        )}
                                                    </span>
                                                </div>
                                            </td>


                                            {/* Status */}
                                            <td>
                                                {achievement.is_active ? (
                                                    <span className="badge badge-success badge-outline">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-ghost">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>


                                            {/* Actions */}
                                            <td>
                                                <div className="flex justify-end gap-1">

                                                    {/* View */}
                                                    <button
                                                        type="button"
                                                        title="View"
                                                        onClick={() =>
                                                            openViewModal(
                                                                achievement
                                                            )
                                                        }
                                                        className="btn btn-square btn-sm text-[#584140] hover:bg-[#911824]/10 hover:text-[#911824]"
                                                    >
                                                        <FaEye />
                                                    </button>


                                                    {/* Edit */}
                                                    <button
                                                        type="button"
                                                        title="Edit"
                                                        onClick={() =>
                                                            openEditModal(
                                                                achievement
                                                            )
                                                        }
                                                        className="btn btn-square btn-sm text-[#584140] hover:bg-[#911824]/10 hover:text-[#911824]"
                                                    >
                                                        <FaEdit />
                                                    </button>


                                                    {/* Delete */}
                                                    <button
                                                        type="button"
                                                        title="Delete"
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                achievement
                                                            )
                                                        }
                                                        className="btn btn-square btn-sm text-error hover:bg-error/10"
                                                    >
                                                        <FaTrash />
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    )
                                )}
                            </tbody>

                        </table>
                    </div>
                )}
            </div>


            {/* =====================================================
                VIEW MODAL
            ===================================================== */}

            {selectedAchievement && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">

                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-[#584140]">
                                    {
                                        selectedAchievement.title
                                    }
                                </h3>

                                <p className="mt-1 text-sm text-[#584140]/60">
                                    Achievement / Award
                                    Details
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeViewModal
                                }
                                className="btn btn-sm btn-circle btn-ghost"
                            >
                                <FaTimes />
                            </button>
                        </div>


                        {/* Image */}
                        {selectedAchievement.image_url && (
                            <div className="relative mt-6 h-56 w-full overflow-hidden rounded-xl border border-base-200 bg-[#FBF9F9]">
                                <Image
                                    src={
                                        selectedAchievement.image_url
                                    }
                                    alt={
                                        selectedAchievement.title
                                    }
                                    fill
                                    sizes="(max-width: 768px) 100vw, 672px"
                                    className="object-contain p-5"
                                />
                            </div>
                        )}


                        {/* Details */}
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <div className="rounded-lg bg-[#FBF9F9] p-4">
                                <p className="text-xs text-[#584140]/50">
                                    Type
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {formatType(
                                        selectedAchievement.type
                                    )}
                                </p>
                            </div>


                            <div className="rounded-lg bg-[#FBF9F9] p-4">
                                <p className="text-xs text-[#584140]/50">
                                    Award Date
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {formatDate(
                                        selectedAchievement.award_date
                                    )}
                                </p>
                            </div>


                            <div className="rounded-lg bg-[#FBF9F9] p-4">
                                <p className="text-xs text-[#584140]/50">
                                    Issuing Organization
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {
                                        selectedAchievement.issuing_organization ||
                                        "—"
                                    }
                                </p>
                            </div>


                            <div className="rounded-lg bg-[#FBF9F9] p-4">
                                <p className="text-xs text-[#584140]/50">
                                    Status
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {selectedAchievement.is_active
                                        ? "Active"
                                        : "Inactive"}
                                </p>
                            </div>

                        </div>


                        {/* Description */}
                        {selectedAchievement.description && (
                            <div className="mt-5">
                                <p className="text-sm font-semibold text-[#584140]">
                                    Description
                                </p>

                                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#584140]/70">
                                    {
                                        selectedAchievement.description
                                    }
                                </p>
                            </div>
                        )}


                        {/* Website */}
                        {selectedAchievement.website_url && (
                            <div className="mt-5">
                                <a
                                    href={
                                        selectedAchievement.website_url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-[#911824] hover:underline"
                                >
                                    Visit Website
                                    <FaExternalLinkAlt className="text-xs" />
                                </a>
                            </div>
                        )}


                        {/* Footer */}
                        <div className="modal-action">
                            <button
                                type="button"
                                onClick={
                                    closeViewModal
                                }
                                className="btn"
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    closeViewModal();

                                    openEditModal(
                                        selectedAchievement
                                    );
                                }}
                                className="btn border-[#911824] bg-[#911824] text-white hover:border-[#86000D] hover:bg-[#86000D]"
                            >
                                <FaEdit />
                                Edit
                            </button>
                        </div>

                    </div>

                    <div
                        className="modal-backdrop"
                        onClick={
                            closeViewModal
                        }
                    />
                </div>
            )}


            {/* =====================================================
                EDIT MODAL
            ===================================================== */}

            {editingAchievement && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl">

                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-[#584140]">
                                    Edit Achievement
                                </h3>

                                <p className="mt-1 text-sm text-[#584140]/60">
                                    Update achievement or
                                    award information.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    closeEditModal
                                }
                                className="btn btn-sm btn-circle btn-ghost"
                                disabled={
                                    editLoading
                                }
                            >
                                <FaTimes />
                            </button>
                        </div>


                        <form
                            onSubmit={
                                handleEditSubmit
                            }
                            className="mt-6 space-y-5"
                        >

                            {/* Title + Type */}
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

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
                                            editForm.title
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                                        required
                                    />
                                </div>


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
                                            editForm.type
                                        }
                                        onChange={
                                            handleEditChange
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
                                            editForm.issuing_organization
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        placeholder="e.g. Punjab Healthcare Commission"
                                        className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                                    />
                                </div>


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
                                            editForm.award_date
                                        }
                                        onChange={
                                            handleEditChange
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
                                        editForm.website_url
                                    }
                                    onChange={
                                        handleEditChange
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
                                        editForm.description
                                    }
                                    onChange={
                                        handleEditChange
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
                                        handleEditImageChange
                                    }
                                    className="file-input file-input-bordered w-full"
                                />

                                <p className="mt-2 text-xs text-[#584140]/50">
                                    PNG, JPG, JPEG or
                                    WebP. Maximum
                                    size: 5MB.
                                </p>


                                {editImagePreview && (
                                    <div className="mt-4">
                                        <p className="mb-2 text-sm font-medium text-[#584140]">
                                            Image Preview
                                        </p>

                                        <div className="relative h-36 w-full overflow-hidden rounded-xl border border-base-200 bg-[#FBF9F9] sm:w-52">
                                            <Image
                                                src={
                                                    editImagePreview
                                                }
                                                alt="Achievement preview"
                                                fill
                                                sizes="208px"
                                                className="object-contain p-3"
                                            />
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
                                            Active records
                                            are displayed
                                            on the public
                                            website.
                                        </p>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={
                                            editForm.is_active
                                        }
                                        onChange={
                                            handleEditActiveChange
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
                                        closeEditModal
                                    }
                                    disabled={
                                        editLoading
                                    }
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        editLoading
                                    }
                                    className="btn border-[#911824] bg-[#911824] text-white hover:border-[#86000D] hover:bg-[#86000D]"
                                >
                                    {editLoading ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <FaEdit />
                                            Update Achievement
                                        </>
                                    )}
                                </button>

                            </div>

                        </form>
                    </div>

                    <div
                        className="modal-backdrop"
                        onClick={() => {
                            if (!editLoading) {
                                closeEditModal();
                            }
                        }}
                    />
                </div>
            )}


            {/* =====================================================
                DELETE MODAL
            ===================================================== */}

            {deletingAchievement && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-md">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
                            <FaTrash />
                        </div>

                        <h3 className="mt-4 text-xl font-bold text-[#584140]">
                            Delete Achievement?
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#584140]/70">
                            Are you sure you want to
                            delete{" "}
                            <strong>
                                {
                                    deletingAchievement.title
                                }
                            </strong>
                            ? This action cannot be
                            undone.
                        </p>


                        <div className="modal-action">

                            <button
                                type="button"
                                onClick={
                                    closeDeleteModal
                                }
                                disabled={
                                    deleteLoading
                                }
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleDelete
                                }
                                disabled={
                                    deleteLoading
                                }
                                className="btn btn-error text-white"
                            >
                                {deleteLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FaTrash />
                                        Delete
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                    <div
                        className="modal-backdrop"
                        onClick={() => {
                            if (!deleteLoading) {
                                closeDeleteModal();
                            }
                        }}
                    />
                </div>
            )}
        </>
    );
}


/*
 * Small trophy icon component.
 * Kept separate so the main component stays readable.
 */
function FaTrophyIcon() {
    return (
        <span className="text-xl">
            ★
        </span>
    );
}


export default AchievementsAwardsList;