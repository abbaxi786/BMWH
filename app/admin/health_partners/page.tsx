"use client";

import { useState } from "react";
import HealthPartnersList from "./healthPartnersList";
import HealthPartnersForm from "./healthPartnersForm";

type Tab = "partners" | "add-partner";

function HealthPartners() {
    const [activeTab, setActiveTab] =
        useState<Tab>("partners");

    return (
        <div className="w-full p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#584140]">
                    Health Partners
                </h1>

                <p className="mt-1 text-sm text-[#584140]/60">
                    Manage healthcare organizations and
                    institutional partnerships.
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="tabs tabs-box w-fit bg-base-100 shadow-sm">
                    <button
                        type="button"
                        className={`tab ${
                            activeTab === "partners"
                                ? "tab-active bg-[#911824] text-white"
                                : "text-[#584140]"
                        }`}
                        onClick={() =>
                            setActiveTab("partners")
                        }
                    >
                        Health Partners
                    </button>

                    <button
                        type="button"
                        className={`tab ${
                            activeTab === "add-partner"
                                ? "tab-active bg-[#911824] text-white"
                                : "text-[#584140]"
                        }`}
                        onClick={() =>
                            setActiveTab("add-partner")
                        }
                    >
                        Add Partner
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="w-full">
                {activeTab === "partners" && (
                    <HealthPartnersList />
                )}

                {activeTab === "add-partner" && (
                    <HealthPartnersForm />
                )}
            </div>
        </div>
    );
}

export default HealthPartners;