
import { getWhoWeAre } from "../../../lib/data/aboutSectionQuery/WhoWeAre";

export const dynamic = "force-dynamic";

export default async function WhoWeAre() {
    let content;

    try {
        content = await getWhoWeAre();
    } catch (error) {
        console.error("Failed to load Who We Are content:", error);
        return null;
    }

    // Hide the section if no active record exists.
    if (!content || !content.isActive) {
        return null;
    }

    const eyebrow = content.eyebrow?.trim() ?? "";
    const title = content.title?.trim() ?? "";
    const descriptionOne = content.descriptionOne?.trim() ?? "";
    const descriptionTwo = content.descriptionTwo?.trim() ?? "";

    // Hide the entire section if all editable fields are empty.
    if (!eyebrow && !title && !descriptionOne && !descriptionTwo) {
        return null;
    }

    return (
        <section
            id="who-we-are"
            className="
                scroll-mt-28
                bg-[#FBF9F9]
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
                <div
                    className="
                        grid
                        gap-8
                        lg:grid-cols-[0.8fr_1.2fr]
                        lg:gap-14
                        xl:gap-20
                    "
                >
                    {/* Heading */}
                    <div>
                        {eyebrow && (
                            <div className="mb-3 flex items-center gap-2">
                                <span className="h-px w-8 bg-[#911824]" />

                                <p
                                    className="
                                        text-[11px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.2em]
                                        text-[#911824]
                                        sm:text-xs
                                    "
                                >
                                    {eyebrow}
                                </p>
                            </div>
                        )}

                        {title && (
                            <h2
                                className="
                                    max-w-xl
                                    text-3xl
                                    font-bold
                                    leading-tight
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

                    {/* Description */}
                    {(descriptionOne || descriptionTwo) && (
                        <div
                            className="
                                space-y-5
                                text-base
                                leading-7
                                text-[#5B403D]
                                sm:text-[17px]
                                sm:leading-8
                            "
                        >
                            {descriptionOne && (
                                <p>{descriptionOne}</p>
                            )}

                            {descriptionTwo && (
                                <p>{descriptionTwo}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
