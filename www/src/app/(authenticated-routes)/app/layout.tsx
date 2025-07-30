import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full h-full min-h-screen">
        <main className="p-5 space-y-5 w-full max-w-[1000px] mx-auto">
          {/* <BackButton /> */}
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
