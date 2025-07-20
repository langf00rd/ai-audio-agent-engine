import { AppSidebar } from "@/components/app-sidebar";
import BackButton from "@/components/buttons/back";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="p-5 space-y-5 w-full max-w-[600px] mx-auto">
          <BackButton />
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}
