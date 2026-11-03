
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaSave } from "react-icons/fa";

interface AboutSectionContent {
    section_title: string;
    heading: string;
    description: string;
    description_two: string;
    button_text: string;
    button_url: string;
}

interface ApiResponse {
    success: boolean;
    data: AboutSectionContent | null;
    message?: string;
    detail?: string;
}

const API_URL = "/api/content/about_section";

const EMPTY_CONTENT: AboutSectionContent = {
    section_title: "",
    heading: "",
    description: "",
    description_two: "",
    button_text: "",
    button_url: "",
};

export default function AboutSectionAccordion() {
    const [content, setContent] =
        useState<AboutSectionContent>(EMPTY_CONTENT);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] =
        useState<"success" | "error" | "">("");

    // Fetch About Section content from the API
    useEffect(() => {
        let active = true;

        const fetchContent = async () => {
            try {
                const response = await axios.get<ApiResponse>(
                    API_URL,
                    {
                        headers: {
                            "Cache-Control": "no-cache",
                        },
                        params: {
                            _t: Date.now(),
                        },
                    }
                );

                if (!active) return;

                if (response.data.success && response.data.data) {
                    setContent({
                        ...EMPTY_CONTENT,
                        ...response.data.data,
                    });

                    setMessage("");
                    setMessageType("");
                } else if (
                    response.data.success &&
                    !response.data.data
                ) {
                    setMessage(
                        "No active About Section content was found."
                    );
                    setMessageType("error");
                } else {
                    setMessage(
                        response.data.message ||
                            "Failed to load About Section content."
                    );
                    setMessageType("error");
                }
            } catch (error: unknown) {
                if (!active) return;

                console.error(
                    "Failed to load About Section:",
                    error
                );

                setMessage(getApiError(error));
                setMessageType("error");
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void fetchContent();

        return () => {
            active = false;
        };
    }, []);

    // Update a field
    const handleChange = (
        field: keyof AboutSectionContent,
        value: string
    ) => {
        setContent((previous) => ({
            ...previous,
            [field]: value,
        }));

        setMessage("");
        setMessageType("");
    };

    // Save changes using PATCH
    const handleSave = async () => {
        if (saving) return;

        setSaving(true);
        setMessage("");
        setMessageType("");

        try {
            const payload: AboutSectionContent = {
                section_title: content.section_title,
                heading: content.heading,
                description: content.description,
                description_two: content.description_two,
                button_text: content.button_text,
                button_url: content.button_url,
            };

            const response = await axios.patch<ApiResponse>(
                API_URL,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.detail ||
                        response.data.message ||
                        "Unable to save About Section content."
                );
            }

            if (response.data.data) {
                setContent({
                    ...EMPTY_CONTENT,
                    ...response.data.data,
                });
            }

            setMessage(
                response.data.message ||
                    "About Section updated successfully."
            );
            setMessageType("success");
        } catch (error: unknown) {
            console.error(
                "Failed to save About Section:",
                error
            );

            setMessage(getApiError(error));
            setMessageType("error");
        } finally {
            setSaving(false);
        }
    };

    const inputClass =
        "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#86000D] focus:ring-2 focus:ring-[#86000D]/10 disabled:cursor-not-allowed disabled:opacity-60";

    const labelClass =
        "mb-1.5 block text-sm font-medium text-gray-700";

    return (
        <div className="w-full space-y-5">
            {/* Status Message */}
            {message && (
                <div
                    role={
                        messageType === "error"
                            ? "alert"
                            : "status"
                    }
                    aria-live="polite"
                    className={`rounded-lg border p-3 text-sm font-medium ${
                        messageType === "success"
                            ? "border-green-200 bg-green-50 text-green-800"
                            : "border-red-200 bg-red-50 text-red-800"
                    }`}
                >
                    {message}
                </div>
            )}

            {loading ? (
                <div className="py-8 text-center">
                    <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-[#86000D]" />
                    <p className="mt-3 text-sm text-gray-500">
                        Loading About Section...
                    </p>
                </div>
            ) : (
                <>
                    {/* Section Title */}
                    <div>
                        <label
                            htmlFor="about-section-title"
                            className={labelClass}
                        >
                            Section Title
                        </label>

                        <input
                            id="about-section-title"
                            type="text"
                            value={content.section_title}
                            onChange={(event) =>
                                handleChange(
                                    "section_title",
                                    event.target.value
                                )
                            }
                            placeholder="e.g. About BMWH"
                            className={inputClass}
                            disabled={saving}
                        />
                    </div>

                    {/* Main Heading */}
                    <div>
                        <label
                            htmlFor="about-section-heading"
                            className={labelClass}
                        >
                            Main Heading
                        </label>

                        <input
                            id="about-section-heading"
                            type="text"
                            value={content.heading}
                            onChange={(event) =>
                                handleChange(
                                    "heading",
                                    event.target.value
                                )
                            }
                            placeholder="Enter main heading"
                            className={inputClass}
                            disabled={saving}
                        />
                    </div>

                    {/* First Description */}
                    <div>
                        <label
                            htmlFor="about-section-description"
                            className={labelClass}
                        >
                            First Description
                        </label>

                        <textarea
                            id="about-section-description"
                            rows={4}
                            value={content.description}
                            onChange={(event) =>
                                handleChange(
                                    "description",
                                    event.target.value
                                )
                            }
                            placeholder="Enter first paragraph"
                            className={inputClass}
                            disabled={saving}
                        />
                    </div>

                    {/* Second Description */}
                    <div>
                        <label
                            htmlFor="about-section-description-two"
                            className={labelClass}
                        >
                            Second Description
                        </label>

                        <textarea
                            id="about-section-description-two"
                            rows={4}
                            value={content.description_two}
                            onChange={(event) =>
                                handleChange(
                                    "description_two",
                                    event.target.value
                                )
                            }
                            placeholder="Enter second paragraph"
                            className={inputClass}
                            disabled={saving}
                        />
                    </div>

                    {/* Button Fields */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="about-section-button-text"
                                className={labelClass}
                            >
                                Button Text
                            </label>

                            <input
                                id="about-section-button-text"
                                type="text"
                                value={content.button_text}
                                onChange={(event) =>
                                    handleChange(
                                        "button_text",
                                        event.target.value
                                    )
                                }
                                placeholder="Learn More About BMWH"
                                className={inputClass}
                                disabled={saving}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="about-section-button-url"
                                className={labelClass}
                            >
                                Button URL
                            </label>

                            <input
                                id="about-section-button-url"
                                type="text"
                                value={content.button_url}
                                onChange={(event) =>
                                    handleChange(
                                        "button_url",
                                        event.target.value
                                    )
                                }
                                placeholder="/pages/about"
                                className={inputClass}
                                disabled={saving}
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving || loading}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#86000D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6d000a] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <FaSave />
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

function getApiError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as
            | {
                  detail?: string;
                  message?: string;
              }
            | undefined;

        if (data?.detail) return data.detail;
        if (data?.message) return data.message;

        if (error.response?.status === 401) {
            return "You are not authorized. Please sign in as an admin.";
        }

        if (error.response?.status === 404) {
            return "The About Section record was not found.";
        }

        if (error.response?.status === 400) {
            return "The submitted content is invalid.";
        }

        return error.message || "A network error occurred.";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "An unexpected error occurred.";
}
