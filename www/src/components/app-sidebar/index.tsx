import { Bot, ChevronUp, Settings, User2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { COOKIE_KEYS, ROUTES } from "@/lib/constants";
import { cookies } from "next/headers";
import SignOutButton from "../buttons/sign-out";

const items = [
  {
    title: "Agents",
    url: ROUTES.agent.index,
    icon: Bot,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export async function AppSidebar() {
  const userCookie = JSON.parse(
    (await cookies()).get(COOKIE_KEYS.user)?.value as unknown as string,
  );
  return (
    <Sidebar collapsible="icon" className="border-r border-neutral-100">
      <SidebarHeader className="h-20 p-4 bg-white">
        <div className="flex items-center w-full gap-2">
          <div className="flex flex-col gap-[2px] scale-[0.7]">
            <div className="w-[40px] h-[20px] rounded-[4px] bg-primary" />
            <div className="w-[40px] h-[8px] rounded-[4px] bg-primary" />
            <div className="w-[40px] h-[5px] rounded-[4px] bg-primary" />
          </div>
          <h2 className="font-bold text-primary">AI VOICE AGENT</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 mt-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className="text-[17px]">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 size={16} />
                  {userCookie.email}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <SignOutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
