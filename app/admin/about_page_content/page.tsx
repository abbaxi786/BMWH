
"use client";

import MainBannerAccordion from "./banner_section";
import WhoWeAreAccordion from "./who_we_are";
import MissionVisionAccordion from "./mission_vision";
import FounderMessageAccordion from "./founderMessage";
import TopLeadershipAccordion from "./top_leadership";
import TimelineHistoryAccordion from "./timeline";

export default function AboutPageContent() {
    return (
        <div className="w-full space-y-4">
            {/* Page heading */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    About Page Content
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Manage the content displayed throughout the hospital&apos;s
                    About page.
                </p>
            </div>

            {/* Main banner */}
            <MainBannerAccordion />

            {/* Who we are */}
            <WhoWeAreAccordion />
            
            <TimelineHistoryAccordion/>

            {/* Mission and vision */}
            <MissionVisionAccordion />

            {/* Founder message */}
            <FounderMessageAccordion />

            {/* Chairman and president messages */}
            <TopLeadershipAccordion />
        </div>
    );
}
