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
        <section className="relative z-20 w-full px-0 sm:px-2 lg:px-5">
            <div
                className="
                    mx-auto
                    w-full
                    overflow-hidden
                    rounded-lg
                    bg-[#FBF9F9]
                    shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]
                "
            >
                <div className="grid w-full grid-cols-1 md:grid-cols-3">

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
                            <div
                                key={title}
                                className={`
                                    flex
                                    min-h-[170px]
                                    flex-col
                                    gap-2
                                    p-5

                                    sm:min-h-[180px]
                                    sm:p-6

                                    md:min-h-[190px]
                                    md:p-7

                                    lg:min-h-[196px]
                                    lg:p-8

                                    ${className}
                                `}
                            >
                                {/* Icon + Number */}
                                <div className="flex w-full items-start justify-between gap-4">

                                    <Icon
                                        size={28}
                                        className={`
                                            shrink-0
                                            opacity-80

                                            sm:h-8
                                            sm:w-8

                                            ${iconClassName}
                                        `}
                                    />

                                    <span
                                        className="
                                            text-xl
                                            font-bold
                                            leading-7

                                            sm:text-2xl
                                            sm:leading-8
                                        "
                                    >
                                        {value}
                                    </span>

                                </div>

                                {/* Title */}
                                <div className="pt-2 sm:pt-3 md:pt-4">
                                    <h3
                                        className={`
                                            text-xs
                                            font-semibold
                                            uppercase
                                            leading-5
                                            tracking-[0.6px]

                                            sm:text-sm
                                            sm:tracking-[0.7px]

                                            ${titleClassName}
                                        `}
                                    >
                                        {title}
                                    </h3>
                                </div>

                                {/* Description */}
                                <p
                                    className={`
                                        text-sm
                                        font-normal
                                        leading-5

                                        sm:text-base
                                        sm:leading-6

                                        ${descriptionClassName}
                                    `}
                                >
                                    {description}
                                </p>
                            </div>
                        )
                    )}

                </div>
            </div>
        </section>
    );
}