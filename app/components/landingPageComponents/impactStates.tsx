import {
    FaUserGroup,
    FaHandHoldingHeart,
    FaClock,
} from "react-icons/fa6";

const IMPACT_STATS = [
    {
        value: "50K+",
        title: "Patients Served",
        description:
            "Providing continuous care and support to our growing community over the years.",
        icon: FaUserGroup,
        className: "bg-[#86000D] text-white",
        iconClassName: "text-white",
        titleClassName: "text-white",
        descriptionClassName: "text-white/80",
    },
    {
        value: "10K+",
        title: "Free Treatments",
        description:
            "Funded through generous donations and our dedicated welfare programs.",
        icon: FaHandHoldingHeart,
        className: "bg-[#E9E8E8] text-[#5B403D]",
        iconClassName: "text-[#86000D]",
        titleClassName: "text-[#5B403D]",
        descriptionClassName: "text-[#5B403D]",
    },
    {
        value: "25+",
        title: "Years of Service",
        description:
            "A legacy of clinical integrity, trust, and unwavering commitment to health.",
        icon: FaClock,
        className: "bg-[#303031] text-[#F2F0F0]",
        iconClassName: "text-[#F2F0F0]",
        titleClassName: "text-[#F2F0F0]",
        descriptionClassName: "text-[#F2F0F0]/80",
    },
];

export default function ImpactStats() {
    return (
        <section
            aria-labelledby="impact-stats-heading"
            className="relative z-20 w-full"
        >
            {/* Accessible heading */}
            <h2
                id="impact-stats-heading"
                className="sr-only"
            >
                Our Impact
            </h2>

            {/* Impact Card */}
            <div
                className="
                    w-full
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#E4BEBA]/40
                    bg-[#FBF9F9]
                    shadow-[0_18px_40px_rgba(0,0,0,0.10)]

                    lg:rounded-2xl
                "
            >
                <div
                    className="
                        grid
                        w-full
                        grid-cols-1

                        md:grid-cols-3
                    "
                >
                    {IMPACT_STATS.map(
                        ({
                            value,
                            title,
                            description,
                            icon: Icon,
                            className,
                            iconClassName,
                            titleClassName,
                            descriptionClassName,
                        }) => (
                            <article
                                key={title}
                                className={`
                                    relative
                                    flex
                                    min-h-[175px]
                                    flex-col
                                    justify-between
                                    gap-5
                                    overflow-hidden
                                    p-6

                                    sm:min-h-[185px]
                                    sm:p-7

                                    md:min-h-[190px]
                                    md:p-7

                                    lg:min-h-[200px]
                                    lg:p-8

                                    xl:min-h-[210px]
                                    xl:p-9

                                    2xl:min-h-[220px]
                                    2xl:p-10

                                    ${className}
                                `}
                            >
                                {/* Decorative Circle */}
                                <div
                                    aria-hidden="true"
                                    className="
                                        pointer-events-none
                                        absolute
                                        -right-10
                                        -top-10
                                        h-28
                                        w-28
                                        rounded-full
                                        border
                                        border-white/10
                                    "
                                />

                                {/* Top Row */}
                                <div
                                    className="
                                        relative
                                        z-10
                                        flex
                                        w-full
                                        items-start
                                        justify-between
                                        gap-4
                                    "
                                >
                                    <Icon
                                        aria-hidden="true"
                                        size={28}
                                        className={`
                                            shrink-0
                                            opacity-90

                                            sm:h-8
                                            sm:w-8

                                            lg:h-9
                                            lg:w-9

                                            2xl:h-10
                                            2xl:w-10

                                            ${iconClassName}
                                        `}
                                    />

                                    <span
                                        className="
                                            text-2xl
                                            font-bold
                                            leading-8
                                            tracking-[-0.4px]

                                            sm:text-[26px]
                                            sm:leading-9

                                            lg:text-[28px]

                                            2xl:text-3xl
                                            2xl:leading-10
                                        "
                                    >
                                        {value}
                                    </span>
                                </div>

                                {/* Content */}
                                <div
                                    className="
                                        relative
                                        z-10
                                        flex
                                        flex-col
                                        gap-1.5
                                    "
                                >
                                    <h3
                                        className={`
                                            text-xs
                                            font-semibold
                                            uppercase
                                            leading-5
                                            tracking-[0.6px]

                                            sm:text-sm
                                            sm:tracking-[0.7px]

                                            lg:text-[15px]

                                            2xl:text-base
                                            2xl:tracking-[0.8px]

                                            ${titleClassName}
                                        `}
                                    >
                                        {title}
                                    </h3>

                                    <p
                                        className={`
                                            max-w-xl
                                            text-sm
                                            font-normal
                                            leading-5

                                            sm:text-[15px]
                                            sm:leading-6

                                            lg:text-base

                                            2xl:text-[17px]
                                            2xl:leading-7

                                            ${descriptionClassName}
                                        `}
                                    >
                                        {description}
                                    </p>
                                </div>
                            </article>
                        )
                    )}
                </div>
            </div>
        </section>
    );
}