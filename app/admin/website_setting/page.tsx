
"use client";

import { useState } from "react";
import {
    FiSettings,
    FiImage,
    FiBarChart2,
    FiInfo,
    FiMessageSquare,
    FiChevronDown,
    FiSave,
    FiRotateCcw,
    FiCheckCircle,
    FiAlertCircle,
} from "react-icons/fi";
import BannerImagesSettings from "./banner_images";
import ImpactStatsSettings from "./stats_values";

type BannerSlot = {
    src: string;
    alt: string;
};

type Stat = {
    value: string;
    title: string;
    description: string;
};

type WebsiteSettings = {
    banner: {
        badge: string;
        heading: string;
        description: string;
        primaryButtonText: string;
        primaryButtonLink: string;
        secondaryButtonText: string;
        secondaryButtonLink: string;
        images: BannerSlot[];
    };
    stats: Stat[];
    about: {
        heading: string;
        description: string;
        buttonText: string;
        buttonLink: string;
    };
    president: {
        heading: string;
        name: string;
        designation: string;
        message: string;
    };
};

const DEFAULT_SETTINGS: WebsiteSettings = {
    banner: {
        badge: "Compassionate Care. Stronger Communities.",
        heading: "Compassionate Healthcare. Serving the Community.",
        description:
            "Bashir Memorial Welfare Hospital is committed to providing quality healthcare to everyone, regardless of their financial status.",
        primaryButtonText: "Book an Appointment",
        primaryButtonLink: "/book-appointment",
        secondaryButtonText: "Find a Doctor",
        secondaryButtonLink: "/doctors",
        images: [
            { src: "/images/banner.jpeg", alt: "Hospital banner" },
            { src: "/images/dentalSeat.jpeg", alt: "Dental care" },
            { src: "/images/stethoscope.jpg", alt: "Medical care" },
            { src: "/images/med.jpeg", alt: "Hospital services" },
        ],
    },
    stats: [
        {
            value: "50K+",
            title: "Patients Served",
            description:
                "Providing continuous care and support to our growing community over the years.",
        },
        {
            value: "10K+",
            title: "Free Treatments",
            description:
                "Funded through generous donations and our dedicated welfare programs.",
        },
        {
            value: "25+",
            title: "Years of Service",
            description:
                "A legacy of clinical integrity, trust, and unwavering commitment to health.",
        },
    ],
    about: {
        heading: "About Bashir Memorial Welfare Hospital",
        description:
            "Dedicated to providing compassionate, accessible and quality healthcare to our community.",
        buttonText: "Learn More About Us",
        buttonLink: "/pages/about",
    },
    president: {
        heading: "President's Message",
        name: "",
        designation: "",
        message: "",
    },
};

const ACCORDION_ITEMS = [
    {
        id: "banner",
        title: "Home Page Banner Content",
        description:
            "Manage the banner badge, heading, description and buttons.",
        icon: FiSettings,
    },
    {
        id: "bannerImages",
        title: "Home Page Banner Images",
        description:
            "Manage up to four banner images and their alt text.",
        icon: FiImage,
    },
    {
        id: "stats",
        title: "Impact Statistics",
        description:
            "Edit the statistics displayed on the homepage.",
        icon: FiBarChart2,
    },
    {
        id: "about",
        title: "Home Page About Section",
        description:
            "Manage the homepage about heading and content.",
        icon: FiInfo,
    },
    {
        id: "president",
        title: "President's Message",
        description:
            "Manage the president's name, designation and message.",
        icon: FiMessageSquare,
    },
];

const inputClass =
    "input input-bordered w-full rounded-xl bg-base-100 focus:outline-none focus:border-red-800";

const textareaClass =
    "textarea textarea-bordered w-full min-h-28 rounded-xl bg-base-100 focus:outline-none focus:border-red-800";

const labelClass = "label-text font-semibold text-base-content";

