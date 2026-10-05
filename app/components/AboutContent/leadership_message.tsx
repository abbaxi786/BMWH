import Image from "next/image"
import {
    FaQuoteLeft,
    FaHandHoldingHeart,
} from "react-icons/fa"

const chairmanMessage = {
    name: "Sohail Iqbal",
    designation: "Chairman, Bashir Memorial Welfare Hospital",
    image: "/person/sohail-iqbal.jpg",
    message: [
        `Welcome to Bashir Memorial Welfare Hospital, where our commitment to excellence is matched by our dedication to serving humanity.`,

        `Since its humble beginnings, Bashir Memorial Welfare Hospital has grown into a trusted healthcare institution. This progress reflects the vision of our founders, the trust of our community, and the unwavering dedication of our doctors, nurses, and staff, who work tirelessly to deliver safe, compassionate, and high-quality care.`,

        `As Chairman, my priority is to ensure that Bashir Memorial Welfare Hospital continues to evolve with the changing needs of healthcare. We are committed to strengthening our clinical services, investing in advanced medical technology, expanding specialized care, and upholding the highest standards of patient safety and excellence. Every step we take is guided by our belief that quality healthcare should be accessible, ethical, and patient-centered.`,

        `Our achievements would not have been possible without the confidence and generosity of our donors, partners, and well-wishers. Your continued support enables us to invest in better facilities, enhance our services, and extend quality healthcare to those who need it most.`,

        `As we look ahead, we remain focused on building a stronger, more innovative healthcare institution—one that continues to earn the trust of our patients while making a lasting contribution to the health and well-being of our communities.`,

        `Thank you for being part of this journey. Together, we will continue to build a healthier future with compassion, excellence, and purpose.`,
    ],
}

const presidentMessage = {
    name: "Sohaib Afzal",
    designation: "President, Bashir Memorial Welfare Hospital",
    image: "/images/about/president.jpg",
    message: [
        `It is a privilege to welcome you to Bashir Memorial Welfare Hospital, where faith, compassion, and service come together to bring hope and healing to those in need.`,

        `Our institution was founded on an inspiring vision of serving humanity, believing that quality healthcare should never be beyond the reach of anyone because of financial hardship. This enduring legacy continues to guide our mission of delivering care with dignity, compassion, and excellence.`,

        `Every day, our dedicated doctors, nurses, and healthcare professionals care for patients with the understanding that while we provide treatment, true healing comes from Allah.`,
    ],
}

const containerClass = `
    mx-auto
    w-full
    max-w-7xl
    px-5
    sm:px-8
    lg:px-10
    xl:px-12
    2xl:max-w-[1440px]
    2xl:px-16
    3xl:max-w-[1600px]
`

