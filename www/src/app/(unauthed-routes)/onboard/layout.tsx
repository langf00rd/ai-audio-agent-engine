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
    <div className="pt-32 justify-center flex min-h-screen">
      <div className="w-full max-w-[400px] pb-20">
        <Suspense>{children}</Suspense>
      </div>
    </div>
  );
}