export default function WebsiteSettingsPage() {
    const [settings, setSettings] =
        useState<WebsiteSettings>(DEFAULT_SETTINGS);

    const [openSections, setOpenSections] = useState<string[]>([
        "banner",
    ]);

    const [notice, setNotice] = useState("");
    const [noticeType, setNoticeType] = useState<
        "success" | "error"
    >("success");

    const activeBannerCount = settings.banner.images.filter(
        (image) => image.src.trim().length > 0
    ).length;

    const updateBanner = (
        field: Exclude<keyof WebsiteSettings["banner"], "images">,
        value: string
    ) => {
        setSettings((previous) => ({
            ...previous,
            banner: {
                ...previous.banner,
                [field]: value,
            },
        }));
    };

    const updateBannerImage = (
        index: number,
        field: keyof BannerSlot,
        value: string
    ) => {
        setSettings((previous) => ({
            ...previous,
            banner: {
                ...previous.banner,
                images: previous.banner.images.map(
                    (image, imageIndex) =>
                        imageIndex === index
                            ? { ...image, [field]: value }
                            : image
                ),
            },
        }));
    };

    const updateStat = (
        index: number,
        field: keyof Stat,
        value: string
    ) => {
        setSettings((previous) => ({
            ...previous,
            stats: previous.stats.map((stat, statIndex) =>
                statIndex === index
                    ? { ...stat, [field]: value }
                    : stat
            ),
        }));
    };

    const updateAbout = (
        field: keyof WebsiteSettings["about"],
        value: string
    ) => {
        setSettings((previous) => ({
            ...previous,
            about: {
                ...previous.about,
                [field]: value,
            },
        }));
    };

    const updatePresident = (
        field: keyof WebsiteSettings["president"],
        value: string
    ) => {
        setSettings((previous) => ({
            ...previous,
            president: {
                ...previous.president,
                [field]: value,
            },
        }));
    };

    const toggleSection = (id: string) => {
        setOpenSections((previous) =>
            previous.includes(id)
                ? previous.filter((section) => section !== id)
                : [...previous, id]
        );
    };

    const handleDraftSave = () => {
        try {
            localStorage.setItem(
                "bmh-website-settings-draft",
                JSON.stringify(settings)
            );

            setNoticeType("success");
            setNotice(
                "Draft saved in this browser only. Database saving is not connected yet."
            );
        } catch {
            setNoticeType("error");
            setNotice(
                "Unable to save the draft in this browser."
            );
        }
    };

    const handleLoadDraft = () => {
        try {
            const saved = localStorage.getItem(
                "bmh-website-settings-draft"
            );

            if (!saved) {
                setNoticeType("error");
                setNotice(
                    "No saved draft was found in this browser."
                );
                return;
            }

            const parsed = JSON.parse(saved) as WebsiteSettings;

            if (
                !parsed.banner ||
                !Array.isArray(parsed.banner.images) ||
                !Array.isArray(parsed.stats) ||
                !parsed.about ||
                !parsed.president
            ) {
                throw new Error("Invalid draft structure");
            }

            setSettings({
                ...DEFAULT_SETTINGS,
                ...parsed,
                banner: {
                    ...DEFAULT_SETTINGS.banner,
                    ...parsed.banner,
                    images: Array.from(
                        { length: 4 },
                        (_, index) => ({
                            src:
                                parsed.banner.images[index]?.src ?? "",
                            alt:
                                parsed.banner.images[index]?.alt ?? "",
                        })
                    ),
                },
                stats: DEFAULT_SETTINGS.stats.map(
                    (defaultStat, index) => ({
                        ...defaultStat,
                        ...(parsed.stats[index] ?? {}),
                    })
                ),
            });

            setNoticeType("success");
            setNotice("Saved browser draft loaded.");
        } catch {
            setNoticeType("error");
            setNotice(
                "The saved draft could not be loaded."
            );
        }
    };

    const handleReset = () => {
        const confirmed = window.confirm(
            "Reset all fields to their original default values?"
        );

        if (!confirmed) return;

        setSettings(DEFAULT_SETTINGS);
        setNotice("");
    };

    const renderSaveActions = () => (
        <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-base-300 pt-5">
            <button
                type="button"
                onClick={handleReset}
                className="btn btn-ghost rounded-xl"
            >
                <FiRotateCcw size={16} />
                Reset All
            </button>

            <button
                type="button"
                onClick={handleDraftSave}
                className="btn rounded-xl border-red-900 bg-red-900 text-white hover:border-red-950 hover:bg-red-950"
            >
                <FiSave size={16} />
                Save Draft
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-200/50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Page heading */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-base-content/60">
                            <FiSettings size={16} />
                            <span>Admin Panel</span>
                            <span>/</span>
                            <span>Website</span>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Website Settings
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm text-base-content/60 sm:text-base">
                            Manage your homepage content from one
                            place. Connect these settings to your
                            frontend components when you are ready.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={handleLoadDraft}
                            className="btn btn-outline rounded-xl"
                        >
                            <FiRotateCcw size={16} />
                            Load Draft
                        </button>

                        <button
                            type="button"
                            onClick={handleDraftSave}
                            className="btn rounded-xl border-red-900 bg-red-900 text-white hover:border-red-950 hover:bg-red-950"
                        >
                            <FiSave size={16} />
                            Save Draft
                        </button>
                    </div>
                </div>

                {/* Status message */}
                {notice && (
                    <div
                        role="status"
                        className={`alert rounded-xl ${noticeType === "success"
                                ? "alert-success"
                                : "alert-error"
                            }`}
                    >
                        {noticeType === "success" ? (
                            <FiCheckCircle size={20} />
                        ) : (
                            <FiAlertCircle size={20} />
                        )}
                        <span>{notice}</span>
                    </div>
                )}

                {/* Information panel */}
                <div className="rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-red-900/10 p-3 text-red-900">
                            <FiSettings size={22} />
                        </div>

                        <div>
                            <h2 className="font-bold">
                                Content Management
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-base-content/65">
                                Use these sections for editable website
                                content. Doctors, departments,
                                achievements, news and other dynamic
                                records should continue to use their
                                respective management pages.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Settings accordions */}
                <div className="space-y-4">
                    {ACCORDION_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isOpen = openSections.includes(item.id);

                        return (
                            <section
                                key={item.id}
                                className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        toggleSection(item.id)
                                    }
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-base-200/60 sm:p-5"
                                >
                                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                                        <div className="shrink-0 rounded-xl bg-red-900/10 p-3 text-red-900">
                                            <Icon size={21} />
                                        </div>

                                        <div className="min-w-0">
                                            <h2 className="font-bold sm:text-lg">
                                                {item.title}
                                            </h2>

                                            <p className="mt-1 text-sm text-base-content/60">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                    <FiChevronDown
                                        size={21}
                                        className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="border-t border-base-300 p-4 sm:p-6">
                                        {/* 1. Banner text content */}
                                        {item.id === "banner" && (
                                            <div className="space-y-7">
                                                <div>
                                                    <h3 className="font-bold">
                                                        Banner Content
                                                    </h3>
                                                    <p className="mt-1 text-sm text-base-content/60">
                                                        Configure the text
                                                        and buttons separately
                                                        from the banner images.
                                                        Empty text fields can
                                                        be hidden on the
                                                        frontend.
                                                    </p>
                                                </div>

                                                <div className="grid gap-5 md:grid-cols-2">
                                                    <div className="form-control gap-2">
                                                        <label className={labelClass}>
                                                            Badge Text
                                                        </label>
                                                        <input
                                                            className={inputClass}
                                                            value={settings.banner.badge}
                                                            onChange={(e) =>
                                                                updateBanner(
                                                                    "badge",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter badge text"
                                                        />
                                                    </div>

                                                    <div className="form-control gap-2">
                                                        <label className={labelClass}>
                                                            Main Heading
                                                        </label>
                                                        <input
                                                            className={inputClass}
                                                            value={settings.banner.heading}
                                                            onChange={(e) =>
                                                                updateBanner(
                                                                    "heading",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter banner heading"
                                                        />
                                                    </div>

                                                    <div className="form-control gap-2 md:col-span-2">
                                                        <label className={labelClass}>
                                                            Description
                                                        </label>
                                                        <textarea
                                                            className={textareaClass}
                                                            value={settings.banner.description}
                                                            onChange={(e) =>
                                                                updateBanner(
                                                                    "description",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter banner description"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid gap-5 md:grid-cols-2">
                                                    <div className="form-control gap-2">
                                                        <label className={labelClass}>
                                                            Primary Button Text
                                                        </label>
                                                        <input
                                                            className={inputClass}
                                                            value={settings.banner.primaryButtonText}
                                                            onChange={(e) =>
                                                                updateBanner(
                                                                    "primaryButtonText",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Book an Appointment"
                                                        />
                                                    </div>

                                                    <div className="form-control gap-2">
                                                        <label className={labelClass}>
                                                            Primary Button Link
                                                        </label>
                                                        <input
                                                            className={inputClass}
                                                            value={settings.banner.primaryButtonLink}
                                                            onChange={(e) =>
                                                                updateBanner(
                                                                    "primaryButtonLink",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="/book-appointment"
                                                        />
                                                    </div>

                                                    <div className="form-control gap-2">
                                                        <label className={labelClass}>
                                                            Secondary Button Text
                                                        </label>
                                                        <input
                                                            className={inputClass}
                                                            value={settings.banner.secondaryButtonText}
                                                            onChange={(e) =>
                                                                updateBanner(
                                                                    "secondaryButtonText",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Find a Doctor"
                                                        />
                                                    </div>

                                                    <div className="form-control gap-2">
                                                        <label className={labelClass}>
                                                            Secondary Button Link
                                                        </label>
                                                        <input
                                                            className={inputClass}
                                                            value={settings.banner.secondaryButtonLink}
                                                            onChange={(e) =>
                                                                updateBanner(
                                                                    "secondaryButtonLink",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="/doctors"
                                                        />
                                                    </div>
                                                </div>

                                                {renderSaveActions()}
                                            </div>
                                        )}

                                        {/* 2. Banner images - separate accordion */}
                                        {item.id === "bannerImages" && (
                                            <BannerImagesSettings />
                                        )}

                                        {/* 3. Impact statistics */}
                                        {item.id === "stats" && (
                                            <ImpactStatsSettings />
                                        )}

                                        {/* 4. About section */}
                                        {item.id === "about" && (
                                            <div className="space-y-5">
                                                <div className="form-control gap-2">
                                                    <label className={labelClass}>
                                                        Section Heading
                                                    </label>
                                                    <input
                                                        className={inputClass}
                                                        value={settings.about.heading}
                                                        onChange={(e) =>
                                                            updateAbout(
                                                                "heading",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter section heading"
                                                    />
                                                </div>

                                                <div className="form-control gap-2">
                                                    <label className={labelClass}>
                                                        Description
                                                    </label>
                                                    <textarea
                                                        className={textareaClass}
                                                        value={settings.about.description}
                                                        onChange={(e) =>
                                                            updateAbout(
                                                                "description",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter about section description"
                                                    />
                                                </div>

                                                <div className="grid gap-5 md:grid-cols-2">
                                                    <div className="form-control gap-2">
                                                        <label className={labelClass}>
                                                            Button Text
                                                        </label>
                                                        <input
                                                            className={inputClass}
                                                            value={settings.about.buttonText}
                                                            onChange={(e) =>
                                                                updateAbout(
                                                                    "buttonText",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Learn More About Us"
                                                        />
                                                    </div>

                                                    <div className="form-control gap-2">
                                                        <label className={labelClass}>
                                                            Button Link
                                                        </label>
                                                        <input
                                                            className={inputClass}
                                                            value={settings.about.buttonLink}
                                                            onChange={(e) =>
                                                                updateAbout(
                                                                    "buttonLink",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="/pages/about"
                                                        />
                                                    </div>
                                                </div>

                                                {renderSaveActions()}
                                            </div>
                                        )}

                                        {/* 5. President's message */}
                                        {item.id === "president" && (
                                            <div className="space-y-5">
                                                <div className="form-control gap-2">
                                                    <label className={labelClass}>
                                                        Section Heading
                                                    </label>
                                                    <input
                                                        className={inputClass}
                                                        value={settings.president.heading}
                                                        onChange={(e) =>
                                                            updatePresident(
                                                                "heading",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="President's Message"
                                                    />
                                                </div>

                                                <div className="grid gap-5 md:grid-cols-2">
                                                    <div className="form-control gap-2">
                                                        <label className={labelClass}>
                                                            President's Name
                                                        </label>
                                                        <input
                                                            className={inputClass}
                                                            value={settings.president.name}
                                                            onChange={(e) =>
                                                                updatePresident(
                                                                    "name",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter name"
                                                        />
                                                    </div>

                                                    <div className="form-control gap-2">
                                                        <label className={labelClass}>
                                                            Designation
                                                        </label>
                                                        <input
                                                            className={inputClass}
                                                            value={settings.president.designation}
                                                            onChange={(e) =>
                                                                updatePresident(
                                                                    "designation",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="Enter designation"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-control gap-2">
                                                    <label className={labelClass}>
                                                        Message
                                                    </label>
                                                    <textarea
                                                        className={`${textareaClass} min-h-48`}
                                                        value={settings.president.message}
                                                        onChange={(e) =>
                                                            updatePresident(
                                                                "message",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter the president's message"
                                                    />
                                                </div>

                                                {renderSaveActions()}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>

                {/* Integration note */}
                <div className="flex items-start gap-3 rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-5">
                    <FiCheckCircle
                        size={21}
                        className="mt-0.5 shrink-0 text-red-900"
                    />

                    <div>
                        <h3 className="font-bold">
                            Ready for API integration
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-base-content/65">
                            This page currently manages local form state
                            and browser drafts. It does not upload images
                            to Cloudinary or persist settings to your
                            database. Those functions can be added
                            separately without changing the accordion
                            structure.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
