"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
    FiEdit2,
    FiTrash2,
    FiSearch,
    FiPlus,
    FiRefreshCw,
} from "react-icons/fi";

import type { LabTest } from "./page";

type Props = {
    onEdit: (test: LabTest) => void;
    onAddNew: () => void;
};

export default function LabTestList({
    onEdit,
    onAddNew,
}: Props) {
    const [tests, setTests] = useState<LabTest[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<number | null>(null);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

    const fetchTests = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                "/api/lab_test?admin=true"
            );

            if (response.data?.success) {
                setTests(response.data.labTests || []);
            } else {
                setTests([]);
            }
        } catch (error) {
            console.error("Error fetching lab tests:", error);
            setTests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTests();
    }, []);

    const categories = useMemo(() => {
        return Array.from(
            new Set(tests.map((test) => test.category).filter(Boolean))
        ).sort();
    }, [tests]);

    const filteredTests = useMemo(() => {
        const searchValue = search.toLowerCase().trim();

        return tests.filter((test) => {
            const matchesSearch =
                !searchValue ||
                test.test_name.toLowerCase().includes(searchValue) ||
                test.category.toLowerCase().includes(searchValue) ||
                test.specimen_source
                    .toLowerCase()
                    .includes(searchValue);

            const matchesCategory =
                category === "all" ||
                test.category === category;

            return matchesSearch && matchesCategory;
        });
    }, [tests, search, category]);

    const handleDelete = async (id: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this lab test?"
        );

        if (!confirmed) return;

        try {
            setDeleting(id);

            await axios.delete(`/api/lab_tests?id=${id}`);

            setTests((prev) =>
                prev.filter((test) => test.id !== id)
            );
        } catch (error: any) {
            console.error("Error deleting lab test:", error);

            alert(
                error?.response?.data?.message ||
                    "Failed to delete lab test."
            );
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="rounded-xl border border-[#E0BFBD]/40 bg-white shadow-sm">

            {/* Top Controls */}
            <div className="border-b border-[#E0BFBD]/30 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex flex-1 flex-col gap-3 sm:flex-row">

                        {/* Search */}
                        <div className="relative w-full sm:max-w-md">
                            <FiSearch
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#584140]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search lab tests..."
                                className="
                                    h-10 w-full rounded-lg
                                    border border-[#E0BFBD]
                                    bg-white pl-9 pr-3
                                    text-sm text-[#0B1C30]
                                    outline-none
                                    focus:border-[#911824]
                                    focus:ring-1
                                    focus:ring-[#911824]
                                "
                            />
                        </div>

                        {/* Category */}
                        <select
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                            className="
                                h-10 rounded-lg
                                border border-[#E0BFBD]
                                bg-white px-3
                                text-sm text-[#0B1C30]
                                outline-none
                                focus:border-[#911824]
                                focus:ring-1
                                focus:ring-[#911824]
                            "
                        >
                            <option value="all">
                                All Categories
                            </option>

                            {categories.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="flex items-center gap-2">

                        {/* Refresh */}
                        <button
                            type="button"
                            onClick={fetchTests}
                            disabled={loading}
                            className="
                                flex h-10 items-center
                                justify-center gap-2
                                rounded-lg border
                                border-[#E0BFBD]
                                px-3 text-sm font-medium
                                text-[#584140]
                                transition-colors
                                hover:bg-[#FEF3F2]
                                hover:text-[#911824]
                                disabled:opacity-50
                            "
                        >
                            <FiRefreshCw
                                size={15}
                                className={loading ? "animate-spin" : ""}
                            />
                            <span className="hidden sm:inline">
                                Refresh
                            </span>
                        </button>

                        {/* Add */}
                        <button
                            type="button"
                            onClick={onAddNew}
                            className="
                                flex h-10 items-center
                                justify-center gap-2
                                rounded-lg bg-[#911824]
                                px-4 text-sm font-semibold
                                text-white transition-colors
                                hover:bg-[#75131D]
                            "
                        >
                            <FiPlus size={16} />
                            Add Lab Test
                        </button>

                    </div>
                </div>
            </div>

            {/* Count */}
            <div className="border-b border-[#E0BFBD]/30 px-4 py-3">
                <p className="text-sm text-[#584140]">
                    Showing{" "}
                    <span className="font-semibold text-[#911824]">
                        {filteredTests.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold">
                        {tests.length}
                    </span>{" "}
                    lab tests
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">

                {loading ? (
                    <div className="flex min-h-60 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E0BFBD] border-t-[#911824]" />
                    </div>
                ) : filteredTests.length === 0 ? (
                    <div className="flex min-h-60 flex-col items-center justify-center px-4 text-center">
                        <p className="text-base font-semibold text-[#0B1C30]">
                            No lab tests found
                        </p>

                        <p className="mt-1 text-sm text-[#584140]">
                            Try changing your search or category filter.
                        </p>
                    </div>
                ) : (
                    <table className="w-full min-w-[1000px] text-left">

                        <thead>
                            <tr className="border-b border-[#E0BFBD]/30 bg-[#FEF9F8]">
                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#584140]">
                                    Test Name
                                </th>

                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#584140]">
                                    Category
                                </th>

                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#584140]">
                                    Reporting Time
                                </th>

                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#584140]">
                                    Specimen Source
                                </th>

                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#584140]">
                                    Processing
                                </th>

                                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#584140]">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-[#584140]">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredTests.map((test) => (
                                <tr
                                    key={test.id}
                                    className="border-b border-[#E0BFBD]/20 last:border-0 hover:bg-[#FEF9F8]"
                                >
                                    <td className="px-4 py-4">
                                        <p className="font-semibold text-[#0B1C30]">
                                            {test.test_name}
                                        </p>
                                    </td>

                                    <td className="px-4 py-4">
                                        <span className="rounded-full bg-[#F8E8E7] px-2.5 py-1 text-xs font-medium text-[#911824]">
                                            {test.category}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4 text-sm text-[#584140]">
                                        {test.reporting_time}
                                    </td>

                                    <td className="px-4 py-4 text-sm text-[#584140]">
                                        {test.specimen_source}
                                    </td>

                                    <td className="px-4 py-4 text-sm text-[#584140]">
                                        {test.processing}
                                    </td>

                                    <td className="px-4 py-4">
                                        <span
                                            className={`
                                                rounded-full px-2.5 py-1
                                                text-xs font-semibold
                                                ${
                                                    test.is_active
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                }
                                            `}
                                        >
                                            {test.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="flex justify-end gap-2">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit(test)
                                                }
                                                className="
                                                    flex h-8 w-8
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    border border-[#E0BFBD]
                                                    text-[#584140]
                                                    transition-colors
                                                    hover:bg-[#FEF3F2]
                                                    hover:text-[#911824]
                                                "
                                                title="Edit"
                                            >
                                                <FiEdit2 size={14} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(test.id)
                                                }
                                                disabled={
                                                    deleting === test.id
                                                }
                                                className="
                                                    flex h-8 w-8
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    border border-red-200
                                                    text-red-600
                                                    transition-colors
                                                    hover:bg-red-50
                                                    disabled:opacity-50
                                                "
                                                title="Delete"
                                            >
                                                {deleting === test.id ? (
                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
                                                ) : (
                                                    <FiTrash2 size={14} />
                                                )}
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                )}
            </div>
        </div>
    );
}

