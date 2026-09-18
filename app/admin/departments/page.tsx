"use client";

import { useState } from "react";
import Department, {
    DepartmentData,
} from "./departmentList";
import DepartmentForm from "./departmentForm";

type Tab = "departments" | "add-department";

function Departments() {
    const [activeTab, setActiveTab] =
        useState<Tab>("departments");

    // Department currently being edited
    const [editDepartment, setEditDepartment] =
        useState<DepartmentData | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Edit Department
    |--------------------------------------------------------------------------
    */

    function handleEdit(department: DepartmentData) {
        setEditDepartment(department);
        setActiveTab("add-department");
    }

    /*
    |--------------------------------------------------------------------------
    | Form Success
    |--------------------------------------------------------------------------
    */

    function handleFormSuccess() {
        setEditDepartment(null);
        setActiveTab("departments");
    }

    /*
    |--------------------------------------------------------------------------
    | Cancel Edit
    |--------------------------------------------------------------------------
    */

    function handleCancelEdit() {
        setEditDepartment(null);
        setActiveTab("departments");
    }

    /*
    |--------------------------------------------------------------------------
    | Tab Change
    |--------------------------------------------------------------------------
    */

    function handleDepartmentsTab() {
        setEditDepartment(null);
        setActiveTab("departments");
    }

    function handleAddDepartmentTab() {
        setEditDepartment(null);
        setActiveTab("add-department");
    }

    return (
        <div className="w-full p-6">

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#584140]">
                    Departments
                </h1>

                <p className="mt-1 text-sm text-[#584140]/60">
                    Manage hospital departments and their information.
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="tabs tabs-box w-fit bg-base-100 shadow-sm">

                    {/* Departments Tab */}
                    <button
                        type="button"
                        className={`tab ${
                            activeTab === "departments"
                                ? "tab-active bg-[#911824] text-white"
                                : "text-[#584140]"
                        }`}
                        onClick={handleDepartmentsTab}
                    >
                        Departments
                    </button>

                    {/* Add / Edit Department Tab */}
                    <button
                        type="button"
                        className={`tab ${
                            activeTab === "add-department"
                                ? "tab-active bg-[#911824] text-white"
                                : "text-[#584140]"
                        }`}
                        onClick={handleAddDepartmentTab}
                    >
                        {editDepartment
                            ? "Edit Department"
                            : "Add Department"}
                    </button>

                </div>
            </div>

            {/* Tab Content */}
            <div className="w-full">

                {/* Department List */}
                {activeTab === "departments" && (
                    <Department
                        onEdit={handleEdit}
                    />
                )}

                {/* Department Form */}
                {activeTab === "add-department" && (
                    <DepartmentForm
                        editDepartment={editDepartment}
                        onSuccess={handleFormSuccess}
                        onCancelEdit={handleCancelEdit}
                    />
                )}

            </div>

        </div>
    );
}

export default Departments;