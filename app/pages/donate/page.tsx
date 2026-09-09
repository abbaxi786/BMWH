import React from "react";
import DonationHero from "@/app/components/donate/overlayCard";
import AdoptYourCause from "@/app/components/donate/adoptYourCause";
import DonationPart from "@/app/components/donate/donationPart";

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