"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import DepartmentViewModal from "./departmentViewModal";

export interface DepartmentData {
    id: number;
    name: string;
    category: string;
    description: string | null;
    slug: string;
    image_url: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

interface DepartmentListProps {
    onEdit: (department: DepartmentData) => void;
}

function Department({ onEdit }: DepartmentListProps) {
    const [departments, setDepartments] = useState<DepartmentData[]>([]);
    const [selectedDepartment, setSelectedDepartment] =
        useState<DepartmentData | null>(null);

    // Department selected for deletion
    const [deleteDepartment, setDeleteDepartment] =
        useState<DepartmentData | null>(null);

    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Get Departments
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        async function getDepartments() {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get("/api/departments");

                if (response.data.success) {
                    setDepartments(response.data.data);
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
                setLoading(false);
            }
        }

        getDepartments();
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Delete Department
    |--------------------------------------------------------------------------
    */

    async function handleDelete() {
        if (!deleteDepartment) {
            return;
        }

        try {
            setDeleting(true);

            await axios.delete(
                `/api/departments/departments?slug=${encodeURIComponent(
                    deleteDepartment.slug
                )}`
            );

            // Remove deleted department from local state
            setDepartments((previous) =>
                previous.filter(
                    (department) =>
                        department.id !== deleteDepartment.id
                )
            );

            // Close confirmation modal
            setDeleteDepartment(null);
        } catch (error: any) {
            console.error(error);

            alert(
                error?.response?.data?.message ||
                    "Failed to delete department"
            );
        } finally {
            setDeleting(false);
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

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error) {
        return (
            <div className="rounded-box bg-base-100 p-8 text-center shadow-md">
                <p className="text-sm text-red-600">
                    {error}
                </p>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Empty
    |--------------------------------------------------------------------------
    */

    if (departments.length === 0) {
        return (
            <div className="rounded-box bg-base-100 p-8 text-center shadow-md">
                <p className="text-sm text-[#584140]">
                    No departments found.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="w-full">
                <ul className="list bg-base-100 rounded-box shadow-md">

                    {/* Header */}
                    <li className="p-4 pb-2">
                        <div className="flex items-center justify-between gap-4">

                            <div>
                                <h2 className="text-lg font-semibold text-[#584140]">
                                    Departments
                                </h2>

                                <p className="text-xs opacity-60">
                                    Hospital clinical departments
                                </p>
                            </div>

                            <div className="badge badge-outline shrink-0">
                                {departments.length} Departments
                            </div>

                        </div>
                    </li>

                    {/* Departments */}
                    {departments.map((department) => (
                        <li
                            key={department.id}
                            className="list-row"
                        >

                            {/* Department Image */}
                            <div>
                                {department.image_url ? (
                                    <Image
                                        src={department.image_url}
                                        alt={department.name}
                                        width={56}
                                        height={56}
                                        className="size-14 rounded-box object-cover"
                                    />
                                ) : (
                                    <div className="flex size-14 items-center justify-center rounded-box bg-[#f8e8e9]">
                                        <span className="text-xl font-semibold text-[#911824]">
                                            {department.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Department Information */}
                            <div className="min-w-0">

                                <div className="truncate font-semibold text-[#584140]">
                                    {department.name}
                                </div>

                                <div className="text-xs uppercase font-semibold opacity-60">
                                    {department.category}
                                </div>

                                <div className="mt-1 truncate text-xs text-[#911824]">
                                    /{department.slug}
                                </div>

                            </div>

                            {/* Description */}
                            <p className="list-col-wrap text-xs opacity-70">
                                {department.description ||
                                    "No description provided"}
                            </p>

                            {/* Status + Actions */}
                            <div className="flex shrink-0 items-center justify-end gap-1 whitespace-nowrap">

                                {/* Status */}
                                <span
                                    className={`badge badge-sm mr-2 ${
                                        department.is_active
                                            ? "badge-success"
                                            : "badge-error"
                                    }`}
                                >
                                    {department.is_active
                                        ? "Active"
                                        : "Inactive"}
                                </span>

                                {/* View Button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedDepartment(
                                            department
                                        )
                                    }
                                    className="btn btn-square btn-ghost text-[#911824]"
                                    title="View department"
                                    aria-label={`View ${department.name}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="size-[1.2em]"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />

                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="3"
                                        />
                                    </svg>
                                </button>

                                {/* Edit Button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        onEdit(department)
                                    }
                                    className="btn btn-square btn-ghost"
                                    title="Edit department"
                                    aria-label={`Edit ${department.name}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="size-[1.2em]"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 20h9"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                                        />
                                    </svg>
                                </button>

                                {/* Delete Button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setDeleteDepartment(
                                            department
                                        )
                                    }
                                    className="btn btn-square btn-ghost text-red-600"
                                    title="Delete department"
                                    aria-label={`Delete ${department.name}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="size-[1.2em]"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 6h18"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8 6V4h8v2"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19 6l-1 14H6L5 6"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10 11v5"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14 11v5"
                                        />
                                    </svg>
                                </button>

                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* View Department Modal */}
            <DepartmentViewModal
                department={selectedDepartment}
                onClose={() =>
                    setSelectedDepartment(null)
                }
            />

            {/* Delete Confirmation Modal */}
            {deleteDepartment && (
                <div className="modal modal-open">
                    <div className="modal-box">

                        <h3 className="text-lg font-bold text-[#584140]">
                            Delete Department?
                        </h3>

                        <p className="py-4 text-sm text-[#584140]/80">
                            Do you want to delete{" "}
                            <span className="font-semibold text-[#911824]">
                                "{deleteDepartment.name}"
                            </span>
                            ?
                        </p>

                        <p className="text-sm text-red-600">
                            This action cannot be undone.
                        </p>

                        <div className="modal-action">

                            {/* Cancel */}
                            <button
                                type="button"
                                className="btn"
                                disabled={deleting}
                                onClick={() =>
                                    setDeleteDepartment(null)
                                }
                            >
                                Cancel
                            </button>

                            {/* Confirm Delete */}
                            <button
                                type="button"
                                className="btn bg-red-600 text-white hover:bg-red-700"
                                disabled={deleting}
                                onClick={handleDelete}
                            >
                                {deleting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete"
                                )}
                            </button>

                        </div>
                    </div>

                    {/* Click outside to close */}
                    <div
                        className="modal-backdrop"
                        onClick={() => {
                            if (!deleting) {
                                setDeleteDepartment(null);
                            }
                        }}
                    />
                </div>
            )}
        </>
    );
}

export default Department;