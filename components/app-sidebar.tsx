"use client";

import * as React from "react";
import { FileText, Home, LogOut, LayoutTemplate } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  {
    title: "Маягт бөглөлтүүд",
    url: "/dashboard",
    icon: FileText,
  },
  {
    title: "Маягтын агуулга",
    url: "/dashboard/form-content",
    icon: LayoutTemplate,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const navMain = navItems.map((item) => ({
    ...item,
    isActive: pathname === item.url,
  }));

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  // User info available from session if needed
  const _userName = session?.user?.name || "Admin";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  TC
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Tenger Capital</span>
                  <span className="truncate text-xs">Хяналтын самбар</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" target="_blank">
                <Home />
                <span>Сайт харах</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut />
              <span>Гарах</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
