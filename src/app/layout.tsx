import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LeadFlow — Smart Lead Management Platform",
  description:
    "Capture, track, and convert leads effortlessly. A modern lead management platform with role-based access, lifecycle tracking, and real-time collaboration.",
  keywords: ["lead management", "CRM", "sales", "dashboard"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} font-sans h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-zinc-100">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
