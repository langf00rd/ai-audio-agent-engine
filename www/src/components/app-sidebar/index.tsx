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
import {
  LibraryBig,
  Mail,
  PlusIcon,
  Repeat2,
  Settings2,
  User2,
  Users2,
} from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import SignOutButton from "../buttons/sign-out";
import { Logo } from "../logo";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
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
  {
    title: "Contacts",
    url: ROUTES.app.contacts,
    icon: Users2,
  },
  {
    title: "Inbox",
    url: ROUTES.app.inbox,
    icon: Mail,
    disabled: true,
  },
  {
    title: "Actions",
    url: ROUTES.app.actions,
    icon: Repeat2,
    disabled: true,
  },
];

export async function AppSidebar() {
  const userCookie = JSON.parse(
    (await cookies()).get(COOKIE_KEYS.user)?.value as unknown as string,
  ) as User;
  const currentBusiness = JSON.parse(
    (await cookies()).get(COOKIE_KEYS.currentBusiness)
      ?.value as unknown as string,
  ) as Business;
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-neutral-100 w-[18vw]"
    >
      <SidebarHeader className="h-[140px] p-4 px-8 border-b border-neutral-100  bg-white flex items-start">
        <Logo />
        <div className="flex items-center w-full gap-2">
          <WorkspaceSwitcher />
          <Link href={ROUTES.onboard.business} title="create business">
            <Button size="icon" variant="outline">
              <PlusIcon />
            </Button>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white px-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 mt-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.disabled ? "#" : item.url}
                      className={`${item.disabled && "opacity-50 cursor-not-allowed"}`}
                    >
                      <item.icon className="opacity-60 group-hover/menu-item:rotate-[12deg] transition-transform" />
                      <span className="text-[16px]">{item.title}</span>
                      {item.disabled && (
                        <Badge className="ml-4 scale-[0.8]">Soon</Badge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-white px-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="rounded-none px-4 flex items-center justify-between h-[100px] border-neutral-100 cursor-pointer border-t">
                  <div className="flex items-center gap-4">
                    <div className="bg-neutral-100 flex items-center justify-center w-10 h-10 rounded-full">
                      <User2 size={16} />
                    </div>
                    <div className="space-y-1">
                      <p className="capitalize">
                        {userCookie.first_name} {userCookie.last_name}
                      </p>
                      <p className="opacity-50 -mt-1">{currentBusiness.name}</p>
                    </div>
                  </div>
                  <Badge>FREE</Badge>
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
