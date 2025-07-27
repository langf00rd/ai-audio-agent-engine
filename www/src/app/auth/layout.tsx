import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "toow - Authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="items-center justify-center flex min-h-screen">
      <div className="max-w-[400px] w-full mx-auto space-y-4 p-10 bg-white shadow-xs rounded-[45px] border border-neutral-100">
        <Suspense>{children}</Suspense>
      </div>
    </div>
  );
}
