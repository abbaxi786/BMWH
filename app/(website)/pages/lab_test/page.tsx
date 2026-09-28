"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    FaClock,
    FaFlask,
    FaSearch,
    FaVial,
    FaCheckCircle,
    FaExternalLinkAlt,
} from "react-icons/fa";

export interface LabTest {
    id: number;
    test_name: string;
    category: string;
    reporting_time: string;
    specimen_source: string;
    processing: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

function LabTests() {
    const [labTests, setLabTests] = useState<LabTest[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const getLabTests = async () => {
            try {
                setLoading(true);

                const response = await axios.get("/api/lab_test");

                const data = response.data;

                if (Array.isArray(data)) {
                    setLabTests(data);
                } else if (Array.isArray(data.labTests)) {
                    setLabTests(data.labTests);
                } else if (Array.isArray(data.tests)) {
                    setLabTests(data.tests);
                } else {
                    setLabTests([]);
                }
            } catch (error) {
                console.error("Error fetching lab tests:", error);
                setLabTests([]);
            } finally {
                setLoading(false);
            }
        };

        getLabTests();
    }, []);

    /*
     * Get unique categories
     */
    const categories = useMemo(() => {
        const categoryList = labTests
            .map((test) => test.category)
            .filter(
                (category): category is string =>
                    Boolean(category && category.trim())
            );

        return ["All", ...Array.from(new Set(categoryList))];
    }, [labTests]);

