import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const defaultSans = DM_Sans({
  variable: "--font-default-sans",
  subsets: ["latin"],
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
      <body className={`${defaultSans.className} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
