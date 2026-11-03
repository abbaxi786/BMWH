
"use client";

import axios from "axios";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
    FaChevronDown,
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaSave,
    FaEye,
    FaEyeSlash,
    FaArrowUp,
    FaArrowDown,
    FaHistory,
    FaRedo,
} from "react-icons/fa";

const API_URL = "/api/content/about_content/timeline";

type TimelineItem = {
    id: number;
    year: string;
    title: string;
    description: string;
    sort_order: number;
    is_active: boolean;
};

type TimelineFormData = {
    year: string;
    title: string;
    description: string;
    sort_order: number;
    is_active: boolean;
};

const initialForm: TimelineFormData = {
    year: "",
    title: "",
    description: "",
    sort_order: 0,
    is_active: true,
};

export default function TimelineHistoryAccordion() {
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState<TimelineItem[]>([]);
    const [form, setForm] = useState<TimelineFormData>(initialForm);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadTimeline = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            // all=true returns active and inactive records for the admin.
            const response = await axios.get(`${API_URL}?all=true`);

            const records: TimelineItem[] = response.data.data ?? [];

            setItems(
                [...records].sort(
                    (a, b) =>
                        a.sort_order - b.sort_order || a.id - b.id
                )
            );
        } catch (err) {
            console.error("Failed to fetch timeline history:", err);

            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message ||
                          "Failed to load timeline history."
                    : "Failed to load timeline history."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            void loadTimeline();
        }
    }, [isOpen, loadTimeline]);

    function resetForm() {
        setForm(initialForm);
        setEditingId(null);
    }

    function handleEdit(item: TimelineItem) {
        setForm({
            year: item.year,
            title: item.title,
            description: item.description,
            sort_order: item.sort_order,
            is_active: item.is_active,
        });

        setEditingId(item.id);
        setError("");
        setSuccess("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        const payload = {
            year: form.year.trim(),
            title: form.title.trim(),
            description: form.description.trim(),
            sort_order: Number(form.sort_order),
            is_active: form.is_active,
        };

        try {
            if (editingId !== null) {
                await axios.put(`${API_URL}?id=${editingId}`, payload);
                setSuccess("Timeline milestone updated successfully.");
            } else {
                await axios.post(API_URL, payload);
                setSuccess("Timeline milestone added successfully.");
            }

            resetForm();
            await loadTimeline();
        } catch (err) {
            console.error("Failed to save timeline milestone:", err);

            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message ||
                          "Failed to save timeline milestone."
                    : "Failed to save timeline milestone."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(item: TimelineItem) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${item.title}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        setDeletingId(item.id);
        setError("");
        setSuccess("");

        try {
            await axios.delete(`${API_URL}?id=${item.id}`);

            if (editingId === item.id) {
                resetForm();
            }

            setSuccess("Timeline milestone deleted successfully.");
            await loadTimeline();
        } catch (err) {
            console.error("Failed to delete timeline milestone:", err);

            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message ||
                          "Failed to delete timeline milestone."
                    : "Failed to delete timeline milestone."
            );
        } finally {
            setDeletingId(null);
        }
    }

    async function updateMilestone(
        item: TimelineItem,
        changes: Partial<Pick<TimelineItem, "is_active" | "sort_order">>
    ) {
        setError("");
        setSuccess("");

        try {
            await axios.put(`${API_URL}?id=${item.id}`, {
                year: item.year,
                title: item.title,
                description: item.description,
                sort_order: changes.sort_order ?? item.sort_order,
                is_active: changes.is_active ?? item.is_active,
            });

            setSuccess("Timeline settings updated successfully.");
            await loadTimeline();
        } catch (err) {
            console.error("Failed to update timeline settings:", err);

            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message ||
                          "Failed to update timeline settings."
                    : "Failed to update timeline settings."
            );
        }
    }

    async function moveMilestone(item: TimelineItem, direction: -1 | 1) {
        const index = items.findIndex((record) => record.id === item.id);
        const target = items[index + direction];

        if (!target) return;

        // Use distinct positive order values while swapping records.
        const temporaryOrder =
            Math.max(0, ...items.map((record) => record.sort_order)) + 1;

        setError("");
        setSuccess("");

        try {
            await axios.put(`${API_URL}?id=${target.id}`, {
                year: target.year,
                title: target.title,
                description: target.description,
                sort_order: temporaryOrder,
                is_active: target.is_active,
            });

            await axios.put(`${API_URL}?id=${item.id}`, {
                year: item.year,
                title: item.title,
                description: item.description,
                sort_order: target.sort_order,
                is_active: item.is_active,
            });

            await axios.put(`${API_URL}?id=${target.id}`, {
                year: target.year,
                title: target.title,
                description: target.description,
                sort_order: item.sort_order,
                is_active: target.is_active,
            });

            setSuccess("Timeline order updated successfully.");
            await loadTimeline();
        } catch (err) {
            console.error("Failed to reorder timeline:", err);

            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message ||
                          "Failed to reorder timeline."
                    : "Failed to reorder timeline."
            );

            await loadTimeline();
        }
    }

    return (
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Accordion Header */}
            <button
                type="button"
                onClick={() => setIsOpen((previous) => !previous)}
                aria-expanded={isOpen}
                className="
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-4
                    px-5
                    py-5
                    text-left
                    transition
                    hover:bg-gray-50
                    sm:px-6
                "
            >
                <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F8EBED] text-[#911824]">
                        <FaHistory size={19} aria-hidden="true" />
                    </span>

                    <span className="min-w-0">
                        <span className="block text-base font-bold text-gray-900 sm:text-lg">
                            Timeline History
                        </span>

                        <span className="mt-1 block text-sm text-gray-500">
                            Add, edit, reorder, publish, or delete milestones.
                        </span>
                    </span>
                </span>

                <FaChevronDown
                    aria-hidden="true"
                    className={`shrink-0 text-gray-500 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Accordion Content */}
            {isOpen && (
                <div className="space-y-6 border-t border-gray-100 p-4 sm:p-6">
                    {/* Alerts */}
                    {error && (
                        <div
                            role="alert"
                            className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            role="status"
                            className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                        >
                            {success}
                        </div>
                    )}

                    {/* Add / Edit Form */}
                    <div className="rounded-lg border border-gray-200 bg-gray-50/60">
                        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-4 sm:px-5">
                            <div>
                                <h3 className="font-bold text-gray-900">
                                    {editingId !== null
                                        ? "Edit Timeline Milestone"
                                        : "Add Timeline Milestone"}
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Enter the information to display on the
                                    public About page.
                                </p>
                            </div>

                            {editingId !== null && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#911824]"
                                >
                                    <FaTimes aria-hidden="true" />
                                    Cancel
                                </button>
                            )}
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-4 sm:p-5"
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-semibold text-gray-700">
                                        Year / Period
                                    </span>

                                    <input
                                        required
                                        maxLength={20}
                                        value={form.year}
                                        onChange={(event) =>
                                            setForm((previous) => ({
                                                ...previous,
                                                year: event.target.value,
                                            }))
                                        }
                                        placeholder="e.g. 2026"
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#911824] focus:ring-2 focus:ring-[#911824]/10"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-semibold text-gray-700">
                                        Milestone Title
                                    </span>

                                    <input
                                        required
                                        maxLength={255}
                                        value={form.title}
                                        onChange={(event) =>
                                            setForm((previous) => ({
                                                ...previous,
                                                title: event.target.value,
                                            }))
                                        }
                                        placeholder="e.g. Hospital Established"
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#911824] focus:ring-2 focus:ring-[#911824]/10"
                                    />
                                </label>
                            </div>

                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-gray-700">
                                    Description
                                </span>

                                <textarea
                                    required
                                    rows={4}
                                    value={form.description}
                                    onChange={(event) =>
                                        setForm((previous) => ({
                                            ...previous,
                                            description: event.target.value,
                                        }))
                                    }
                                    placeholder="Describe this milestone..."
                                    className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm leading-6 outline-none transition focus:border-[#911824] focus:ring-2 focus:ring-[#911824]/10"
                                />
                            </label>

                            <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-semibold text-gray-700">
                                        Display Order
                                    </span>

                                    <input
                                        required
                                        type="number"
                                        min={0}
                                        step={1}
                                        value={form.sort_order}
                                        onChange={(event) =>
                                            setForm((previous) => ({
                                                ...previous,
                                                sort_order: Number(
                                                    event.target.value
                                                ),
                                            }))
                                        }
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#911824] focus:ring-2 focus:ring-[#911824]/10"
                                    />
                                </label>

                                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 bg-white p-3.5">
                                    <input
                                        type="checkbox"
                                        checked={form.is_active}
                                        onChange={(event) =>
                                            setForm((previous) => ({
                                                ...previous,
                                                is_active: event.target.checked,
                                            }))
                                        }
                                        className="h-4 w-4 accent-[#911824]"
                                    />

                                    <span>
                                        <span className="block text-sm font-semibold text-gray-800">
                                            Publish milestone
                                        </span>
                                        <span className="mt-1 block text-xs text-gray-500">
                                            Display on the public website.
                                        </span>
                                    </span>
                                </label>
                            </div>

                            <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-md bg-[#911824] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#74131D] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {editingId !== null ? (
                                        <FaSave aria-hidden="true" />
                                    ) : (
                                        <FaPlus aria-hidden="true" />
                                    )}

                                    {saving
                                        ? "Saving..."
                                        : editingId !== null
                                          ? "Save Changes"
                                          : "Add Milestone"}
                                </button>

                                {editingId !== null && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                                    >
                                        <FaTimes aria-hidden="true" />
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Table Heading */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="font-bold text-gray-900">
                                Timeline Records
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                {items.length} milestone
                                {items.length === 1 ? "" : "s"} in total
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => void loadTimeline()}
                            disabled={loading}
                            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            <FaRedo
                                aria-hidden="true"
                                className={loading ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>
                    </div>

                    {/* Timeline Table */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full min-w-[850px] border-collapse text-left">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                                        Order
                                    </th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                                        Year
                                    </th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                                        Milestone
                                    </th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                                        Description
                                    </th>
                                    <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-10 text-center text-sm text-gray-500"
                                        >
                                            Loading timeline records...
                                        </td>
                                    </tr>
                                ) : items.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-10 text-center text-sm text-gray-500"
                                        >
                                            No timeline milestones found. Add
                                            your first milestone above.
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-gray-50/80"
                                        >
                                            <td className="px-4 py-4 text-sm font-semibold text-gray-700">
                                                {item.sort_order}
                                            </td>

                                            <td className="px-4 py-4 text-sm font-bold text-[#911824]">
                                                {item.year}
                                            </td>

                                            <td className="max-w-[220px] px-4 py-4">
                                                <p className="break-words text-sm font-semibold text-gray-900">
                                                    {item.title}
                                                </p>
                                            </td>

                                            <td className="max-w-[320px] px-4 py-4">
                                                <p className="line-clamp-3 whitespace-pre-line break-words text-sm leading-6 text-gray-600">
                                                    {item.description}
                                                </p>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                        item.is_active
                                                            ? "bg-green-50 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {item.is_active
                                                        ? "Published"
                                                        : "Hidden"}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        title="Move up"
                                                        aria-label={`Move ${item.title} up`}
                                                        disabled={index === 0}
                                                        onClick={() =>
                                                            void moveMilestone(
                                                                item,
                                                                -1
                                                            )
                                                        }
                                                        className="rounded-md border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <FaArrowUp aria-hidden="true" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Move down"
                                                        aria-label={`Move ${item.title} down`}
                                                        disabled={
                                                            index ===
                                                            items.length - 1
                                                        }
                                                        onClick={() =>
                                                            void moveMilestone(
                                                                item,
                                                                1
                                                            )
                                                        }
                                                        className="rounded-md border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                                                    >
                                                        <FaArrowDown aria-hidden="true" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title={
                                                            item.is_active
                                                                ? "Hide milestone"
                                                                : "Publish milestone"
                                                        }
                                                        aria-label={
                                                            item.is_active
                                                                ? `Hide ${item.title}`
                                                                : `Publish ${item.title}`
                                                        }
                                                        onClick={() =>
                                                            void updateMilestone(
                                                                item,
                                                                {
                                                                    is_active:
                                                                        !item.is_active,
                                                                }
                                                            )
                                                        }
                                                        className="rounded-md border border-gray-200 p-2 text-gray-600 transition hover:border-[#E4C3C7] hover:text-[#911824]"
                                                    >
                                                        {item.is_active ? (
                                                            <FaEyeSlash aria-hidden="true" />
                                                        ) : (
                                                            <FaEye aria-hidden="true" />
                                                        )}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Edit milestone"
                                                        aria-label={`Edit ${item.title}`}
                                                        onClick={() =>
                                                            handleEdit(item)
                                                        }
                                                        className="rounded-md border border-gray-200 p-2 text-[#911824] transition hover:bg-[#F8EBED]"
                                                    >
                                                        <FaEdit aria-hidden="true" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="Delete milestone"
                                                        aria-label={`Delete ${item.title}`}
                                                        disabled={
                                                            deletingId ===
                                                            item.id
                                                        }
                                                        onClick={() =>
                                                            void handleDelete(
                                                                item
                                                            )
                                                        }
                                                        className="rounded-md border border-red-100 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        <FaTrash aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
}
