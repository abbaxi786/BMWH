"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
    FaUsers,
    FaHandHoldingHeart,
    FaClock,
    FaFloppyDisk,
    FaRotate,
    FaCircleCheck,
    FaCircleExclamation,
} from "react-icons/fa6";

interface ImpactStat {
    id: number;
    target: number;
    suffix: string;
    title: string;
    description: string;
    display_order: number;
    is_active: boolean;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

const FIXED_CARDS = [
    {
        order: 1,
        icon: FaUsers,
        color: "bg-[#86000D]",
        label: "Maroon card",
    },
    {
        order: 2,
        icon: FaHandHoldingHeart,
        color: "bg-[#E9E8E8]",
        label: "Light gray card",
    },
    {
        order: 3,
        icon: FaClock,
        color: "bg-[#303031]",
        label: "Dark zinc card",
    },
];

function getErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError(error)) {
        return (
            error.response?.data?.message ||
            error.message ||
            fallback
        );
    }

    return error instanceof Error ? error.message : fallback;
}

export default function ImpactStatsSettings() {
    const [stats, setStats] = useState<ImpactStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Load the latest statistics from the API.
    const loadStats = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get<ApiResponse<ImpactStat[]>>(
                "/api/content/stats",
                {
                    withCredentials: true,
                    headers: {
                        "Cache-Control": "no-cache",
                        Pragma: "no-cache",
                    },
                    params: {
                        _t: Date.now(),
                    },
                }
            );

            if (!response.data.success || !Array.isArray(response.data.data)) {
                throw new Error(
                    response.data.message ||
                        "The statistics API returned invalid data."
                );
            }

            const sortedStats = [...response.data.data].sort(
                (a, b) => a.display_order - b.display_order
            );

            setStats(sortedStats);
        } catch (err) {
            console.error("Failed to load impact statistics:", err);
            setError(
                getErrorMessage(
                    err,
                    "Failed to load impact statistics."
                )
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadStats();
    }, [loadStats]);

    const updateField = (
        id: number,
        field: keyof Pick<
            ImpactStat,
            "target" | "suffix" | "title" | "description" | "is_active"
        >,
        value: string | number | boolean
    ) => {
        setStats((current) =>
            current.map((stat) =>
                stat.id === id ? { ...stat, [field]: value } : stat
            )
        );

        setError("");
        setSuccess("");
    };

    // Save changes to the database.
    const saveStat = async (stat: ImpactStat) => {
        setSavingId(stat.id);
        setError("");
        setSuccess("");

        try {
            const response = await axios.patch<ApiResponse<ImpactStat>>(
                "/api/content/stats",
                {
                    id: stat.id,
                    target: stat.target,
                    suffix: stat.suffix,
                    title: stat.title,
                    description: stat.description,
                    is_active: stat.is_active,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache",
                    },
                }
            );

            if (!response.data.success || !response.data.data) {
                throw new Error(
                    response.data.message ||
                        "Failed to save impact statistic."
                );
            }

            // Reload from the database-backed GET endpoint rather than
            // relying only on the PATCH response.
            await loadStats();

            setSuccess(
                `"${response.data.data.title}" saved successfully.`
            );
        } catch (err) {
            console.error("Failed to save impact statistic:", err);
            setError(
                getErrorMessage(
                    err,
                    "Failed to save impact statistic."
                )
            );
        } finally {
            setSavingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center gap-3 text-zinc-600">
                <FaRotate className="animate-spin text-xl" />
                <span>Loading impact statistics...</span>
            </div>
        );
    }

    return (
        <section className="w-full space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-zinc-900">
                        Impact Statistics
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                        Manage the three statistics displayed on your website.
                        Icons, colors, and layout are fixed.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => void loadStats()}
                    disabled={loading || savingId !== null}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <FaRotate />
                    Refresh
                </button>
            </div>

            {error && (
                <div
                    role="alert"
                    className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
                >
                    <FaCircleExclamation className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div
                    role="status"
                    className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                >
                    <FaCircleCheck className="mt-0.5 shrink-0" />
                    <span>{success}</span>
                </div>
            )}

            {stats.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center">
                    <h3 className="font-semibold text-zinc-800">
                        No impact statistics found
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500">
                        Check that the impact_stats table contains records
                        and that the GET API returns them.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {stats.map((stat) => {
                        const fixed = FIXED_CARDS.find(
                            (card) => card.order === stat.display_order
                        );

                        const Icon = fixed?.icon ?? FaUsers;
                        const cardColor = fixed?.color ?? "bg-zinc-100";

                        return (
                            <article
                                key={stat.id}
                                className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
                            >
                                <div
                                    className={`${cardColor} flex items-center justify-between gap-4 p-5 ${
                                        stat.display_order === 2
                                            ? "text-[#5B403D]"
                                            : "text-white"
                                    }`}
                                >
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold uppercase tracking-widest opacity-75">
                                            {fixed?.label ??
                                                `Card ${stat.display_order}`}
                                        </p>

                                        <p className="mt-2 text-3xl font-bold tracking-tight">
                                            {stat.target}
                                            {stat.suffix}
                                        </p>

                                        <h3 className="mt-1 wrap-break-words text-lg font-semibold">
                                            {stat.title || "Untitled statistic"}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 text-sm opacity-80">
                                            {stat.description ||
                                                "No description provided."}
                                        </p>
                                    </div>

                                    <Icon className="shrink-0 text-3xl" />
                                </div>

                                <div className="space-y-4 p-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label
                                                htmlFor={`target-${stat.id}`}
                                                className="mb-1.5 block text-sm font-semibold text-zinc-700"
                                            >
                                                Counter Target
                                            </label>

                                            <input
                                                id={`target-${stat.id}`}
                                                type="number"
                                                min={0}
                                                step={1}
                                                value={stat.target}
                                                onChange={(event) =>
                                                    updateField(
                                                        stat.id,
                                                        "target",
                                                        event.target.value === ""
                                                            ? 0
                                                            : Number(event.target.value)
                                                    )
                                                }
                                                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-[#86000D] focus:ring-2 focus:ring-[#86000D]/10"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor={`suffix-${stat.id}`}
                                                className="mb-1.5 block text-sm font-semibold text-zinc-700"
                                            >
                                                Number Suffix
                                            </label>

                                            <input
                                                id={`suffix-${stat.id}`}
                                                type="text"
                                                maxLength={20}
                                                value={stat.suffix}
                                                onChange={(event) =>
                                                    updateField(
                                                        stat.id,
                                                        "suffix",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="e.g. K+"
                                                className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-[#86000D] focus:ring-2 focus:ring-[#86000D]/10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`title-${stat.id}`}
                                            className="mb-1.5 block text-sm font-semibold text-zinc-700"
                                        >
                                            Card Title
                                        </label>

                                        <input
                                            id={`title-${stat.id}`}
                                            type="text"
                                            maxLength={150}
                                            required
                                            value={stat.title}
                                            onChange={(event) =>
                                                updateField(
                                                    stat.id,
                                                    "title",
                                                    event.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-[#86000D] focus:ring-2 focus:ring-[#86000D]/10"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor={`description-${stat.id}`}
                                            className="mb-1.5 block text-sm font-semibold text-zinc-700"
                                        >
                                            Description
                                        </label>

                                        <textarea
                                            id={`description-${stat.id}`}
                                            rows={3}
                                            value={stat.description}
                                            onChange={(event) =>
                                                updateField(
                                                    stat.id,
                                                    "description",
                                                    event.target.value
                                                )
                                            }
                                            className="w-full resize-y rounded-lg border border-zinc-300 px-3 py-2.5 outline-none transition focus:border-[#86000D] focus:ring-2 focus:ring-[#86000D]/10"
                                        />
                                    </div>

                                    <label
                                        htmlFor={`active-${stat.id}`}
                                        className="flex cursor-pointer items-center justify-between gap-3 rounded-lg bg-zinc-50 p-3"
                                    >
                                        <span>
                                            <span className="block text-sm font-semibold text-zinc-800">
                                                Display on website
                                            </span>
                                            <span className="mt-0.5 block text-xs text-zinc-500">
                                                Inactive cards are hidden from
                                                the public API.
                                            </span>
                                        </span>

                                        <input
                                            id={`active-${stat.id}`}
                                            type="checkbox"
                                            checked={stat.is_active}
                                            onChange={(event) =>
                                                updateField(
                                                    stat.id,
                                                    "is_active",
                                                    event.target.checked
                                                )
                                            }
                                            className="h-5 w-5 accent-[#86000D]"
                                        />
                                    </label>

                                    <div className="flex justify-end border-t border-zinc-100 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => void saveStat(stat)}
                                            disabled={
                                                savingId !== null ||
                                                !stat.title.trim() ||
                                                !Number.isInteger(stat.target) ||
                                                stat.target < 0
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#86000D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6F000A] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {savingId === stat.id ? (
                                                <>
                                                    <FaRotate className="animate-spin" />
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
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            <p className="text-xs leading-relaxed text-zinc-500">
                Changes are saved to PostgreSQL when you click Save Changes.
                The frontend icons and visual styling are not editable here.
            </p>
        </section>
    );
}