    /*
     * Filter tests
     */
    const filteredTests = useMemo(() => {
        const searchText = search.toLowerCase().trim();

        return labTests.filter((test) => {
            const matchesSearch =
                !searchText ||
                test.test_name?.toLowerCase().includes(searchText) ||
                test.category?.toLowerCase().includes(searchText) ||
                test.specimen_source
                    ?.toLowerCase()
                    .includes(searchText) ||
                test.processing?.toLowerCase().includes(searchText);

            const matchesCategory =
                selectedCategory === "All" ||
                test.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [labTests, search, selectedCategory]);

    return (
        <main className="min-h-screen bg-white">

            {/* =====================================================
                HERO SECTION
            ====================================================== */}
            <section className="relative overflow-hidden bg-[#800000]">

                {/* Background decoration */}
                <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/10" />

                <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-black/10" />

                <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">

                    <div className="max-w-3xl">

                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">

                            <FaFlask
                                size={13}
                                className="text-white"
                            />

                            <span className="text-xs font-semibold uppercase tracking-wider text-white sm:text-sm">
                                Laboratory & Diagnostic Services
                            </span>

                        </div>

                        <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                            Laboratory Tests
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
                            Explore the laboratory tests available at
                            Bashir Memorial Welfare Hospital, including
                            reporting times, specimen requirements, and
                            processing information.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">

                            <a
                                href="#lab-tests"
                                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#800000] shadow-lg transition hover:bg-gray-100"
                            >
                                Explore Tests
                            </a>

                            <a
                                href="/pages/contact"
                                className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                            >
                                Contact Us
                            </a>

                        </div>

                    </div>

                </div>
            </section>

            {/* =====================================================
                STATS
            ====================================================== */}
            <section className="border-b border-gray-100 bg-gray-50">

                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">

                    <div className="text-center">

                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#800000]/10">
                            <FaFlask
                                size={16}
                                className="text-[#800000]"
                            />
                        </div>

                        <p className="mt-2 text-2xl font-bold text-[#800000] sm:text-3xl">
                            {loading ? "—" : labTests.length}
                        </p>

                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Available Tests
                        </p>

                    </div>

                    <div className="text-center">

                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#800000]/10">
                            <FaVial
                                size={16}
                                className="text-[#800000]"
                            />
                        </div>

                        <p className="mt-2 text-2xl font-bold text-[#800000] sm:text-3xl">
                            {loading ? "—" : categories.length - 1}
                        </p>

                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Test Categories
                        </p>

                    </div>

                    <div className="text-center">

                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#800000]/10">
                            <FaClock
                                size={16}
                                className="text-[#800000]"
                            />
                        </div>

                        <p className="mt-2 text-2xl font-bold text-[#800000] sm:text-3xl">
                            24 Hrs
                        </p>

                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Routine Reporting
                        </p>

                    </div>

                    <div className="text-center">

                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#800000]/10">
                            <FaCheckCircle
                                size={16}
                                className="text-[#800000]"
                            />
                        </div>

                        <p className="mt-2 text-2xl font-bold text-[#800000] sm:text-3xl">
                            Quality
                        </p>

                        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                            Diagnostic Services
                        </p>

                    </div>

                </div>

            </section>

            {/* =====================================================
                LAB TESTS
            ====================================================== */}
            <section
                id="lab-tests"
                className="w-full bg-white py-14 md:py-20"
            >

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Section heading */}
                    <div className="mb-10 text-center">

                        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#800000]">
                            Our Laboratory
                        </p>

                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                            Find a Laboratory Test
                        </h2>

                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                            Search our available laboratory tests by name,
                            category, specimen, or processing method.
                        </p>

                    </div>

                    {/* =================================================
                        SEARCH & FILTER
                    ================================================== */}
                    <div className="mb-10 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-6">

                        <div className="flex flex-col gap-5">

                            {/* Search */}
                            <div className="relative w-full">

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search by test name, category, specimen..."
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        py-3
                                        pl-11
                                        text-sm
                                        text-gray-800
                                        outline-none
                                        transition
                                        placeholder:text-gray-400
                                        focus:border-[#800000]
                                        focus:ring-2
                                        focus:ring-[#800000]/10
                                    "
                                />

                                <FaSearch
                                    className="
                                        absolute
                                        left-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-gray-400
                                    "
                                    size={15}
                                />

                            </div>

                            {/* Results */}
                            {!loading && (
                                <div className="flex items-center justify-between">

                                    <p className="text-sm text-gray-500">

                                        Showing{" "}

                                        <span className="font-semibold text-gray-800">
                                            {filteredTests.length}
                                        </span>{" "}

                                        {filteredTests.length === 1
                                            ? "test"
                                            : "tests"}

                                    </p>

                                    {(search ||
                                        selectedCategory !== "All") && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearch("");
                                                    setSelectedCategory("All");
                                                }}
                                                className="text-xs font-semibold text-[#800000] hover:underline"
                                            >
                                                Clear Filters
                                            </button>
                                        )}

                                </div>
                            )}

                            {/* Categories */}
                            {!loading && categories.length > 1 && (

                                <div className="flex gap-2 overflow-x-auto pb-1">

                                    {categories.map((category) => (

                                        <button
                                            key={category}
                                            type="button"
                                            onClick={() =>
                                                setSelectedCategory(
                                                    category
                                                )
                                            }
                                            className={`
                                                whitespace-nowrap
                                                rounded-full
                                                px-4
                                                py-2
                                                text-xs
                                                font-semibold
                                                transition
                                                ${selectedCategory ===
                                                    category
                                                    ? "bg-[#800000] text-white"
                                                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#800000]/30 hover:text-[#800000]"
                                                }
                                            `}
                                        >
                                            {category}
                                        </button>

                                    ))}

                                </div>

                            )}

                        </div>

                    </div>

                    {/* =================================================
                        LOADING
                    ================================================== */}
                    {loading && (

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {[1, 2, 3, 4, 5, 6].map((item) => (

                                <div
                                    key={item}
                                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                                >

                                    <div className="animate-pulse">

                                        <div className="mb-4 flex items-center justify-between">

                                            <div className="h-5 w-2/3 rounded bg-gray-200" />

                                            <div className="h-6 w-20 rounded-full bg-gray-200" />

                                        </div>

                                        <div className="grid grid-cols-2 gap-4">

                                            <div>
                                                <div className="mb-2 h-3 w-20 rounded bg-gray-200" />
                                                <div className="h-4 w-32 rounded bg-gray-200" />
                                            </div>

                                            <div>
                                                <div className="mb-2 h-3 w-20 rounded bg-gray-200" />
                                                <div className="h-4 w-28 rounded bg-gray-200" />
                                            </div>

                                            <div>
                                                <div className="mb-2 h-3 w-20 rounded bg-gray-200" />
                                                <div className="h-4 w-32 rounded bg-gray-200" />
                                            </div>

                                            <div>
                                                <div className="mb-2 h-3 w-20 rounded bg-gray-200" />
                                                <div className="h-4 w-24 rounded bg-gray-200" />
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                    {/* =================================================
                        TEST CARDS
                    ================================================== */}
                    {!loading && filteredTests.length > 0 && (

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {filteredTests.map((test) => (

                                <article
                                    key={test.id}
                                    className="
                                        group
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        bg-white
                                        p-5
                                        shadow-sm
                                        transition
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-[#800000]/30
                                        hover:shadow-lg
                                    "
                                >

                                    {/* Top */}
                                    <div className="flex items-start justify-between gap-4">

                                        <div className="flex min-w-0 items-start gap-3">

                                            <div
                                                className="
                                                    flex
                                                    h-11
                                                    w-11
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-[#800000]/10
                                                    text-[#800000]
                                                "
                                            >
                                                <FaFlask size={18} />
                                            </div>

                                            <div className="min-w-0">

                                                <h3 className="
                                                    text-lg
                                                    font-bold
                                                    leading-snug
                                                    text-gray-900
                                                    transition
                                                    group-hover:text-[#800000]
                                                ">
                                                    {test.test_name}
                                                </h3>

                                                {test.category && (
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {test.category}
                                                    </p>
                                                )}

                                            </div>

                                        </div>

                                        {/* Processing badge */}
                                        <span
                                            className={`
                                                shrink-0
                                                rounded-full
                                                px-3
                                                py-1
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-wide
                                                ${test.processing
                                                    ?.toLowerCase()
                                                    .includes(
                                                        "outsource"
                                                    )
                                                    ? "bg-orange-100 text-orange-700"
                                                    : "bg-green-100 text-green-700"
                                                }
                                            `}
                                        >
                                            {test.processing}
                                        </span>

                                    </div>

                                    {/* Divider */}
                                    <div className="my-5 border-t border-gray-100" />

                                    {/* Information */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                        {/* Reporting Time */}
                                        <div className="flex items-start gap-3">

                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[#800000]">
                                                <FaClock size={13} />
                                            </div>

                                            <div className="min-w-0">

                                                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                                    Reporting Time
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                                    {test.reporting_time}
                                                </p>

                                            </div>

                                        </div>

                                        {/* Specimen */}
                                        <div className="flex items-start gap-3">

                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[#800000]">
                                                <FaVial size={13} />
                                            </div>

                                            <div className="min-w-0">

                                                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                                    Specimen
                                                </p>

                                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                                    {test.specimen_source}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    {/* Bottom */}
                                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

                                        <div className="flex items-center gap-2">

                                            <FaCheckCircle
                                                size={13}
                                                className="text-green-600"
                                            />

                                            <span className="text-xs font-medium text-gray-500">
                                                {test.is_active
                                                    ? "Currently UnAvailable"
                                                    : "Currently Available"}
                                            </span>

                                        </div>

                                        <a
                                            href={`https://www.google.com/search?q=${encodeURIComponent(
                                                `${test.test_name} ٹیسٹ کیا ہے اردو میں`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-xs font-semibold text-[#800000] transition hover:underline"
                                        >
                                            Test Information
                                            <FaExternalLinkAlt size={9} />
                                        </a>

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}

                    {/* =================================================
                        EMPTY STATE
                    ================================================== */}
                    {!loading && filteredTests.length === 0 && (

                        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#800000]/10">

                                <FaFlask
                                    size={28}
                                    className="text-[#800000]"
                                />

                            </div>

                            <h3 className="mt-5 text-xl font-bold text-gray-900">
                                No laboratory tests found
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                {search
                                    ? "We couldn't find any tests matching your search. Try another test name or category."
                                    : "There are currently no laboratory tests available."}
                            </p>

                            {(search ||
                                selectedCategory !== "All") && (

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            setSelectedCategory("All");
                                        }}
                                        className="
                                        mt-6
                                        rounded-lg
                                        bg-[#800000]
                                        px-5
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-[#660000]
                                    "
                                    >
                                        Clear Filters
                                    </button>

                                )}

                        </div>

                    )}

                </div>

            </section>

            {/* =====================================================
                CTA SECTION
            ====================================================== */}
            <section className="bg-gray-50 py-16 md:py-20">

                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

                    <div className="overflow-hidden rounded-2xl bg-[#800000] px-6 py-12 text-center sm:px-12">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10">

                            <FaFlask
                                size={24}
                                className="text-white"
                            />

                        </div>

                        <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
                            Need Information About a Laboratory Test?
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                            If you are unsure which test you need or require
                            additional information about specimen requirements,
                            reporting times, or laboratory services, our team
                            is available to assist you.
                        </p>

                        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

                            <a
                                href="/pages/contact"
                                className="
                                    rounded-lg
                                    bg-white
                                    px-6
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-[#800000]
                                    transition
                                    hover:bg-gray-100
                                "
                            >
                                Contact Us
                            </a>

                            <a
                                href="tel:+920000000000"
                                className="
                                    rounded-lg
                                    border
                                    border-white/30
                                    px-6
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-white/10
                                "
                            >
                                Call Hospital
                            </a>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default LabTests;