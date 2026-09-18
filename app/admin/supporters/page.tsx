"use client";

import { useState } from "react";
import SupportersList from "./supportersList";
import SupportersForm from "./supportersForm";

type Tab = "supporters" | "add-supporter";

function Supporters() {
    const [activeTab, setActiveTab] =
        useState<Tab>("supporters");

    return (
        <div className="w-full p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#584140]">
                    Supporters
                </h1>

                <p className="mt-1 text-sm text-[#584140]/60">
                    Manage hospital supporters, partners,
                    sponsors, and organizations.
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="tabs tabs-box w-fit bg-base-100 shadow-sm">
                    <button
                        type="button"
                        className={`tab ${
                            activeTab === "supporters"
                                ? "tab-active bg-[#911824] text-white"
                                : "text-[#584140]"
                        }`}
                        onClick={() =>
                            setActiveTab("supporters")
                        }
                    >
                        Supporters
                    </button>

                    <button
                        type="button"
                        className={`tab ${
                            activeTab === "add-supporter"
                                ? "tab-active bg-[#911824] text-white"
                                : "text-[#584140]"
                        }`}
                        onClick={() =>
                            setActiveTab("add-supporter")
                        }
                    >
                        Add Supporter
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="w-full">
                {activeTab === "supporters" && (
                    <SupportersList />
                )}

                {activeTab === "add-supporter" && (
                    <SupportersForm />
                )}
            </div>
        </div>
    );
}

export default Supporters;