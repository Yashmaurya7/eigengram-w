"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarCheck2,
  Layout,
  PackagePlus,
  Settings,
  Users,
  Home,
  Search,
  BookOpen,
  User,
  Menu,
  HousePlus,
} from "lucide-react";


import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { allowedMails } from "@/lib/constants";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "./ModeToggle";
import { useSession } from "next-auth/react";

const adminSidebarItems = [
  { icon: Layout, label: "Services", href: "/admin" },
  { icon: PackagePlus, label: "New Service", href: "/admin/new-service" },
  { icon: Users, label: "Users", href: "/admin/users" },
  {
    icon: CalendarCheck2,
    label: "Subscriptions",
    href: "/admin/subscriptions",
  },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  {
    icon: HousePlus,
    label: "Feature Requests",
    href: "/admin/feature-requests",
  },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const userSidebarItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: Search, label: "Search Services", href: "/dashboard/search" },
  {
    icon: BookOpen,
    label: "My Subscriptions",
    href: "/dashboard/subscriptions",
  },
  { icon: User, label: "Account", href: "/dashboard/account" },
];

export function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
const {data:session}=useSession();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const sidebarItems = isAdmin ? adminSidebarItems : userSidebarItems;

  const SidebarContent = () => (
    <div className="flex min-h-screen   md:w-72 flex-col dark:text-white text-black border-r">
      <div className="flex h-16 items-center w-full border-b px-4">
        <h1 className="text-xl flex items-center justify-between font-bold w-full">
          <Link href={"/"}>Eigengram</Link>{" "}
          {isAdmin && (
            <p className="text-sm text-green-400 font-medium">(Admin)</p>
          )}
        </h1>
      </div>
      <nav className="flex flex-col space-y-2 p-4 justify-between min-h-[calc(80vh-4rem)]">
        <div>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={cn(
                  "w-full justify-start my-1 hover:shadow",
                  pathname === item.href
                    ? "bg-gray-700 text-white hover:bg-gray-700 hover:text-white"
                    : "text-black dark:text-white hover:bg-gray-700/80 hover:text-white"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Link href={item.href}>
                  <Icon className="mr-2 h-5 w-5" />
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </div>
        <div className="flex items-center justify-between">
          <ModeToggle />
          {isAdmin ? (
            <div className="text-blue-500 dark:text-blue-200">
              <Link href={"/dashboard"} className="flex">
                Dashboard
              </Link>
            </div>
          ) : (
            session?.user &&
            allowedMails?.includes(session?.user.email||'') && (
              <div className="text-blue-500 dark:text-blue-200">
                <Link href={"/admin"}>Admin</Link>
              </div>
            )
          )}
        </div>
      </nav>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 right-4 z-40"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return <SidebarContent />;
}
