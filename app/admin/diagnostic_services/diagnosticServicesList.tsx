"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

import {
    FiEye,
    FiEdit2,
    FiTrash2,
} from "react-icons/fi";

export interface DiagnosticService {
    id: number;
    name: string;
    category: string;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
}

interface DiagnosticServicesListProps {
    onEdit: (service: DiagnosticService) => void;
}

function DiagnosticServicesList({
    onEdit,
}: DiagnosticServicesListProps) {

    const [services, setServices] = useState<
        DiagnosticService[]
    >([]);

    // View modal
    const [selectedService, setSelectedService] =
        useState<DiagnosticService | null>(null);

    // Delete modal
    const [deleteService, setDeleteService] =
        useState<DiagnosticService | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [deleting, setDeleting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [deleteError, setDeleteError] =
        useState("");


    // ======================================================
    // FETCH SERVICES
    // ======================================================

    async function getDiagnosticServices() {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "/api/diagnostic_services"
            );

            if (response.data.success) {
                setServices(
                    response.data.data
                );
            } else {
                setError(
                    response.data.message ||
                    "Failed to fetch diagnostic services."
                );
            }

        } catch (error: any) {

            console.error(error);

            setError(
                error?.response?.data?.message ||
                "Failed to fetch diagnostic services."
            );

        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        getDiagnosticServices();
    }, []);


    // ======================================================
    // DELETE SERVICE
    // ======================================================

    async function handleDelete() {

        if (!deleteService) {
            return;
        }

        try {
            setDeleting(true);
            setDeleteError("");

            await axios.delete(
                `/api/diagnostic_services/${deleteService.id}`
            );

            // Remove deleted service immediately
            setServices((currentServices) =>
                currentServices.filter(
                    (service) =>
                        service.id !==
                        deleteService.id
                )
            );

            // Close delete modal
            setDeleteService(null);

        } catch (error: any) {

            console.error(error);

            setDeleteError(
                error?.response?.data?.message ||
                "Failed to delete diagnostic service."
            );

        } finally {
            setDeleting(false);
        }
    }


    // ======================================================
    // LOADING
    // ======================================================

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
                    services.length === 0 && (
                        <div className="rounded-box bg-base-100 p-8 text-center shadow-md">

                            <p className="text-sm text-[#584140]/70">
                                No diagnostic services found.
                            </p>

                        </div>
                    )}


                {/* List */}
                {!error &&
                    services.length > 0 && (

                        <ul className="list bg-base-100 rounded-box shadow-md">

                            {/* Header */}
                            <li className="p-4 pb-2">

                                <div className="flex items-center justify-between gap-4">

                                    <div>

                                        <h2 className="text-lg font-semibold text-[#584140]">
                                            Diagnostic Services
                                        </h2>

                                        <p className="mt-1 text-xs text-[#584140]/60">
                                            Manage hospital diagnostic and laboratory services.
                                        </p>

                                    </div>

                                    <div className="badge badge-outline shrink-0">
                                        {services.length} Services
                                    </div>

                                </div>

                            </li>


                            {/* Services */}
                            {services.map(
                                (service) => (

                                    <li
                                        key={service.id}
                                        className="list-row"
                                    >

                                        {/* Image */}
                                        <div>

                                            {service.image_url ? (

                                                <Image
                                                    src={
                                                        service.image_url
                                                    }
                                                    alt={
                                                        service.name
                                                    }
                                                    width={56}
                                                    height={56}
                                                    className="size-14 rounded-box object-cover"
                                                />

                                            ) : (

                                                <div className="flex size-14 items-center justify-center rounded-box bg-[#f8e8e9]">

                                                    <span className="text-xl font-semibold text-[#911824]">
                                                        {service.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </span>

                                                </div>

                                            )}

                                        </div>


                                        {/* Name */}
                                        <div className="min-w-0">

                                            <div className="truncate font-semibold text-[#584140]">
                                                {
                                                    service.name
                                                }
                                            </div>

                                            <div className="mt-1 text-xs text-[#911824]">
                                                {
                                                    service.category
                                                }
                                            </div>

                                        </div>


                                        {/* Description */}
                                        <p className="list-col-wrap text-xs opacity-70">
                                            {service.description ||
                                                "No description provided"}
                                        </p>


                                        {/* Status + Actions */}
                                        <div className="flex shrink-0 items-center justify-end gap-1 whitespace-nowrap">

                                            <span
                                                className={`badge badge-sm mr-2 ${
                                                    service.is_active
                                                        ? "badge-success"
                                                        : "badge-error"
                                                }`}
                                            >
                                                {service.is_active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>


                                            {/* VIEW */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedService(
                                                        service
                                                    )
                                                }
                                                className="btn btn-square btn-ghost text-[#911824]"
                                                title="View service"
                                                aria-label={`View ${service.name}`}
                                            >
                                                <FiEye
                                                    size={18}
                                                />
                                            </button>


                                            {/* EDIT */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit(
                                                        service
                                                    )
                                                }
                                                className="btn btn-square btn-ghost text-[#584140]"
                                                title="Edit service"
                                                aria-label={`Edit ${service.name}`}
                                            >
                                                <FiEdit2
                                                    size={18}
                                                />
                                            </button>


                                            {/* DELETE */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDeleteError("");
                                                    setDeleteService(
                                                        service
                                                    );
                                                }}
                                                className="btn btn-square btn-ghost text-red-600"
                                                title="Delete service"
                                                aria-label={`Delete ${service.name}`}
                                            >
                                                <FiTrash2
                                                    size={18}
                                                />
                                            </button>

                                        </div>

                                    </li>

                                )
                            )}

                        </ul>

                    )}

            </div>


            {/* ==================================================
                VIEW MODAL
            ================================================== */}

            {selectedService && (

                <dialog
                    open
                    className="modal modal-bottom sm:modal-middle"
                >

                    <div className="modal-box max-w-2xl">

                        <div className="flex items-start justify-between gap-4">

                            <div>

                                <h3 className="text-xl font-bold text-[#584140]">
                                    {
                                        selectedService.name
                                    }
                                </h3>

                                <p className="mt-1 text-sm text-[#584140]/60">
                                    Diagnostic Service
                                </p>

                            </div>

                            <span
                                className={`badge ${
                                    selectedService.is_active
                                        ? "badge-success"
                                        : "badge-error"
                                }`}
                            >
                                {selectedService.is_active
                                    ? "Active"
                                    : "Inactive"}
                            </span>

                        </div>


                        {/* Image */}
                        {selectedService.image_url && (

                            <div className="mt-5">

                                <Image
                                    src={
                                        selectedService.image_url
                                    }
                                    alt={
                                        selectedService.name
                                    }
                                    width={800}
                                    height={400}
                                    className="h-56 w-full rounded-xl object-cover"
                                />

                            </div>

                        )}


                        {/* ID + Category */}
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Service ID
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    #{selectedService.id}
                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Category
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {
                                        selectedService.category
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
                                {selectedService.description ||
                                    "No description provided."}
                            </p>

                        </div>


                        {/* Actions */}
                        <div className="modal-action">

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedService(null)
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
                                setSelectedService(null)
                            }
                        >
                            close
                        </button>
                    </form>

                </dialog>

            )}


            {/* ==================================================
                DELETE CONFIRMATION MODAL
            ================================================== */}

            {deleteService && (

                <dialog
                    open
                    className="modal modal-bottom sm:modal-middle"
                >

                    <div className="modal-box max-w-md">

                        {/* Icon */}
                        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-100">

                            <FiTrash2
                                size={24}
                                className="text-red-600"
                            />

                        </div>


                        {/* Heading */}
                        <h3 className="mt-5 text-center text-xl font-bold text-[#584140]">
                            Delete Diagnostic Service?
                        </h3>


                        {/* Message */}
                        <p className="mt-3 text-center text-sm leading-6 text-[#584140]/70">

                            Do you want to delete{" "}

                            <span className="font-semibold text-[#584140]">
                                "{deleteService.name}"
                            </span>

                            ?

                            <br />

                            This action cannot be undone.

                        </p>


                        {/* Error */}
                        {deleteError && (

                            <div className="mt-4 rounded-lg bg-red-50 p-3">

                                <p className="text-center text-sm text-red-600">
                                    {deleteError}
                                </p>

                            </div>

                        )}


                        {/* Buttons */}
                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() => {
                                    if (!deleting) {
                                        setDeleteService(
                                            null
                                        );
                                        setDeleteError("");
                                    }
                                }}
                                className="btn btn-ghost"
                                disabled={deleting}
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                onClick={handleDelete}
                                className="btn bg-red-600 text-white hover:bg-red-700"
                                disabled={deleting}
                            >

                                {deleting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FiTrash2
                                            size={17}
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
                            onClick={() => {
                                if (!deleting) {
                                    setDeleteService(
                                        null
                                    );
                                }
                            }}
                        >
                            close
                        </button>
                    </form>

                </dialog>

            )}

        </>
    );
}

export default DiagnosticServicesList;