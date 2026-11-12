import React from "react";
import type { Metadata } from "next";

import DonationHero from "@/app/components/donate/overlayCard";
import AdoptYourCause from "@/app/components/donate/adoptYourCause";
import DonationPart from "@/app/components/donate/donationPart";

export const revalidate = 86400;

const SITE_URL = process.env.BACKEND_URL?.replace(/\/+$/, "") || "";

export const metadata: Metadata = {
    title: "Donate | Support Bashir Memorial Welfare Hospital",
    description:
        "Support Bashir Memorial Welfare Hospital through donations. Help provide quality healthcare, medical facilities, and essential services to patients in need.",

    alternates: {
        canonical: `${SITE_URL}/pages/donate`,
    },

    openGraph: {
        title: "Donate | Bashir Memorial Welfare Hospital",
        description:
            "Your contribution can help Bashir Memorial Welfare Hospital provide better healthcare and support to patients in need.",
        url: `${SITE_URL}/pages/donate`,
        siteName: "Bashir Memorial Welfare Hospital",
        type: "website",
        images: [
            {
                url: `${SITE_URL}/images/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: "Support Bashir Memorial Welfare Hospital",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Donate | Bashir Memorial Welfare Hospital",
        description:
            "Support healthcare services and help make a difference through your donation.",
        images: [`${SITE_URL}/images/og-image.jpg`],
    },
};

function Donate() {
    return (
        <main
            id="donate-page"
            className="animate-fade-in-up"
        >
            {/* ================= DONATION OVERVIEW ================= */}
            <section
                id="donation-overview"
                className="scroll-mt-28"
            >
                <DonationHero />
            </section>

            {/* ================= WHAT YOU CAN SUPPORT ================= */}
            <section
                id="what-you-can-support"
                className="scroll-mt-28"
            >
                <AdoptYourCause />
            </section>

            {/* ================= WAYS TO DONATE ================= */}
            <section
                id="ways-to-donate"
                className="scroll-mt-28"
            >
                <DonationPart />
            </section>
        </main>
    );
}

export default Donate;