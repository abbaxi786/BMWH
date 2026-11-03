
"use client";

import { useState } from "react";
import axios from "axios";
import {
    FaChevronDown,
    FaChevronUp,
    FaUsers,
    FaFloppyDisk,
    FaSpinner,
} from "react-icons/fa6";

const API_URL = "/api/content/about_content/who_we_are";

type WhoWeAreData = {
    id?: number;
    eyebrow: string | null;
    title: string | null;
    descriptionOne: string | null;
    descriptionTwo: string | null;
    isActive: boolean;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    data?: WhoWeAreData | null;
};

const EMPTY_FORM = {
    eyebrow: "",
    title: "",
    descriptionOne: "",
    descriptionTwo: "",
    isActive: true,
};

export default function WhoWeAreAccordion() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const [form, setForm] = useState(EMPTY_FORM);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const fetchContent = async () => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await axios.get<ApiResponse>(API_URL, {
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Failed to load Who We Are content."
                );
            }

            const data = response.data.data;

            if (!data) {
                setForm(EMPTY_FORM);
            } else {
                setForm({
                    eyebrow: data.eyebrow ?? "",
                    title: data.title ?? "",
                    descriptionOne: data.descriptionOne ?? "",
                    descriptionTwo: data.descriptionTwo ?? "",
                    isActive: data.isActive ?? true,
                });
            }

            setLoaded(true);
        } catch (error) {
            const message = axios.isAxiosError<ApiResponse>(error)
                ? error.response?.data?.message || error.message
                : error instanceof Error
                    ? error.message
                    : "Failed to load Who We Are content.";

            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    const toggleAccordion = async () => {
        const nextOpen = !isOpen;
        setIsOpen(nextOpen);
        setSuccessMessage("");
        setErrorMessage("");

        if (nextOpen && !loaded) {
            await fetchContent();
        }
    };

    const handleChange = (
        field: keyof typeof form,
        value: string | boolean
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setSuccessMessage("");
    };

    const handleSave = async () => {
        setSaving(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const response = await axios.patch<ApiResponse>(
                API_URL,
                {
                    eyebrow: form.eyebrow,
                    title: form.title,
                    descriptionOne: form.descriptionOne,
                    descriptionTwo: form.descriptionTwo,
                    isActive: form.isActive,
                },
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Failed to save Who We Are content."
                );
            }

            const data = response.data.data;

            if (data) {
                setForm({
                    eyebrow: data.eyebrow ?? "",
                    title: data.title ?? "",
                    descriptionOne: data.descriptionOne ?? "",
                    descriptionTwo: data.descriptionTwo ?? "",
                    isActive: data.isActive ?? true,
                });
            }

            setLoaded(true);
            setSuccessMessage(
                response.data.message || "Who We Are content saved successfully."
            );
        } catch (error) {
            const message = axios.isAxiosError<ApiResponse>(error)
                ? error.response?.data?.message || error.message
                : error instanceof Error
                    ? error.message
                    : "Failed to save Who We Are content.";

            setErrorMessage(message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={toggleAccordion}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50"
            >
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-700">
                        <FaUsers />
                    </div>

                    <div className="min-w-0">
                        <h2 className="font-semibold text-gray-900">
                            Who We Are
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage the introduction and description on the About page.
                        </p>
                    </div>
                </div>

                {isOpen ? (
                    <FaChevronUp className="shrink-0 text-gray-500" />
                ) : (
                    <FaChevronDown className="shrink-0 text-gray-500" />
                )}
            </button>

            {isOpen && (
                <div className="border-t border-gray-200 px-5 py-5">
                    {loading ? (
                        <div
                            role="status"
                            className="flex items-center gap-3 py-8 text-sm text-gray-500"
                        >
                            <FaSpinner className="animate-spin" />
                            Loading Who We Are content...
                        </div>
                    ) : (
                        <>
                            {successMessage && (
                                <div
                                    role="status"
                                    className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                                >
                                    {successMessage}
                                </div>
                            )}

                            {errorMessage && (
                                <div
                                    role="alert"
                                    className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                                >
                                    {errorMessage}
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="who-we-are-eyebrow"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Eyebrow Text
                                    </label>

                                    <input
                                        id="who-we-are-eyebrow"
                                        type="text"
                                        value={form.eyebrow}
                                        onChange={(event) =>
                                            handleChange("eyebrow", event.target.value)
                                        }
                                        placeholder="Who We Are"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="who-we-are-title"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Section Title
                                    </label>

                                    <input
                                        id="who-we-are-title"
                                        type="text"
                                        value={form.title}
                                        onChange={(event) =>
                                            handleChange("title", event.target.value)
                                        }
                                        placeholder="A growing hospital with a clear purpose"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="who-we-are-description-one"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        First Paragraph
                                    </label>

                                    <textarea
                                        id="who-we-are-description-one"
                                        rows={5}
                                        value={form.descriptionOne}
                                        onChange={(event) =>
                                            handleChange(
                                                "descriptionOne",
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter the first paragraph..."
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="who-we-are-description-two"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Second Paragraph
                                    </label>

                                    <textarea
                                        id="who-we-are-description-two"
                                        rows={5}
                                        value={form.descriptionTwo}
                                        onChange={(event) =>
                                            handleChange(
                                                "descriptionTwo",
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter the second paragraph..."
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex cursor-pointer items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={form.isActive}
                                            onChange={(event) =>
                                                handleChange(
                                                    "isActive",
                                                    event.target.checked
                                                )
                                            }
                                            className="h-4 w-4 rounded border-gray-300 accent-red-700"
                                        />

                                        <span className="text-sm font-medium text-gray-700">
                                            Show this section on the website
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
                                <p className="text-xs text-gray-500">
                                    Changes are saved to the database.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving || !loaded}
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FaFloppyDisk />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
