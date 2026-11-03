
"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
    FaChevronDown,
    FaChevronUp,
    FaUserDoctor,
    FaImage,
    FaFloppyDisk,
} from "react-icons/fa6";

type FounderFormValues = {
    section_label: string;
    heading: string;
    founder_name: string;
    designation: string;
    message: string;
    read_more_text: string;
    read_more_url: string;
    english_quote: string;
    urdu_quote: string;
    quranic_ayat: string;
    quranic_surah: string;
    quranic_surah_number: string;
    quranic_ayat_number: string;
    quranic_translation: string;
    quranic_translation_language: string;
};

type FounderRecord = Partial<FounderFormValues> & {
    id?: number;
    image_url?: string | null;
    is_active?: boolean | number | string | null;
};

const initialValues: FounderFormValues = {
    section_label: "",
    heading: "",
    founder_name: "",
    designation: "",
    message: "",
    read_more_text: "",
    read_more_url: "",
    english_quote: "",
    urdu_quote: "",
    quranic_ayat: "",
    quranic_surah: "",
    quranic_surah_number: "",
    quranic_ayat_number: "",
    quranic_translation: "",
    quranic_translation_language: "English",
};

const fields: {
    name: keyof FounderFormValues;
    label: string;
    type?: "text" | "url" | "number" | "textarea";
    placeholder?: string;
    fullWidth?: boolean;
}[] = [
    {
        name: "section_label",
        label: "Section Label",
        placeholder: "From Our Founder",
    },
    {
        name: "heading",
        label: "Section Heading",
        placeholder: "A vision built around people",
    },
    {
        name: "founder_name",
        label: "Founder Name",
        placeholder: "Dr. Bashir Ahmed",
    },
    {
        name: "designation",
        label: "Designation",
        placeholder: "Founder",
    },
    {
        name: "message",
        label: "Founder Message",
        type: "textarea",
        placeholder: "Enter the founder's message",
        fullWidth: true,
    },
    {
        name: "read_more_text",
        label: "Read More Button Text",
        placeholder: "Read More",
    },
    {
        name: "read_more_url",
        label: "Read More URL",
        type: "url",
        placeholder: "/about/founder",
    },
    {
        name: "english_quote",
        label: "English Quote",
        type: "textarea",
        placeholder: "Enter an optional English quote",
        fullWidth: true,
    },
    {
        name: "urdu_quote",
        label: "Urdu Quote",
        type: "textarea",
        placeholder: "اردو اقتباس یہاں لکھیں",
        fullWidth: true,
    },
    {
        name: "quranic_ayat",
        label: "Quranic Ayat (Arabic)",
        type: "textarea",
        placeholder: "Enter the Arabic ayat",
        fullWidth: true,
    },
    {
        name: "quranic_surah",
        label: "Surah Name",
        placeholder: "Al-Baqarah",
    },
    {
        name: "quranic_surah_number",
        label: "Surah Number",
        type: "number",
        placeholder: "2",
    },
    {
        name: "quranic_ayat_number",
        label: "Ayat Number",
        type: "number",
        placeholder: "255",
    },
    {
        name: "quranic_translation_language",
        label: "Translation Language",
        placeholder: "English",
    },
    {
        name: "quranic_translation",
        label: "Quranic Translation",
        type: "textarea",
        placeholder: "Enter the translation",
        fullWidth: true,
    },
];

function extractFounderRecord(responseData: unknown): FounderRecord {
    const response = responseData as Record<string, unknown>;

    // Supports common API response shapes:
    // { data: record }, { founder: record }, { content: record }, or record.
    const candidate =
        response?.data ??
        response?.founder ??
        response?.founderMessage ??
        response?.content ??
        responseData;

    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
        return candidate as FounderRecord;
    }

    return {};
}

function toFormValues(record: FounderRecord): FounderFormValues {
    return {
        section_label: String(record.section_label ?? ""),
        heading: String(record.heading ?? ""),
        founder_name: String(record.founder_name ?? ""),
        designation: String(record.designation ?? ""),
        message: String(record.message ?? ""),
        read_more_text: String(record.read_more_text ?? ""),
        read_more_url: String(record.read_more_url ?? ""),
        english_quote: String(record.english_quote ?? ""),
        urdu_quote: String(record.urdu_quote ?? ""),
        quranic_ayat: String(record.quranic_ayat ?? ""),
        quranic_surah: String(record.quranic_surah ?? ""),
        quranic_surah_number:
            record.quranic_surah_number == null
                ? ""
                : String(record.quranic_surah_number),
        quranic_ayat_number:
            record.quranic_ayat_number == null
                ? ""
                : String(record.quranic_ayat_number),
        quranic_translation: String(record.quranic_translation ?? ""),
        quranic_translation_language: String(
            record.quranic_translation_language ?? "English"
        ),
    };
}

function isRecordActive(value: FounderRecord["is_active"]): boolean {
    if (value === undefined || value === null) return true;
    return value === true || value === 1 || value === "1" || value === "true";
}

