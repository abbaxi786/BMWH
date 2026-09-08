import Image from "next/image";

export default function DepartmentHero() {
    return (
        <section className="w-full px-5 py-8">
            <div className="relative mx-auto min-h-80 w-full overflow-hidden rounded-lg bg-[#FBF9F9] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">

                <div className="absolute inset-0">
                    <Image
                        src="/images/departmentImage.png"
                        alt="Clinical Department"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

                <div className="absolute inset-0 bg-[linear-gradient(90deg,#FBF9F9_0%,rgba(251,249,249,0.9)_50%,rgba(251,249,249,0)_100%)]" />

                <div className="relative z-10 flex min-h-80 w-full max-w-2xl flex-col justify-center gap-4 p-8">

                    <h1 className="text-[48px] font-bold leading-14 tracking-[-0.96px] text-[#1B1C1C]">
                        Clinical Departments
                    </h1>

                    <p className="max-w-149 text-lg font-normal leading-7 text-[#5B403D]">
                        Our comprehensive range of medical departments is staffed by expert
                        professionals dedicated to providing world-class care. Explore our
                        specialties below.
                    </p>

                </div>
            </div>
        </section>
    );
}