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
import { User } from "@/lib/types";
import { Bot, Settings, User2 } from "lucide-react";
import { cookies } from "next/headers";
import SignOutButton from "../buttons/sign-out";
import { Logo } from "../logo";

const items = [
  {
    title: "Your Agents",
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
  ) as User;
  return (
    <Sidebar collapsible="icon" className="border-r border-neutral-100">
      <SidebarHeader className="h-20 p-4 px-8 border-b border-neutral-100  bg-white flex items-start">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="bg-white px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 mt-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="opacity-60" />
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
          {/* <SidebarMenuItem className="border-t border-neutral-100 flex items-center justify-center h-[60px]">
                        <Badge className="w-full py-3" variant="secondary">
                            FREE PLAN
                        </Badge>
                    </SidebarMenuItem> */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="rounded-none h-[100px] border-neutral-100 cursor-pointer border-t">
                  <div className="bg-neutral-100 flex items-center justify-center w-10 h-10 rounded-full">
                    <User2 size={16} />
                  </div>
                  <div>
                    <p className="capitalize">
                      {userCookie.first_name} {userCookie.last_name}
                    </p>
                    <p className="opacity-50 -mt-1">My workspace</p>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right">
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
