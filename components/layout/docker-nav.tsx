"use client";

import React from "react";
import {
  ReceiptIcon,
  WalletIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr"; // Adjusted import names for standard Phosphor
import { LayoutDashboard, Radar } from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Utility for cleaner classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DockerNav() {
  const pathname = usePathname();

  const navItems = [
    {
      id: "Bridge",
      icon: LayoutDashboard,
      label: "Bridge",
      href: "/dashboard",
    },
    { id: "Log", icon: ReceiptIcon, label: "Log", href: "/logs" },
    { id: "Plans", icon: WalletIcon, label: "Plans", href: "/plans" },
    { id: "Trends", icon: Radar, label: "Trends", href: "/trends" },
    { id: "Profile", icon: UserIcon, label: "Profile", href: "/profile" },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 p-2 rounded-full border border-white/10 bg-primary backdrop-blur-xl shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Active if pathname starts with item's href
          const isActive = pathname.startsWith(item.href);

          return (
            <button
              key={item.id}
              className={cn(
                "relative flex flex-col items-center justify-center w-16 h-14 rounded-full transition-all duration-300",
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              )}
            >
              {/* The Sliding Background Pill */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white/15 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Icon & Label with Z-Index to sit above the pill */}
              <Link
                href={item.href}
                className="relative z-10 flex flex-col items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={20} weight={isActive ? "fill" : "regular"} />
                </motion.div>
                <span className="text-[10px] font-medium tracking-wide mt-1">
                  {item.label}
                </span>
              </Link>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
