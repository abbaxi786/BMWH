"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    FiEye,
    FiEdit2,
    FiTrash2,
} from "react-icons/fi";

export interface HospitalFacility {
    id: number;
    name: string;
    category: string;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
}

interface HospitalFacilitiesListProps {
    onEdit: (facility: HospitalFacility) => void;
}

function HospitalFacilitiesList({
    onEdit,
}: HospitalFacilitiesListProps) {
    const [facilities, setFacilities] = useState<
        HospitalFacility[]
    >([]);

    const [selectedFacility, setSelectedFacility] =
        useState<HospitalFacility | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [deleteLoading, setDeleteLoading] =
        useState<number | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Fetch Facilities
    |--------------------------------------------------------------------------
    */
    async function getFacilities() {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "/api/hospital_facilities"
            );

            if (response.data.success) {
                setFacilities(
                    response.data.data
                );
            } else {
                setError(
                    response.data.message ||
                        "Failed to fetch hospital facilities."
                );
            }
        } catch (error: any) {
            console.error(error);

            setError(
                error?.response?.data?.message ||
                    "Failed to fetch hospital facilities."
            );
        } finally {
            setLoading(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Initial Fetch
    |--------------------------------------------------------------------------
    */
    useEffect(() => {
        getFacilities();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Delete Facility
    |--------------------------------------------------------------------------
    */
    async function handleDelete(
        facility: HospitalFacility
    ) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${facility.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(facility.id);
            setError("");

            const response = await axios.delete(
                `/api/hospital_facilities?facility_id=${facility.id}`
            );

            if (response.data.success) {
                /*
                |--------------------------------------------------------------------------
                | Remove facility from local state
                |--------------------------------------------------------------------------
                */
                setFacilities((currentFacilities) =>
                    currentFacilities.filter(
                        (item) =>
                            item.id !== facility.id
                    )
                );

                /*
                |--------------------------------------------------------------------------
                | Close view modal if deleted facility
                |--------------------------------------------------------------------------
                */
                if (
                    selectedFacility?.id ===
                    facility.id
                ) {
                    setSelectedFacility(null);
                }
            } else {
                setError(
                    response.data.message ||
                        "Failed to delete hospital facility."
                );
            }
        } catch (error: any) {
            console.error(
                "Delete facility error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to delete hospital facility."
            );
        } finally {
            setDeleteLoading(null);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */
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
                    <div className="mb-6 rounded-box bg-base-100 p-6 shadow-md">
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                )}

                {/* Empty */}
                {!error &&
                    facilities.length === 0 && (
                        <div className="rounded-box bg-base-100 p-8 text-center shadow-md">
                            <p className="text-sm text-[#584140]/70">
                                No hospital facilities found.
                            </p>
                        </div>
                    )}

                {/* Facilities */}
                {!error &&
                    facilities.length > 0 && (
                        <ul className="list bg-base-100 rounded-box shadow-md">

                            {/* Header */}
                            <li className="p-4 pb-2">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-[#584140]">
                                            Hospital Facilities
                                        </h2>

                                        <p className="mt-1 text-xs text-[#584140]/60">
                                            Manage hospital facilities and infrastructure.
                                        </p>
                                    </div>

                                    <div className="badge badge-outline shrink-0">
                                        {facilities.length}{" "}
                                        Facilities
                                    </div>
                                </div>
                            </li>

                            {/* Facility Items */}
                            {facilities.map(
                                (facility) => (
                                    <li
                                        key={
                                            facility.id
                                        }
                                        className="list-row"
                                    >
                                        {/* Image */}
                                        <div>
                                            {facility.image_url ? (
                                                <Image
                                                    src={
                                                        facility.image_url
                                                    }
                                                    alt={
                                                        facility.name
                                                    }
                                                    width={
                                                        56
                                                    }
                                                    height={
                                                        56
                                                    }
                                                    className="size-14 rounded-box object-cover"
                                                />
                                            ) : (
                                                <div className="flex size-14 items-center justify-center rounded-box bg-[#f8e8e9]">
                                                    <span className="text-xl font-semibold text-[#911824]">
                                                        {facility.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Name + Category */}
                                        <div className="min-w-0">
                                            <div className="truncate font-semibold text-[#584140]">
                                                {
                                                    facility.name
                                                }
                                            </div>

                                            <div className="mt-1 text-xs text-[#911824]">
                                                {
                                                    facility.category
                                                }
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="list-col-wrap text-xs opacity-70">
                                            {facility.description ||
                                                "No description provided"}
                                        </p>

                                        {/* Status + Actions */}
                                        <div className="flex shrink-0 items-center justify-end gap-1 whitespace-nowrap">

                                            {/* Status */}
                                            <span
                                                className={`badge badge-sm mr-2 ${
                                                    facility.is_active
                                                        ? "badge-success"
                                                        : "badge-error"
                                                }`}
                                            >
                                                {facility.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>

                                            {/* View */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedFacility(
                                                        facility
                                                    )
                                                }
                                                className="btn btn-square btn-ghost text-[#911824]"
                                                title="View facility"
                                                aria-label={`View ${facility.name}`}
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
                                                    onEdit(
                                                        facility
                                                    )
                                                }
                                                className="btn btn-square btn-ghost text-[#584140]"
                                                title="Edit facility"
                                                aria-label={`Edit ${facility.name}`}
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
                                                    handleDelete(
                                                        facility
                                                    )
                                                }
                                                disabled={
                                                    deleteLoading ===
                                                    facility.id
                                                }
                                                className="btn btn-square btn-ghost text-red-600"
                                                title="Delete facility"
                                                aria-label={`Delete ${facility.name}`}
                                            >
                                                {deleteLoading ===
                                                facility.id ? (
                                                    <span className="loading loading-spinner loading-sm" />
                                                ) : (
                                                    <FiTrash2
                                                        size={
                                                            18
                                                        }
                                                    />
                                                )}
                                            </button>
                                        </div>
                                    </li>
                                )
                            )}
                        </ul>
                    )}
            </div>

            {/* ================================================================== */}
            {/* View Modal */}
            {/* ================================================================== */}

            {selectedFacility && (
                <dialog
                    open
                    className="modal modal-bottom sm:modal-middle"
                >
                    <div className="modal-box max-w-2xl">

                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-[#584140]">
                                    {
                                        selectedFacility.name
                                    }
                                </h3>

                                <p className="mt-1 text-sm text-[#584140]/60">
                                    Hospital Facility
                                </p>
                            </div>

                            <span
                                className={`badge ${
                                    selectedFacility.is_active
                                        ? "badge-success"
                                        : "badge-error"
                                }`}
                            >
                                {selectedFacility.is_active
                                    ? "Active"
                                    : "Inactive"}
                            </span>
                        </div>

                        {/* Image */}
                        {selectedFacility.image_url && (
                            <div className="mt-5">
                                <Image
                                    src={
                                        selectedFacility.image_url
                                    }
                                    alt={
                                        selectedFacility.name
                                    }
                                    width={800}
                                    height={400}
                                    className="h-56 w-full rounded-xl object-cover"
                                />
                            </div>
                        )}

                        {/* Information */}
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                            {/* ID */}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Facility ID
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    #
                                    {
                                        selectedFacility.id
                                    }
                                </p>
                            </div>

                            {/* Category */}
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Category
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {
                                        selectedFacility.category
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                Description
                            </p>

                            <p className="mt-2 text-sm leading-6 text-[#584140]/80">
                                {selectedFacility.description ||
                                    "No description provided."}
                            </p>
                        </div>

                        {/* Close */}
                        <div className="modal-action">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedFacility(
                                        null
                                    )
                                }
                                className="btn bg-[#911824] text-white hover:bg-[#760f19]"
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    {/* Modal Backdrop */}
                    <form
                        method="dialog"
                        className="modal-backdrop"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setSelectedFacility(
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

export default HospitalFacilitiesList;