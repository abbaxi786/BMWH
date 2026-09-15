"use client";

import { useState } from "react";
import NewsUpdatesList, {
    NewsUpdate,
} from "./newsUpdatesList";
import NewsUpdatesForm from "./newsUpdatesForm";

type Tab =
    | "news"
    | "add-news";

function NewsUpdates() {

    const [activeTab, setActiveTab] =
        useState<Tab>("news");

    // Stores the news article currently being edited
    const [editNews, setEditNews] =
        useState<NewsUpdate | null>(null);


    // ==================================================
    // ADD NEWS
    // ==================================================

    function handleAddNews() {
        setEditNews(null);
        setActiveTab("add-news");
    }


    // ==================================================
    // EDIT NEWS
    // ==================================================

    function handleNewsEdit(
        article: NewsUpdate
    ) {
        setEditNews(article);
        setActiveTab("add-news");
    }


    // ==================================================
    // SUCCESS
    // After create/update, return to list
    // ==================================================

    function handleNewsSuccess() {
        setEditNews(null);
        setActiveTab("news");
    }


    // ==================================================
    // CANCEL EDIT
    // ==================================================

    function handleCancelEdit() {
        setEditNews(null);
        setActiveTab("news");
    }


    // ==================================================
    // NEWS TAB
    // ==================================================

    function handleNewsTab() {
        setEditNews(null);
        setActiveTab("news");
    }


    return (
        <div className="w-full">

            {/* ==========================================
                HEADING
            ========================================== */}

            <div className="mb-6">

                <h1 className="text-2xl font-bold text-[#584140]">
                    News & Updates
                </h1>

                <p className="mt-1 text-sm text-[#584140]/60">
                    Manage hospital news, announcements,
                    events, and website updates.
                </p>

            </div>


            {/* ==========================================
                TABS
            ========================================== */}

            <div className="mb-6">

                <div className="tabs tabs-box w-fit bg-base-100 shadow-sm">

                    {/* News Tab */}
                    <button
                        type="button"
                        className={`tab ${
                            activeTab === "news"
                                ? "tab-active bg-[#911824] text-white"
                                : "text-[#584140]"
                        }`}
                        onClick={
                            handleNewsTab
                        }
                    >
                        News & Updates
                    </button>


                    {/* Add / Edit Tab */}
                    <button
                        type="button"
                        className={`tab ${
                            activeTab ===
                            "add-news"
                                ? "tab-active bg-[#911824] text-white"
                                : "text-[#584140]"
                        }`}
                        onClick={
                            handleAddNews
                        }
                    >
                        {editNews
                            ? "Edit News"
                            : "Add News"}
                    </button>

                </div>

            </div>


            {/* ==========================================
                CONTENT
            ========================================== */}

            <div className="w-full">

                {/* News List */}
                {activeTab === "news" && (
                    <NewsUpdatesList
                        onEdit={
                            handleNewsEdit
                        }
                    />
                )}


                {/* Add / Edit Form */}
                {activeTab ===
                    "add-news" && (
                    <NewsUpdatesForm
                        editNews={
                            editNews
                        }
                        onSuccess={
                            handleNewsSuccess
                        }
                        onCancelEdit={
                            handleCancelEdit
                        }
                    />
                )}

            </div>

        </div>
    );
}

export default NewsUpdates;
