import { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="items-center justify-center flex min-h-screen">
      <div className="max-w-[400px] w-full mx-auto space-y-4 p-10 bg-neutral-50 rounded-2xl">
        {children}
      </div>
      <Toaster />
    </div>
  );
}
