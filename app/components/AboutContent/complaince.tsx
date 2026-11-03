import {
  FaFilePdf,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";

const certificates = [
  {
    title: "Charity Certificate",
    description:
      "View our official charity certificate.",
    href: "/document/Charity_Certificate.pdf",
  },
  {
    title: "Certificate of Registration",
    description:
      "View our official certificate of registration.",
    href: "/document/certificate_of_registeration.pdf",
  },
];

export default function ComplianceCertificates() {
  return (
    <section className="w-full bg-[#FBF9F9] py-14 sm:py-18 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
            Transparency & Trust
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Compliance Certificates
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Explore our official certificates and registration
            documents demonstrating our commitment to
            transparency and accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {certificates.map((certificate) => (
            <a
              key={certificate.href}
              href={certificate.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${certificate.title} PDF in a new tab`}
              className="group flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg sm:p-7"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-red-50 transition-colors group-hover:bg-red-100">
                <FaFilePdf className="text-3xl text-red-700" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-red-700 sm:text-xl">
                  {certificate.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {certificate.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-700">
                  View Certificate
                  <FaArrowUpRightFromSquare
                    className="text-xs transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
