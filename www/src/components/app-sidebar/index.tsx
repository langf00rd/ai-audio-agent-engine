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
import { Business, User } from "@/lib/types";
import { LibraryBig, Settings2, User2 } from "lucide-react";
import { cookies } from "next/headers";
import SignOutButton from "../buttons/sign-out";
import { Logo } from "../logo";
import WorkspaceSwitcher from "./workspace-switcher";

const items = [
  {
    title: "Your Agents",
    url: ROUTES.agent.index,
    icon: LibraryBig,
  },
  {
    title: "Settings",
    url: ROUTES.app.settings,
    icon: Settings2,
  },
];

export async function AppSidebar() {
  const userCookie = JSON.parse(
    (await cookies()).get(COOKIE_KEYS.user)?.value as unknown as string,
  ) as User;
  const businesses = JSON.parse(
    (await cookies()).get(COOKIE_KEYS.business)?.value as unknown as string,
  ) as Business[];
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-neutral-100 w-[20vw]"
    >
      <SidebarHeader className="h-[140px] p-4 px-8 border-b border-neutral-100  bg-white flex items-start">
        <Logo />
        <WorkspaceSwitcher />
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="border border-neutral-100 w-full"
              >
                <SidebarMenuButton>
                  Select Workspace
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {businesses.map((a) => (
                  <DropdownMenuItem key={a.id}>
                    <span>{a.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu> */}
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
                      <span className="text-[16px]">{item.title}</span>
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
                    <p className="opacity-50 -mt-1">{businesses[0].name}</p>
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
