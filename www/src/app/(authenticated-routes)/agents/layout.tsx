import BackButton from "@/components/buttons/back";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-[700px] mx-auto py-5 space-y-4 px-5">
      <BackButton />
      {children}
    </div>
  );
}
