"use client";

import { useState } from "react";
import DepartmentFacilitiesList, {
    DepartmentService,
} from "./departmentServicesList";
import DepartmentFacilityForm from "./departmentServicesForm";

type Tab = "services" | "add-service";

function DepartmentServices() {
    const [activeTab, setActiveTab] =
        useState<Tab>("services");

    /*
     * Currently edited service
     */
    const [editService, setEditService] =
        useState<DepartmentService | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Open Add Service
    |--------------------------------------------------------------------------
    */

    function handleAddService() {
        setEditService(null);
        setActiveTab("add-service");
    }

    /*
    |--------------------------------------------------------------------------
    | Open Edit Service
    |--------------------------------------------------------------------------
    */

    function handleServiceEdit(
        service: DepartmentService
    ) {
        setEditService(service);
        setActiveTab("add-service");
    }

    /*
    |--------------------------------------------------------------------------
    | Service saved successfully
    |--------------------------------------------------------------------------
    */

    function handleServiceSuccess() {
        setEditService(null);
        setActiveTab("services");
    }

    /*
    |--------------------------------------------------------------------------
    | Cancel editing
    |--------------------------------------------------------------------------
    */

    function handleCancelEdit() {
        setEditService(null);
        setActiveTab("services");
    }

    /*
    |--------------------------------------------------------------------------
    | Open Services tab
    |--------------------------------------------------------------------------
    */

    function handleServicesTab() {
        setEditService(null);
        setActiveTab("services");
    }

    return (
        <div className="w-full">

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#584140]">
                    Department Services
                </h1>

                <p className="mt-1 text-sm text-[#584140]/60">
                    Manage services provided by each hospital
                    department.
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="tabs tabs-box w-fit bg-base-100 shadow-sm">

                    {/* Services */}
                    <button
                        type="button"
                        className={`tab ${
                            activeTab === "services"
                                ? "tab-active bg-[#911824] text-white"
                                : "text-[#584140]"
                        }`}
                        onClick={
                            handleServicesTab
                        }
                    >
                        Services
                    </button>

                    {/* Add / Edit Service */}
                    <button
                        type="button"
                        className={`tab ${
                            activeTab === "add-service"
                                ? "tab-active bg-[#911824] text-white"
                                : "text-[#584140]"
                        }`}
                        onClick={
                            handleAddService
                        }
                    >
                        {editService
                            ? "Edit Service"
                            : "Add Service"}
                    </button>

                </div>
            </div>

            {/* Tab Content */}
            <div className="w-full">

                {/* Services List */}
                {activeTab === "services" && (
                    <DepartmentFacilitiesList
                        onEdit={
                            handleServiceEdit
                        }
                    />
                )}

                {/* Add / Edit Form */}
                {activeTab === "add-service" && (
                    <DepartmentFacilityForm
                        editService={
                            editService
                        }
                        onSuccess={
                            handleServiceSuccess
                        }
                        onCancelEdit={
                            handleCancelEdit
                        }
                    />
                )}

            </div>
        </div>
    );
}

export default DepartmentServices;
