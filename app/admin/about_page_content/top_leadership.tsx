
"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import {
    FaChevronDown,
    FaHandHoldingHeart,
    FaQuoteLeft,
    FaSave,
    FaUserTie,
} from "react-icons/fa";

// KEEP YOUR ORIGINAL API ROUTE
const API_URL = "/api/content/about_content/top_leadership";

export const dynamic = "force-static";

type LeaderKey = "chairman" | "president";

type Leader = {
    id?: number;
    leader_key: LeaderKey;
    name: string;
    designation: string;
    image: string;
    section_label: string;
    heading: string;
    signature_text: string;
    message: string[];
    quranic_verse: string | null;
    quranic_translation: string | null;
    quranic_reference: string | null;
    is_active: boolean;
};

const defaultLeaders: Leader[] = [
    {
        leader_key: "chairman",
        name: "Sohail Iqbal",
        designation: "Chairman, Bashir Memorial Welfare Hospital",
        image: "/person/sohail-iqbal.jpg",
        section_label: "Chairman's Message",
        heading: "A Vision for Better Healthcare",
        signature_text: "With sincere appreciation,",
        message: [],
        quranic_verse: null,
        quranic_translation: null,
        quranic_reference: null,
        is_active: true,
    },
    {
        leader_key: "president",
        name: "Sohaib Afzal",
        designation: "President, Bashir Memorial Welfare Hospital",
        image: "/images/about/president.jpg",
        section_label: "President's Message",
        heading: "Serving Humanity With Faith",
        signature_text: "With heartfelt gratitude,",
        message: [],
        quranic_verse: "وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ",
        quranic_translation:
            "And when I am ill, it is He (Allah) who cures me.",
        quranic_reference: "Surah Ash-Shu'ara — 26:80",
        is_active: true,
    },
];

const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#911824] focus:ring-2 focus:ring-[#911824]/10";

const labelClass =
    "mb-1.5 block text-sm font-semibold text-gray-700";

function normalizeLeader(
    item: Partial<Leader>,
    leaderKey: LeaderKey
): Leader {
    const fallback =
        defaultLeaders.find(
            (leader) => leader.leader_key === leaderKey
        )!;

    return {
        ...fallback,
        ...item,
        leader_key: leaderKey,
        name: item.name ?? fallback.name,
        designation: item.designation ?? fallback.designation,
        image: item.image ?? fallback.image,
        section_label: item.section_label ?? fallback.section_label,
        heading: item.heading ?? fallback.heading,
        signature_text:
            item.signature_text ?? fallback.signature_text,
        message: Array.isArray(item.message)
            ? item.message
            : fallback.message,
        quranic_verse:
            item.quranic_verse === undefined
                ? fallback.quranic_verse
                : item.quranic_verse,
        quranic_translation:
            item.quranic_translation === undefined
                ? fallback.quranic_translation
                : item.quranic_translation,
        quranic_reference:
            item.quranic_reference === undefined
                ? fallback.quranic_reference
                : item.quranic_reference,
        is_active: item.is_active ?? fallback.is_active,
    };
}

