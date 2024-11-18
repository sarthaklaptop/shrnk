"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../components/ui/navbar-menu";
import { cn } from "@/lib/utils";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
      <div
        className={cn("fixed top-0 inset-x-0 max-w-2xl mx-auto z-50 border rounded-full", className)}
      >
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Services">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/seo">URL Shortning</HoveredLink>
              <HoveredLink href="/seo">Analitics</HoveredLink>
              <HoveredLink href="/seo">Marketing Campaigns</HoveredLink>
            </div>
          </MenuItem>
          <a href="/pricing"><p className="text-black">Pricing</p></a>
        </Menu>
    </div>
      </Menu>
    </div>

  );
}
