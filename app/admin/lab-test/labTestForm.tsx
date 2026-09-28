"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    FiSave,
    FiX,
} from "react-icons/fi";
import { LabTest } from "./page";

type Props = {
    editingTest: LabTest | null;
    onSuccess: () => void;
    onCancel: () => void;
};

type FormData = {
    test_name: string;
    category: string;
    reporting_time: string;
    specimen_source: string;
    processing: string;
    is_active: boolean;
};

const initialForm: FormData = {
    test_name: "",
    category: "",
    reporting_time: "",
    specimen_source: "",
    processing: "In-house",
    is_active: true,
};

const categories = [
    "Routine Chemistry",
    "Hematology",
    "Serology",
    "Immunology",
    "Microbiology",
    "Hormones",
    "Urinalysis",
    "Stool Examination",
    "Coagulation",
    "Other",
];

const processingOptions = [
    "In-house",
    "Outsourced",
];

export default function LabTestForm({
    editingTest,
    onSuccess,
    onCancel,
}: Props) {
    const [formData, setFormData] =
        useState<FormData>(initialForm);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (editingTest) {
            setFormData({
                test_name: editingTest.test_name || "",
                category: editingTest.category || "",
                reporting_time:
                    editingTest.reporting_time || "",
                specimen_source:
                    editingTest.specimen_source || "",
                processing:
                    editingTest.processing || "In-house",
                is_active:
                    editingTest.is_active ?? true,
            });
        } else {
            setFormData(initialForm);
        }

        setError("");
    }, [editingTest]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");

        if (
            !formData.test_name.trim() ||
            !formData.category.trim() ||
            !formData.reporting_time.trim() ||
            !formData.specimen_source.trim() ||
            !formData.processing.trim()
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);

            if (editingTest) {
                await axios.put(
                    `/api/lab-tests?id=${editingTest.id}`,
                    formData
                );
            } else {
                await axios.post(
                    "/api/lab-tests",
                    formData
                );
            }

            onSuccess();
        } catch (error: any) {
            console.error(
                "Error saving lab test:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to save lab test. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl">

            <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-[#E0BFBD]/40 bg-white shadow-sm"
            >

                {/* Header */}
                <div className="border-b border-[#E0BFBD]/30 px-5 py-4 md:px-6">
                    <h2 className="text-lg font-bold text-[#911824]">
                        {editingTest
                            ? "Edit Lab Test"
                            : "Add Lab Test"}
                    </h2>

                    <p className="mt-1 text-sm text-[#584140]">
                        {editingTest
                            ? "Update the laboratory test information below."
                            : "Enter the details for the new laboratory test."}
                    </p>
                </div>

                {/* Form Body */}
                <div className="space-y-5 p-5 md:p-6">

                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Test Name */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-[#0B1C30]">
                            Test Name
                            <span className="ml-1 text-red-600">*</span>
                        </label>

                        <input
                            type="text"
                            name="test_name"
                            value={formData.test_name}
                            onChange={handleChange}
                            placeholder="e.g. Complete Blood Count"
                            className="
                                h-11 w-full rounded-lg
                                border border-[#E0BFBD]
                                bg-white px-3
                                text-sm text-[#0B1C30]
                                outline-none
                                focus:border-[#911824]
                                focus:ring-1
                                focus:ring-[#911824]
                            "
                        />
                    </div>

                    {/* Category + Reporting Time */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-[#0B1C30]">
                                Category
                                <span className="ml-1 text-red-600">*</span>
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="
                                    h-11 w-full rounded-lg
                                    border border-[#E0BFBD]
                                    bg-white px-3
                                    text-sm text-[#0B1C30]
                                    outline-none
                                    focus:border-[#911824]
                                    focus:ring-1
                                    focus:ring-[#911824]
                                "
                            >
                                <option value="">
                                    Select category
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

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-[#0B1C30]">
                                Reporting Time
                                <span className="ml-1 text-red-600">*</span>
                            </label>

                            <input
                                type="text"
                                name="reporting_time"
                                value={formData.reporting_time}
                                onChange={handleChange}
                                placeholder="e.g. 24 Hrs"
                                className="
                                    h-11 w-full rounded-lg
                                    border border-[#E0BFBD]
                                    bg-white px-3
                                    text-sm text-[#0B1C30]
                                    outline-none
                                    focus:border-[#911824]
                                    focus:ring-1
                                    focus:ring-[#911824]
                                "
                            />
                        </div>

                    </div>

                    {/* Specimen Source */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-[#0B1C30]">
                            Specimen Source
                            <span className="ml-1 text-red-600">*</span>
                        </label>

                        <textarea
                            name="specimen_source"
                            value={formData.specimen_source}
                            onChange={handleChange}
                            rows={3}
                            placeholder="e.g. Serum (clotted vial)"
                            className="
                                w-full rounded-lg
                                border border-[#E0BFBD]
                                bg-white px-3 py-2.5
                                text-sm text-[#0B1C30]
                                outline-none
                                resize-none
                                focus:border-[#911824]
                                focus:ring-1
                                focus:ring-[#911824]
                            "
                        />
                    </div>

                    {/* Processing */}
                    <div>
                        <label className="mb-1.5 block text-sm font-semibold text-[#0B1C30]">
                            Processing
                            <span className="ml-1 text-red-600">*</span>
                        </label>

                        <select
                            name="processing"
                            value={formData.processing}
                            onChange={handleChange}
                            className="
                                h-11 w-full rounded-lg
                                border border-[#E0BFBD]
                                bg-white px-3
                                text-sm text-[#0B1C30]
                                outline-none
                                focus:border-[#911824]
                                focus:ring-1
                                focus:ring-[#911824]
                            "
                        >
                            {processingOptions.map((item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Active Status */}
                    <div className="rounded-lg border border-[#E0BFBD]/40 bg-[#FEF9F8] p-4">
                        <label className="flex cursor-pointer items-center gap-3">

                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        is_active:
                                            e.target.checked,
                                    }))
                                }
                                className="h-4 w-4 accent-[#911824]"
                            />

                            <div>
                                <p className="text-sm font-semibold text-[#0B1C30]">
                                    Active Lab Test
                                </p>

                                <p className="text-xs text-[#584140]">
                                    Active tests are visible on the
                                    public website.
                                </p>
                            </div>

                        </label>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse gap-3 border-t border-[#E0BFBD]/30 px-5 py-4 sm:flex-row sm:justify-end md:px-6">

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="
                            flex h-10 items-center
                            justify-center gap-2
                            rounded-lg border
                            border-[#E0BFBD]
                            px-4 text-sm font-semibold
                            text-[#584140]
                            transition-colors
                            hover:bg-[#FEF3F2]
                            hover:text-[#911824]
                            disabled:opacity-50
                        "
                    >
                        <FiX size={16} />
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            flex h-10 items-center
                            justify-center gap-2
                            rounded-lg bg-[#911824]
                            px-5 text-sm font-semibold
                            text-white
                            transition-colors
                            hover:bg-[#75131D]
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        {loading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FiSave size={16} />
                                {editingTest
                                    ? "Update Lab Test"
                                    : "Save Lab Test"}
                            </>
                        )}
                    </button>

                </div>

            </form>
        </div>
    );
}

