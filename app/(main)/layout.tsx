import DockerNav from "@/components/layout/docker-nav";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full">
      {children}
      <DockerNav />
    </div>
  );
}
