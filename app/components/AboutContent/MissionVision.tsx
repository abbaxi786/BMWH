
import { FaHeartbeat } from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";
import { getMissionVision } from "../../../lib/data/aboutSectionQuery/VisionAndMission";

export const dynamic = "force-dynamic";

export default async function MissionVision() {
    let content;

    try {
        content = await getMissionVision();
    } catch (error) {
        console.error("Failed to load Mission & Vision:", error);
        return null;
    }

    // Hide the entire section if there is no active record.
    if (!content || !content.isActive) {
        return null;
    }

    const eyebrow = content.eyebrow?.trim() ?? "";
    const title = content.title?.trim() ?? "";
    const missionTitle = content.missionTitle?.trim() ?? "";
    const missionDescription =
        content.missionDescription?.trim() ?? "";
    const visionTitle = content.visionTitle?.trim() ?? "";
    const visionDescription =
        content.visionDescription?.trim() ?? "";

    // Hide the section if all editable content is empty.
    if (
        !eyebrow &&
        !title &&
        !missionTitle &&
        !missionDescription &&
        !visionTitle &&
        !visionDescription
    ) {
        return null;
    }

    return (
        <section
            id="mission-vision"
            className="
                scroll-mt-28
                bg-white
                py-16
                sm:py-20
                lg:py-24
                xl:py-28
                2xl:py-32
            "
        >
            <div
                className="
                    mx-auto
                    w-full
                    max-w-7xl
                    px-5
                    sm:px-8
                    lg:px-10
                "
            >
                {/* Section Heading */}
                {(eyebrow || title) && (
                    <div className="mb-10 text-center sm:mb-12">
                        {eyebrow && (
                            <div className="mb-3 flex items-center justify-center gap-2">
                                <span className="h-px w-8 bg-[#911824]" />

                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#911824] sm:text-xs">
                                    {eyebrow}
                                </p>

                                <span className="h-px w-8 bg-[#911824]" />
                            </div>
                        )}

                        {title && (
                            <h2
                                className="
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    text-[#1B1C1C]
                                    sm:text-4xl
                                    lg:text-[42px]
                                    xl:text-[46px]
                                "
                            >
                                {title}
                            </h2>
                        )}
                    </div>
                )}

                {/* Mission and Vision Cards */}
                {(missionTitle ||
                    missionDescription ||
                    visionTitle ||
                    visionDescription) && (
                    <div className="grid gap-5 sm:gap-6 lg:grid-cols-2 xl:gap-8">
                        {/* Mission */}
                        {(missionTitle || missionDescription) && (
                            <div
                                id="mission"
                                className="
                                    scroll-mt-28
                                    min-h-70
                                    border
                                    border-[#E7DEDC]
                                    bg-[#FBF9F9]
                                    p-7
                                    sm:p-8
                                    lg:p-10
                                    xl:min-h-80
                                "
                            >
                                <div
                                    className="
                                        mb-6
                                        flex
                                        h-13
                                        w-13
                                        items-center
                                        justify-center
                                        bg-[#911824]
                                        text-xl
                                        text-white
                                        sm:h-14
                                        sm:w-14
                                        sm:text-2xl
                                    "
                                >
                                    <FaHeartbeat aria-hidden="true" />
                                </div>

                                {missionTitle && (
                                    <h3 className="mb-4 text-2xl font-bold text-[#1B1C1C]">
                                        {missionTitle}
                                    </h3>
                                )}

                                {missionDescription && (
                                    <p className="leading-7 text-[#5B403D] sm:leading-8">
                                        {missionDescription}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Vision */}
                        {(visionTitle || visionDescription) && (
                            <div
                                id="vision"
                                className="
                                    scroll-mt-28
                                    min-h-70
                                    bg-[#911824]
                                    p-7
                                    text-white
                                    sm:p-8
                                    lg:p-10
                                    xl:min-h-80
                                "
                            >
                                <div
                                    className="
                                        mb-6
                                        flex
                                        h-13
                                        w-13
                                        items-center
                                        justify-center
                                        bg-white/10
                                        text-xl
                                        sm:h-14
                                        sm:w-14
                                        sm:text-2xl
                                    "
                                >
                                    <MdHealthAndSafety aria-hidden="true" />
                                </div>

                                {visionTitle && (
                                    <h3 className="mb-4 text-2xl font-bold">
                                        {visionTitle}
                                    </h3>
                                )}

                                {visionDescription && (
                                    <p className="leading-7 text-white/80 sm:leading-8">
                                        {visionDescription}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
