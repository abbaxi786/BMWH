"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import {
    FiEye,
    FiEdit2,
    FiTrash2,
    FiStar,
} from "react-icons/fi";

export interface NewsUpdate {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    image_url: string | null;
    category: string | null;
    author_name: string | null;
    is_featured: boolean;
    is_published: boolean;
    published_at: string | null;
    meta_title: string | null;
    meta_description: string | null;
    created_at?: string;
    updated_at?: string;
}

interface NewsUpdatesListProps {
    onEdit: (article: NewsUpdate) => void;
}

function NewsUpdatesList({
    onEdit,
}: NewsUpdatesListProps) {
    const [news, setNews] = useState<NewsUpdate[]>([]);

    const [selectedNews, setSelectedNews] =
        useState<NewsUpdate | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [deleteLoading, setDeleteLoading] =
        useState<number | null>(null);


    // ==================================================
    // GET NEWS
    // ==================================================

    async function getNews() {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "/api/new_updates"
            );

            if (response.data.success) {
                setNews(response.data.data);
            } else {
                setError(
                    response.data.message ||
                    "Failed to fetch news."
                );
            }

        } catch (error: any) {
            console.error("Get news error:", error);

            setError(
                error?.response?.data?.message ||
                "Failed to fetch news."
            );

        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        getNews();
    }, []);


    // ==================================================
    // DELETE NEWS
    // ==================================================

    async function handleDelete(
        article: NewsUpdate
    ) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${article.title}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(article.id);
            setError("");

            const response = await axios.delete(
                `/api/new_updates?id=${article.id}`
            );

            if (response.data.success) {

                // Remove deleted article from local state
                setNews((currentNews) =>
                    currentNews.filter(
                        (item) =>
                            item.id !== article.id
                    )
                );

                // Close view modal if this article
                // was currently being viewed
                if (
                    selectedNews?.id === article.id
                ) {
                    setSelectedNews(null);
                }

            } else {
                setError(
                    response.data.message ||
                    "Failed to delete news article."
                );
            }

        } catch (error: any) {
            console.error(
                "Delete news error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Failed to delete news article."
            );

        } finally {
            setDeleteLoading(null);
        }
    }


    // ==================================================
    // FORMAT DATE
    // ==================================================

    const formatDate = (
        date: string | null
    ) => {
        if (!date) return "Not published";

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );
    };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {
        return (
            <div className="flex w-full justify-center py-12">
                <span className="loading loading-spinner loading-md text-[#911824]" />
            </div>
        );
    }


    return (
        <>
            <div className="w-full">

                {/* ======================================
                    ERROR
                ====================================== */}

                {error && (
                    <div className="mb-6 rounded-box bg-base-100 p-6 shadow-md">
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                )}


                {/* ======================================
                    EMPTY
                ====================================== */}

                {!error &&
                    news.length === 0 && (
                        <div className="rounded-box bg-base-100 p-8 text-center shadow-md">
                            <p className="text-sm text-[#584140]/70">
                                No news articles found.
                            </p>
                        </div>
                    )}


                {/* ======================================
                    NEWS LIST
                ====================================== */}

                {!error &&
                    news.length > 0 && (
                        <ul className="list bg-base-100 rounded-box shadow-md">

                            {/* Header */}
                            <li className="p-4 pb-2">
                                <div className="flex items-center justify-between gap-4">

                                    <div>
                                        <h2 className="text-lg font-semibold text-[#584140]">
                                            News & Updates
                                        </h2>

                                        <p className="mt-1 text-xs text-[#584140]/60">
                                            Manage hospital news,
                                            announcements, and updates.
                                        </p>
                                    </div>

                                    <div className="badge badge-outline shrink-0">
                                        {news.length} Articles
                                    </div>

                                </div>
                            </li>


                            {/* ==================================
                                NEWS ARTICLES
                            ================================== */}

                            {news.map(
                                (article) => (
                                    <li
                                        key={
                                            article.id
                                        }
                                        className="list-row"
                                    >

                                        {/* Image */}
                                        <div>
                                            {article.image_url ? (
                                                <Image
                                                    src={
                                                        article.image_url
                                                    }
                                                    alt={
                                                        article.title
                                                    }
                                                    width={
                                                        72
                                                    }
                                                    height={
                                                        56
                                                    }
                                                    className="h-14 w-18 rounded-box object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-14 w-18 items-center justify-center rounded-box bg-[#f8e8e9]">
                                                    <span className="text-xl font-semibold text-[#911824]">
                                                        {article.title
                                                            ?.charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>


                                        {/* Title */}
                                        <div className="min-w-0">

                                            <div className="flex items-center gap-2">

                                                <span className="truncate font-semibold text-[#584140]">
                                                    {
                                                        article.title
                                                    }
                                                </span>

                                                {article.is_featured && (
                                                    <FiStar
                                                        size={
                                                            14
                                                        }
                                                        className="shrink-0 text-[#911824]"
                                                        fill="currentColor"
                                                    />
                                                )}

                                            </div>


                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">

                                                {article.category && (
                                                    <span className="text-[#911824]">
                                                        {
                                                            article.category
                                                        }
                                                    </span>
                                                )}

                                                <span className="text-[#584140]/50">
                                                    {formatDate(
                                                        article.published_at
                                                    )}
                                                </span>

                                            </div>

                                        </div>


                                        {/* Excerpt */}
                                        <p className="list-col-wrap text-xs opacity-70">
                                            {article.excerpt ||
                                                article.content?.slice(
                                                    0,
                                                    120
                                                ) ||
                                                "No description provided"}
                                        </p>


                                        {/* Status + Actions */}
                                        <div className="flex shrink-0 items-center justify-end gap-1 whitespace-nowrap">

                                            {/* Status */}
                                            <span
                                                className={`badge badge-sm mr-2 ${
                                                    article.is_published
                                                        ? "badge-success"
                                                        : "badge-warning"
                                                }`}
                                            >
                                                {article.is_published
                                                    ? "Published"
                                                    : "Draft"}
                                            </span>


                                            {/* ==================================
                                                VIEW
                                            ================================== */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedNews(
                                                        article
                                                    )
                                                }
                                                className="btn btn-square btn-ghost text-[#911824]"
                                                title="View article"
                                                aria-label={`View ${article.title}`}
                                            >
                                                <FiEye
                                                    size={
                                                        18
                                                    }
                                                />
                                            </button>


                                            {/* ==================================
                                                EDIT
                                            ================================== */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit(
                                                        article
                                                    )
                                                }
                                                className="btn btn-square btn-ghost text-[#584140]"
                                                title="Edit article"
                                                aria-label={`Edit ${article.title}`}
                                            >
                                                <FiEdit2
                                                    size={
                                                        18
                                                    }
                                                />
                                            </button>


                                            {/* ==================================
                                                DELETE
                                            ================================== */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(
                                                        article
                                                    )
                                                }
                                                disabled={
                                                    deleteLoading ===
                                                    article.id
                                                }
                                                className="btn btn-square btn-ghost text-red-600"
                                                title="Delete article"
                                                aria-label={`Delete ${article.title}`}
                                            >

                                                {deleteLoading ===
                                                article.id ? (
                                                    <span className="loading loading-spinner loading-sm" />
                                                ) : (
                                                    <FiTrash2
                                                        size={
                                                            18
                                                        }
                                                    />
                                                )}

                                            </button>

                                        </div>

                                    </li>
                                )
                            )}

                        </ul>
                    )}

            </div>


            {/* ==========================================
                VIEW MODAL
            ========================================== */}

            {selectedNews && (
                <dialog
                    open
                    className="modal modal-bottom sm:modal-middle"
                >

                    <div className="modal-box max-w-3xl">

                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">

                            <div className="min-w-0">

                                <div className="flex items-center gap-2">

                                    {selectedNews.is_featured && (
                                        <FiStar
                                            size={
                                                18
                                            }
                                            className="shrink-0 text-[#911824]"
                                            fill="currentColor"
                                        />
                                    )}

                                    <h3 className="text-xl font-bold text-[#584140]">
                                        {
                                            selectedNews.title
                                        }
                                    </h3>

                                </div>

                                <p className="mt-1 text-sm text-[#584140]/60">
                                    News & Update
                                </p>

                            </div>


                            <span
                                className={`badge ${
                                    selectedNews.is_published
                                        ? "badge-success"
                                        : "badge-warning"
                                }`}
                            >
                                {selectedNews.is_published
                                    ? "Published"
                                    : "Draft"}
                            </span>

                        </div>


                        {/* Image */}
                        {selectedNews.image_url && (
                            <div className="mt-5">

                                <Image
                                    src={
                                        selectedNews.image_url
                                    }
                                    alt={
                                        selectedNews.title
                                    }
                                    width={
                                        1000
                                    }
                                    height={
                                        500
                                    }
                                    className="h-64 w-full rounded-xl object-cover"
                                />

                            </div>
                        )}


                        {/* Metadata */}
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Category
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {selectedNews.category ||
                                        "Uncategorized"}
                                </p>
                            </div>


                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Author
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {selectedNews.author_name ||
                                        "Not specified"}
                                </p>
                            </div>


                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Published
                                </p>

                                <p className="mt-1 font-medium text-[#584140]">
                                    {formatDate(
                                        selectedNews.published_at
                                    )}
                                </p>
                            </div>

                        </div>


                        {/* Slug */}
                        <div className="mt-5">

                            <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                Slug
                            </p>

                            <p className="mt-1 break-all text-sm text-[#911824]">
                                /news/
                                {
                                    selectedNews.slug
                                }
                            </p>

                        </div>


                        {/* Excerpt */}
                        {selectedNews.excerpt && (
                            <div className="mt-5">

                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    Excerpt
                                </p>

                                <p className="mt-2 text-sm leading-6 text-[#584140]/80">
                                    {
                                        selectedNews.excerpt
                                    }
                                </p>

                            </div>
                        )}


                        {/* Content */}
                        <div className="mt-5">

                            <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                Content
                            </p>

                            <div className="mt-2 max-h-60 overflow-y-auto rounded-lg bg-[#FBF9F9] p-4">

                                <p className="whitespace-pre-wrap text-sm leading-6 text-[#584140]/80">
                                    {
                                        selectedNews.content
                                    }
                                </p>

                            </div>

                        </div>


                        {/* SEO */}
                        {(selectedNews.meta_title ||
                            selectedNews.meta_description) && (
                            <div className="mt-5 rounded-xl border border-base-200 p-4">

                                <p className="text-xs font-semibold uppercase tracking-wide text-[#584140]/50">
                                    SEO Information
                                </p>


                                {selectedNews.meta_title && (
                                    <div className="mt-3">

                                        <p className="text-xs font-medium text-[#584140]/60">
                                            Meta Title
                                        </p>

                                        <p className="mt-1 text-sm text-[#584140]">
                                            {
                                                selectedNews.meta_title
                                            }
                                        </p>

                                    </div>
                                )}


                                {selectedNews.meta_description && (
                                    <div className="mt-3">

                                        <p className="text-xs font-medium text-[#584140]/60">
                                            Meta Description
                                        </p>

                                        <p className="mt-1 text-sm text-[#584140]">
                                            {
                                                selectedNews.meta_description
                                            }
                                        </p>

                                    </div>
                                )}

                            </div>
                        )}


                        {/* Close */}
                        <div className="modal-action">

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedNews(
                                        null
                                    )
                                }
                                className="btn bg-[#911824] text-white hover:bg-[#760f19]"
                            >
                                Close
                            </button>

                        </div>

                    </div>


                    {/* Modal Backdrop */}
                    <form
                        method="dialog"
                        className="modal-backdrop"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setSelectedNews(
                                    null
                                )
                            }
                        >
                            close
                        </button>
                    </form>

                </dialog>
            )}

        </>
    );
}

export default NewsUpdatesList;
