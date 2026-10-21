import type { Metadata } from "next";
import Nav from "../components/nav";
import Footer from "../components/footer";
import BackToTop from "../components/backToTop";
import SocialMediaFab from "../components/SocialMediaFab";

export const metadata: Metadata = {
  title: "BMWH Hospital Official Page",
  description:
    "This website connects patients with free treatment services, donation opportunities, and hospital information.",
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
    </div>
  );
}