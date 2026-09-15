"use client";

import Image from "next/image";
import type { DepartmentData } from "./departmentList";

interface DepartmentViewModalProps {
department: DepartmentData | null;
onClose: () => void;
}

function DepartmentViewModal({
department,
onClose,
}: DepartmentViewModalProps) {


if (!department) {
    return null;
}

return (
    <dialog
        open
        className="modal modal-bottom sm:modal-middle"
    >
        <div className="modal-box w-11/12 max-w-3xl p-0 overflow-y-scroll">

            {/* Header */}
            <div className="flex items-center justify-between bg-[#911824] px-6 py-4 text-white">
                <div>
                    <h3 className="text-lg font-semibold">
                        Department Details
                    </h3>

                    <p className="text-xs opacity-80">
                        Complete department information
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/10"
                    aria-label="Close"
                >
                    ✕
                </button>
            </div>

            {/* Content */}
            <div className="p-6">

                {/* Department Profile */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                    {/* Image */}
                    <div className="shrink-0">
                        {department.image_url ? (
                            <Image
                                src={department.image_url}
                                alt={department.name}
                                width={140}
                                height={140}
                                className="size-32 rounded-xl object-cover"
                            />
                        ) : (
                            <div className="flex size-32 items-center justify-center rounded-xl bg-[#f8e8e9]">
                                <span className="text-5xl font-bold text-[#911824]">
                                    {department.name
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Main Information */}
                    <div className="min-w-0">
                        <h2 className="text-2xl font-bold text-[#584140]">
                            {department.name}
                        </h2>

                        <p className="mt-1 text-sm font-medium text-[#911824]">
                            {department.category}
                        </p>

                        <p className="mt-2 text-sm text-[#584140]/70">
                            /{department.slug}
                        </p>

                        <div className="mt-3">
                            <span
                                className={`badge ${
                                    department.is_active
                                        ? "badge-success"
                                        : "badge-error"
                                }`}
                            >
                                {department.is_active
                                    ? "Active"
                                    : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="divider" />

                {/* Department Details */}
                <div className="space-y-5">

                    {/* Category */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                            Category
                        </p>

                        <p className="mt-1 text-sm text-[#584140]">
                            {department.category || "Not provided"}
                        </p>
                    </div>

                    {/* Slug */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                            Slug
                        </p>

                        <p className="mt-1 break-all text-sm text-[#584140]">
                            {department.slug || "Not provided"}
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                            Description
                        </p>

                        <p className="mt-1 whitespace-pre-line text-sm leading-6 text-[#584140]">
                            {department.description ||
                                "No description provided"}
                        </p>
                    </div>

                    {/* Department ID */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                            Department ID
                        </p>

                        <p className="mt-1 text-sm text-[#584140]">
                            {department.id}
                        </p>
                    </div>

                    {/* Status */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-50">
                            Status
                        </p>

                        <p className="mt-1 text-sm text-[#584140]">
                            {department.is_active
                                ? "Active"
                                : "Inactive"}
                        </p>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-base-200 bg-base-50 px-6 py-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="btn bg-[#911824] text-white hover:bg-[#760f19]"
                >
                    Close
                </button>
            </div>
        </div>

        {/* Click outside modal to close */}
        <form
            method="dialog"
            className="modal-backdrop"
            onClick={onClose}
        >
            <button type="button">
                close
            </button>
        </form>
    </dialog>
);


}

export default DepartmentViewModal;
