"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    FiActivity,
    FiAward,
    FiBriefcase,
    FiCalendar,
    FiClock,
    FiFileText,
    FiGrid,
    FiHeart,
    FiHome,
    FiImage,
    FiRefreshCw,
    FiUserCheck,
    FiUsers,
} from "react-icons/fi";

/* =========================================================
   TYPES
========================================================= */

interface Statistics {
    doctors: number;
    departments: number;
    departmentServices: number;
    achievements: number;
    doctorSchedules: number;
    galleryImages: number;
    eventGuests: number;
    events: number;
    healthPartners: number;
    hospitalFacilities: number;
    newsUpdates: number;
    successStories: number;
    supporters: number;
}

interface ActiveStatistics {
    doctors: number;
}

interface Event {
    id: number;
    title: string;
    description: string | null;
    event_date: string;
    start_time: string | null;
    end_time: string | null;
    location: string | null;
    cover_image_url: string | null;
    is_featured: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface News {
    id: number;
    title: string;
    [key: string]: unknown;
}

interface SuccessStory {
    id: number;
    title: string;
    [key: string]: unknown;
}

interface DashboardData {
    statistics: Statistics;
    activeStatistics: ActiveStatistics;
    recentEvents: Event[];
    upcomingEvents: Event[];
    recentNews: News[];
    recentSuccessStories: SuccessStory[];
}

interface DashboardResponse {
    success: boolean;
    data: DashboardData;
    message?: string;
}

/* =========================================================
   COUNT UP COMPONENT
========================================================= */

interface CountUpProps {
    value: number;
    duration?: number;
}

function CountUp({
    value,
    duration = 1000,
}: CountUpProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrame: number;

        const startValue = 0;
        const endValue = Number(value) || 0;

        if (endValue === 0) {
            setCount(0);
            return;
        }

        const animate = (currentTime: number) => {
            if (startTime === null) {
                startTime = currentTime;
            }

            const elapsed = currentTime - startTime;

            const progress = Math.min(
                elapsed / duration,
                1
            );

            /*
             * Ease-out effect:
             * Starts quickly and slows down near the final number.
             */
            const easedProgress =
                1 - Math.pow(1 - progress, 3);

            const currentValue =
                startValue +
                (endValue - startValue) *
                    easedProgress;

            setCount(Math.floor(currentValue));

            if (progress < 1) {
                animationFrame =
                    requestAnimationFrame(animate);
            } else {
                setCount(endValue);
            }
        };

        animationFrame =
            requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [value, duration]);

    return <>{count.toLocaleString()}</>;
}

/* =========================================================
   COMPONENT
========================================================= */