export default function TopLeadershipAccordion() {
    const [leaders, setLeaders] =
        useState<Leader[]>(defaultLeaders);

    const [openLeader, setOpenLeader] =
        useState<LeaderKey | null>("chairman");

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] =
        useState<LeaderKey | null>(null);

    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    // Separate selected image files for each leader
    const [imageFiles, setImageFiles] = useState<
        Record<LeaderKey, File | null>
    >({
        chairman: null,
        president: null,
    });

    // ==========================================
    // FETCH LEADERS
    // ==========================================

    const fetchLeaders = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(API_URL);
            const payload = response.data;

            const records = Array.isArray(payload?.data)
                ? payload.data
                : payload?.data
                    ? [payload.data]
                    : [];

            setLeaders(
                (["chairman", "president"] as LeaderKey[]).map(
                    (leaderKey) => {
                        const record = records.find(
                            (item: Partial<Leader>) =>
                                item.leader_key === leaderKey
                        );

                        return normalizeLeader(
                            record ?? {},
                            leaderKey
                        );
                    }
                )
            );
        } catch (err) {
            console.error(
                "Failed to load top leadership:",
                err
            );

            setError(
                "Unable to load leadership content. Check the API route and try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchLeaders();
    }, [fetchLeaders]);

    // ==========================================
    // UPDATE LEADER STATE
    // ==========================================

    const updateLeader = (
        leaderKey: LeaderKey,
        field: keyof Leader,
        value: string | boolean | string[] | null
    ) => {
        setLeaders((current) =>
            current.map((leader) =>
                leader.leader_key === leaderKey
                    ? { ...leader, [field]: value }
                    : leader
            )
        );

        setNotice("");
    };

    // ==========================================
    // IMAGE FILE HANDLING
    // ==========================================

    const handleImageChange = (
        leaderKey: LeaderKey,
        file: File | null
    ) => {
        setError("");
        setNotice("");

        if (!file) {
            setImageFiles((current) => ({
                ...current,
                [leaderKey]: null,
            }));

            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must not exceed 5MB.");
            return;
        }

        setImageFiles((current) => ({
            ...current,
            [leaderKey]: file,
        }));
    };

    // ==========================================
    // SAVE LEADER
    // ==========================================

    const saveLeader = async (leaderKey: LeaderKey) => {
        const leader = leaders.find(
            (item) => item.leader_key === leaderKey
        );

        if (!leader) return;

        const selectedFile = imageFiles[leaderKey];

        setSaving(leaderKey);
        setError("");
        setNotice("");

        try {
            const payload = {
                leader_key: leader.leader_key,
                name: leader.name,
                designation: leader.designation,
                section_label: leader.section_label,
                heading: leader.heading,
                signature_text: leader.signature_text,
                message: leader.message,
                quranic_verse: leader.quranic_verse,
                quranic_translation: leader.quranic_translation,
                quranic_reference: leader.quranic_reference,
                is_active: leader.is_active,
            };

            let response;

            // ==================================
            // OPTION 1: IMAGE FILE UPLOAD
            // ==================================

            if (selectedFile) {
                const formData = new FormData();

                formData.append(
                    "leader_key",
                    leader.leader_key
                );

                formData.append("name", leader.name);
                formData.append(
                    "designation",
                    leader.designation
                );

                formData.append(
                    "section_label",
                    leader.section_label
                );

                formData.append("heading", leader.heading);

                formData.append(
                    "signature_text",
                    leader.signature_text
                );

                formData.append(
                    "message",
                    JSON.stringify(leader.message)
                );

                formData.append(
                    "quranic_verse",
                    leader.quranic_verse ?? ""
                );

                formData.append(
                    "quranic_translation",
                    leader.quranic_translation ?? ""
                );

                formData.append(
                    "quranic_reference",
                    leader.quranic_reference ?? ""
                );

                formData.append(
                    "is_active",
                    String(leader.is_active)
                );

                // File is uploaded to Cloudinary by the API
                formData.append("image", selectedFile);

                response = await axios.patch(
                    API_URL,
                    formData
                );
            }

            // ==================================
            // OPTION 2: IMAGE URL OR TEXT UPDATE
            // ==================================

            else {
                const jsonPayload: Record<string, unknown> = {
                    ...payload,
                };

                // Only send an image when it is an absolute
                // HTTP/HTTPS URL.
                //
                // If the existing image is a local path,
                // omit it so the database image remains unchanged.

                const imageValue = leader.image.trim();

                if (imageValue) {
                    if (/^https?:\/\//i.test(imageValue)) {
                        try {
                            const parsedUrl = new URL(imageValue);

                            if (
                                parsedUrl.protocol !== "https:" &&
                                parsedUrl.protocol !== "http:"
                            ) {
                                throw new Error();
                            }

                            jsonPayload.image = imageValue;
                        } catch {
                            throw new Error(
                                "Please enter a valid HTTP or HTTPS image URL."
                            );
                        }
                    } else if (!imageValue.startsWith("/")) {
                        throw new Error(
                            "Please enter a valid image URL."
                        );
                    }
                }

                response = await axios.patch(
                    API_URL,
                    jsonPayload
                );
            }

            if (response.data?.success === false) {
                throw new Error(
                    response.data?.message ||
                    "Unable to save leadership content."
                );
            }

            // ==================================
            // UPDATE FRONTEND WITH SAVED DATA
            // ==================================

            if (response.data?.data) {
                const saved = normalizeLeader(
                    response.data.data,
                    leaderKey
                );

                setLeaders((current) =>
                    current.map((item) =>
                        item.leader_key === leaderKey
                            ? saved
                            : item
                    )
                );
            } else if (selectedFile) {
                // Refetch if the API doesn't return updated data
                await fetchLeaders();
            }

            // Clear uploaded file after successful save
            setImageFiles((current) => ({
                ...current,
                [leaderKey]: null,
            }));

            setNotice(
                `${
                    leaderKey === "chairman"
                        ? "Chairman's"
                        : "President's"
                } content saved successfully.`
            );

        } catch (err) {
            console.error(
                "Failed to save top leadership:",
                err
            );

            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message ||
                        "Unable to save changes. Please try again."
                    : err instanceof Error
                        ? err.message
                        : "Unable to save changes."
            );
        } finally {
            setSaving(null);
        }
    };

    // ==========================================
    // LEADER FORM
    // ==========================================

    const renderLeaderForm = (leader: Leader) => {
        const leaderKey = leader.leader_key;
        const isChairman = leaderKey === "chairman";

        const selectedFile = imageFiles[leaderKey];

        return (
            <div className="space-y-6 p-4 sm:p-6">

                {/* ACTIVE STATUS */}

                <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-gray-800">
                            Section visibility
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                            {leader.is_active
                                ? "This leadership section is enabled."
                                : "This leadership section is disabled on the website."}
                        </p>
                    </div>

                    <label className="inline-flex cursor-pointer items-center gap-3">
                        <span
                            className={`text-sm font-semibold ${
                                leader.is_active
                                    ? "text-emerald-700"
                                    : "text-gray-500"
                            }`}
                        >
                            {leader.is_active ? "Active" : "Inactive"}
                        </span>

                        <input
                            type="checkbox"
                            checked={leader.is_active}
                            onChange={(event) =>
                                updateLeader(
                                    leaderKey,
                                    "is_active",
                                    event.target.checked
                                )
                            }
                            className="peer sr-only"
                            aria-label={`Set ${leaderKey} section active`}
                        />

                        <span
                            className={`relative h-6 w-11 rounded-full transition ${
                                leader.is_active
                                    ? "bg-emerald-600"
                                    : "bg-gray-300"
                            }`}
                        >
                            <span
                                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                                    leader.is_active
                                        ? "left-[22px]"
                                        : "left-0.5"
                                }`}
                            />
                        </span>
                    </label>
                </div>

                {/* LEADER INFORMATION */}

                <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                        <FaUserTie className="text-[#911824]" />
                        Leader Information
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <div>
                            <label className={labelClass}>
                                Full name
                            </label>

                            <input
                                className={inputClass}
                                value={leader.name}
                                onChange={(e) =>
                                    updateLeader(
                                        leaderKey,
                                        "name",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter leader name"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                Designation
                            </label>

                            <input
                                className={inputClass}
                                value={leader.designation}
                                onChange={(e) =>
                                    updateLeader(
                                        leaderKey,
                                        "designation",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter designation"
                            />
                        </div>

                        {/* IMAGE MANAGEMENT */}

                        <div className="md:col-span-2">
                            <label className={labelClass}>
                                Leader Image
                            </label>

                            {/* IMAGE URL */}

                            <input
                                type="url"
                                className={inputClass}
                                value={leader.image}
                                onChange={(e) => {
                                    updateLeader(
                                        leaderKey,
                                        "image",
                                        e.target.value
                                    );

                                    // Clear selected file when URL changes
                                    setImageFiles((current) => ({
                                        ...current,
                                        [leaderKey]: null,
                                    }));
                                }}
                                placeholder="https://example.com/leader.jpg"
                            />

                            <p className="mt-1.5 text-xs text-gray-500">
                                Enter an external HTTP/HTTPS image URL.
                                Leave unchanged to keep the current image.
                            </p>

                            {/* CLOUDINARY FILE UPLOAD */}

                            <div className="mt-4">
                                <label className={labelClass}>
                                    Or Upload Image to Cloudinary
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-[#911824]/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#911824]`}
                                    onChange={(e) => {
                                        const file =
                                            e.target.files?.[0] || null;

                                        handleImageChange(
                                            leaderKey,
                                            file
                                        );

                                        // Reset input so the same file
                                        // can be selected again.
                                        if (!file) {
                                            e.target.value = "";
                                        }
                                    }}
                                />

                                <p className="mt-1.5 text-xs text-gray-500">
                                    Supported image files. Maximum size: 5MB.
                                    Images are converted to WebP and uploaded
                                    to Cloudinary when you save.
                                </p>

                                {/* SELECTED FILE */}

                                {selectedFile && (
                                    <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-blue-800">
                                                New image selected
                                            </p>

                                            <p className="mt-1 truncate text-xs text-blue-700">
                                                {selectedFile.name}
                                            </p>

                                            <p className="text-xs text-blue-600">
                                                {(
                                                    selectedFile.size /
                                                    (1024 * 1024)
                                                ).toFixed(2)}{" "}
                                                MB
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImageFiles((current) => ({
                                                    ...current,
                                                    [leaderKey]: null,
                                                }));
                                            }}
                                            className="shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* CURRENT IMAGE PREVIEW */}

                            {leader.image && (
                                <div className="mt-4 flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={leader.image}
                                            alt={`${leader.name} preview`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-gray-700">
                                            Current image
                                        </p>

                                        <p className="mt-1 break-all text-xs text-gray-500">
                                            {leader.image}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* MESSAGE CONTENT */}

                <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                        <FaQuoteLeft className="text-[#911824]" />
                        Message Content
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <div>
                            <label className={labelClass}>
                                Section label
                            </label>

                            <input
                                className={inputClass}
                                value={leader.section_label}
                                onChange={(e) =>
                                    updateLeader(
                                        leaderKey,
                                        "section_label",
                                        e.target.value
                                    )
                                }
                                placeholder="Chairman's Message"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                Message heading
                            </label>

                            <input
                                className={inputClass}
                                value={leader.heading}
                                onChange={(e) =>
                                    updateLeader(
                                        leaderKey,
                                        "heading",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter message heading"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>
                                Message paragraphs
                            </label>

                            <textarea
                                rows={9}
                                className={inputClass}
                                value={leader.message.join("\n\n")}
                                onChange={(e) =>
                                    updateLeader(
                                        leaderKey,
                                        "message",
                                        e.target.value
                                            .split(/\n\s*\n/)
                                            .map((paragraph) =>
                                                paragraph.trim()
                                            )
                                            .filter(Boolean)
                                    )
                                }
                                placeholder="Enter each paragraph separated by a blank line."
                            />

                            <p className="mt-1.5 text-xs text-gray-500">
                                Separate paragraphs with a blank line.
                                Each paragraph is saved as a separate item.
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <label className={labelClass}>
                                Signature text
                            </label>

                            <input
                                className={inputClass}
                                value={leader.signature_text}
                                onChange={(e) =>
                                    updateLeader(
                                        leaderKey,
                                        "signature_text",
                                        e.target.value
                                    )
                                }
                                placeholder="With sincere appreciation,"
                            />
                        </div>
                    </div>
                </div>

                {/* PRESIDENT QURANIC VERSE */}

                {!isChairman && (
                    <div className="rounded-xl border border-[#E4BEBA] bg-[#FBF9F9] p-4 sm:p-5">

                        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-[#911824]">
                            <FaHandHoldingHeart />
                            Quranic Verse
                        </h3>

                        <div className="space-y-4">

                            <div>
                                <label className={labelClass}>
                                    Arabic verse
                                </label>

                                <textarea
                                    dir="rtl"
                                    rows={2}
                                    className={`${inputClass} text-right text-xl leading-9`}
                                    value={leader.quranic_verse ?? ""}
                                    onChange={(e) =>
                                        updateLeader(
                                            leaderKey,
                                            "quranic_verse",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter Arabic verse"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    English translation
                                </label>

                                <textarea
                                    rows={3}
                                    className={inputClass}
                                    value={
                                        leader.quranic_translation ?? ""
                                    }
                                    onChange={(e) =>
                                        updateLeader(
                                            leaderKey,
                                            "quranic_translation",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter translation"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Quranic reference
                                </label>

                                <input
                                    className={inputClass}
                                    value={
                                        leader.quranic_reference ?? ""
                                    }
                                    onChange={(e) =>
                                        updateLeader(
                                            leaderKey,
                                            "quranic_reference",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Surah Ash-Shu'ara — 26:80"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* SAVE BUTTON */}

                <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-xs text-gray-500">
                        Changes apply to this leader only.
                    </p>

                    <button
                        type="button"
                        onClick={() => void saveLeader(leaderKey)}
                        disabled={saving !== null}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#911824] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#74121c] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <FaSave />

                        {saving === leaderKey
                            ? "Saving..."
                            : "Save Changes"}
                    </button>
                </div>
            </div>
        );
    };

    // ==========================================
    // MAIN ACCORDION
    // ==========================================

    return (
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
                <h2 className="text-lg font-bold text-gray-900">
                    Top Leadership
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Manage the Chairman and President messages displayed on
                    the About page.
                </p>
            </div>

            {/* ERROR */}

            {error && (
                <div
                    role="alert"
                    className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6"
                >
                    {error}
                </div>
            )}

            {/* SUCCESS */}

            {notice && (
                <div
                    role="status"
                    className="mx-4 mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 sm:mx-6"
                >
                    {notice}
                </div>
            )}

            {/* LOADING */}

            {loading ? (
                <div className="space-y-4 p-6">
                    <div className="h-12 animate-pulse rounded-lg bg-gray-100" />

                    <div className="h-12 animate-pulse rounded-lg bg-gray-100" />

                    <p className="text-center text-sm text-gray-500">
                        Loading leadership content...
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-gray-200">

                    {leaders.map((leader) => {
                        const isOpen =
                            openLeader === leader.leader_key;

                        const title =
                            leader.leader_key === "chairman"
                                ? "Chairman Message"
                                : "President Message";

                        return (
                            <div key={leader.leader_key}>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenLeader(
                                            isOpen
                                                ? null
                                                : leader.leader_key
                                        )
                                    }
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50 sm:px-6"
                                >
                                    <span className="flex min-w-0 items-center gap-3">

                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#911824]/10 text-[#911824]">
                                            <FaUserTie />
                                        </span>

                                        <span className="min-w-0">
                                            <span className="block font-semibold text-gray-900">
                                                {title}
                                            </span>

                                            <span className="mt-1 block truncate text-sm text-gray-500">
                                                {leader.name}
                                            </span>
                                        </span>
                                    </span>

                                    <span className="flex shrink-0 items-center gap-3">

                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                leader.is_active
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {leader.is_active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

                                        <FaChevronDown
                                            className={`text-gray-400 transition-transform ${
                                                isOpen
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </span>
                                </button>

                                {isOpen && renderLeaderForm(leader)}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
