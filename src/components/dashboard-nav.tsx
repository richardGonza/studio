"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Handshake,
  Building,
  Gavel,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/users", icon: Users, label: "Opportunities" },
  { href: "/dashboard/volunteers", icon: Handshake, label: "Volunteers" },
  { href: "/dashboard/branches", icon: Building, label: "Branches" },
  { href: "/dashboard/cases", icon: Gavel, label: "Cases" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={
              item.href === '/dashboard'
                ? pathname === item.href
                : pathname.startsWith(item.href)
            }
          >
            <Link href={item.href}>
              <item.icon />
              {item.label}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
