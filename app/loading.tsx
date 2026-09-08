export default function Loading() {
    return (
        <main className="w-full overflow-x-hidden bg-[#FBF9F9]">

            {/* =========================================================
                HERO SKELETON
            ========================================================= */}
            <section
                className="
                    relative
                    min-h-155
                    w-full
                    overflow-hidden
                    bg-[#F5F3F3]

                    sm:min-h-150

                    md:min-h-155

                    lg:h-150
                    lg:min-h-0

                    xl:h-155
                "
            >
                {/* Background */}
                <div className="absolute inset-0 bg-[#EFEDED]" />

                {/* Hero Content */}
                <div
                    className="
                        relative
                        z-10
                        flex
                        min-h-155
                        w-full
                        items-center
                        px-5
                        py-16

                        sm:px-8
                        sm:py-20

                        md:px-10

                        lg:h-full
                        lg:min-h-0
                        lg:px-12

                        xl:px-16
                        2xl:px-20
                    "
                >
                    <div
                        className="
                            flex
                            w-full
                            max-w-2xl
                            flex-col
                            items-start
                            gap-4
                        "
                    >

                        {/* Label */}
                        <div className="h-6 w-56 animate-pulse rounded-full bg-[#D9D7D7]" />

                        {/* Heading */}
                        <div className="w-full max-w-2xl space-y-3">
                            <div className="h-10 w-full max-w-xl animate-pulse rounded bg-[#D9D7D7] sm:h-12" />

                            <div className="h-10 w-4/5 max-w-lg animate-pulse rounded bg-[#D9D7D7] sm:h-12" />
                        </div>

                        {/* Description */}
                        <div className="w-full max-w-xl space-y-2 pt-2">
                            <div className="h-4 w-full animate-pulse rounded bg-[#D9D7D7]" />
                            <div className="h-4 w-5/6 animate-pulse rounded bg-[#D9D7D7]" />
                            <div className="h-4 w-2/3 animate-pulse rounded bg-[#D9D7D7]" />
                        </div>

                        {/* Buttons */}
                        <div
                            className="
                                flex
                                w-full
                                flex-col
                                gap-3
                                pt-2

                                sm:w-auto
                                sm:flex-row
                            "
                        >
                            <div className="h-11 w-full animate-pulse rounded bg-[#D9D7D7] sm:w-48" />

                            <div className="h-11 w-full animate-pulse rounded bg-[#D9D7D7] sm:w-40" />
                        </div>

                    </div>
                </div>
            </section>


            {/* =========================================================
                IMPACT STATS SKELETON
            ========================================================= */}
            <section
                className="
                    relative
                    z-20
                    -mt-20
                    px-4
                    pb-20

                    sm:-mt-20
                    sm:px-6
                    sm:pb-24

                    md:-mt-20
                    md:px-8

                    lg:-mt-24
                    lg:px-10

                    xl:px-12
                "
            >
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

                    <div className="grid grid-cols-1 md:grid-cols-3">

                        {/* Card 1 */}
                        <div className="min-h-[170px] animate-pulse bg-[#E3E1E1] p-5 sm:p-6 md:p-7 lg:p-8">
                            <div className="flex justify-between">
                                <div className="h-8 w-8 rounded bg-[#D0CECE]" />
                                <div className="h-7 w-16 rounded bg-[#D0CECE]" />
                            </div>

                            <div className="mt-8 h-4 w-32 rounded bg-[#D0CECE]" />

                            <div className="mt-3 h-4 w-full rounded bg-[#D0CECE]" />
                            <div className="mt-2 h-4 w-4/5 rounded bg-[#D0CECE]" />
                        </div>


                        {/* Card 2 */}
                        <div className="min-h-[170px] animate-pulse bg-[#E9E8E8] p-5 sm:p-6 md:p-7 lg:p-8">
                            <div className="flex justify-between">
                                <div className="h-8 w-8 rounded bg-[#D0CECE]" />
                                <div className="h-7 w-16 rounded bg-[#D0CECE]" />
                            </div>

                            <div className="mt-8 h-4 w-32 rounded bg-[#D0CECE]" />

                            <div className="mt-3 h-4 w-full rounded bg-[#D0CECE]" />
                            <div className="mt-2 h-4 w-4/5 rounded bg-[#D0CECE]" />
                        </div>


                        {/* Card 3 */}
                        <div className="min-h-[170px] animate-pulse bg-[#3A3A3A] p-5 sm:p-6 md:p-7 lg:p-8">
                            <div className="flex justify-between">
                                <div className="h-8 w-8 rounded bg-[#555555]" />
                                <div className="h-7 w-16 rounded bg-[#555555]" />
                            </div>

                            <div className="mt-8 h-4 w-32 rounded bg-[#555555]" />

                            <div className="mt-3 h-4 w-full rounded bg-[#555555]" />
                            <div className="mt-2 h-4 w-4/5 rounded bg-[#555555]" />
                        </div>

                    </div>
                </div>
            </section>


            {/* =========================================================
                ABOUT SECTION SKELETON
            ========================================================= */}
            <section className="w-full bg-[#FBF9F9] py-16 sm:py-20 lg:py-24">

                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-12">

                    <div
                        className="
                            grid
                            grid-cols-1
                            items-center
                            gap-12

                            lg:grid-cols-2
                            lg:gap-12
                        "
                    >

                        {/* Content */}
                        <div className="animate-pulse">

                            {/* Label */}
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-8 bg-[#D9D7D7]" />
                                <div className="h-4 w-28 rounded bg-[#D9D7D7]" />
                            </div>

                            {/* Heading */}
                            <div className="mt-5 space-y-3">
                                <div className="h-8 w-full max-w-xl rounded bg-[#D9D7D7]" />
                                <div className="h-8 w-4/5 rounded bg-[#D9D7D7]" />
                            </div>

                            {/* Paragraph */}
                            <div className="mt-6 space-y-2">
                                <div className="h-4 w-full max-w-xl rounded bg-[#D9D7D7]" />
                                <div className="h-4 w-full max-w-lg rounded bg-[#D9D7D7]" />
                                <div className="h-4 w-5/6 max-w-lg rounded bg-[#D9D7D7]" />
                            </div>

                            {/* Second paragraph */}
                            <div className="mt-5 space-y-2">
                                <div className="h-4 w-full max-w-xl rounded bg-[#D9D7D7]" />
                                <div className="h-4 w-4/5 max-w-lg rounded bg-[#D9D7D7]" />
                            </div>

                            {/* Button */}
                            <div className="mt-7 h-11 w-52 rounded bg-[#D9D7D7]" />

                        </div>


                        {/* Image */}
                        <div
                            className="
                                relative
                                h-[280px]
                                w-full
                                animate-pulse
                                overflow-hidden
                                rounded-lg
                                bg-[#E3E1E1]

                                sm:h-[360px]

                                md:h-[400px]

                                lg:h-[420px]

                                xl:h-[440px]
                            "
                        >

                            {/* Floating card */}
                            <div
                                className="
                                    absolute
                                    bottom-4
                                    left-4
                                    z-10
                                    flex
                                    h-16
                                    w-[calc(100%-32px)]
                                    items-center
                                    gap-3
                                    rounded-lg
                                    bg-[#F5F3F3]
                                    p-3

                                    sm:bottom-6
                                    sm:left-6
                                    sm:w-72
                                "
                            >
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#D9D7D7]" />

                                <div className="flex flex-1 flex-col gap-2">
                                    <div className="h-3 w-16 rounded bg-[#D9D7D7]" />
                                    <div className="h-5 w-32 rounded bg-[#D9D7D7]" />
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================================
                NEWS SECTION SKELETON
            ========================================================= */}
            <section className="w-full bg-white py-16 sm:py-20 lg:py-24">

                <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10 xl:px-12">

                    {/* Header */}
                    <div
                        className="
                            flex
                            flex-col
                            gap-5
                            animate-pulse

                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                        "
                    >
                        <div className="flex flex-col gap-3">

                            <div className="flex items-center gap-2">
                                <div className="h-1 w-8 bg-[#D9D7D7]" />
                                <div className="h-4 w-32 rounded bg-[#D9D7D7]" />
                            </div>

                            <div className="h-8 w-56 rounded bg-[#D9D7D7]" />

                        </div>

                        <div className="h-5 w-28 rounded bg-[#D9D7D7]" />
                    </div>


                    {/* Cards */}
                    <div
                        className="
                            mt-8
                            grid
                            grid-cols-1
                            gap-5

                            sm:gap-6

                            md:grid-cols-2

                            lg:grid-cols-3
                        "
                    >

                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="
                                    min-h-[380px]
                                    overflow-hidden
                                    rounded-lg
                                    bg-[#FBF9F9]
                                    animate-pulse
                                "
                            >

                                {/* Image */}
                                <div className="h-[190px] w-full bg-[#E3E1E1]" />

                                {/* Content */}
                                <div className="space-y-3 p-4 sm:p-5">

                                    <div className="h-3 w-24 rounded bg-[#D9D7D7]" />

                                    <div className="h-6 w-full rounded bg-[#D9D7D7]" />

                                    <div className="h-6 w-4/5 rounded bg-[#D9D7D7]" />

                                    <div className="pt-2">
                                        <div className="h-4 w-full rounded bg-[#D9D7D7]" />
                                        <div className="mt-2 h-4 w-3/4 rounded bg-[#D9D7D7]" />
                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>

                </div>

            </section>

        </main>
    );
}

// import Image from "next/image";
// import { ReactElement } from "react";

// export default function Loading(): ReactElement {
//     return (
//         <main className="flex min-h-screen items-center justify-center bg-[#FBF9F9]">
//             <div className="flex flex-col items-center">

//                 {/* Logo + Circular Loader */}
//                 <div className="relative flex h-32 w-32 items-center justify-center">

//                     {/* Outer spinning loader */}
//                     <div
//                         className="
//                             absolute
//                             inset-0
//                             rounded-full
//                             border-4
//                             border-[#E5E2E2]
//                             border-t-[#86000D]
//                             animate-spin
//                         "
//                     />

//                     {/* Inner Logo */}
//                     <div className="relative h-20 w-20">
//                         <Image
//                             src="/logo.png"
//                             alt="Bashir Memorial Welfare Hospital"
//                             fill
//                             priority
//                             sizes="80px"
//                             className="object-contain"
//                         />
//                     </div>

//                 </div>

//                 {/* Loading Text */}
//                 <p className="mt-6 text-sm font-medium text-[#5B403D]">
//                     Loading...
//                 </p>

//             </div>
//         </main>
//     );
// }