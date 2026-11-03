
"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
    FaUserGroup,
    FaHandHoldingHeart,
    FaClock,
} from "react-icons/fa6";

import { ImpactStatsSkeleton } from "./heroAndStatsSkeleton";

interface ImpactStat {
    id: number;
    target: number;
    suffix: string;
    title: string;
    description: string;
    display_order: number;
    is_active?: boolean;
}

interface ImpactStatsApiResponse {
    success: boolean;
    data: ImpactStat[] | null;
    message?: string;
}

interface RunningNumberProps {
    target: number;
    duration?: number;
}

// Original visual styles, kept separate from API content.
const CARD_PRESENTATION = [
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
    const [stats, setStats] = useState<ImpactStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let active = true;

        async function fetchImpactStats() {
            try {
                const response =
                    await axios.get<ImpactStatsApiResponse>(
                        "/api/content/stats",
                        {
                            headers: {
                                "Cache-Control": "no-cache",
                                Pragma: "no-cache",
                            },
                            params: {
                                _t: Date.now(),
                            },
                        }
                    );

                if (!active) return;

                const result = response.data;


                if (
                    !result.success ||
                    !Array.isArray(result.data)
                ) {
                    throw new Error(
                        result.message ||
                        "Invalid impact statistics response"
                    );
                }

                const validStats = result.data
                    .filter(
                        (stat) =>
                            Number.isInteger(stat.id) &&
                            Number.isInteger(stat.target) &&
                            stat.target >= 0 &&
                            Number.isInteger(stat.display_order) &&
                            stat.display_order >= 1 &&
                            typeof stat.title === "string" &&
                            typeof stat.suffix === "string" &&
                            typeof stat.description === "string"
                    )
                    .sort(
                        (a, b) =>
                            a.display_order - b.display_order
                    );

                setStats(validStats);
            } catch (error) {
                if (!active) return;

                console.error(
                    "Impact stats API error:",
                    axios.isAxiosError(error)
                        ? error.response?.data?.message ||
                        error.message
                        : error
                );

                setHasError(true);
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        void fetchImpactStats();

        return () => {
            active = false;
        };
    }, []);

    if (loading) {
        return <ImpactStatsSkeleton />;
    }

    if (hasError || stats.length === 0) {
        return null;
    }

    return (
        <section
            aria-labelledby="impact-stats-heading"
            className="relative z-20 w-full"
        >
            <h2
                id="impact-stats-heading"
                className="sr-only"
            >
                Our Impact
            </h2>

            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {stats.map((stat, index) => {
                        // Cycle through the three original styles.
                        const presentation =
                            CARD_PRESENTATION[index % CARD_PRESENTATION.length];

                        const IconComponent = presentation.icon;

                        return (
                            <div
                                key={stat.id}
                                className={`flex flex-col gap-4 rounded-xl border border-[#E4BEBA]/40 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-1 ${presentation.className}`}
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
                                        className={`text-3xl ${presentation.iconClassName}`}
                                    />
                                </div>

                                <div>
                                    <h3
                                        className={`mb-2 text-xl font-semibold ${presentation.titleClassName}`}
                                    >
                                        {stat.title}
                                    </h3>

                                    <p
                                        className={`text-sm leading-relaxed ${presentation.descriptionClassName}`}
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
