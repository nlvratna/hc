import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Health Connect",
  description: "An AI health Bot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen  px-2 sm:px-4 lg:px-6">
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
