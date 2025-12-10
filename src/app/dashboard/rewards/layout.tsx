"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Trophy,
  Medal,
  Target,
  Gift,
  BarChart3,
  Flame,
} from "lucide-react";

const rewardsNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard/rewards",
    icon: BarChart3,
    exact: true,
  },
  {
    title: "Badges",
    href: "/dashboard/rewards/badges",
    icon: Medal,
  },
  {
    title: "Leaderboard",
    href: "/dashboard/rewards/leaderboard",
    icon: Trophy,
  },
  {
    title: "Challenges",
    href: "/dashboard/rewards/challenges",
    icon: Target,
  },
  {
    title: "Catálogo",
    href: "/dashboard/rewards/catalog",
    icon: Gift,
  },
];

export default function RewardsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isActive = (item: typeof rewardsNavItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
            <Flame className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Recompensas</h1>
            <p className="text-sm text-muted-foreground">
              Gana puntos, desbloquea badges y compite en el leaderboard
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex gap-1 border-b">
        {rewardsNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
