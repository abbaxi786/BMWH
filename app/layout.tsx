import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ngrok from "@ngrok/ngrok";

const ngrokState = globalThis as typeof globalThis & {
  __ngrokStarted?: boolean;
};

async function forwardToApp() {
  try {
    const forwarder = await ngrok.forward({
      addr: "http://localhost:3000",
      authtoken: process.env.NGROK_AUTHTOKEN,
      domain: "poet-thigh-capitol.ngrok-free.dev",
    });

    console.log("Public URL:", forwarder.url());
  } catch (error) {
    console.error("Ngrok error:", error);
    ngrokState.__ngrokStarted = false;
  }
}

if (
  process.env.NEXT_PHASE !== "phase-production-build" &&
  !ngrokState.__ngrokStarted
) {
  ngrokState.__ngrokStarted = true;
  void forwardToApp();
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BMWH Hospital Official Page",
  description:
    "This website connects patients with free treatment services, donation opportunities, and hospital information.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}