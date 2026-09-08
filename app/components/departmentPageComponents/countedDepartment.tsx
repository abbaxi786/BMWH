"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
    FaArrowRight,
    FaHospital,
} from "react-icons/fa";

interface Department {
    id: number;
    name: string;
    description?: string | null;
    image_url?: string | null;
    category?: string | null;
}

interface DepartmentsResponse {
    success: boolean;
    data: Department[];
}

export default function DepartmentsSection() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get<DepartmentsResponse>(
                    "/api/departments"
                );

                if (response.data.success) {
                    setDepartments(response.data.data.slice(0, 4));
                }
            } catch (error) {
                console.error("Error fetching departments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    if (loading) {
        return (
            <section className="bg-[#FBF9F9] py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-80 animate-pulse rounded-2xl bg-gray-200"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-[#FBF9F9] py-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#911824]">
                            Our Departments
                        </p>

                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Specialized Care for Every Need
                        </h2>

                        <p className="mt-4 text-base leading-7 text-gray-600">
                            Explore our specialized medical departments and
                            discover comprehensive healthcare services provided
                            by our experienced medical team.
                        </p>
                    </div>

                    {/* View All */}
                    <Link
                        href="/pages/departments"
                        className="group inline-flex w-fit items-center gap-2 rounded-full border border-[#911824] px-5 py-3 text-sm font-semibold text-[#911824] transition-all duration-300 hover:bg-[#911824] hover:text-white"
                    >
                        View All Departments

                        <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Departments */}
                {departments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {departments.map((department) => (
                            <Link
                                key={department.id}
                                href={`/pages/departments/${department.id}`}
                                className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* Image */}
                                <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
                                    {department.image_url ? (
                                        <Image
                                            src={department.image_url}
                                            alt={department.name}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <FaHospital className="text-5xl text-gray-300" />
                                        </div>
                                    )}

                                    {/* Category */}
                                    {department.category && (
                                        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#911824] shadow-sm">
                                            {department.category}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#911824]">
                                        {department.name}
                                    </h3>

                                    {department.description && (
                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
                                            {department.description}
                                        </p>
                                    )}

                                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#911824]">
                                        View Department

                                        <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
                        <FaHospital className="mx-auto text-4xl text-gray-300" />

                        <p className="mt-4 text-gray-500">
                            No departments available at the moment.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}