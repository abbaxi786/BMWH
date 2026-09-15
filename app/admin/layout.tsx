import type { Metadata } from "next";
import AdminSidebar from "./components/sideBar";
import AdminHeader from "./components/header";
import { AuthProvider } from "../context/context";


export const metadata: Metadata = {
    title: "BMWH Admin Panel",
    description:
        "Bashir Memorial Welfare Hospital administration panel",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <div className="min-h-screen">
                <AdminHeader />

                <div className="flex">
                    <AdminSidebar />

                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </AuthProvider>
    );
}