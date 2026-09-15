"use client";

import { useState } from "react";
import HospitalFacilitiesList, {
    HospitalFacility,
} from "./hospitalFacilitiesList";
import HospitalFacilitiesForm from "./hospitalFaciltiesForm";

type Tab =
    | "facilities"
    | "add-facility";

function HospitalFacilities() {
    const [activeTab, setActiveTab] =
        useState<Tab>("facilities");

    /*
    |--------------------------------------------------------------------------
    | Facility being edited
    |--------------------------------------------------------------------------
    */
    const [editFacility, setEditFacility] =
        useState<HospitalFacility | null>(null);

    /*
    |--------------------------------------------------------------------------
    | Open Add Facility
    |--------------------------------------------------------------------------
    */
    function handleAddFacility() {
        setEditFacility(null);
        setActiveTab("add-facility");
    }

    /*
    |--------------------------------------------------------------------------
    | Open Edit Facility
    |--------------------------------------------------------------------------
    */
    function handleFacilityEdit(
        facility: HospitalFacility
    ) {
        setEditFacility(facility);
        setActiveTab("add-facility");
    }

    /*
    |--------------------------------------------------------------------------
    | After Successful Add/Edit
    |--------------------------------------------------------------------------
    */
    function handleFacilitySuccess() {
        setEditFacility(null);
        setActiveTab("facilities");
    }

    /*
    |--------------------------------------------------------------------------
    | Cancel Add/Edit
    |--------------------------------------------------------------------------
    */
    function handleCancelEdit() {
        setEditFacility(null);
        setActiveTab("facilities");
    }

    /*
    |--------------------------------------------------------------------------
    | Go Back To Facilities
    |--------------------------------------------------------------------------
    */
    function handleFacilitiesTab() {
        setEditFacility(null);
        setActiveTab("facilities");
    }

    return (
        <div className="w-full">

            {/* Heading */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#584140]">
                    Hospital Facilities
                </h1>

                <p className="mt-1 text-sm text-[#584140]/60">
                    Manage hospital facilities, infrastructure,
                    and available resources.
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="tabs tabs-box w-fit bg-base-100 shadow-sm">

                    {/* Facilities Tab */}
                    <button
                        type="button"
                        className={`tab ${
                            activeTab ===
                            "facilities"
                                ? "tab-active bg-[#911824] text-white"
                                : "text-[#584140]"
                        }`}
                        onClick={
                            handleFacilitiesTab
                        }
                    >
                        Facilities
                    </button>

                    {/* Add/Edit Facility Tab */}
                    <button
                        type="button"
                        className={`tab ${
                            activeTab ===
                            "add-facility"
                                ? "tab-active bg-[#911824] text-white"
                                : "text-[#584140]"
                        }`}
                        onClick={
                            handleAddFacility
                        }
                    >
                        {editFacility
                            ? "Edit Facility"
                            : "Add Facility"}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="w-full">

                {/* Facilities List */}
                {activeTab ===
                    "facilities" && (
                    <HospitalFacilitiesList
                        onEdit={
                            handleFacilityEdit
                        }
                    />
                )}

                {/* Add/Edit Form */}
                {activeTab ===
                    "add-facility" && (
                    <HospitalFacilitiesForm
                        editFacility={
                            editFacility
                        }
                        onSuccess={
                            handleFacilitySuccess
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

export default HospitalFacilities;