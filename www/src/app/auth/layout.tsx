import { Metadata } from "next";

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
      <div className="max-w-[400px] w-full mx-auto py-5 space-y-4 px-5 shadow-sm border">
        {children}
      </div>
    </div>
  );
}
