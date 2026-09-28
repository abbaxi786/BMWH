"use client";

import React, { useState } from "react";
import LabTestList from "./labTestList";
import LabTestForm from "./labTestForm";
import { FiList, FiPlus } from "react-icons/fi";

export type LabTest = {
    id: number;
    test_name: string;
    category: string;
    reporting_time: string;
    specimen_source: string;
    processing: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
};

export default function LabTests() {
    const [activeTab, setActiveTab] = useState<"list" | "form">("list");

    const [editingTest, setEditingTest] = useState<LabTest | null>(null);

    const handleEdit = (test: LabTest) => {
        setEditingTest(test);
        setActiveTab("form");
    };

    const handleFormSuccess = () => {
        setEditingTest(null);
        setActiveTab("list");
    };

    const handleAddNew = () => {
        setEditingTest(null);
        setActiveTab("form");
    };

    return (
        <div className="min-h-full bg-[#F8F9FB] p-4 md:p-6">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#911824]">
                    Lab Tests
                </h1>

                <p className="mt-1 text-sm text-[#584140]">
                    Manage laboratory tests, reporting times, specimen sources
                    and processing information.
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-[#E0BFBD]/50">
                <div className="flex gap-2">

                    {/* List Tab */}
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab("list");
                            setEditingTest(null);
                        }}
                        className={`
                            flex items-center gap-2
                            border-b-2 px-4 py-3
                            text-sm font-semibold
                            transition-colors
                            ${
                                activeTab === "list"
                                    ? "border-[#911824] text-[#911824]"
                                    : "border-transparent text-[#584140] hover:text-[#911824]"
                            }
                        `}
                    >
                        <FiList size={16} />
                        Lab Tests
                    </button>

                    {/* Form Tab */}
                    <button
                        type="button"
                        onClick={handleAddNew}
                        className={`
                            flex items-center gap-2
                            border-b-2 px-4 py-3
                            text-sm font-semibold
                            transition-colors
                            ${
                                activeTab === "form"
                                    ? "border-[#911824] text-[#911824]"
                                    : "border-transparent text-[#584140] hover:text-[#911824]"
                            }
                        `}
                    >
                        <FiPlus size={16} />
                        {editingTest ? "Edit Lab Test" : "Add Lab Test"}
                    </button>

                </div>
            </div>

            {/* Tab Content */}
            {activeTab === "list" ? (
                <LabTestList
                    onEdit={handleEdit}
                    onAddNew={handleAddNew}
                />
            ) : (
                <LabTestForm
                    editingTest={editingTest}
                    onSuccess={handleFormSuccess}
                    onCancel={() => {
                        setEditingTest(null);
                        setActiveTab("list");
                    }}
                />
            )}
        </div>
    );
}

