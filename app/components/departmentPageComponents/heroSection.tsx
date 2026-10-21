import Image from "next/image";

export default function DepartmentHero() {
  return (
    <section className="w-full bg-[#FBF9F9] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 xl:px-12 2xl:px-16">
      <div
        className="
          relative
          mx-auto
          min-h-[280px]
          w-full
          max-w-7xl
          overflow-hidden
          rounded-2xl
          bg-[#FBF9F9]
          shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]
          sm:min-h-[320px]
          2xl:max-w-[1440px]
        "
      >
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0">
          <Image
            src="/images/departmentImage.png"
            alt="Clinical Department"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 1440px"
            className="object-cover object-center"
          />
        </div>

        {/* IMAGE OVERLAY */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#FBF9F9_0%,rgba(251,249,249,0.94)_35%,rgba(251,249,249,0.78)_58%,rgba(251,249,249,0.12)_100%)]" />

        {/* HERO CONTENT */}
        <div
          className="
            relative
            z-10
            flex
            min-h-[280px]
            w-full
            flex-col
            justify-center
            gap-4
            px-5
            py-10
            sm:min-h-[320px]
            sm:px-10
            sm:py-12
            lg:max-w-3xl
            lg:px-12
          "
        >
          <h1
            className="
              max-w-2xl
              text-3xl
              font-bold
              leading-tight
              tracking-[-0.6px]
              text-[#1B1C1C]
              sm:text-4xl
              sm:tracking-[-0.8px]
              lg:text-5xl
              lg:leading-[1.15]
              lg:tracking-[-0.96px]
            "
          >
            Clinical Departments
          </h1>

          <p
            className="
              max-w-xl
              text-sm
              font-normal
              leading-6
              text-[#5B403D]
              sm:text-base
              sm:leading-7
              lg:text-lg
            "
          >
            Our comprehensive range of medical departments is staffed by
            expert professionals dedicated to providing world-class care.
            Explore our specialties below.
          </p>
        </div>
      </div>
    </section>
  );
}