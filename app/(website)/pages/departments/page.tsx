import DepartmentHero from "@/app/components/departmentPageComponents/heroSection";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import { LuStethoscope } from "react-icons/lu";
import ContactUsCard from "@/app/components/contactCard/contactCard";

import {
  getDepartments,
} from "@/lib/data/department/all_department";

interface DepartmentData {
  id: number;
  name: string;
  category: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

function groupDepartmentsByCategory(
  departments: DepartmentData[]
) {
  return departments.reduce(
    (
      groups: Record<string, DepartmentData[]>,
      department
    ) => {
      if (!groups[department.category]) {
        groups[department.category] = [];
      }

      groups[department.category].push(department);

      return groups;
    },
    {}
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
    /*
     * Direct database access.
     *
     * No axios
     * No /api/departments request
     */
    const departments = await getDepartments();

    data = departments as DepartmentData[];
  } catch (error) {
    console.error(
      "Failed to fetch departments:",
      error
    );
  }

  /*
   * Only show active departments
   */
  const activeDepartments = data.filter(
    (department) => department.is_active
  );

  /*
   * Group departments by category
   */
  const groupedDepartments =
    groupDepartmentsByCategory(activeDepartments);

  return (
    <div
      id="department-page"
      className="min-h-screen bg-[#FBF9F9] animate-fade-in-up"
    >
      {/* ==================================================
          HERO
      ================================================== */}

      <section
        id="department-overview"
        className="scroll-mt-28"
      >
        <DepartmentHero />
      </section>

      {/* ==================================================
          DEPARTMENTS
      ================================================== */}

      <main
        id="departments"
        className="scroll-mt-28 bg-[#FBF9F9]"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-5 py-12 sm:px-8 lg:px-10">

          {Object.entries(groupedDepartments).map(
            ([category, departments]) => {
              const categoryId =
                createCategoryId(category);

              return (
                <section
                  key={category}
                  id={categoryId}
                  className="scroll-mt-28"
                >
                  {/* ==================================================
                      CATEGORY HEADER
                  ================================================== */}

                  <div className="mb-7 flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#86000D]/10">
                      <LuStethoscope
                        size={23}
                        className="text-[#86000D]"
                      />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl font-bold tracking-[-0.3px] text-[#1B1C1C] sm:text-[30px]">
                        {category}
                      </h2>

                      <div className="mt-2 h-0.5 w-16 rounded-full bg-[#86000D]" />
                    </div>
                  </div>

                  {/* ==================================================
                      DEPARTMENT CARDS
                  ================================================== */}

                  <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
                    {departments.map(
                      (department) => (
                        <Link
                          key={department.id}
                          href={`/pages/departments/department/${department.slug}`}
                          className="
                            group
                            relative
                            flex
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
                          {/* ==================================================
                              IMAGE
                          ================================================== */}

                          <div className="relative h-56 w-full overflow-hidden">
                            <Image
                              src={department.image_url}
                              alt={department.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                              className="
                                object-cover
                                transition-transform
                                duration-500
                                ease-out
                                group-hover:scale-105
                              "
                            />

                            {/* Image Overlay */}

                            <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />

                            {/* Arrow */}

                            <div
                              className="
                                absolute
                                right-4
                                top-4
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                text-[#86000D]
                                shadow-md
                                transition-all
                                duration-300
                                group-hover:bg-[#86000D]
                                group-hover:text-white
                              "
                            >
                              <FaArrowRight
                                size={14}
                                className="
                                  transition-transform
                                  duration-300
                                  group-hover:translate-x-0.5
                                "
                              />
                            </div>

                            {/* Department Label */}

                            <div className="absolute bottom-4 left-4">
                              <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.8px] text-[#86000D] shadow-sm backdrop-blur-sm">
                                Department
                              </span>
                            </div>
                          </div>

                          {/* ==================================================
                              CONTENT
                          ================================================== */}

                          <div className="flex flex-1 flex-col p-6">
                            {/* Title */}

                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#86000D]/10">
                                <LuStethoscope
                                  size={18}
                                  className="text-[#86000D]"
                                />
                              </div>

                              <h3 className="text-[22px] font-bold leading-7 text-[#1B1C1C] transition-colors duration-200 group-hover:text-[#86000D]">
                                {department.name}
                              </h3>
                            </div>

                            {/* Description */}

                            <p className="mt-4 line-clamp-4 flex-1 text-[15px] leading-6 text-[#6B5A57]">
                              {department.description}
                            </p>

                            {/* Divider */}

                            <div className="my-5 h-px w-full bg-[#E4BEBA]/30" />

                            {/* Explore */}

                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-[#77706E]">
                                Learn more
                              </span>

                              <span
                                className="
                                  flex
                                  items-center
                                  gap-2
                                  text-[12px]
                                  font-bold
                                  uppercase
                                  tracking-[0.8px]
                                  text-[#86000D]
                                "
                              >
                                Explore

                                <FaArrowRight
                                  size={11}
                                  className="
                                    transition-transform
                                    duration-300
                                    group-hover:translate-x-1
                                  "
                                />
                              </span>
                            </div>
                          </div>
                        </Link>
                      )
                    )}
                  </div>
                </section>
              );
            }
          )}
        </div>

        {/* ==================================================
            CONTACT
        ================================================== */}

        <section
          id="department-contact"
          className="scroll-mt-28"
        >
          <ContactUsCard />
        </section>
      </main>
    </div>
  );
}

export default Departments;