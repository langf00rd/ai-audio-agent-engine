import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { DM_Sans, Luckiest_Guy } from "next/font/google";
import "./globals.css";

const defaultSans = DM_Sans({
  variable: "--font-default-sans",
  subsets: ["latin"],
});

const headingBoldSans = Luckiest_Guy({
  variable: "--font-heading-bold-sans",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "ai sales agent",
  description: "create your personal ai sales agent",
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
