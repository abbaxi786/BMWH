
"use client";

import { useEffect, useState, useRef } from "react";
import type { IconType } from "react-icons";
import {
    FaUserGroup,
    FaHandHoldingHeart,
    FaClock,
} from "react-icons/fa6";

interface ImpactStat {
    id: number;
    target: number;
    suffix: string;
    title: string;
    description: string;
    display_order: number;
    is_active?: boolean;
}

interface ImpactStatDisplay extends ImpactStat {
    icon: IconType;
    className: string;
    iconClassName: string;
    titleClassName: string;
    descriptionClassName: string;
}

// Fixed frontend presentation; content comes from PostgreSQL.
const FIXED_PRESENTATION = [
    {
        icon: FaUserGroup,
        className: "bg-[#86000D] text-white",
        iconClassName: "text-white",
        titleClassName: "text-white",
        descriptionClassName: "text-white/80",
    },
    {
        icon: FaHandHoldingHeart,
        className: "bg-[#E9E8E8] text-[#5B403D]",
        iconClassName: "text-[#86000D]",
        titleClassName: "text-[#5B403D]",
        descriptionClassName: "text-[#5B403D]",
    },
    {
        icon: FaClock,
        className: "bg-[#303031] text-[#F2F0F0]",
        iconClassName: "text-[#F2F0F0]",
        titleClassName: "text-[#F2F0F0]",
        descriptionClassName: "text-[#F2F0F0]/80",
    },
];

interface RunningNumberProps {
    target: number;
    duration?: number;
}

function RunningNumber({
    target,
    duration = 1500,
}: RunningNumberProps) {
    const [count, setCount] = useState(0);
    const elementRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        let hasAnimated = false;
        let animationFrame = 0;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || hasAnimated) return;

                hasAnimated = true;
                let startTime: number | null = null;

                const animate = (timestamp: number) => {
                    if (startTime === null) {
                        startTime = timestamp;
                    }

                    const progress = Math.min(
                        (timestamp - startTime) / duration,
                        1
                    );

                    setCount(Math.floor(progress * target));

                    if (progress < 1) {
                        animationFrame =
                            requestAnimationFrame(animate);
                    }
                };

                animationFrame = requestAnimationFrame(animate);
            },
            { threshold: 0.1 }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(animationFrame);
        };
    }, [target, duration]);

    return <span ref={elementRef}>{count}</span>;
}

export default function ImpactStats() {
    const [stats, setStats] = useState<ImpactStatDisplay[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchImpactStats() {
            try {
                const response = await fetch("/api/content/stats", {
                    method: "GET",
                    cache: "no-store",
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch impact statistics"
                    );
                }

                const result = await response.json();

                if (!result.success || !Array.isArray(result.data)) {
                    throw new Error("Invalid impact statistics response");
                }

                const mappedStats: ImpactStatDisplay[] = result.data
                    .filter(
                        (stat: ImpactStat) =>
                            Number.isInteger(stat.display_order) &&
                            stat.display_order >= 1 &&
                            stat.display_order <= 3 &&
                            Number.isInteger(stat.target) &&
                            stat.target >= 0 &&
                            typeof stat.title === "string" &&
                            typeof stat.suffix === "string" &&
                            typeof stat.description === "string"
                    )
                    .map((stat: ImpactStat) => ({
                        ...stat,
                        ...FIXED_PRESENTATION[stat.display_order - 1],
                    }))
                    .sort(
                        (a:any, b:any) => a.display_order - b.display_order
                    );

                setStats(mappedStats);
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                console.error("Impact stats API error:", error);
                setHasError(true);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void fetchImpactStats();

        return () => controller.abort();
    }, []);

    // Avoid showing outdated hardcoded content if the API fails.
    if (loading || hasError || stats.length === 0) {
        return null;
    }

    return (
        <section
            aria-labelledby="impact-stats-heading"
            className="relative z-20 w-full"
        >
            <h2 id="impact-stats-heading" className="sr-only">
                Our Impact
            </h2>

            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {stats.map((stat) => {
                        const IconComponent = stat.icon;

                        return (
                            <div
                                key={stat.id}
                                className={`flex flex-col gap-4 rounded-xl border border-[#E4BEBA]/40 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1 ${stat.className}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-4xl font-bold tracking-tight">
                                        <RunningNumber
                                            key={`${stat.id}-${stat.target}`}
                                            target={stat.target}
                                        />
                                        {stat.suffix}
                                    </span>

                                    <IconComponent
                                        aria-hidden="true"
                                        className={`text-3xl ${stat.iconClassName}`}
                                    />
                                </div>

                                <div>
                                    <h3
                                        className={`mb-2 text-xl font-semibold ${stat.titleClassName}`}
                                    >
                                        {stat.title}
                                    </h3>

                                    <p
                                        className={`text-sm leading-relaxed ${stat.descriptionClassName}`}
                                    >
                                        {stat.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
