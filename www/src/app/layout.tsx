import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Funnel_Display, Funnel_Sans } from "next/font/google";
import "./globals.css";

const defaultSans = Funnel_Sans({
  variable: "--font-default-sans",
  subsets: ["latin"],
});

const headingBoldSans = Funnel_Display({
  variable: "--font-heading-bold-sans",
  subsets: ["latin"],
  weight: "600",
});

export const metadata: Metadata = {
  title: "toow - Create An Autonomous Sales Agents",
  description: "One Platform to Create An Autonomous Sales Agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${defaultSans.variable} ${headingBoldSans.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
