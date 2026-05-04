"use client";

import * as React from "react";
import {
  FileText,
  Home,
  LogOut,
  LayoutTemplate,
  Images,
  LayoutDashboard,
  FileBarChart,
  MousePointerClick,
  Globe2,
  Radio,
  Send,
  Activity,
  BookOpen,
  MessageSquare,
  Mail,
  PenSquare,
  HelpCircle,
  Handshake,
} from "lucide-react";

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
  {
    title: "Нүүр баннер",
    url: "/dashboard/hero",
    icon: Images,
  },
  {
    title: "Журнал",
    url: "/dashboard/journal",
    icon: BookOpen,
    items: [
      { title: "Нийтлэлүүд", url: "/dashboard/journal", icon: PenSquare },
      { title: "Сэтгэгдэл", url: "/dashboard/journal/comments", icon: MessageSquare },
      { title: "Захиалагчид", url: "/dashboard/journal/subscribers", icon: Mail },
    ],
  },
  {
    title: "FAQ",
    url: "/dashboard/faq",
    icon: HelpCircle,
  },
  {
    title: "Хамтрагчид",
    url: "/dashboard/partners",
    icon: Handshake,
  },
  {
    title: "Аналитик",
    url: "/dashboard/analytics",
    icon: Activity,
    items: [
      { title: "Тойм", url: "/dashboard/analytics", icon: LayoutDashboard },
      { title: "Хуудсууд", url: "/dashboard/analytics/pages", icon: FileBarChart },
      { title: "Хэсгүүд", url: "/dashboard/analytics/sections", icon: LayoutDashboard },
      { title: "Идэвх", url: "/dashboard/analytics/engagement", icon: MousePointerClick },
      { title: "Үзэгчид", url: "/dashboard/analytics/audience", icon: Globe2 },
      { title: "Эх сурвалж", url: "/dashboard/analytics/acquisition", icon: Globe2 },
      { title: "Маягт", url: "/dashboard/analytics/form", icon: Send },
      { title: "Шууд", url: "/dashboard/analytics/live", icon: Radio },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const navMain = navItems.map((item) => ({
    ...item,
    isActive:
      pathname === item.url ||
      ("items" in item && item.items
        ? item.items.some(
            (s) => pathname === s.url || pathname.startsWith(`${s.url}/`),
          )
        : false),
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