export default function LeadershipMessages() {
    return (
        <section
            id="leadership-messages"
            className="
                scroll-mt-28
                w-full
                bg-white
                py-16
                sm:py-20
                lg:py-24
                xl:py-28
                2xl:py-32
            "
        >
            <div className={containerClass}>

                {/* ==================================================
                    SECTION HEADER
                ================================================== */}

                <div
                    className="
                        mx-auto
                        mb-12
                        max-w-3xl
                        text-center
                        sm:mb-14
                        lg:mb-16
                        xl:mb-18
                        2xl:mb-20
                    "
                >
                    <div className="mb-4 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-[#911824] sm:text-sm">
                        <span className="h-0.5 w-7 bg-[#911824] sm:w-8" />

                        Leadership Messages

                        <span className="h-0.5 w-7 bg-[#911824] sm:w-8" />
                    </div>

                    <h2
                        className="
                            text-3xl
                            font-bold
                            leading-tight
                            text-[#1B1C1C]
                            sm:text-4xl
                            lg:text-5xl
                            xl:text-[3.25rem]
                            2xl:text-[3.5rem]
                        "
                    >
                        A Message From Our Leadership
                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-5
                            max-w-2xl
                            text-sm
                            leading-7
                            text-[#5B403D]
                            sm:text-base
                            lg:mt-6
                            lg:leading-8
                        "
                    >
                        Our leadership remains committed to strengthening
                        healthcare services while keeping compassion,
                        integrity, and patient welfare at the heart of
                        everything we do.
                    </p>
                </div>

                {/* ==================================================
                    CHAIRMAN MESSAGE
                ================================================== */}

                <article
                    id="chairman-message"
                    className="
                        mb-8
                        overflow-hidden
                        rounded-2xl
                        border
                        border-[#E4BEBA]/40
                        bg-[#FBF9F9]
                        shadow-[0_8px_35px_rgba(134,0,13,0.06)]
                        sm:mb-10
                        sm:rounded-3xl
                        lg:mb-12
                        xl:mb-14
                    "
                >
                    <div
                        className="
                            grid
                            items-start
                            lg:grid-cols-[0.42fr_0.58fr]
                        "
                    >

                        {/* ==================================================
                            CHAIRMAN IMAGE - STICKY
                        ================================================== */}

                        <div
                            className="
                                p-4
                                sm:p-6
                                lg:sticky
                                lg:top-28
                                lg:self-start
                                lg:p-8
                                xl:p-10
                                2xl:p-12
                            "
                        >
                            <div
                                className="
                                    relative
                                    mx-auto
                                    aspect-square
                                    w-full
                                    max-w-[430px]
                                    overflow-hidden
                                    rounded-2xl
                                    bg-gray-100
                                    shadow-sm
                                    lg:max-w-[440px]
                                    xl:max-w-[470px]
                                    2xl:max-w-[500px]
                                "
                            >
                                <Image
                                    src={chairmanMessage.image}
                                    alt={chairmanMessage.name}
                                    fill
                                    sizes="
                                        (max-width: 640px) 100vw,
                                        (max-width: 1024px) 90vw,
                                        (max-width: 1280px) 38vw,
                                        (max-width: 1536px) 36vw,
                                        34vw
                                    "
                                    className="
                                        object-cover
                                        transition-transform
                                        duration-500
                                        hover:scale-105
                                    "
                                />

                                {/* Image Overlay */}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                {/* Chairman Info */}

                                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                                    <div className="rounded-xl bg-black/35 p-3 backdrop-blur-md sm:p-4">
                                        <h3 className="text-lg font-bold text-white sm:text-xl">
                                            {chairmanMessage.name}
                                        </h3>

                                        <p className="mt-1 text-xs text-white/80 sm:text-sm">
                                            {chairmanMessage.designation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ==================================================
                            CHAIRMAN CONTENT
                        ================================================== */}

                        <div
                            className="
                                p-6
                                sm:p-8
                                lg:px-10
                                lg:py-10
                                xl:px-12
                                xl:py-12
                                2xl:px-14
                                2xl:py-14
                            "
                        >
                            <div className="mb-6 flex items-start gap-3 sm:mb-7 sm:gap-4">

                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[#911824]/10
                                        text-[#911824]
                                        sm:h-12
                                        sm:w-12
                                    "
                                >
                                    <FaQuoteLeft aria-hidden="true" />
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#911824] sm:text-xs">
                                        Chairman's Message
                                    </p>

                                    <h3
                                        className="
                                            mt-1
                                            text-xl
                                            font-bold
                                            leading-tight
                                            text-[#1B1C1C]
                                            sm:text-2xl
                                            lg:text-3xl
                                        "
                                    >
                                        A Vision for Better Healthcare
                                    </h3>
                                </div>
                            </div>

                            {/* Message */}

                            <div
                                className="
                                    space-y-4
                                    text-sm
                                    leading-7
                                    text-[#5B403D]
                                    sm:text-[15px]
                                    lg:space-y-5
                                    lg:leading-7
                                    xl:leading-8
                                "
                            >
                                {chairmanMessage.message.map(
                                    (paragraph, index) => (
                                        <p key={index}>
                                            {paragraph}
                                        </p>
                                    )
                                )}
                            </div>

                            {/* Signature */}

                            <div className="mt-7 border-t border-[#E4BEBA]/40 pt-5 sm:mt-8">
                                <p className="text-sm font-medium text-gray-500">
                                    With sincere appreciation,
                                </p>

                                <p className="mt-1 text-lg font-bold text-[#911824]">
                                    {chairmanMessage.name}
                                </p>

                                <p className="text-sm text-gray-500">
                                    Chairman
                                </p>
                            </div>
                        </div>
                    </div>
                </article>

                {/* ==================================================
                    PRESIDENT MESSAGE
                ================================================== */}

                <article
                    id="president-message"
                    className="
                        overflow-hidden
                        rounded-2xl
                        bg-[#911824]
                        text-white
                        shadow-[0_12px_40px_rgba(134,0,13,0.15)]
                        sm:rounded-3xl
                    "
                >
                    <div className="grid lg:grid-cols-[0.62fr_0.38fr]">

                        {/* President Content */}

                        <div
                            className="
                                p-6
                                sm:p-8
                                lg:p-10
                                xl:p-12
                                2xl:p-14
                            "
                        >
                            <div className="mb-6 flex items-center gap-3 sm:mb-7 sm:gap-4">

                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-white/10
                                        sm:h-12
                                        sm:w-12
                                    "
                                >
                                    <FaHandHoldingHeart aria-hidden="true" />
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/60 sm:text-xs">
                                        President's Message
                                    </p>

                                    <h3 className="mt-1 text-xl font-bold sm:text-2xl lg:text-3xl">
                                        Serving Humanity With Faith
                                    </h3>
                                </div>
                            </div>

                            <div
                                className="
                                    space-y-4
                                    text-sm
                                    leading-7
                                    text-white/80
                                    sm:text-[15px]
                                    lg:space-y-5
                                    lg:leading-8
                                "
                            >
                                {presidentMessage.message.map(
                                    (paragraph, index) => (
                                        <p key={index}>
                                            {paragraph}
                                        </p>
                                    )
                                )}

                                {/* Quranic Verse */}

                                <div
                                    className="
                                        my-7
                                        rounded-2xl
                                        border
                                        border-white/10
                                        bg-white/10
                                        p-5
                                        sm:my-8
                                        sm:p-6
                                    "
                                >
                                    <p
                                        dir="rtl"
                                        className="
                                            text-center
                                            text-xl
                                            leading-9
                                            text-white
                                            sm:text-2xl
                                            sm:leading-10
                                        "
                                    >
                                        وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ
                                    </p>

                                    <p className="mt-4 text-center text-xs italic text-white/75 sm:text-sm">
                                        "And when I am ill, it is He (Allah)
                                        who cures me."
                                    </p>

                                    <p className="mt-2 text-center text-[10px] font-semibold uppercase tracking-wider text-white/50 sm:text-xs">
                                        Surah Ash-Shu‘ara — 26:80
                                    </p>
                                </div>

                                <p>
                                    This belief reminds us that healthcare is
                                    not only a profession but also a
                                    responsibility and a trust. Through the
                                    generosity of our donors, the support of
                                    our well-wishers, and the dedication of
                                    our team, we are able to provide
                                    compassionate care and bring hope to
                                    thousands of patients and their families
                                    each year.
                                </p>

                                <p>
                                    I extend my heartfelt gratitude to everyone
                                    who supports Bashir Memorial Welfare
                                    Hospital. Your trust, generosity, and
                                    prayers empower us to continue this noble
                                    mission and make a meaningful difference in
                                    countless lives.
                                </p>

                                <p>
                                    Together, we remain committed to serving
                                    humanity with compassion, integrity, and
                                    faith. May Allah (SWT) bless our collective
                                    efforts and reward all those who contribute
                                    to this mission.
                                </p>
                            </div>

                            {/* Signature */}

                            <div className="mt-8 border-t border-white/15 pt-5 sm:mt-9 sm:pt-6">
                                <p className="text-sm font-medium text-white/75">
                                    With heartfelt gratitude,
                                </p>

                                <p className="mt-1 text-lg font-bold sm:mt-2">
                                    {presidentMessage.name}
                                </p>

                                <p className="text-sm text-white/60">
                                    President
                                </p>
                            </div>
                        </div>

                        {/* President Image */}

                        <div
                            className="
                                relative
                                min-h-[380px]
                                overflow-hidden
                                bg-[#78000b]
                                sm:min-h-[450px]
                                lg:min-h-full
                                lg:order-last
                                xl:min-h-[700px]
                                2xl:min-h-[760px]
                            "
                        >
                            <Image
                                src={presidentMessage.image}
                                alt={presidentMessage.name}
                                fill
                                sizes="
                                    (max-width: 1024px) 100vw,
                                    (max-width: 1280px) 38vw,
                                    (max-width: 1536px) 36vw,
                                    34vw
                                "
                                className="
                                    object-cover
                                    transition-transform
                                    duration-500
                                    hover:scale-105
                                "
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                            <div className="absolute bottom-6 left-6 right-6 sm:bottom-7 sm:left-7 sm:right-7">
                                <p className="text-xl font-bold sm:text-2xl">
                                    {presidentMessage.name}
                                </p>

                                <p className="mt-1 text-xs text-white/75 sm:text-sm">
                                    {presidentMessage.designation}
                                </p>
                            </div>
                        </div>
                    </div>
                </article>

            </div>
        </section>
    )
}