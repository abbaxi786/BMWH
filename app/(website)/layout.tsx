import type { Metadata } from "next";
import Nav from "../components/nav";
import Footer from "../components/footer";
import "../globals.css";
import BackToTop from "../components/backToTop";
import SocialMediaFab from "../components/SocialMediaFab";

export const metadata: Metadata = {
    title: "BMWH Hospital Official Page",
    description:
        "This website is for making the connection with the patient for free cure and for donation methods and our hospital information",
};

export default function WebsiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">
                {children}
            </main>

            <Footer />
            <SocialMediaFab/>
            <BackToTop/>
        </div>
    );
}