function Dashboard() {
    const [dashboard, setDashboard] =
        useState<DashboardData | null>(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    /* =====================================================
       FETCH DASHBOARD
    ===================================================== */

    const fetchDashboard = async (
        showRefreshLoader = false
    ) => {
        try {
            if (showRefreshLoader) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response =
                await axios.get<DashboardResponse>(
                    "/api/dashboard"
                );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                        "Failed to load dashboard"
                );
            }

            setDashboard(response.data.data);
        } catch (error) {
            console.error(
                "Error fetching dashboard:",
                error
            );

            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                        "Failed to load dashboard data"
                );
            } else {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load dashboard data"
                );
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        fetchDashboard();
    }, []);

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <div className="flex min-h-125 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="loading loading-spinner loading-lg text-[#911824]" />

                    <p className="text-sm text-gray-500">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    /* =====================================================
       ERROR
    ===================================================== */

    if (error || !dashboard) {
        return (
            <div className="flex min-h-125 p-5 items-center justify-center">
                <div className="w-full max-w-md rounded-xl border border-red-100 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F1F1]">
                        <FiActivity
                            size={26}
                            className="text-[#911824]"
                        />
                    </div>

                    <h2 className="text-lg font-semibold text-[#5B403D]">
                        Unable to load dashboard
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        {error ||
                            "Something went wrong while loading dashboard data."}
                    </p>

                    <button
                        type="button"
                        onClick={() => fetchDashboard()}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#911824] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#760f19]"
                    >
                        <FiRefreshCw size={16} />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const {
        statistics,
        recentEvents,
        upcomingEvents,
        recentNews,
        recentSuccessStories,
    } = dashboard;

    /* =====================================================
       MAIN STATISTICS
    ===================================================== */

    const mainStats = [
        {
            title: "Doctors",
            value: statistics.doctors,
            description: "Total doctors",
            icon: FiUsers,

            // BMWH mono-tone palette
            iconBg: "bg-[#F8F1F1]",
            iconColor: "text-[#911824]",
        },
        {
            title: "Departments",
            value: statistics.departments,
            description: "Total departments",
            icon: FiGrid,

            iconBg: "bg-[#F1ECEB]",
            iconColor: "text-[#6F5A58]",
        },
        {
            title: "Events",
            value: statistics.events,
            description: "Total events",
            icon: FiCalendar,

            iconBg: "bg-[#F8F1F1]",
            iconColor: "text-[#911824]",
        },
        {
            title: "News Updates",
            value: statistics.newsUpdates,
            description: "Total news updates",
            icon: FiFileText,

            iconBg: "bg-[#F1ECEB]",
            iconColor: "text-[#6F5A58]",
        },
    ];

    /* =====================================================
       SECONDARY STATISTICS
    ===================================================== */

    const secondaryStats = [
        {
            title: "Gallery Images",
            value: statistics.galleryImages,
            description: "Event gallery images",
            icon: FiImage,

            iconBg: "bg-[#F8F1F1]",
            iconColor: "text-[#911824]",
        },
        {
            title: "Success Stories",
            value: statistics.successStories,
            description: "Patient success stories",
            icon: FiHeart,

            iconBg: "bg-[#F1ECEB]",
            iconColor: "text-[#6F5A58]",
        },
        {
            title: "Health Partners",
            value: statistics.healthPartners,
            description: "Hospital health partners",
            icon: FiBriefcase,

            iconBg: "bg-[#F8F1F1]",
            iconColor: "text-[#911824]",
        },
        {
            title: "Supporters",
            value: statistics.supporters,
            description: "Hospital supporters",
            icon: FiUsers,

            iconBg: "bg-[#F1ECEB]",
            iconColor: "text-[#6F5A58]",
        },
        {
            title: "Achievements",
            value: statistics.achievements,
            description: "Hospital achievements",
            icon: FiAward,

            iconBg: "bg-[#F8F1F1]",
            iconColor: "text-[#911824]",
        },
        {
            title: "Facilities",
            value: statistics.hospitalFacilities,
            description: "Hospital facilities",
            icon: FiHome,

            iconBg: "bg-[#F1ECEB]",
            iconColor: "text-[#6F5A58]",
        },
        {
            title: "Department Services",
            value: statistics.departmentServices,
            description: "Department services",
            icon: FiActivity,

            iconBg: "bg-[#F8F1F1]",
            iconColor: "text-[#911824]",
        },
        {
            title: "Doctor Schedules",
            value: statistics.doctorSchedules,
            description: "Doctor schedules",
            icon: FiClock,

            iconBg: "bg-[#F1ECEB]",
            iconColor: "text-[#6F5A58]",
        },
        {
            title: "Event Guests",
            value: statistics.eventGuests,
            description: "Event guests",
            icon: FiUserCheck,

            iconBg: "bg-[#F8F1F1]",
            iconColor: "text-[#911824]",
        },
    ];

    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDate = (date: string) => {
        if (!date) return "No date";

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );
    };

    /* =====================================================
       FORMAT TIME
    ===================================================== */

    const formatTime = (time: string | null) => {
        if (!time) return "";

        const [hours, minutes] = time
            .split(":")
            .map(Number);

        if (
            Number.isNaN(hours) ||
            Number.isNaN(minutes)
        ) {
            return time;
        }

        const date = new Date();

        date.setHours(hours);
        date.setMinutes(minutes);

        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        });
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="w-full py-3 md:px-2">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-[#5B403D]">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Overview of Bashir Memorial Welfare
                        Hospital CMS.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => fetchDashboard(true)}
                    disabled={refreshing}
                    className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-[#5B403D] shadow-sm transition hover:border-[#911824] hover:text-[#911824] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <FiRefreshCw
                        size={16}
                        className={
                            refreshing
                                ? "animate-spin"
                                : ""
                        }
                    />

                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>
            </div>

            {/* =================================================
                MAIN STATISTICS
            ================================================= */}

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {mainStats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="stats w-full border border-gray-100 bg-white shadow-sm"
                        >
                            <div className="stat">

                                <div
                                    className={`stat-figure rounded-xl p-3 ${stat.iconBg}`}
                                >
                                    <Icon
                                        size={23}
                                        className={
                                            stat.iconColor
                                        }
                                    />
                                </div>

                                <div className="stat-title text-gray-500">
                                    {stat.title}
                                </div>

                                <div className="stat-value text-2xl text-[#5B403D]">
                                    <CountUp
                                        value={
                                            stat.value
                                        }
                                        duration={1200}
                                    />
                                </div>

                                <div className="stat-desc mt-1">
                                    {stat.description}
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>

            {/* =================================================
                CMS STATISTICS
            ================================================= */}

            <div className="mb-8">

                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-[#5B403D]">
                        CMS Overview
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Content and management records across
                        the hospital website.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                    {secondaryStats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {stat.title}
                                        </p>

                                        <p className="mt-2 text-2xl font-semibold text-[#5B403D]">
                                            <CountUp
                                                value={
                                                    stat.value
                                                }
                                                duration={1000}
                                            />
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            {stat.description}
                                        </p>
                                    </div>

                                    <div
                                        className={`rounded-xl p-3 ${stat.iconBg}`}
                                    >
                                        <Icon
                                            size={21}
                                            className={
                                                stat.iconColor
                                            }
                                        />
                                    </div>

                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>

            {/* =================================================
                EVENTS SECTION
            ================================================= */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                {/* =================================================
                    UPCOMING EVENTS
                ================================================= */}

                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

                        <div>
                            <h2 className="font-semibold text-[#5B403D]">
                                Upcoming Events
                            </h2>

                            <p className="mt-0.5 text-xs text-gray-500">
                                Upcoming hospital events
                            </p>
                        </div>

                        <FiCalendar
                            size={19}
                            className="text-[#911824]"
                        />

                    </div>

                    {upcomingEvents.length === 0 ? (

                        <div className="px-5 py-10 text-center">

                            <FiCalendar
                                size={30}
                                className="mx-auto text-[#B7A5A2]"
                            />

                            <p className="mt-3 text-sm text-gray-500">
                                No upcoming events
                            </p>

                        </div>

                    ) : (

                        <div className="divide-y divide-gray-100">

                            {upcomingEvents.map(
                                (event) => (

                                    <div
                                        key={event.id}
                                        className="flex gap-4 p-5"
                                    >

                                        <div className="hidden h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F1ECEB] sm:block">

                                            {event.cover_image_url ? (

                                                <img
                                                    src={
                                                        event.cover_image_url
                                                    }
                                                    alt={
                                                        event.title
                                                    }
                                                    className="h-full w-full object-cover"
                                                />

                                            ) : (

                                                <div className="flex h-full w-full items-center justify-center">

                                                    <FiCalendar
                                                        size={22}
                                                        className="text-[#6F5A58]"
                                                    />

                                                </div>
                                            )}

                                        </div>

                                        <div className="min-w-0 flex-1">

                                            <div className="flex flex-wrap items-start justify-between gap-2">

                                                <h3 className="font-medium text-[#5B403D]">
                                                    {
                                                        event.title
                                                    }
                                                </h3>

                                                {event.is_featured && (

                                                    <span className="rounded-full bg-[#F8F1F1] px-2 py-1 text-[10px] font-medium text-[#911824]">
                                                        Featured
                                                    </span>

                                                )}

                                            </div>

                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">

                                                <span>
                                                    {formatDate(
                                                        event.event_date
                                                    )}
                                                </span>

                                                {event.start_time && (

                                                    <span>
                                                        {formatTime(
                                                            event.start_time
                                                        )}

                                                        {event.end_time &&
                                                            ` - ${formatTime(
                                                                event.end_time
                                                            )}`}
                                                    </span>

                                                )}

                                            </div>

                                            {event.location && (

                                                <p className="mt-1 truncate text-xs text-gray-400">
                                                    {
                                                        event.location
                                                    }
                                                </p>

                                            )}

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </div>


                {/* =================================================
                    RECENT EVENTS
                ================================================= */}

                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

                        <div>
                            <h2 className="font-semibold text-[#5B403D]">
                                Recent Events
                            </h2>

                            <p className="mt-0.5 text-xs text-gray-500">
                                Recently added hospital events
                            </p>
                        </div>

                        <FiActivity
                            size={19}
                            className="text-[#911824]"
                        />

                    </div>

                    {recentEvents.length === 0 ? (

                        <div className="px-5 py-10 text-center">

                            <FiCalendar
                                size={30}
                                className="mx-auto text-[#B7A5A2]"
                            />

                            <p className="mt-3 text-sm text-gray-500">
                                No events found
                            </p>

                        </div>

                    ) : (

                        <div className="divide-y divide-gray-100">

                            {recentEvents.map(
                                (event) => (

                                    <div
                                        key={event.id}
                                        className="flex gap-4 p-5"
                                    >

                                        <div className="hidden h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F1ECEB] sm:block">

                                            {event.cover_image_url ? (

                                                <img
                                                    src={
                                                        event.cover_image_url
                                                    }
                                                    alt={
                                                        event.title
                                                    }
                                                    className="h-full w-full object-cover"
                                                />

                                            ) : (

                                                <div className="flex h-full w-full items-center justify-center">

                                                    <FiCalendar
                                                        size={22}
                                                        className="text-[#6F5A58]"
                                                    />

                                                </div>

                                            )}

                                        </div>

                                        <div className="min-w-0 flex-1">

                                            <div className="flex items-start justify-between gap-3">

                                                <h3 className="truncate font-medium text-[#5B403D]">
                                                    {
                                                        event.title
                                                    }
                                                </h3>

                                                <span
                                                    className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${
                                                        event.is_active
                                                            ? "bg-[#F8F1F1] text-[#911824]"
                                                            : "bg-[#F1ECEB] text-[#6F5A58]"
                                                    }`}
                                                >
                                                    {event.is_active
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>

                                            </div>

                                            <p className="mt-2 text-xs text-gray-500">
                                                {formatDate(
                                                    event.event_date
                                                )}
                                            </p>

                                            {event.location && (

                                                <p className="mt-1 truncate text-xs text-gray-400">
                                                    {
                                                        event.location
                                                    }
                                                </p>

                                            )}

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    )}

                </div>

            </div>


            {/* =================================================
                NEWS / SUCCESS STORIES
            ================================================= */}

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* =================================================
                    RECENT NEWS
                ================================================= */}

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="rounded-xl bg-[#F8F1F1] p-3">
                            <FiFileText
                                size={21}
                                className="text-[#911824]"
                            />
                        </div>

                        <div>
                            <h2 className="font-semibold text-[#5B403D]">
                                Recent News
                            </h2>

                            <p className="text-xs text-gray-500">
                                Latest news updates
                            </p>
                        </div>

                    </div>

                    {recentNews.length === 0 ? (

                        <div className="py-8 text-center">

                            <p className="text-sm text-gray-400">
                                News details will appear
                                here once the news schema is
                                confirmed.
                            </p>

                            <p className="mt-2 text-xs text-gray-400">
                                Total news updates:{" "}
                                <CountUp
                                    value={
                                        statistics.newsUpdates
                                    }
                                    duration={900}
                                />
                            </p>

                        </div>

                    ) : (

                        <div className="mt-5 space-y-3">

                            {recentNews.map((news) => (

                                <div
                                    key={news.id}
                                    className="rounded-lg border border-gray-100 p-3"
                                >
                                    <p className="text-sm font-medium text-[#5B403D]">
                                        {news.title}
                                    </p>
                                </div>

                            ))}

                        </div>
                    )}

                </div>


                {/* =================================================
                    SUCCESS STORIES
                ================================================= */}

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-3">

                        <div className="rounded-xl bg-[#F1ECEB] p-3">

                            <FiHeart
                                size={21}
                                className="text-[#6F5A58]"
                            />

                        </div>

                        <div>
                            <h2 className="font-semibold text-[#5B403D]">
                                Success Stories
                            </h2>

                            <p className="text-xs text-gray-500">
                                Patient success stories
                            </p>
                        </div>

                    </div>

                    {recentSuccessStories.length ===
                    0 ? (

                        <div className="py-8 text-center">

                            <p className="text-sm text-gray-400">
                                Success story details will
                                appear here once the schema is
                                confirmed.
                            </p>

                            <p className="mt-2 text-xs text-gray-400">
                                Total success stories:{" "}
                                <CountUp
                                    value={
                                        statistics.successStories
                                    }
                                    duration={900}
                                />
                            </p>

                        </div>

                    ) : (

                        <div className="mt-5 space-y-3">

                            {recentSuccessStories.map(
                                (story) => (

                                    <div
                                        key={story.id}
                                        className="rounded-lg border border-gray-100 p-3"
                                    >
                                        <p className="text-sm font-medium text-[#5B403D]">
                                            {story.title}
                                        </p>
                                    </div>

                                )
                            )}

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default Dashboard;

