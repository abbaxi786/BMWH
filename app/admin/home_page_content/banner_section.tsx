
"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const API_URL = "/api/content/hero_section";

type HeroContent = {
    id: number;
    badge_text: string | null;
    heading: string | null;
    description: string | null;
    button_text: string | null;
    button_url: string | null;
};

type ApiResponse = {
    success: boolean;
    message?: string;
    data?: HeroContent | null;
};

const emptyForm: HeroContent = {
    id: 1,
    badge_text: "",
    heading: "",
    description: "",
    button_text: "",
    button_url: "",
};

export default function BannerSection() {
    const [form, setForm] = useState<HeroContent>(emptyForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchHeroContent = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get<ApiResponse>(API_URL, {
                headers: { Accept: "application/json" },
            });

            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Failed to load hero content."
                );
            }

            if (response.data.data) {
                setForm({
                    id: response.data.data.id,
                    badge_text: response.data.data.badge_text ?? "",
                    heading: response.data.data.heading ?? "",
                    description: response.data.data.description ?? "",
                    button_text: response.data.data.button_text ?? "",
                    button_url: response.data.data.button_url ?? "",
                });
            } else {
                setError("No hero content record was found in the database.");
            }
        } catch (err) {
            if (axios.isAxiosError<ApiResponse>(err)) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load hero content."
                );
            } else {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load hero content."
                );
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchHeroContent();
    }, [fetchHeroContent]);

    const handleChange = (
        field: keyof Omit<HeroContent, "id">,
        value: string
    ) => {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setMessage("");
        setError("");

        try {
            const response = await axios.patch<ApiResponse>(
                API_URL,
                {
                    badge_text: form.badge_text,
                    heading: form.heading,
                    description: form.description,
                    button_text: form.button_text,
                    button_url: form.button_url,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message || "Failed to save hero content."
                );
            }

            if (response.data.data) {
                setForm({
                    id: response.data.data.id,
                    badge_text: response.data.data.badge_text ?? "",
                    heading: response.data.data.heading ?? "",
                    description: response.data.data.description ?? "",
                    button_text: response.data.data.button_text ?? "",
                    button_url: response.data.data.button_url ?? "",
                });
            }

            setMessage(
                response.data.message || "Hero content saved successfully."
            );
        } catch (err) {
            if (axios.isAxiosError<ApiResponse>(err)) {
                setError(
                    err.response?.data?.message ||
                    "Failed to save hero content."
                );
            } else {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to save hero content."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    const inputClass =
        "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-red-700 focus:ring-2 focus:ring-red-700/10";

    if (loading) {
        return (
            <div className="rounded-xl border border-gray-200 bg-white p-6">
                <p className="text-sm text-gray-500">
                    Loading hero section content...
                </p>
            </div>
        );
    }

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Hero Banner Content
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Edit the text and button displayed over the existing banner
                    images. Image management remains unchanged.
                </p>
            </div>

            {error && (
                <div
                    role="alert"
                    className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                    {error}
                    {error.includes("No hero content record") && (
                        <button
                            type="button"
                            onClick={() => void fetchHeroContent()}
                            className="ml-2 font-semibold underline"
                        >
                            Retry
                        </button>
                    )}
                </div>
            )}

            {message && (
                <div
                    role="status"
                    className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
                >
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        htmlFor="badge_text"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                        Badge Text
                    </label>
                    <input
                        id="badge_text"
                        type="text"
                        maxLength={255}
                        value={form.badge_text ?? ""}
                        onChange={(event) =>
                            handleChange("badge_text", event.target.value)
                        }
                        placeholder="Compassionate Care. Stronger Communities."
                        className={inputClass}
                    />
                </div>

                <div>
                    <label
                        htmlFor="heading"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                        Main Heading
                    </label>
                    <textarea
                        id="heading"
                        rows={2}
                        maxLength={500}
                        value={form.heading ?? ""}
                        onChange={(event) =>
                            handleChange("heading", event.target.value)
                        }
                        placeholder="Compassionate Healthcare. Serving the Community."
                        className={inputClass}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        The frontend currently displays a line break after
                        “Healthcare.” If you want the line break to be editable,
                        the frontend component will need a small adjustment.
                    </p>
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows={4}
                        value={form.description ?? ""}
                        onChange={(event) =>
                            handleChange("description", event.target.value)
                        }
                        placeholder="Enter the hero section description..."
                        className={inputClass}
                    />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="button_text"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Button Text
                        </label>
                        <input
                            id="button_text"
                            type="text"
                            maxLength={100}
                            value={form.button_text ?? ""}
                            onChange={(event) =>
                                handleChange("button_text", event.target.value)
                            }
                            placeholder="Find a Doctor"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="button_url"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Button URL
                        </label>
                        <input
                            id="button_url"
                            type="text"
                            maxLength={500}
                            value={form.button_url ?? ""}
                            onChange={(event) =>
                                handleChange("button_url", event.target.value)
                            }
                            placeholder="/doctors"
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
                    <button
                        type="button"
                        onClick={() => void fetchHeroContent()}
                        disabled={saving}
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Reload Content
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-[#86000D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6f000a] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? "Saving..." : "Save Hero Content"}
                    </button>
                </div>
            </form>
        </section>
    );
}
