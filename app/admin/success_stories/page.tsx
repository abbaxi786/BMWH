"use client";

import { useState } from "react";
import SuccessStoriesList from "./successStoriesList";
import SuccessStoriesForm from "./successStoriesForm";

type Tab =
    | "stories"
    | "add-story";

function SuccessStories() {
    const [activeTab, setActiveTab] =
        useState<Tab>("stories");

    return (
        <div className="w-full">
            {/* Heading */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#584140]">
                    Success Stories
                </h1>

                <p className="mt-1 text-sm text-[#584140]/60">
                    Manage patient success stories and
                    healthcare testimonials.
                </p>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="tabs tabs-box w-fit bg-base-100 shadow-sm">
                    <button
                        type="button"
                        className={`tab ${
                            activeTab === "stories"
                                ? "tab-active bg-[#911824] text-white"
                                : "text-[#584140]"
                        }`}
                        onClick={() =>
                            setActiveTab("stories")
                        }
                    >
                        Success Stories
                    </button>

                    <button
                        type="button"
                        className={`tab ${
                            activeTab === "add-story"
                                ? "tab-active bg-[#911824] text-white"
                                : "text-[#584140]"
                        }`}
                        onClick={() =>
                            setActiveTab("add-story")
                        }
                    >
                        Add Story
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="w-full">
                {activeTab === "stories" && (
                    <SuccessStoriesList />
                )}

                {activeTab === "add-story" && (
                    <SuccessStoriesForm />
                )}
            </div>
        </div>
    );
}

export default SuccessStories;