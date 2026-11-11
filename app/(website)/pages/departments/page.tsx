import DepartmentHero from "@/app/components/departmentPageComponents/heroSection";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import { LuStethoscope } from "react-icons/lu";
import ContactUsCard from "@/app/components/contactCard/contactCard";

import { getDepartments } from "@/lib/data/department/all_department";

interface DepartmentData {
  id: number;
  name: string;
  category: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

export const revalidate = 86400;

function groupDepartmentsByCategory(
  departments: DepartmentData[]
): Record<string, DepartmentData[]> {
  return departments.reduce(
    (groups, department) => {
      const category = department.category || "Other";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(department);
      return groups;
    },
    {} as Record<string, DepartmentData[]>
  );
}

function createCategoryId(category: string) {
  return category
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function Departments() {
  let data: DepartmentData[] = [];

  try {
    const departments = await getDepartments();
    data = departments as DepartmentData[];
  } catch (error) {
    console.error("Failed to fetch departments:", error);
  }

  const activeDepartments = data.filter(
    (department) => department.is_active
  );

  const groupedDepartments =
    groupDepartmentsByCategory(activeDepartments);

  return (
    <div
      id="department-page"
      className="min-h-screen w-full overflow-x-clip bg-[#FBF9F9] animate-fade-in-up"
    >
      {/* HERO */}
      <section
        id="department-overview"
        className="w-full scroll-mt-20"
      >
        <DepartmentHero />
      </section>

      {/* DEPARTMENTS */}
      <main
        id="departments"
        className="w-full scroll-mt-20 bg-[#FBF9F9]"
      >
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-7xl
            flex-col
            gap-12
            px-5
            py-10
            sm:gap-14
            sm:px-8
            sm:py-12
            lg:px-10
            xl:px-12
            2xl:max-w-[1440px]
            2xl:px-16
          "
        >
          {Object.entries(groupedDepartments).map(
            ([category, departments]) => {
              const categoryId = createCategoryId(category);

              return (
                <section
                  key={category}
                  id={categoryId}
                  className="w-full scroll-mt-20"
                >
                  {/* CATEGORY HEADER */}
                  <div className="mb-7 flex w-full items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#86000D]/10">
                      <LuStethoscope
                        size={23}
                        className="text-[#86000D]"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-2xl font-bold tracking-[-0.3px] text-[#1B1C1C] sm:text-[30px]">
                        {category}
                      </h2>

                      <div className="mt-2 h-0.5 w-16 rounded-full bg-[#86000D]" />
                    </div>
                  </div>

                  {/* DEPARTMENT CARDS */}
                  <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-7">
                    {departments.map((department) => (
                      <Link
                        key={department.id}
                        href={`/pages/departments/department/${department.slug}`}
                        className="
                          group
                          relative
                          flex
                          min-w-0
                          flex-col
                          overflow-hidden
                          rounded-2xl
                          border
                          border-[#E4BEBA]/30
                          bg-white
                          shadow-[0_4px_20px_rgba(134,0,13,0.05)]
                          transition-all
                          duration-300
                          hover:-translate-y-1.5
                          hover:border-[#86000D]/20
                          hover:shadow-[0_15px_35px_rgba(134,0,13,0.12)]
                        "
                      >
                        {/* IMAGE */}
                        <div className="relative h-52 w-full overflow-hidden sm:h-56">
                          <Image
                            src={department.image_url}
                            alt={department.name}
                            fill
                            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />

                          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />

                          <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#86000D] shadow-md transition-all duration-300 group-hover:bg-[#86000D] group-hover:text-white">
                            <FaArrowRight
                              size={14}
                              className="transition-transform duration-300 group-hover:translate-x-0.5"
                            />
                          </div>

                          <div className="absolute bottom-4 left-4">
                            <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.8px] text-[#86000D] shadow-sm backdrop-blur-sm">
                              Department
                            </span>
                          </div>
                        </div>

                        {/* CONTENT */}
                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#86000D]/10">
                              <LuStethoscope
                                size={18}
                                className="text-[#86000D]"
                              />
                            </div>

                            <h3 className="min-w-0 break-words text-xl font-bold leading-7 text-[#1B1C1C] transition-colors duration-200 group-hover:text-[#86000D] sm:text-[22px]">
                              {department.name}
                            </h3>
                          </div>

                          <p className="mt-4 line-clamp-4 flex-1 text-[15px] leading-6 text-[#6B5A57]">
                            {department.description}
                          </p>

                          <div className="my-5 h-px w-full bg-[#E4BEBA]/30" />

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-[#77706E]">
                              Learn more
                            </span>

                            <span className="flex shrink-0 items-center gap-2 text-[12px] font-bold uppercase tracking-[0.8px] text-[#86000D]">
                              Explore
                              <FaArrowRight
                                size={11}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                              />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            }
          )}

          {/* EMPTY STATE */}
          {activeDepartments.length === 0 && (
            <div className="rounded-2xl border border-[#E4BEBA]/40 bg-white px-6 py-12 text-center">
              <LuStethoscope
                size={36}
                className="mx-auto text-[#86000D]"
              />
              <h2 className="mt-4 text-xl font-bold text-[#1B1C1C]">
                No departments available
              </h2>
              <p className="mt-2 text-sm text-[#6B5A57]">
                Please check back later for our available hospital departments.
              </p>
            </div>
          )}
        </div>

        {/* CONTACT */}
        <section
          id="department-contact"
          className="w-full scroll-mt-20"
        >
          <ContactUsCard />
        </section>
      </main>
    </div>
  );
}

export default Departments;