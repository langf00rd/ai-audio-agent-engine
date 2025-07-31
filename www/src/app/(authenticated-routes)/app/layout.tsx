import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full h-full min-h-screen">
        <main className="p-5 space-y-5 w-full max-w-[1000px] mx-auto">
          {/* <BackButton /> */}
          <Suspense>{children}</Suspense>
        </main>
      </div>
    </SidebarProvider>
  );
}
