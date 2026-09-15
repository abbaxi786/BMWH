"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    FiEye,
    FiEdit2,
    FiTrash2,
} from "react-icons/fi";

interface Department {
    id: number;
    name: string;
}

export interface DepartmentService {
    id: number;
    department_id: number;
    name: string;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
}

interface DepartmentFacilitiesListProps {
    onEdit: (service: DepartmentService) => void;
}

function DepartmentFacilitiesList({
    onEdit,
}: DepartmentFacilitiesListProps) {
    const [departments, setDepartments] =
        useState<Department[]>([]);

    const [services, setServices] =
        useState<DepartmentService[]>([]);

    const [selectedDepartment, setSelectedDepartment] =
        useState<string>("");

    const [selectedService, setSelectedService] =
        useState<DepartmentService | null>(null);

    const [deleteService, setDeleteService] =
        useState<DepartmentService | null>(null);

    const [loadingDepartments, setLoadingDepartments] =
        useState(true);

    const [loadingServices, setLoadingServices] =
        useState(false);

    const [deleting, setDeleting] =
        useState(false);

    const [error, setError] =
        useState("");

    /*
    |--------------------------------------------------------------------------
    | Get departments
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
                    setDepartments(
                        response.data.data
                    );
                } else {
                    setError(
                        response.data.message ||
                            "Failed to fetch departments"
                    );
                }
            } catch (error: any) {
                console.error(error);

                setError(
                    error?.response?.data?.message ||
                        "Failed to fetch departments"
                );
            } finally {
                setLoadingDepartments(false);
            }
        }

        getDepartments();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Get services
    |--------------------------------------------------------------------------
    */

    async function getServices(
        departmentId: string
    ) {
        if (!departmentId) {
            setServices([]);
            return;
        }

        try {
            setLoadingServices(true);
            setError("");

            const response = await axios.get(
                `/api/department_services?department_id=${departmentId}`
            );

            if (response.data.success) {
                setServices(
                    response.data.data
                );
            } else {
                setError(
                    response.data.message ||
                        "Failed to fetch department services"
                );

                setServices([]);
            }
        } catch (error: any) {
            console.error(error);

            setError(
                error?.response?.data?.message ||
                    "Failed to fetch department services"
            );

            setServices([]);
        } finally {
            setLoadingServices(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Get services when department changes
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!selectedDepartment) {
            setServices([]);
            return;
        }

        getServices(selectedDepartment);
    }, [selectedDepartment]);

    /*
    |--------------------------------------------------------------------------
    | Delete service
    |--------------------------------------------------------------------------
    */

    async function handleDelete() {
        if (!deleteService) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await axios.delete(
                `/api/department_services?id=${deleteService.id}`
            );

            /*
             * Close confirmation modal
             */
            setDeleteService(null);

            /*
             * If the deleted service was being viewed,
             * also close the view modal.
             */
            if (
                selectedService?.id ===
                deleteService.id
            ) {
                setSelectedService(null);
            }

            /*
             * Refresh services
             */
            await getServices(
                selectedDepartment
            );
        } catch (error: any) {
            console.error(
                "Failed to delete department service:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to delete department service"
            );
        } finally {
            setDeleting(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Loading departments
    |--------------------------------------------------------------------------
    */

    if (loadingDepartments) {
        return (
            <div className="flex w-full justify-center py-12">
                <span className="loading loading-spinner loading-md text-[#911824]" />
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <>
            <div className="w-full space-y-6">

                {/* Department Selector */}
                <div className="rounded-box bg-base-100 p-5 shadow-md">

                    <div className="mb-3">
                        <h2 className="text-lg font-semibold text-[#584140]">
                            Select Department
                        </h2>

                        <p className="mt-1 text-xs text-[#584140]/60">
                            Select a department to view its services.
                        </p>
                    </div>

                    <select
                        value={selectedDepartment}
                        onChange={(e) =>
                            setSelectedDepartment(
                                e.target.value
                            )
                        }
                        className="select select-bordered w-full max-w-md focus:border-[#911824] focus:outline-none"
                    >
                        <option value="">
                            Select department
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

                {/* Error */}
                {error && (
                    <div className="rounded-box bg-base-100 p-6 shadow-md">
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                )}

                {/* No Department Selected */}
                {!selectedDepartment &&
                    !error && (
                        <div className="rounded-box bg-base-100 p-8 text-center shadow-md">
                            <p className="text-sm text-[#584140]/70">
                                Select a department to view its services.
                            </p>
                        </div>
                    )}

                {/* Loading Services */}
                {selectedDepartment &&
                    loadingServices && (
                        <div className="flex w-full justify-center py-12">
                            <span className="loading loading-spinner loading-md text-[#911824]" />
                        </div>
                    )}

                {/* No Services */}
                {selectedDepartment &&
                    !loadingServices &&
                    !error &&
                    services.length === 0 && (
                        <div className="rounded-box bg-base-100 p-8 text-center shadow-md">
                            <p className="text-sm text-[#584140]">
                                No services found for this department.
                            </p>
                        </div>
                    )}

                {/* Services List */}
                {selectedDepartment &&
                    !loadingServices &&
                    services.length > 0 && (
                        <div className="w-full">

                            <ul className="list rounded-box bg-base-100 shadow-md">

                                {/* Header */}
                                <li className="p-4 pb-2">
                                    <div className="flex items-center justify-between gap-4">

                                        <div>
                                            <h2 className="text-lg font-semibold text-[#584140]">
                                                Department Services
                                            </h2>

                                            <p className="text-xs opacity-60">
                                                {
                                                    departments.find(
                                                        (
                                                            department
                                                        ) =>
                                                            department.id ===
                                                            Number(
                                                                selectedDepartment
                                                            )
                                                    )?.name
                                                }
                                            </p>
                                        </div>

                                        <div className="badge badge-outline shrink-0">
                                            {
                                                services.length
                                            }{" "}
                                            Services
                                        </div>

                                    </div>
                                </li>

                                {/* Services */}
                                {services.map(
                                    (service) => (
                                        <li
                                            key={
                                                service.id
                                            }
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
                                                            {service.name
                                                                ?.charAt(
                                                                    0
                                                                )
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
                                                    Service #
                                                    {
                                                        service.id
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

                                                {/* Status */}
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

                                                {/* View */}
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
                                                            service
                                                        )
                                                    }
                                                    className="btn btn-square btn-ghost text-[#584140]"
                                                    title="Edit service"
                                                    aria-label={`Edit ${service.name}`}
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
                                                        setDeleteService(
                                                            service
                                                        )
                                                    }
                                                    className="btn btn-square btn-ghost text-red-600"
                                                    title="Delete service"
                                                    aria-label={`Delete ${service.name}`}
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
                        </div>
                    )}
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* View Modal */}
            {/* ---------------------------------------------------------------- */}

            {selectedService && (
                <dialog
                    open
                    className="modal modal-bottom sm:modal-middle"
                >
                    <div className="modal-box max-w-2xl">

                        {/* Modal Header */}
                        <div className="flex items-start justify-between gap-4">

                            <div>
                                <h3 className="text-xl font-bold text-[#584140]">
                                    {
                                        selectedService.name
                                    }
                                </h3>

                                <p className="mt-1 text-sm text-[#584140]/60">
                                    Department Service
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

                        {/* Details */}
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Department
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {
                                        departments.find(
                                            (
                                                department
                                            ) =>
                                                department.id ===
                                                selectedService.department_id
                                        )?.name ||
                                        "Unknown Department"
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Service ID
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    #
                                    {
                                        selectedService.id
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
                                {
                                    selectedService.description ||
                                    "No description provided."
                                }
                            </p>

                        </div>

                        {/* Close */}
                        <div className="modal-action">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedService(
                                        null
                                    )
                                }
                                className="btn bg-[#911824] text-white hover:bg-[#760f19]"
                            >
                                Close
                            </button>
                        </div>

                    </div>

                    {/* Click Outside */}
                    <form
                        method="dialog"
                        className="modal-backdrop"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setSelectedService(
                                    null
                                )
                            }
                        >
                            close
                        </button>
                    </form>
                </dialog>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* Delete Confirmation Modal */}
            {/* ---------------------------------------------------------------- */}

            {deleteService && (
                <dialog
                    open
                    className="modal modal-bottom sm:modal-middle"
                >
                    <div className="modal-box max-w-md">

                        {/* Icon */}
                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100">
                            <FiTrash2
                                size={22}
                                className="text-red-600"
                            />
                        </div>

                        {/* Content */}
                        <div className="mt-5 text-center">

                            <h3 className="text-lg font-bold text-[#584140]">
                                Delete Department Service?
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-[#584140]/70">
                                Are you sure you want to delete{" "}
                                <span className="font-semibold text-[#584140]">
                                    {deleteService.name}
                                </span>
                                ?
                            </p>

                            <p className="mt-2 text-xs text-red-600">
                                This action cannot be undone.
                            </p>

                        </div>

                        {/* Actions */}
                        <div className="modal-action justify-center">

                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteService(
                                        null
                                    )
                                }
                                disabled={deleting}
                                className="btn border-[#E0BFBD]/50 bg-white text-[#584140] hover:bg-[#FBF9F9]"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="btn border-red-600 bg-red-600 text-white hover:bg-red-700"
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

                    {/* Click Outside */}
                    <form
                        method="dialog"
                        className="modal-backdrop"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setDeleteService(
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

export default DepartmentFacilitiesList;
