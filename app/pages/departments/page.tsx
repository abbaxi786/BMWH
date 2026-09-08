import React from "react"
import DepartmentHero from "@/app/components/departmentPageComponents/heroSection"
import axios from "axios"
import Link from "next/link"
import Image from "next/image"
import { FaArrowRight } from "react-icons/fa6"
import { LuStethoscope } from "react-icons/lu"
import ContactUsCard from "@/app/components/contactCard/contactCard"

interface DepartmentData {
  id: number
  name: string
  category: string
  slug: string
  description: string
  image_url: string
  is_active: boolean
}

function groupDepartmentsByCategory(
  departments: DepartmentData[]
) {
  return departments.reduce(
    (groups: Record<string, DepartmentData[]>, department) => {
      if (!groups[department.category]) {
        groups[department.category] = []
      }

      groups[department.category].push(department)

      return groups
    },
    {}
  )
}

async function Departments() {
  let data: DepartmentData[] = []

  try {
    const response = await axios.get(
      `${process.env.BACKEND_URL}/api/departments`
    )

    if (response.data.success) {
      data = response.data.data
    }
  } catch (error) {
    console.error("Failed to fetch departments:", error)
  }

  // Only show active departments
  const activeDepartments = data.filter(
    (department) => department.is_active
  )

  // Group departments according to category
  const groupedDepartments =
    groupDepartmentsByCategory(activeDepartments)

  return (
    <div className="min-h-screen bg-[#FBF9F9] animate-fade-in-up">

      {/* Hero */}
      <DepartmentHero />

      {/* Departments */}
      <main className="bg-[#FBF9F9]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-10 py-8">

          {Object.entries(groupedDepartments).map(
            ([category, departments]) => (
              <section
                key={category}
                className="flex flex-col gap-4 pt-4"
              >

                {/* Category heading */}
                <div className="flex items-center gap-2 border-b-2 border-[#E4BEBA]/30 pb-2">
                  <LuStethoscope
                    size={24}
                    className="shrink-0 text-[#86000D]"
                  />

                  <h2 className="text-[32px] font-bold leading-10 tracking-[-0.32px] text-[#1B1C1C]">
                    {category}
                  </h2>
                </div>

                {/* Department cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {departments.map((department) => (
                    <Link
                      key={department.id}
                      href={`/pages/departments/department/${department.slug}`}
                      className="group overflow-hidden rounded-lg border border-[#E4BEBA]/20 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                    >

                      {/* Image */}
                      <div className="relative h-31.5 w-full overflow-hidden">
                        <Image
                          src={department.image_url}
                          alt={department.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Arrow */}
                        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#86000D]/90 text-white backdrop-blur-sm">
                          <FaArrowRight size={14} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex min-h-71.75 flex-col p-6">

                        {/* Department name */}
                        <div className="flex items-center gap-2">
                          <LuStethoscope
                            size={20}
                            className="shrink-0 text-[#5F5E5E]"
                          />

                          <h3 className="text-[24px] font-semibold leading-8 text-[#1B1C1C]">
                            {department.name}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="mt-2 flex-1 text-[16px] leading-6 text-[#5B403D]">
                          {department.description}
                        </p>

                        {/* Bottom */}
                        <div className="mt-4 flex items-center justify-between border-t border-[#E4BEBA]/30 pt-4">

                          <span className="text-[14px] font-semibold leading-5 tracking-[0.14px] text-[#5F5E5E]">
                            Department
                          </span>

                          <span className="text-[12px] font-bold uppercase leading-4 tracking-[0.6px] text-[#86000D]">
                            Explore
                          </span>

                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )
          )}

        </div>
        <ContactUsCard />
      </main>
    </div>
  )
}

export default Departments