
export function HeroBannerSkeleton() {
    return (
        <section
            aria-label="Loading hospital banner"
            aria-busy="true"
            className="
                relative
                min-h-155
                w-full
                animate-pulse
                overflow-hidden
                bg-[#FBF9F9]
                sm:min-h-150
                lg:h-150
                lg:min-h-0
                xl:h-155
                2xl:h-165
            "
        >
            <div
                className="
                    mx-auto flex min-h-155 w-full max-w-7xl
                    items-center px-5 py-16
                    sm:min-h-150 sm:px-8 sm:py-20
                    lg:min-h-0 lg:px-10 xl:px-12
                    2xl:max-w-360 2xl:px-16
                "
            >
                <div className="w-full max-w-2xl space-y-5">
                    <div className="h-6 w-64 rounded-full bg-[#E9E1E1]" />

                    <div className="space-y-3 pt-2">
                        <div className="h-10 w-full max-w-xl rounded-md bg-[#E9E1E1] sm:h-14" />
                        <div className="h-10 w-4/5 max-w-lg rounded-md bg-[#E9E1E1] sm:h-14" />
                    </div>

                    <div className="space-y-2 pt-2">
                        <div className="h-4 w-full max-w-xl rounded bg-[#E9E1E1]" />
                        <div className="h-4 w-4/5 max-w-lg rounded bg-[#E9E1E1]" />
                    </div>

                    <div className="h-12 w-40 rounded bg-[#E9E1E1]" />
                </div>
            </div>
        </section>
    );
}

export function ImpactStatsSkeleton() {
    return (
        <section
            aria-label="Loading impact statistics"
            aria-busy="true"
            className="relative z-20 w-full"
        >
            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {[0, 1, 2].map((item) => (
                        <div
                            key={item}
                            className="
                                min-h-[190px]
                                animate-pulse
                                rounded-xl
                                border border-[#E4BEBA]/40
                                bg-white
                                p-8
                                shadow-[0_18px_40px_rgba(0,0,0,0.05)]
                            "
                        >
                            <div className="mb-7 flex items-center justify-between">
                                <div className="h-10 w-28 rounded bg-[#E9E1E1]" />
                                <div className="h-9 w-9 rounded-full bg-[#E9E1E1]" />
                            </div>

                            <div className="mb-3 h-5 w-3/4 rounded bg-[#E9E1E1]" />
                            <div className="h-4 w-full rounded bg-[#E9E1E1]" />
                            <div className="mt-2 h-4 w-2/3 rounded bg-[#E9E1E1]" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
