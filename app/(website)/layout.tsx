
import type { Metadata } from "next";
import Nav from "../components/nav";
import Footer from "../components/footer";
import BackToTop from "../components/backToTop";
import SocialMediaFab from "../components/SocialMediaFab";

export const metadata: Metadata = {
  metadataBase: new URL("https://bmwhospital.org.pk"),

  title: {
    default: "BMWH Hospital | Quality Healthcare",
    template: "%s | BMWH Hospital",
  },

  description:
    "Visit BMWH Hospital for information about healthcare services, medical departments, diagnostic facilities, free treatment services, and donation opportunities.",

  applicationName: "BMWH Hospital",

  icons: {
    icon: [
      {
        url: "/logo.png",
        type: "image/png",
      },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },

  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: "BMWH Hospital",
    title: "BMWH Hospital | Quality Healthcare",
    description:
      "Explore BMWH Hospital's healthcare services, medical departments, diagnostic facilities, and opportunities to support patients.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bashir Memorial Welfare Hospital",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "BMWH Hospital | Quality Healthcare",
    description:
      "Explore BMWH Hospital's healthcare services, medical departments, and diagnostic facilities.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

// Hospital structured data
const hospitalSchema = {
  "@context": "https://schema.org",
  "@type": "Hospital",

  name: "Bashir Memorial Welfare Hospital",

  alternateName: [
    "BMWH",
    "Bashir Memorial Eye Trust Hospital",
  ],

  url: "https://bmwhospital.org.pk/",

  logo: "https://bmwhospital.org.pk/logo.png",

  image: "https://bmwhospital.org.pk/og-image.jpg",

  telephone: "+924237124872",

  address: {
    "@type": "PostalAddress",
    streetAddress: "14/1 Lyton Road",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    addressCountry: "PK",
  },

  sameAs: [
    "https://www.youtube.com/@bmwhospital",
    "https://www.instagram.com/bashirmemorialbmt",
    "https://www.facebook.com/people/Bashir-Memorial-Welfare-Hospital/61592074031243/",
  ],
};

// Website structured data
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",

  name: "BMWH Hospital",

   "alternateName": [
    "BMWH",
    "Bashir Memorial Welfare Hospital",
    "Bashir Memorial Eye Trust Hospital"
  ],

  url: "https://bmwhospital.org.pk/",
};

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />

      <main className="flex-1">{children}</main>

      <Footer />
      <SocialMediaFab />
      <BackToTop />

      {/* Hospital Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(hospitalSchema).replace(/</g, "\\u003c"),
        }}
      />

      {/* Website Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
