import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "toow - Onboarding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="justify-center pt-32 flex min-h-screen">
      <div className="w-full max-w-[400px]">
        <Suspense>{children}</Suspense>
      </div>
    </div>
  );
}
