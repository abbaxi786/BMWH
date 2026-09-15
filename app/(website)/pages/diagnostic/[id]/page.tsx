import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaCalendarCheck,
  FaCheckCircle,
  FaPhoneAlt,
  FaArrowRight,
} from "react-icons/fa";
import ContactUsCard from "@/app/components/contactCard/contactCard";

interface DiagnosticService {
  id: number;
  name: string;
  category: string;
  image_url: string;
  description: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getDiagnosticService(
  id: string
): Promise<DiagnosticService | null> {
  try {
    const baseUrl = process.env.BACKEND_URL;

    const response = await fetch(
      `${baseUrl}/api/diagnostic_services/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(
      "Error fetching diagnostic service:",
      error
    );

    return null;
  }
}

export default async function DiagnosticServicePage({
  params,
}: PageProps) {
  const { id } = await params;

  const service = await getDiagnosticService(id);

  if (!service) {
    return (
      <main className="min-h-screen bg-[#FBF9F9] animate-fade-in-up">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
          <h1 className="mb-3 text-3xl font-bold text-[#1B1C1C]">
            Diagnostic Service Not Found
          </h1>

          <p className="mb-6 max-w-lg text-[#5B403D]">
            The diagnostic service you are looking for could not
            be found or may no longer be available.
          </p>

          <Link
            href="/diagnostic-services"
            className="inline-flex items-center gap-2 rounded-xs bg-[#86000D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6d000a]"
          >
            <FaArrowLeft size={12} />
            Back to Diagnostic Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FBF9F9] animate-fade-in-up">
      {/* ================= BREADCRUMB ================= */}
      <section className="border-b border-[#E5E2E2] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-10">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-[#5F5E5E] transition hover:text-[#86000D]"
            >
              Home
            </Link>

            <span className="text-[#A09D9D]">/</span>

            <Link
              href="/pages/diagnostic"
              className="text-[#5F5E5E] transition hover:text-[#86000D]"
            >
              Diagnostic Services
            </Link>

            <span className="text-[#A09D9D]">/</span>

            <span className="font-medium text-[#86000D]">
              {service.name}
            </span>
          </div>
        </div>
      </section>

      {/* ================= HERO ================= */}
      <section className="bg-[#F5F3F3]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-20">
          {/* Content */}
          <div>
            {/* Category */}
            <div className="mb-5">
              <span className="inline-flex rounded-xl bg-[#86000D]/10 px-4 py-2 text-xs font-medium uppercase tracking-[1px] text-[#86000D]">
                {service.category}
              </span>
            </div>

            {/* Heading */}
            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-[-0.8px] text-[#1B1C1C] sm:text-5xl lg:text-[52px] lg:leading-15">
              {service.name}
            </h1>

            {/* Description */}
            <p className="max-w-150 text-lg leading-8 text-[#5B403D]">
              {service.description}
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center gap-2 rounded-xs bg-[#86000D] px-7 text-sm font-bold text-white shadow-sm transition hover:bg-[#6d000a]"
              >
                <FaCalendarCheck size={13} />
                Contact Us
              </Link>

              <Link
                href="/diagnostic-services"
                className="inline-flex h-11 items-center gap-2 rounded-xs border border-[#86000D] bg-transparent px-7 text-sm font-bold text-[#86000D] transition hover:bg-[#86000D] hover:text-white"
              >
                <FaArrowLeft size={12} />
                All Services
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-80 overflow-hidden rounded-xl sm:h-100] lg:h-115">
            <Image
              src={service.image_url}
              alt={service.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ================= DETAILS ================= */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
            {/* Main Content */}
            <div>
              <span className="text-xs font-medium uppercase tracking-[1.2px] text-[#5F5E5E]">
                Diagnostic Care
              </span>

              <h2 className="mt-2 text-3xl font-bold text-[#1B1C1C] sm:text-4xl">
                Reliable diagnostic services
              </h2>

              <div className="mt-6 max-w-190">
                <p className="text-base leading-7 text-[#5B403D]">
                  Our diagnostic services are designed to support
                  accurate diagnosis and informed treatment decisions.
                  Patients can access reliable diagnostic care through
                  our hospital's dedicated services.
                </p>

                <p className="mt-5 text-base leading-7 text-[#5B403D]">
                  If you need more information about this service,
                  our healthcare team can guide you regarding
                  availability, preparation requirements, and the
                  appropriate next steps.
                </p>
              </div>

              {/* Benefits */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <FaCheckCircle
                    className="mt-1 shrink-0 text-[#86000D]"
                    size={18}
                  />

                  <div>
                    <h3 className="font-semibold text-[#1B1C1C]">
                      Reliable Testing
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#5B403D]">
                      Diagnostic services to support informed
                      healthcare decisions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaCheckCircle
                    className="mt-1 shrink-0 text-[#86000D]"
                    size={18}
                  />

                  <div>
                    <h3 className="font-semibold text-[#1B1C1C]">
                      Professional Care
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#5B403D]">
                      Services provided within a professional
                      healthcare environment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Card */}
            <aside className="h-fit rounded-xl bg-[#F5F3F3] p-6 lg:p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#86000D]/10">
                <FaPhoneAlt
                  size={18}
                  className="text-[#86000D]"
                />
              </div>

              <h3 className="text-2xl font-semibold text-[#1B1C1C]">
                Need more information?
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#5B403D]">
                Contact our hospital team for information about
                this diagnostic service, availability, and
                preparation requirements.
              </p>

              <Link
                href="/contact"
                className="mt-6 flex h-11 items-center justify-center gap-2 rounded-xs bg-[#86000D] px-5 text-sm font-bold text-white transition hover:bg-[#6d000a]"
              >
                Contact Us
                <FaArrowRight size={12} />
              </Link>
            </aside>
          </div>
        </div>
        <ContactUsCard/>
      </section>
    </main>
  );
}