"use client";

import {
    ChangeEvent,
    useEffect,
    useState,
} from "react";
import Image from "next/image";
import axios from "axios";

import {
    FiEye,
    FiEdit2,
    FiTrash2,
    FiExternalLink,
} from "react-icons/fi";

export interface HealthPartner {
    id: number;
    name: string;
    type: string | null;
    partnership_type: string | null;
    description: string | null;
    logo_url: string | null;
    website_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface EditFormData {
    name: string;
    type: string;
    partnership_type: string;
    description: string;
    website_url: string;
    is_active: boolean;
}

function HealthPartnersList() {
    const [partners, setPartners] = useState<
        HealthPartner[]
    >([]);

    const [loading, setLoading] = useState(true);

    // View
    const [selectedPartner, setSelectedPartner] =
        useState<HealthPartner | null>(null);

    // Edit
    const [editingPartner, setEditingPartner] =
        useState<HealthPartner | null>(null);

    const [editForm, setEditForm] =
        useState<EditFormData>({
            name: "",
            type: "",
            partnership_type: "",
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
    const [deletingPartner, setDeletingPartner] =
        useState<HealthPartner | null>(null);

    const [deleteLoading, setDeleteLoading] =
        useState(false);

    // Messages
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Fetch health partners
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        fetchHealthPartners();
    }, []);

    async function fetchHealthPartners() {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "/api/health_partners"
            );

            if (response.data.success) {
                setPartners(response.data.data);
            }
        } catch (error) {
            console.error(
                "Error fetching health partners:",
                error
            );

            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                        "Failed to fetch health partners."
                );
            } else {
                setError(
                    "Failed to fetch health partners."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Format date
    |--------------------------------------------------------------------------
    */

    function formatDate(date: string) {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
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
    | Open edit modal
    |--------------------------------------------------------------------------
    */

    function openEditModal(
        partner: HealthPartner
    ) {
        setEditingPartner(partner);

        setEditForm({
            name: partner.name || "",
            type: partner.type || "",
            partnership_type:
                partner.partnership_type || "",
            description:
                partner.description || "",
            website_url:
                partner.website_url || "",
            is_active: partner.is_active,
        });

        setEditLogo(null);
        setEditLogoPreview(
            partner.logo_url || null
        );

        setError("");
        setSuccess("");
    }

    /*
    |--------------------------------------------------------------------------
    | Close edit modal
    |--------------------------------------------------------------------------
    */

    function closeEditModal() {
        if (
            editLogoPreview &&
            editLogoPreview.startsWith("blob:")
        ) {
            URL.revokeObjectURL(
                editLogoPreview
            );
        }

        setEditingPartner(null);
        setEditLogo(null);
        setEditLogoPreview(null);
        setEditLoading(false);
    }

    /*
    |--------------------------------------------------------------------------
    | Handle edit form changes
    |--------------------------------------------------------------------------
    */

    function handleEditChange(
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        const { name, value } = event.target;

        setEditForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    }

    /*
    |--------------------------------------------------------------------------
    | Handle edit active toggle
    |--------------------------------------------------------------------------
    */

    function handleEditActiveChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        setEditForm((previous) => ({
            ...previous,
            is_active: event.target.checked,
        }));

        setError("");
        setSuccess("");
    }

    /*
    |--------------------------------------------------------------------------
    | Handle edit logo
    |--------------------------------------------------------------------------
    */

    function handleEditLogoChange(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        setError("");
        setSuccess("");

        // Validate image
        if (!file.type.startsWith("image/")) {
            setError(
                "Please select a valid image file."
            );

            event.target.value = "";
            return;
        }

        // 5MB limit
        if (
            file.size >
            5 * 1024 * 1024
        ) {
            setError(
                "Logo must be less than 5MB."
            );

            event.target.value = "";
            return;
        }

        // Remove old blob preview
        if (
            editLogoPreview &&
            editLogoPreview.startsWith("blob:")
        ) {
            URL.revokeObjectURL(
                editLogoPreview
            );
        }

        const objectUrl =
            URL.createObjectURL(file);

        setEditLogo(file);
        setEditLogoPreview(objectUrl);
    }

    /*
    |--------------------------------------------------------------------------
    | Update health partner
    |--------------------------------------------------------------------------
    */

    async function handleEditSubmit() {
        if (!editingPartner) {
            return;
        }

        if (!editForm.name.trim()) {
            setError(
                "Partner name is required."
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
                "name",
                editForm.name.trim()
            );

            formData.append(
                "type",
                editForm.type.trim()
            );

            formData.append(
                "partnership_type",
                editForm.partnership_type.trim()
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
                String(editForm.is_active)
            );

            // Only send a logo if a new one was selected
            if (editLogo) {
                formData.append(
                    "logo",
                    editLogo
                );
            }

            const response =
                await axios.put(
                    `/api/health_partners/${editingPartner.id}`,
                    formData
                );

            if (response.data.success) {
                const updatedPartner =
                    response.data.data;

                /*
                |--------------------------------------------------------------------------
                | Update table without refetching
                |--------------------------------------------------------------------------
                */

                setPartners((previous) =>
                    previous.map((partner) =>
                        partner.id ===
                        updatedPartner.id
                            ? updatedPartner
                            : partner
                    )
                );

                /*
                |--------------------------------------------------------------------------
                | Update view modal if it is currently open
                |--------------------------------------------------------------------------
                */

                if (
                    selectedPartner?.id ===
                    updatedPartner.id
                ) {
                    setSelectedPartner(
                        updatedPartner
                    );
                }

                setSuccess(
                    "Health partner updated successfully."
                );

                closeEditModal();
            }
        } catch (error) {
            console.error(
                "Error updating health partner:",
                error
            );

            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                        "Failed to update health partner."
                );
            } else {
                setError(
                    "Failed to update health partner."
                );
            }
        } finally {
            setEditLoading(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Delete health partner
    |--------------------------------------------------------------------------
    */

    async function handleDelete() {
        if (!deletingPartner) {
            return;
        }

        try {
            setDeleteLoading(true);
            setError("");
            setSuccess("");

            const response =
                await axios.delete(
                    `/api/health_partners/${deletingPartner.id}`
                );

            if (response.data.success) {
                /*
                |--------------------------------------------------------------------------
                | Remove from local list
                |--------------------------------------------------------------------------
                */

                setPartners((previous) =>
                    previous.filter(
                        (partner) =>
                            partner.id !==
                            deletingPartner.id
                    )
                );

                /*
                |--------------------------------------------------------------------------
                | Close view modal if same partner
                |--------------------------------------------------------------------------
                */

                if (
                    selectedPartner?.id ===
                    deletingPartner.id
                ) {
                    setSelectedPartner(null);
                }

                setSuccess(
                    "Health partner deleted successfully."
                );

                setDeletingPartner(null);
            }
        } catch (error) {
            console.error(
                "Error deleting health partner:",
                error
            );

            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                        "Failed to delete health partner."
                );
            } else {
                setError(
                    "Failed to delete health partner."
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
            {/* ============================================================
                MAIN LIST
            ============================================================= */}

            <div className="w-full overflow-hidden rounded-xl border border-base-200 bg-white shadow-sm">
                {/* Header */}
                <div className="flex flex-col gap-3 border-b border-base-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-[#584140]">
                            All Health Partners
                        </h2>

                        <p className="text-sm text-[#584140]/60">
                            {partners.length} partner
                            {partners.length !== 1
                                ? "s"
                                : ""}{" "}
                            found
                        </p>
                    </div>
                </div>

                {/* Success message */}
                {success && (
                    <div className="px-5 pt-5">
                        <div className="alert alert-success">
                            <span>
                                {success}
                            </span>
                        </div>
                    </div>
                )}

                {/* Error message */}
                {error && !editingPartner && (
                    <div className="px-5 pt-5">
                        <div className="alert alert-error">
                            <span>
                                {error}
                            </span>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {partners.length === 0 ? (
                    <div className="flex min-h-60 items-center justify-center p-6">
                        <div className="text-center">
                            <p className="font-medium text-[#584140]">
                                No health partners found
                            </p>

                            <p className="mt-1 text-sm text-[#584140]/60">
                                Add your first health
                                partner to display it
                                here.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="text-[#584140]">
                                    <th>
                                        Partner
                                    </th>

                                    <th>
                                        Type
                                    </th>

                                    <th>
                                        Partnership
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
                                {partners.map(
                                    (
                                        partner
                                    ) => (
                                        <tr
                                            key={
                                                partner.id
                                            }
                                            className="hover:bg-[#FBF9F9]"
                                        >
                                            {/* Partner */}
                                            <td>
                                                <div className="flex min-w-55 items-center gap-3">
                                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-base-200 bg-[#FBF9F9]">
                                                        {partner.logo_url ? (
                                                            <Image
                                                                src={
                                                                    partner.logo_url
                                                                }
                                                                alt={
                                                                    partner.name
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
                                                                partner.name
                                                            }
                                                        </p>

                                                        <p className="text-xs text-[#584140]/50">
                                                            ID:{" "}
                                                            {
                                                                partner.id
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Type */}
                                            <td>
                                                <span className="whitespace-nowrap text-sm text-[#584140]">
                                                    {partner.type ||
                                                        "-"}
                                                </span>
                                            </td>

                                            {/* Partnership Type */}
                                            <td>
                                                <span className="whitespace-nowrap text-sm text-[#584140]">
                                                    {partner.partnership_type ||
                                                        "-"}
                                                </span>
                                            </td>

                                            {/* Website */}
                                            <td>
                                                {partner.website_url ? (
                                                    <a
                                                        href={
                                                            partner.website_url
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
                                                <span
                                                    className={`badge badge-sm ${
                                                        partner.is_active
                                                            ? "badge-success"
                                                            : "badge-error"
                                                    }`}
                                                >
                                                    {partner.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td>
                                                <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                                                    {/* View */}
                                                    <button
                                                        type="button"
                                                        title="View partner"
                                                        className="btn btn-ghost btn-sm text-[#911824] hover:bg-[#911824]/10"
                                                        onClick={() => {
                                                            setError(
                                                                ""
                                                            );
                                                            setSuccess(
                                                                ""
                                                            );
                                                            setSelectedPartner(
                                                                partner
                                                            );
                                                        }}
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
                                                        title="Edit partner"
                                                        className="btn btn-ghost btn-sm text-[#584140] hover:bg-[#584140]/10"
                                                        onClick={() =>
                                                            openEditModal(
                                                                partner
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
                                                        title="Delete partner"
                                                        className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                                                        onClick={() => {
                                                            setError(
                                                                ""
                                                            );
                                                            setSuccess(
                                                                ""
                                                            );
                                                            setDeletingPartner(
                                                                partner
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

            {/* ============================================================
                VIEW MODAL
            ============================================================= */}

            {selectedPartner && (
                <dialog
                    open
                    className="modal"
                    onClick={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setSelectedPartner(
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
                                setSelectedPartner(
                                    null
                                )
                            }
                        >
                            ✕
                        </button>

                        {/* Logo */}
                        <div className="mb-6 flex justify-center">
                            <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-base-200 bg-[#FBF9F9]">
                                {selectedPartner.logo_url ? (
                                    <Image
                                        src={
                                            selectedPartner.logo_url
                                        }
                                        alt={
                                            selectedPartner.name
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
                                    selectedPartner.name
                                }
                            </h3>

                            <p className="mt-1 text-sm text-[#584140]/50">
                                Partner ID:{" "}
                                {
                                    selectedPartner.id
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
                                        selectedPartner.type ||
                                        "-"
                                    }
                                </p>
                            </div>

                            <div className="rounded-lg bg-[#FBF9F9] p-4">
                                <p className="text-xs font-medium uppercase tracking-wide text-[#584140]/50">
                                    Partnership Type
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {
                                        selectedPartner.partnership_type ||
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
                                        selectedPartner.is_active
                                            ? "badge-success"
                                            : "badge-error"
                                    }`}
                                >
                                    {selectedPartner.is_active
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
                                        selectedPartner.created_at
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
                                {selectedPartner.description ||
                                    "No description provided."}
                            </p>
                        </div>

                        {/* Website */}
                        {selectedPartner.website_url && (
                            <div className="mt-5">
                                <a
                                    href={
                                        selectedPartner.website_url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn w-full border-[#911824] bg-[#911824] text-white hover:border-[#86000D] hover:bg-[#86000D]"
                                >
                                    Visit Partner Website

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
                                    setSelectedPartner(
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

            {/* ============================================================
                EDIT MODAL
            ============================================================= */}

            {editingPartner && (
                <dialog
                    open
                    className="modal"
                    onClick={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeEditModal();
                        }
                    }}
                >
                    <div className="modal-box max-w-3xl">
                        {/* Header */}
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-[#584140]">
                                    Edit Health Partner
                                </h3>

                                <p className="mt-1 text-sm text-[#584140]/60">
                                    Update partner
                                    information and
                                    settings.
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

                        {/* Error */}
                        {error && (
                            <div className="alert alert-error mb-5">
                                <span>
                                    {error}
                                </span>
                            </div>
                        )}

                        <div className="space-y-5">
                            {/* Name + Type */}
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                {/* Name */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium text-[#584140]">
                                            Partner
                                            Name
                                            <span className="ml-1 text-error">
                                                *
                                            </span>
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
                                        disabled={
                                            editLoading
                                        }
                                        className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
                                    />
                                </div>

                                {/* Type */}
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
                                        disabled={
                                            editLoading
                                        }
                                        className="select select-bordered w-full focus:border-[#911824] focus:outline-none"
                                    >
                                        <option value="">
                                            Select
                                            type
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

                                        <option value="foundation">
                                            Foundation
                                        </option>

                                        <option value="ngo">
                                            NGO
                                        </option>

                                        <option value="government">
                                            Government
                                        </option>

                                        <option value="other">
                                            Other
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Partnership + Website */}
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                {/* Partnership Type */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium text-[#584140]">
                                            Partnership
                                            Type
                                        </span>
                                    </label>

                                    <select
                                        name="partnership_type"
                                        value={
                                            editForm.partnership_type
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        disabled={
                                            editLoading
                                        }
                                        className="select select-bordered w-full focus:border-[#911824] focus:outline-none"
                                    >
                                        <option value="">
                                            Select
                                            partnership
                                        </option>

                                        <option value="strategic">
                                            Strategic
                                            Partnership
                                        </option>

                                        <option value="medical">
                                            Medical
                                            Partnership
                                        </option>

                                        <option value="financial">
                                            Financial
                                            Partnership
                                        </option>

                                        <option value="equipment">
                                            Equipment
                                            Partnership
                                        </option>

                                        <option value="service">
                                            Service
                                            Partnership
                                        </option>

                                        <option value="sponsorship">
                                            Sponsorship
                                        </option>

                                        <option value="other">
                                            Other
                                        </option>
                                    </select>
                                </div>

                                {/* Website */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium text-[#584140]">
                                            Website
                                            URL
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
                                        disabled={
                                            editLoading
                                        }
                                        placeholder="https://example.com"
                                        className="input input-bordered w-full focus:border-[#911824] focus:outline-none"
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
                                        editForm.description
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    disabled={
                                        editLoading
                                    }
                                    rows={5}
                                    className="textarea textarea-bordered w-full resize-y focus:border-[#911824] focus:outline-none"
                                />
                            </div>

                            {/* Logo */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium text-[#584140]">
                                        Partner Logo
                                    </span>
                                </label>

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={
                                        handleEditLogoChange
                                    }
                                    disabled={
                                        editLoading
                                    }
                                    className="file-input file-input-bordered w-full"
                                />

                                <p className="mt-2 text-xs text-[#584140]/50">
                                    Leave empty to
                                    keep the current
                                    logo. Maximum
                                    size: 5MB.
                                </p>

                                {editLogoPreview && (
                                    <div className="mt-4">
                                        <p className="mb-2 text-sm font-medium text-[#584140]">
                                            Logo
                                            Preview
                                        </p>

                                        <div className="relative h-32 w-32 overflow-hidden rounded-xl border border-base-200 bg-[#FBF9F9]">
                                            <Image
                                                src={
                                                    editLogoPreview
                                                }
                                                alt="Partner logo preview"
                                                fill
                                                sizes="128px"
                                                className="object-contain p-3"
                                            />
                                        </div>

                                        {editLogo && (
                                            <p className="mt-2 max-w-xs truncate text-xs text-[#584140]/50">
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
                                <label className="flex cursor-pointer items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium text-[#584140]">
                                            Active
                                            Partner
                                        </p>

                                        <p className="mt-1 text-sm text-[#584140]/60">
                                            Active
                                            partners
                                            are
                                            displayed
                                            on the
                                            public
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
                                        disabled={
                                            editLoading
                                        }
                                        className="toggle border-[#911824] bg-white checked:bg-[#911824]"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="modal-action">
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
                                type="button"
                                onClick={
                                    handleEditSubmit
                                }
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
                                        <FiEdit2
                                            size={
                                                16
                                            }
                                        />
                                        Update
                                        Partner
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </dialog>
            )}

            {/* ============================================================
                DELETE CONFIRMATION MODAL
            ============================================================= */}

            {deletingPartner && (
                <dialog
                    open
                    className="modal"
                    onClick={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setDeletingPartner(
                                null
                            );
                        }
                    }}
                >
                    <div className="modal-box max-w-md">
                        {/* Icon */}
                        <div className="mb-4 flex justify-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
                                <FiTrash2
                                    size={24}
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-[#584140]">
                                Delete Health
                                Partner?
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#584140]/60">
                                Are you sure you
                                want to delete{" "}
                                <span className="font-semibold text-[#584140]">
                                    {
                                        deletingPartner.name
                                    }
                                </span>
                                ? This action cannot
                                be undone.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="modal-action justify-center">
                            <button
                                type="button"
                                className="btn"
                                onClick={() =>
                                    setDeletingPartner(
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
                                className="btn btn-error text-white"
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
                                            size={
                                                16
                                            }
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

export default HealthPartnersList;