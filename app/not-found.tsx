"use client";

import Link from "next/link";
import {
  MapTrifoldIcon,
  HouseIcon,
  ArrowLeftIcon,
  CompassIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button"; // Assuming you have your enhanced Button

export default function CustomNotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-foreground overflow-hidden px-4">
      {/* --- Background Elements --- */}
      {/* 1. Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* 2. Giant Watermark (Depth) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-[40vw] text-primary/5 dark:text-white/5 select-none pointer-events-none z-0">
        404
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto text-center space-y-8">
        {/* Animated Icon Wrapper (The Radar) */}
        <div className="relative group">
          {/* Outer Pulsing Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full animate-ping opacity-75 duration-3000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-primary/10 rounded-full animate-ping delay-75 duration-1000"></div>

          {/* Icon Container with Glass Effect */}
          <div className="relative w-24 h-24 flex items-center justify-center bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 ease-out">
            <div className="absolute inset-0 rounded-3xl bg-linear-to-tr from-white/40 to-transparent opacity-50 pointer-events-none"></div>
            <MapTrifoldIcon
              weight="duotone"
              className="text-primary dark:text-white drop-shadow-md"
              size={48}
            />
            {/* Small decorative badge */}
            <div className="absolute -top-2 -right-2 bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              LOST
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="space-y-4">
          <h1 className="font-display font-bold text-5xl md:text-6xl tracking-tight text-primary dark:text-white">
            Off the charts
          </h1>
          <p className="font-mono text-muted-foreground text-sm md:text-base leading-relaxed max-w-sm mx-auto">
            We couldn&apos;t find the coordinates for the page you&apos;re
            looking for. It might have been moved to a new sector or
            doesn&apos;t exist.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="rounded-full px-8 shadow-xl shadow-primary/20"
            >
              <HouseIcon weight="bold" />
              Return to Bridge
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="lg"
            className="rounded-full gap-2 group"
            onClick={() => window.history.back()}
          >
            <ArrowLeftIcon
              weight="bold"
              className="group-hover:-translate-x-1 transition-transform"
            />
            Go Back
          </Button>
        </div>

        {/* Footer Technical ID */}
        <div className="pt-12 opacity-30 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
          <CompassIcon size={16} className="animate-spin-slow" />
        </div>
      </div>
    </div>
  );
}
