
"use client";

import { useState } from "react";
import axios from "axios";
import {
    FaChevronDown,
    FaChevronUp,
    FaBullseye,
    FaSave,
    FaSpinner,
} from "react-icons/fa";

const API_URL = "/api/content/about_content/mission_vision";

type MissionVisionData = {
    id?: number;
    eyebrow: string;
    title: string;
    missionTitle: string;
    missionDescription: string;
    visionTitle: string;
    visionDescription: string;
    isActive: boolean;
};

const initialValues: MissionVisionData = {
    eyebrow: "",
    title: "",
    missionTitle: "",
    missionDescription: "",
    visionTitle: "",
    visionDescription: "",
    isActive: true,
};

export default function MissionVisionAccordion() {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] =
        useState<MissionVisionData>(initialValues);

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchData = async () => {
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.get(API_URL);
            const data = response.data?.data;

            if (data) {
                setFormData({
                    eyebrow: data.eyebrow ?? "",
                    title: data.title ?? "",
                    missionTitle: data.missionTitle ?? "",
                    missionDescription: data.missionDescription ?? "",
                    visionTitle: data.visionTitle ?? "",
                    visionDescription: data.visionDescription ?? "",
                    isActive: data.isActive ?? true,
                });
            } else {
                setFormData(initialValues);
                setError(
                    "No Mission & Vision record was found. Create a database record first."
                );
            }

            setHasFetched(true);
        } catch (err) {
            console.error("Failed to fetch Mission & Vision:", err);

            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message ??
                          "Failed to load Mission & Vision content."
                    : "Failed to load Mission & Vision content."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = async () => {
        const shouldOpen = !isOpen;
        setIsOpen(shouldOpen);

        if (shouldOpen && !hasFetched) {
            await fetchData();
        }
    };

    const handleChange = (
        field: keyof MissionVisionData,
        value: string | boolean
    ) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));

        setSuccess("");
        setError("");
    };

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsSaving(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.patch(API_URL, formData);

            if (response.data?.success) {
                const data = response.data.data;

                if (data) {
                    setFormData({
                        eyebrow: data.eyebrow ?? "",
                        title: data.title ?? "",
                        missionTitle: data.missionTitle ?? "",
                        missionDescription: data.missionDescription ?? "",
                        visionTitle: data.visionTitle ?? "",
                        visionDescription: data.visionDescription ?? "",
                        isActive: data.isActive ?? true,
                    });
                }

                setHasFetched(true);
                setSuccess(
                    response.data.message ??
                        "Mission & Vision content saved successfully."
                );
            } else {
                setError(
                    response.data?.message ??
                        "Failed to save Mission & Vision content."
                );
            }
        } catch (err) {
            console.error("Failed to save Mission & Vision:", err);

            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message ??
                          "Failed to save Mission & Vision content."
                    : "Failed to save Mission & Vision content."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass =
        "mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#911824] focus:ring-2 focus:ring-[#911824]/10";

    const labelClass =
        "block text-sm font-semibold text-gray-700";

    return (
        <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Accordion Header */}
            <button
                type="button"
                onClick={handleToggle}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50 sm:px-6"
            >
                <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#911824]/10 text-[#911824]">
                        <FaBullseye aria-hidden="true" />
                    </span>

                    <span>
                        <span className="block font-semibold text-gray-900">
                            Mission & Vision
                        </span>

                        <span className="mt-1 block text-xs text-gray-500">
                            Edit section heading, mission, and vision
                        </span>
                    </span>
                </span>

                {isOpen ? (
                    <FaChevronUp
                        className="shrink-0 text-gray-500"
                        aria-hidden="true"
                    />
                ) : (
                    <FaChevronDown
                        className="shrink-0 text-gray-500"
                        aria-hidden="true"
                    />
                )}
            </button>

            {/* Accordion Content */}
            {isOpen && (
                <div className="border-t border-gray-200 px-5 py-6 sm:px-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-3 py-10 text-sm text-gray-600">
                            <FaSpinner className="animate-spin" />
                            Loading Mission & Vision content...
                        </div>
                    ) : (
                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Section Heading */}
                            <div>
                                <h3 className="mb-4 text-base font-semibold text-gray-900">
                                    Section Heading
                                </h3>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div>
                                        <label className={labelClass}>
                                            Eyebrow Text
                                        </label>

                                        <input
                                            type="text"
                                            value={formData.eyebrow}
                                            onChange={(event) =>
                                                handleChange(
                                                    "eyebrow",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="What Guides Us"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Main Heading
                                        </label>

                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(event) =>
                                                handleChange(
                                                    "title",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Our Mission & Vision"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Mission Fields */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="mb-4 text-base font-semibold text-gray-900">
                                    Mission
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>
                                            Mission Title
                                        </label>

                                        <input
                                            type="text"
                                            value={formData.missionTitle}
                                            onChange={(event) =>
                                                handleChange(
                                                    "missionTitle",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Our Mission"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Mission Description
                                        </label>

                                        <textarea
                                            rows={5}
                                            value={formData.missionDescription}
                                            onChange={(event) =>
                                                handleChange(
                                                    "missionDescription",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter the mission description..."
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Vision Fields */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="mb-4 text-base font-semibold text-gray-900">
                                    Vision
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>
                                            Vision Title
                                        </label>

                                        <input
                                            type="text"
                                            value={formData.visionTitle}
                                            onChange={(event) =>
                                                handleChange(
                                                    "visionTitle",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Our Vision"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Vision Description
                                        </label>

                                        <textarea
                                            rows={5}
                                            value={formData.visionDescription}
                                            onChange={(event) =>
                                                handleChange(
                                                    "visionDescription",
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Enter the vision description..."
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Visibility Toggle */}
                            <div className="flex items-start gap-3 border-t border-gray-200 pt-6">
                                <input
                                    id="mission-vision-active"
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(event) =>
                                        handleChange(
                                            "isActive",
                                            event.target.checked
                                        )
                                    }
                                    className="mt-1 h-4 w-4 accent-[#911824]"
                                />

                                <label
                                    htmlFor="mission-vision-active"
                                    className="cursor-pointer"
                                >
                                    <span className="block text-sm font-semibold text-gray-800">
                                        Show this section on the website
                                    </span>

                                    <span className="mt-1 block text-xs text-gray-500">
                                        Turn this off to hide the entire
                                        Mission & Vision section.
                                    </span>
                                </label>
                            </div>

                            {/* Feedback */}
                            {error && (
                                <div
                                    role="alert"
                                    className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                                >
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div
                                    role="status"
                                    className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                                >
                                    {success}
                                </div>
                            )}

                            {/* Save Button */}
                            <div className="flex justify-end border-t border-gray-200 pt-5">
                                <button
                                    type="submit"
                                    disabled={isSaving || !hasFetched}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#911824] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#75131d] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSaving ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
