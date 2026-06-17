"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import { appConfig } from "@/config/app";
import type { AdminNavItem } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { AdminNavList } from "./admin-nav-list";

interface AdminMobileNavProps {
  items: AdminNavItem[];
}

export function AdminMobileNav({ items }: AdminMobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex lg:hidden"
        render={<Button variant="outline" size="sm" type="button" />}
      >
        <Menu className="size-4" />
        <span className="sr-only">Open navigation</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border px-6 py-5 text-left">
          <SheetTitle className="font-heading text-base">{appConfig.name}</SheetTitle>
        </SheetHeader>
        <div className="p-4">
          <AdminNavList items={items} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
