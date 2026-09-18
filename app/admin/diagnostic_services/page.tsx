"use client";

import { useState } from "react";
import DiagnosticServicesList, {
    DiagnosticService,
} from "./diagnosticServicesList";
import DiagnosticServicesForm from "./diagnosticServicesForm";

type Tab =
    | "services"
    | "add-service";

function DiagnosticServices() {
    const [activeTab, setActiveTab] =
        useState<Tab>("services");

    // Currently selected service for editing
    const [editService, setEditService] =
        useState<DiagnosticService | null>(null);

    // When Edit is clicked from the list
    function handleEdit(service: DiagnosticService) {
        setEditService(service);
        setActiveTab("add-service");
    }

    // After successfully adding/updating a service
    function handleFormSuccess() {
        setEditService(null);
        setActiveTab("services");
    }

    // Cancel editing
    function handleCancelEdit() {
        setEditService(null);
        setActiveTab("services");
    }

    return (
        <div className="w-full p-6">

            {/* Heading */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#584140]">
                    Diagnostic Services
                </h1>

                <p className="mt-1 text-sm text-[#584140]/60">
                    Manage hospital diagnostic, laboratory,
                    imaging, and pathology services.
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="tabs tabs-box w-fit bg-base-100 shadow-sm">

                    {/* Services Tab */}
                    <button
                        type="button"
                        className={`tab ${
                            activeTab === "services"
                                ? "tab-active bg-[#911824] text-white"
                                : "text-[#584140]"
                        }`}
                        onClick={() => {
                            setEditService(null);
                            setActiveTab("services");
                        }}
                    >
                        Services
                    </button>

                    {/* Add/Edit Tab */}
                    <button
                        type="button"
                        className={`tab ${
                            activeTab === "add-service"
                                ? "tab-active bg-[#911824] text-white"
                                : "text-[#584140]"
                        }`}
                        onClick={() => {
                            setEditService(null);
                            setActiveTab("add-service");
                        }}
                    >
                        {editService
                            ? "Edit Service"
                            : "Add Service"}
                    </button>

                </div>
            </div>

            {/* Content */}
            <div className="w-full">

                {/* Services List */}
                {activeTab === "services" && (
                    <DiagnosticServicesList
                        onEdit={handleEdit}
                    />
                )}

                {/* Add / Edit Form */}
                {activeTab === "add-service" && (
                    <DiagnosticServicesForm
                        editService={editService}
                        onSuccess={handleFormSuccess}
                        onCancelEdit={handleCancelEdit}
                    />
                )}

            </div>
        </div>
    );
}

export default DiagnosticServices;