"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import {
    FaChevronDown,
    FaImage,
    FaSave,
    FaSpinner,
    FaCheckCircle,
    FaExclamationCircle,
} from "react-icons/fa";

type BannerContent = {
    id?: number;
    eyebrow: string;
    title: string;
    highlightedTitle: string;
    subtitle: string;
    bannerImage: string;
    imageAlt: string;
    floatingTitle: string;
    floatingSubtitle: string;
    contactUrl: string;
    departmentsUrl: string;
};

type ApiResponse = {
    success: boolean;
    message: string;
    data?: BannerContent | null;
};

const API_URL = "/api/content/about_content/banner";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const initialValues: BannerContent = {
    eyebrow: "",
    title: "",
    highlightedTitle: "",
    subtitle: "",
    bannerImage: "",
    imageAlt: "",
    floatingTitle: "",
    floatingSubtitle: "",
    contactUrl: "",
    departmentsUrl: "",
};

const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#911824] focus:ring-2 focus:ring-[#911824]/10";

export default function MainBannerAccordion() {
    const [isOpen, setIsOpen] = useState(true);
    const [formData, setFormData] =
        useState<BannerContent>(initialValues);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch saved banner content.
    const fetchBanner = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get<ApiResponse>(API_URL);
            const result = response.data;

            console.log("Fetched banner content:", result);

            if (!result.success || !result.data) {
                throw new Error(
                    result.message || "Unable to load banner content."
                );
            }

            setFormData({
                ...initialValues,
                ...result.data,
            });

            setSelectedFile(null);
            setPreviewUrl(result.data.bannerImage || "");
        } catch (err: unknown) {
            const message = axios.isAxiosError<ApiResponse>(err)
                ? err.response?.data?.message
                : err instanceof Error
                  ? err.message
                  : undefined;

            setError(message || "Failed to load banner content.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchBanner();
    }, [fetchBanner]);

    // Update text fields.
    const handleChange = (
        field: keyof BannerContent,
        value: string
    ) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));

        setSuccess("");
        setError("");
    };

    // Select and preview a new banner image.
    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            event.target.value = "";
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            setError("Image size must not exceed 5 MB.");
            event.target.value = "";
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setSuccess("");
        setError("");
    };

    // Save text fields and upload a new image if selected.
    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const payload = new FormData();

            payload.append("eyebrow", formData.eyebrow);
            payload.append("title", formData.title);
            payload.append(
                "highlightedTitle",
                formData.highlightedTitle
            );
            payload.append("subtitle", formData.subtitle);
            payload.append("imageAlt", formData.imageAlt);
            payload.append("floatingTitle", formData.floatingTitle);
            payload.append(
                "floatingSubtitle",
                formData.floatingSubtitle
            );
            payload.append("contactUrl", formData.contactUrl);
            payload.append(
                "departmentsUrl",
                formData.departmentsUrl
            );

            // Do not send the old image URL when uploading a replacement.
            // The API will set bannerImage from the Cloudinary response.
            if (!selectedFile && formData.bannerImage) {
                payload.append("bannerImage", formData.bannerImage);
            }

            if (selectedFile) {
                payload.append("bannerImageFile", selectedFile);
            }

            const response = await axios.patch<ApiResponse>(
                API_URL,
                payload
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                        "Failed to save banner content."
                );
            }

            if (response.data.data) {
                setFormData((previous) => ({
                    ...previous,
                    ...response.data.data,
                }));

                setPreviewUrl(
                    response.data.data.bannerImage || ""
                );
            }

            setSelectedFile(null);
            setSuccess(
                response.data.message ||
                    "Banner content saved successfully."
            );
        } catch (err: unknown) {
            const message = axios.isAxiosError<ApiResponse>(err)
                ? err.response?.data?.message
                : err instanceof Error
                  ? err.message
                  : undefined;

            setError(message || "Failed to save banner content.");
        } finally {
            setSaving(false);
        }
    };

    // Restore saved values and clear any unsaved image selection.
    const handleReset = () => {
        setSelectedFile(null);
        setSuccess("");
        setError("");

        void fetchBanner();
    };

    const renderTextField = (
        field: keyof BannerContent,
        label: string,
        placeholder: string
    ) => (
        <div key={field}>
            <label
                htmlFor={`banner-${field}`}
                className="mb-2 block text-sm font-medium text-gray-700"
            >
                {label}
            </label>

            <input
                id={`banner-${field}`}
                type="text"
                value={String(formData[field] ?? "")}
                onChange={(event) =>
                    handleChange(field, event.target.value)
                }
                placeholder={placeholder}
                className={inputClass}
            />
        </div>
    );

    return (
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setIsOpen((previous) => !previous)}
                aria-expanded={isOpen}
                aria-controls="main-banner-content"
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-gray-50 sm:p-6"
            >
                <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#911824]/10 text-lg text-[#911824]">
                        <FaImage aria-hidden="true" />
                    </div>

                    <div>
                        <h2 className="font-semibold text-gray-900">
                            Main Banner
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage the About page banner content and image.
                        </p>
                    </div>
                </div>

                <FaChevronDown
                    aria-hidden="true"
                    className={`shrink-0 text-gray-500 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <div
                    id="main-banner-content"
                    className="border-t border-gray-100 px-5 pb-6 pt-5 sm:px-6 sm:pb-7"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-3 py-12 text-sm text-gray-500">
                            <FaSpinner className="animate-spin" />
                            Loading banner content...
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            {error && (
                                <div
                                    role="alert"
                                    className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                                >
                                    <FaExclamationCircle className="mt-0.5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {success && (
                                <div
                                    role="status"
                                    className="mb-5 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
                                >
                                    <FaCheckCircle className="mt-0.5 shrink-0" />
                                    <span>{success}</span>
                                </div>
                            )}

                            <div className="grid gap-5 md:grid-cols-2">
                                {renderTextField(
                                    "eyebrow",
                                    "Small Tag / Eyebrow",
                                    "About BMWH"
                                )}

                                {renderTextField(
                                    "title",
                                    "Main Heading",
                                    "Caring for People,"
                                )}

                                {renderTextField(
                                    "highlightedTitle",
                                    "Highlighted Heading",
                                    "Serving the Community"
                                )}

                                {renderTextField(
                                    "imageAlt",
                                    "Banner Image Alt Text",
                                    "Bashir Memorial Welfare Hospital"
                                )}

                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="banner-subtitle"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="banner-subtitle"
                                        rows={4}
                                        value={formData.subtitle}
                                        onChange={(event) =>
                                            handleChange(
                                                "subtitle",
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter the banner description..."
                                        className={`${inputClass} resize-y`}
                                    />
                                </div>

                                {renderTextField(
                                    "floatingTitle",
                                    "Floating Card Title",
                                    "Patient-Centered"
                                )}

                                {renderTextField(
                                    "floatingSubtitle",
                                    "Floating Card Subtitle",
                                    "Healthcare & Welfare"
                                )}

                                {renderTextField(
                                    "contactUrl",
                                    "Contact Button URL",
                                    "/pages/contact"
                                )}

                                {renderTextField(
                                    "departmentsUrl",
                                    "Departments Button URL",
                                    "/pages/departments"
                                )}

                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="banner-image"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Banner Image
                                    </label>

                                    <input
                                        id="banner-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className={`${inputClass} file:mr-4 file:rounded-md file:border-0 file:bg-[#911824]/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#911824]`}
                                    />

                                    <p className="mt-2 text-xs leading-5 text-gray-500">
                                        Maximum image size: 5 MB. The selected
                                        image will be uploaded to Cloudinary
                                        when you save.
                                    </p>

                                    {selectedFile && (
                                        <p className="mt-2 break-all text-xs text-gray-600">
                                            Selected: {selectedFile.name}
                                        </p>
                                    )}

                                    {previewUrl && (
                                        <div className="mt-4">
                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                Image Preview
                                            </p>

                                            <div className="relative h-56 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                                {previewUrl.startsWith("blob:") ? (
                                                    <img
                                                        src={previewUrl}
                                                        alt="Selected banner preview"
                                                        className="h-full w-full object-contain"
                                                    />
                                                ) : (
                                                    <Image
                                                        src={previewUrl}
                                                        alt={
                                                            formData.imageAlt ||
                                                            "Banner preview"
                                                        }
                                                        fill
                                                        unoptimized
                                                        sizes="(max-width: 768px) 100vw, 800px"
                                                        className="object-contain"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-5">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    disabled={saving || loading}
                                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Reset
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving || loading}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#911824] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#77131d] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <FaSave aria-hidden="true" />
                                    )}

                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </section>
    );
}
