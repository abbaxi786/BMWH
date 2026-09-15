"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import axios from "axios";

import {
    FiEye,
    FiEdit2,
    FiTrash2,
    FiExternalLink,
} from "react-icons/fi";

export interface Supporter {
    id: number;
    name: string;
    type: string | null;
    support_type: string | null;
    description: string | null;
    logo_url: string | null;
    website_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface SupporterFormData {
    name: string;
    type: string;
    support_type: string;
    description: string;
    website_url: string;
    is_active: boolean;
}

function SupportersList() {
    const [supporters, setSupporters] = useState<Supporter[]>([]);
    const [loading, setLoading] = useState(true);

    // View
    const [selectedSupporter, setSelectedSupporter] =
        useState<Supporter | null>(null);

    // Edit
    const [editingSupporter, setEditingSupporter] =
        useState<Supporter | null>(null);

    const [editForm, setEditForm] =
        useState<SupporterFormData>({
            name: "",
            type: "",
            support_type: "",
            description: "",
            website_url: "",
            is_active: true,
        });

    const [editLogo, setEditLogo] =
        useState<File | null>(null);

    const [editLogoPreview, setEditLogoPreview] =
        useState<string | null>(null);

    const [editLoading, setEditLoading] =
        useState(false);

    // Delete
    const [deletingSupporter, setDeletingSupporter] =
        useState<Supporter | null>(null);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    // Messages
    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | Fetch Supporters
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        fetchSupporters();
    }, []);

    async function fetchSupporters() {
        try {
            setLoading(true);
            setError("");

            const response =
                await axios.get(
                    "/api/supporters"
                );

            if (response.data.success) {
                setSupporters(
                    response.data.data
                );
            } else {
                setError(
                    response.data.message ||
                        "Failed to fetch supporters."
                );
            }
        } catch (error: unknown) {
            console.error(
                "Error fetching supporters:",
                error
            );

            if (
                axios.isAxiosError(error)
            ) {
                setError(
                    error.response?.data
                        ?.message ||
                        "Failed to fetch supporters."
                );
            } else {
                setError(
                    "Failed to fetch supporters."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    function formatDate(date: string) {
        if (!date) return "-";

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

    /*
    |--------------------------------------------------------------------------
    | Open Edit Modal
    |--------------------------------------------------------------------------
    */

    function openEditModal(
        supporter: Supporter
    ) {
        setEditingSupporter(
            supporter
        );

        setEditForm({
            name: supporter.name || "",
            type: supporter.type || "",
            support_type:
                supporter.support_type || "",
            description:
                supporter.description || "",
            website_url:
                supporter.website_url || "",
            is_active:
                supporter.is_active,
        });

        setEditLogo(null);
        setEditLogoPreview(
            supporter.logo_url
        );

        setError("");
        setSuccess("");
    }

    /*
    |--------------------------------------------------------------------------
    | Close Edit Modal
    |--------------------------------------------------------------------------
    */

    function closeEditModal() {
        if (editLogoPreview &&
            editLogoPreview.startsWith("blob:")
        ) {
            URL.revokeObjectURL(
                editLogoPreview
            );
        }

        setEditingSupporter(null);

        setEditLogo(null);
        setEditLogoPreview(null);

        setEditForm({
            name: "",
            type: "",
            support_type: "",
            description: "",
            website_url: "",
            is_active: true,
        });

        setError("");
    }

    /*
    |--------------------------------------------------------------------------
    | Handle Edit Form
    |--------------------------------------------------------------------------
    */

    const handleEditChange = (
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

        setEditForm(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | Handle Active Toggle
    |--------------------------------------------------------------------------
    */

    const handleActiveChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        setEditForm(
            (previous) => ({
                ...previous,
                is_active:
                    e.target.checked,
            })
        );

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | Handle New Logo
    |--------------------------------------------------------------------------
    */

    const handleEditLogoChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }

        // Validate image type

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

        // Validate image size

        if (
            file.size >
            5 * 1024 * 1024
        ) {
            setError(
                "Logo size must be less than 5MB."
            );

            e.target.value = "";
            return;
        }

        // Remove previous blob preview

        if (
            editLogoPreview &&
            editLogoPreview.startsWith(
                "blob:"
            )
        ) {
            URL.revokeObjectURL(
                editLogoPreview
            );
        }

        setEditLogo(file);

        setEditLogoPreview(
            URL.createObjectURL(file)
        );

        setError("");
        setSuccess("");
    };

    /*
    |--------------------------------------------------------------------------
    | Remove New Logo
    |--------------------------------------------------------------------------
    */

    function removeEditLogo() {
        if (
            editLogoPreview &&
            editLogoPreview.startsWith(
                "blob:"
            )
        ) {
            URL.revokeObjectURL(
                editLogoPreview
            );
        }

        setEditLogo(null);

        /*
        | Restore existing logo
        */

        setEditLogoPreview(
            editingSupporter?.logo_url ||
                null
        );

        const fileInput =
            document.getElementById(
                "supporter-edit-logo"
            ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Submit Edit
    |--------------------------------------------------------------------------
    */

    async function handleEditSubmit(
        e: FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        if (!editingSupporter) {
            return;
        }

        setError("");
        setSuccess("");

        // Validate name

        if (!editForm.name.trim()) {
            setError(
                "Supporter name is required."
            );

            return;
        }

        setEditLoading(true);

        try {
            const formData =
                new FormData();

            formData.append(
                "name",
                editForm.name.trim()
            );

            formData.append(
                "type",
                editForm.type.trim()
            );

            formData.append(
                "support_type",
                editForm.support_type.trim()
            );

            formData.append(
                "description",
                editForm.description.trim()
            );

            formData.append(
                "website_url",
                editForm.website_url.trim()
            );

            formData.append(
                "is_active",
                String(
                    editForm.is_active
                )
            );

            /*
            | Only append logo if a new
            | logo was selected.
            */

            if (editLogo) {
                formData.append(
                    "logo",
                    editLogo
                );
            }

            const response =
                await axios.put(
                    `/api/supporters/${editingSupporter.id}`,
                    formData
                );

            if (
                response.data?.success
            ) {
                const updatedSupporter =
                    response.data.data;

                /*
                | Update local list
                */

                setSupporters(
                    (previous) =>
                        previous.map(
                            (supporter) =>
                                supporter.id ===
                                updatedSupporter.id
                                    ? updatedSupporter
                                    : supporter
                        )
                );

                /*
                | Update selected supporter
                | if View modal is open.
                */

                if (
                    selectedSupporter?.id ===
                    updatedSupporter.id
                ) {
                    setSelectedSupporter(
                        updatedSupporter
                    );
                }

                /*
                | Close edit modal
                */

                closeEditModal();

                setSuccess(
                    "Supporter updated successfully."
                );
            } else {
                setError(
                    response.data?.message ||
                        "Failed to update supporter."
                );
            }
        } catch (error: unknown) {
            console.error(
                "Error updating supporter:",
                error
            );

            if (
                axios.isAxiosError(error)
            ) {
                setError(
                    error.response?.data
                        ?.message ||
                        "Failed to update supporter."
                );
            } else {
                setError(
                    "Failed to update supporter."
                );
            }
        } finally {
            setEditLoading(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Supporter
    |--------------------------------------------------------------------------
    */

    async function handleDelete() {
        if (!deletingSupporter) {
            return;
        }

        setDeleteLoading(true);
        setError("");
        setSuccess("");

        try {
            const response =
                await axios.delete(
                    `/api/supporters/${deletingSupporter.id}`
                );

            if (
                response.data?.success
            ) {
                /*
                | Remove from local list
                */

                setSupporters(
                    (previous) =>
                        previous.filter(
                            (supporter) =>
                                supporter.id !==
                                deletingSupporter.id
                        )
                );

                /*
                | Close view modal if
                | the same supporter is open.
                */

                if (
                    selectedSupporter?.id ===
                    deletingSupporter.id
                ) {
                    setSelectedSupporter(
                        null
                    );
                }

                setDeletingSupporter(
                    null
                );

                setSuccess(
                    "Supporter deleted successfully."
                );
            } else {
                setError(
                    response.data?.message ||
                        "Failed to delete supporter."
                );
            }
        } catch (error: unknown) {
            console.error(
                "Error deleting supporter:",
                error
            );

            if (
                axios.isAxiosError(error)
            ) {
                setError(
                    error.response?.data
                        ?.message ||
                        "Failed to delete supporter."
                );
            } else {
                setError(
                    "Failed to delete supporter."
                );
            }
        } finally {
            setDeleteLoading(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="flex min-h-60 items-center justify-center">
                <span className="loading loading-spinner loading-lg text-[#911824]" />
            </div>
        );
    }

    return (
        <>
            <div className="w-full overflow-hidden rounded-xl border border-base-200 bg-white shadow-sm">

                {/* =====================================================
                    Header
                ====================================================== */}

                <div className="flex flex-col gap-3 border-b border-base-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-[#584140]">
                            All Supporters
                        </h2>

                        <p className="text-sm text-[#584140]/60">
                            {supporters.length} supporter
                            {supporters.length !== 1
                                ? "s"
                                : ""}{" "}
                            found
                        </p>
                    </div>
                </div>

                {/* =====================================================
                    Messages
                ====================================================== */}

                {success && (
                    <div className="mx-5 mt-5 alert alert-success text-sm">
                        <span>
                            {success}
                        </span>
                    </div>
                )}

                {error && (
                    <div className="mx-5 mt-5 alert alert-error text-sm">
                        <span>
                            {error}
                        </span>
                    </div>
                )}

                {/* =====================================================
                    Empty State
                ====================================================== */}

                {supporters.length === 0 ? (
                    <div className="flex min-h-60 items-center justify-center p-6">
                        <div className="text-center">
                            <p className="font-medium text-[#584140]">
                                No supporters found
                            </p>

                            <p className="mt-1 text-sm text-[#584140]/60">
                                Add your first supporter
                                to display it here.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="text-[#584140]">
                                    <th>
                                        Supporter
                                    </th>

                                    <th>
                                        Type
                                    </th>

                                    <th>
                                        Support Type
                                    </th>

                                    <th>
                                        Website
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th className="text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {supporters.map(
                                    (
                                        supporter
                                    ) => (
                                        <tr
                                            key={
                                                supporter.id
                                            }
                                            className="hover:bg-[#FBF9F9]"
                                        >
                                            {/* Supporter */}

                                            <td>
                                                <div className="flex min-w-55 items-center gap-3">
                                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-base-200 bg-[#FBF9F9]">

                                                        {supporter.logo_url ? (
                                                            <Image
                                                                src={
                                                                    supporter.logo_url
                                                                }
                                                                alt={
                                                                    supporter.name
                                                                }
                                                                fill
                                                                sizes="48px"
                                                                className="object-contain p-1"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#911824]">
                                                                N/A
                                                            </div>
                                                        )}

                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-[#584140]">
                                                            {
                                                                supporter.name
                                                            }
                                                        </p>

                                                        <p className="max-w-60 truncate text-xs text-[#584140]/50">
                                                            ID:{" "}
                                                            {
                                                                supporter.id
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Type */}

                                            <td>
                                                <span className="whitespace-nowrap text-sm text-[#584140]">
                                                    {supporter.type ||
                                                        "-"}
                                                </span>
                                            </td>

                                            {/* Support Type */}

                                            <td>
                                                <span className="whitespace-nowrap text-sm text-[#584140]">
                                                    {
                                                        supporter.support_type ||
                                                        "-"
                                                    }
                                                </span>
                                            </td>

                                            {/* Website */}

                                            <td>
                                                {supporter.website_url ? (
                                                    <a
                                                        href={
                                                            supporter.website_url
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-sm text-[#911824] hover:underline"
                                                    >
                                                        Visit
                                                        Website

                                                        <FiExternalLink
                                                            size={
                                                                13
                                                            }
                                                        />
                                                    </a>
                                                ) : (
                                                    <span className="text-sm text-[#584140]/40">
                                                        -
                                                    </span>
                                                )}
                                            </td>

                                            {/* Status */}

                                            <td>
                                                <div className="flex shrink-0 items-center justify-end gap-1 whitespace-nowrap">
                                                    <span
                                                        className={`badge badge-sm mr-2 ${
                                                            supporter.is_active
                                                                ? "badge-success"
                                                                : "badge-error"
                                                        }`}
                                                    >
                                                        {supporter.is_active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Actions */}

                                            <td>
                                                <div className="flex items-center justify-end gap-1 whitespace-nowrap">

                                                    {/* View */}

                                                    <button
                                                        type="button"
                                                        title="View supporter"
                                                        className="btn btn-ghost btn-sm text-[#911824] hover:bg-[#911824]/10"
                                                        onClick={() =>
                                                            setSelectedSupporter(
                                                                supporter
                                                            )
                                                        }
                                                    >
                                                        <FiEye
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>

                                                    {/* Edit */}

                                                    <button
                                                        type="button"
                                                        title="Edit supporter"
                                                        className="btn btn-ghost btn-sm text-[#584140] hover:bg-[#584140]/10"
                                                        onClick={() =>
                                                            openEditModal(
                                                                supporter
                                                            )
                                                        }
                                                    >
                                                        <FiEdit2
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>

                                                    {/* Delete */}

                                                    <button
                                                        type="button"
                                                        title="Delete supporter"
                                                        className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                                                        onClick={() => {
                                                            setDeletingSupporter(
                                                                supporter
                                                            );

                                                            setError(
                                                                ""
                                                            );
                                                        }}
                                                    >
                                                        <FiTrash2
                                                            size={
                                                                16
                                                            }
                                                        />
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

            {/* =========================================================
                View Modal
            ========================================================== */}

            {selectedSupporter && (
                <dialog
                    open
                    className="modal"
                    onClick={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setSelectedSupporter(
                                null
                            );
                        }
                    }}
                >
                    <div className="modal-box max-w-2xl">

                        {/* Close */}

                        <button
                            type="button"
                            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
                            onClick={() =>
                                setSelectedSupporter(
                                    null
                                )
                            }
                        >
                            ✕
                        </button>

                        {/* Logo */}

                        <div className="mb-6 flex justify-center">
                            <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-base-200 bg-[#FBF9F9]">

                                {selectedSupporter.logo_url ? (
                                    <Image
                                        src={
                                            selectedSupporter.logo_url
                                        }
                                        alt={
                                            selectedSupporter.name
                                        }
                                        fill
                                        sizes="112px"
                                        className="object-contain p-3"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#911824]">
                                        No Logo
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Name */}

                        <div className="mb-6 text-center">
                            <h3 className="text-2xl font-bold text-[#584140]">
                                {
                                    selectedSupporter.name
                                }
                            </h3>

                            <p className="mt-1 text-sm text-[#584140]/50">
                                Supporter ID:{" "}
                                {
                                    selectedSupporter.id
                                }
                            </p>
                        </div>

                        {/* Details */}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <div className="rounded-lg bg-[#FBF9F9] p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-[#584140]/50">
                                    Type
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {
                                        selectedSupporter.type ||
                                        "-"
                                    }
                                </p>
                            </div>

                            <div className="rounded-lg bg-[#FBF9F9] p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-[#584140]/50">
                                    Support Type
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {
                                        selectedSupporter.support_type ||
                                        "-"
                                    }
                                </p>
                            </div>

                            <div className="rounded-lg bg-[#FBF9F9] p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-[#584140]/50">
                                    Status
                                </p>

                                <span
                                    className={`badge mt-1 ${
                                        selectedSupporter.is_active
                                            ? "badge-success"
                                            : "badge-error"
                                    }`}
                                >
                                    {selectedSupporter.is_active
                                        ? "Active"
                                        : "Inactive"}
                                </span>
                            </div>

                            <div className="rounded-lg bg-[#FBF9F9] p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-[#584140]/50">
                                    Created
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {formatDate(
                                        selectedSupporter.created_at
                                    )}
                                </p>
                            </div>

                        </div>

                        {/* Description */}

                        <div className="mt-5 rounded-lg border border-base-200 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-[#584140]/50">
                                Description
                            </p>

                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#584140]">
                                {
                                    selectedSupporter.description ||
                                    "No description provided."
                                }
                            </p>
                        </div>

                        {/* Website */}

                        {selectedSupporter.website_url && (
                            <div className="mt-5">
                                <a
                                    href={
                                        selectedSupporter.website_url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn w-full border-[#911824] bg-[#911824] text-white hover:bg-[#86000D]"
                                >
                                    Visit Supporter Website

                                    <FiExternalLink
                                        size={16}
                                    />
                                </a>
                            </div>
                        )}

                        <div className="modal-action">
                            <button
                                type="button"
                                className="btn"
                                onClick={() =>
                                    setSelectedSupporter(
                                        null
                                    )
                                }
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </dialog>
            )}

            {/* =========================================================
                Edit Modal
            ========================================================== */}

            {editingSupporter && (
                <dialog
                    open
                    className="modal"
                    onClick={(event) => {
                        if (
                            event.target ===
                            event.currentTarget &&
                            !editLoading
                        ) {
                            closeEditModal();
                        }
                    }}
                >
                    <div className="modal-box max-w-3xl">

                        {/* Header */}

                        <div className="mb-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-[#584140]">
                                        Edit Supporter
                                    </h3>

                                    <p className="mt-1 text-sm text-[#584140]/60">
                                        Update supporter information
                                        and logo.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-circle btn-ghost"
                                    onClick={
                                        closeEditModal
                                    }
                                    disabled={
                                        editLoading
                                    }
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Edit Error */}

                        {error && (
                            <div className="mb-5 alert alert-error text-sm">
                                <span>
                                    {error}
                                </span>
                            </div>
                        )}

                        <form
                            onSubmit={
                                handleEditSubmit
                            }
                            className="space-y-5"
                        >

                            {/* Name */}

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-[#584140]">
                                        Supporter Name
                                    </span>
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        editForm.name
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    placeholder="Supporter name"
                                    className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                                    disabled={
                                        editLoading
                                    }
                                    required
                                />
                            </div>

                            {/* Type + Support Type */}

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium text-[#584140]">
                                            Type
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
                                        disabled={
                                            editLoading
                                        }
                                    >
                                        <option value="">
                                            Select type
                                        </option>

                                        <option value="hospital">
                                            Hospital
                                        </option>

                                        <option value="organization">
                                            Organization
                                        </option>

                                        <option value="company">
                                            Company
                                        </option>

                                        <option value="ngo">
                                            NGO
                                        </option>

                                        <option value="individual">
                                            Individual
                                        </option>

                                        <option value="other">
                                            Other
                                        </option>
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium text-[#584140]">
                                            Support Type
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        name="support_type"
                                        value={
                                            editForm.support_type
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        placeholder="e.g. Healthcare Partner"
                                        className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                                        disabled={
                                            editLoading
                                        }
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
                                    disabled={
                                        editLoading
                                    }
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
                                    placeholder="Describe the supporter..."
                                    className="textarea textarea-bordered min-h-32 w-full focus:border-[#911824] focus:outline-none"
                                    disabled={
                                        editLoading
                                    }
                                />
                            </div>

                            {/* Logo */}

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-[#584140]">
                                        Supporter Logo
                                    </span>

                                    <span className="label-text-alt text-[#584140]/50">
                                        Optional · Max 5MB
                                    </span>
                                </label>

                                <input
                                    id="supporter-edit-logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleEditLogoChange
                                    }
                                    className="file-input file-input-bordered w-full"
                                    disabled={
                                        editLoading
                                    }
                                />

                                {editLogoPreview && (
                                    <div className="mt-4">

                                        <div className="relative w-fit">

                                            <img
                                                src={
                                                    editLogoPreview
                                                }
                                                alt="Supporter logo preview"
                                                className="h-32 w-32 rounded-xl border border-base-200 bg-[#FBF9F9] object-contain p-2"
                                            />

                                            {editLogo && (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        removeEditLogo
                                                    }
                                                    className="btn btn-circle btn-sm absolute -right-2 -top-2 bg-white text-red-600 shadow-md hover:bg-red-50"
                                                    disabled={
                                                        editLoading
                                                    }
                                                >
                                                    ✕
                                                </button>
                                            )}

                                        </div>

                                        {editLogo && (
                                            <p className="mt-2 text-xs text-[#584140]/60">
                                                {
                                                    editLogo.name
                                                }
                                            </p>
                                        )}

                                    </div>
                                )}
                            </div>

                            {/* Active */}

                            <div className="rounded-xl border border-base-200 bg-[#FBF9F9] p-4">
                                <div className="flex items-center justify-between gap-4">

                                    <div>
                                        <p className="font-medium text-[#584140]">
                                            Active Supporter
                                        </p>

                                        <p className="mt-1 text-xs text-[#584140]/60">
                                            Inactive supporters
                                            will not appear on
                                            the public website.
                                        </p>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={
                                            editForm.is_active
                                        }
                                        onChange={
                                            handleActiveChange
                                        }
                                        className="toggle border-[#911824] bg-base-200 checked:bg-[#911824]"
                                        disabled={
                                            editLoading
                                        }
                                    />

                                </div>
                            </div>

                            {/* Buttons */}

                            <div className="flex flex-col-reverse justify-end gap-3 border-t border-base-200 pt-5 sm:flex-row">

                                <button
                                    type="button"
                                    className="btn"
                                    onClick={
                                        closeEditModal
                                    }
                                    disabled={
                                        editLoading
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn bg-[#911824] text-white hover:bg-[#760f19]"
                                    disabled={
                                        editLoading
                                    }
                                >
                                    {editLoading ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Supporter"
                                    )}
                                </button>

                            </div>

                        </form>
                    </div>
                </dialog>
            )}

            {/* =========================================================
                Delete Confirmation Modal
            ========================================================== */}

            {deletingSupporter && (
                <dialog
                    open
                    className="modal"
                    onClick={(event) => {
                        if (
                            event.target ===
                            event.currentTarget &&
                            !deleteLoading
                        ) {
                            setDeletingSupporter(
                                null
                            );
                        }
                    }}
                >
                    <div className="modal-box max-w-md">

                        <div className="flex items-start gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                                <FiTrash2
                                    size={20}
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-[#584140]">
                                    Delete Supporter
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-[#584140]/70">
                                    Are you sure you want
                                    to delete{" "}
                                    <span className="font-semibold text-[#584140]">
                                        {
                                            deletingSupporter.name
                                        }
                                    </span>
                                    ?
                                </p>

                                <p className="mt-2 text-xs text-[#584140]/50">
                                    This action will permanently
                                    remove the supporter from the
                                    database.
                                </p>
                            </div>

                        </div>

                        {/* Delete Error */}

                        {error && (
                            <div className="mt-5 alert alert-error text-sm">
                                <span>
                                    {error}
                                </span>
                            </div>
                        )}

                        {/* Buttons */}

                        <div className="modal-action">

                            <button
                                type="button"
                                className="btn"
                                onClick={() =>
                                    setDeletingSupporter(
                                        null
                                    )
                                }
                                disabled={
                                    deleteLoading
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn bg-red-600 text-white hover:bg-red-700"
                                onClick={
                                    handleDelete
                                }
                                disabled={
                                    deleteLoading
                                }
                            >
                                {deleteLoading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FiTrash2
                                            size={15}
                                        />
                                        Delete
                                    </>
                                )}
                            </button>

                        </div>
                    </div>
                </dialog>
            )}
        </>
    );
}

export default SupportersList;