export default function FounderMessageAccordion() {
    const [isOpen, setIsOpen] = useState(false);
    const [values, setValues] = useState<FounderFormValues>(initialValues);
    const [isActive, setIsActive] = useState(true);

    const [imageUrl, setImageUrl] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const loadFounder = useCallback(async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.get("/api/content/about_content/founder_message");
            const record = extractFounderRecord(response.data);

            setValues(toFormValues(record));
            setIsActive(isRecordActive(record.is_active));
            setImageUrl(String(record.image_url ?? ""));
        } catch (error) {
            console.error("Unable to load founder content:", error);
            setErrorMessage(
                axios.isAxiosError(error)
                    ? String(
                          error.response?.data?.error ??
                              error.response?.data?.message ??
                              "Unable to load founder content. Check the API route."
                      )
                    : "Unable to load founder content."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadFounder();
    }, [loadFounder]);

    useEffect(() => {
        if (!selectedImage) {
            setImagePreview("");
            return;
        }

        const objectUrl = URL.createObjectURL(selectedImage);
        setImagePreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedImage]);

    const handleFieldChange = (
        name: keyof FounderFormValues,
        value: string
    ) => {
        setValues((current) => ({ ...current, [name]: value }));
        setSuccessMessage("");
        setErrorMessage("");
    };

    const handleImageChange = (file: File | undefined) => {
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setErrorMessage("Please select a valid image file.");
            return;
        }

        setSelectedImage(file);
        setSuccessMessage("");
        setErrorMessage("");
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSaving(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const formData = new FormData();

            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
            });

            formData.append("is_active", String(isActive));

            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            const response = await axios.put(
                "/api/content/about_content/founder_message",
                formData
            );

            const updatedRecord = extractFounderRecord(response.data);

            // Refresh the image URL if the API returns the updated record.
            if (updatedRecord.image_url !== undefined) {
                setImageUrl(String(updatedRecord.image_url ?? ""));
            }

            setSelectedImage(null);
            setImagePreview("");

            // Reload the saved values from the GET endpoint.
            await loadFounder();

            setSuccessMessage("Founder content saved successfully.");
        } catch (error) {
            console.error("Unable to save founder content:", error);

            setErrorMessage(
                axios.isAxiosError(error)
                    ? String(
                          error.response?.data?.error ??
                              error.response?.data?.message ??
                              "Unable to save founder content. Please try again."
                      )
                    : "An unexpected error occurred while saving."
            );
        } finally {
            setSaving(false);
        }
    };

    const displayedImage = imagePreview || imageUrl;

    return (
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50"
            >
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-700">
                        <FaUserDoctor />
                    </div>

                    <div className="min-w-0">
                        <h2 className="font-semibold text-gray-900">
                            Founder Content
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage the founder&apos;s message, image, quotes,
                            and Quranic references.
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

                    {loading ? (
                        <p className="py-8 text-center text-sm text-gray-500">
                            Loading founder content...
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                {fields.map((field) => (
                                    <div
                                        key={field.name}
                                        className={
                                            field.fullWidth
                                                ? "md:col-span-2"
                                                : ""
                                        }
                                    >
                                        <label
                                            htmlFor={`founder-${field.name}`}
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            {field.label}
                                        </label>

                                        {field.type === "textarea" ? (
                                            <textarea
                                                id={`founder-${field.name}`}
                                                value={values[field.name]}
                                                onChange={(event) =>
                                                    handleFieldChange(
                                                        field.name,
                                                        event.target.value
                                                    )
                                                }
                                                placeholder={field.placeholder}
                                                rows={
                                                    field.name === "message"
                                                        ? 6
                                                        : 3
                                                }
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                            />
                                        ) : (
                                            <input
                                                id={`founder-${field.name}`}
                                                type={field.type ?? "text"}
                                                value={values[field.name]}
                                                onChange={(event) =>
                                                    handleFieldChange(
                                                        field.name,
                                                        event.target.value
                                                    )
                                                }
                                                placeholder={field.placeholder}
                                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Founder image */}
                            <div className="border-t border-gray-100 pt-5">
                                <label
                                    htmlFor="founder-image"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Founder Image
                                </label>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-[160px_1fr]">
                                    <div className="flex min-h-36 items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50">
                                        {displayedImage ? (
                                            <img
                                                src={displayedImage}
                                                alt="Founder preview"
                                                className="h-40 w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 p-4 text-sm text-gray-400">
                                                <FaImage className="text-2xl" />
                                                No image selected
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            id="founder-image"
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) =>
                                                handleImageChange(
                                                    event.target.files?.[0]
                                                )
                                            }
                                            className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-red-50 file:px-4 file:py-2.5 file:font-medium file:text-red-700 hover:file:bg-red-100"
                                        />

                                        <p className="mt-2 text-xs text-gray-500">
                                            Choose an image to replace the
                                            current one. It will be uploaded
                                            when you save.
                                        </p>

                                        {selectedImage && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedImage(null);
                                                    setErrorMessage("");
                                                }}
                                                className="mt-3 text-sm font-medium text-red-700 hover:text-red-800"
                                            >
                                                Cancel image selection
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Visibility */}
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(event) =>
                                            setIsActive(event.target.checked)
                                        }
                                        className="h-4 w-4 rounded border-gray-300 accent-red-700"
                                    />
                                    <span className="text-sm font-medium text-gray-800">
                                        Show founder section on the website
                                    </span>
                                </label>
                            </div>

                            <div className="flex justify-end border-t border-gray-100 pt-5">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <FaFloppyDisk />
                                    {saving ? "Saving..." : "Save Founder Content"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </section>
    );
}
