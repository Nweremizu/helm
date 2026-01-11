/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { cn } from "@/lib/utils";
import { Key, useEffect, useState, useMemo } from "react";

const formatDateLabel = (dateString: string | number | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export function KeelPacingWidget({ data }: { data: any }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [seriesData, setSeriesData] = useState(data.series);
  const [isLoaded, setIsLoaded] = useState(false);

  // Extract metadata
  const { title, status, currency } = data.meta;

  // Calculate max value for scaling
  const maxValue = useMemo(() => {
    const max = Math.max(...seriesData.map((d: any) => d.value));
    return max > 0 ? max : 1000; // Default to 1000 if all 0
  }, [seriesData]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
          {status}
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between h-48 gap-1 relative pb-6">
        {/* Dashed Grid Line (Average or Limit) */}
        <div className="absolute top-1/3 w-full border-t border-dashed border-gray-200 pointer-events-none z-0"></div>

        {seriesData.map((item: any, index: number) => {
          const isHovered = hoveredIndex === index;
          const isActive = item.status === "active";
          const isPast = item.status === "closed";

          // Labels
          const isFirst = index === 0;
          const isLast = index === seriesData.length - 1;
          const shouldShowLabel = isFirst || isLast || isActive;

          let labelText = "";
          if (isActive) labelText = "Today";
          else if (isFirst || isLast) labelText = formatDateLabel(item.date);

          // Height calculation
          const heightPercentage = Math.max((item.value / maxValue) * 100, 4); // Min 4% height

          return (
            <div
              key={item.date}
              className="relative flex flex-col items-center flex-1 h-full justify-end group/bar cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              <div
                className={cn(
                  "absolute -top-16 transition-all duration-200 z-20 pointer-events-none",
                  isHovered || isActive
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                )}
              >
                <div className="bg-gray-900 text-white text-xs font-bold py-1.5 px-2.5 rounded-lg shadow-lg whitespace-nowrap relative flex flex-col items-center gap-0.5">
                  <span className="text-[10px] font-medium text-gray-300">
                    {formatDateLabel(item.date)}
                  </span>
                  <span>
                    {currency === "NGN" ? "₦" : "$"}
                    {item.value >= 1000
                      ? (item.value / 1000).toFixed(1) + "k"
                      : Math.round(item.value).toLocaleString()}
                  </span>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </div>

              {/* Bar */}
              <div
                className={cn(
                  "w-full rounded-t-md relative transition-all duration-700 ease-out",
                  isActive
                    ? "bg-gray-800 shadow-lg shadow-gray-200/50"
                    : isPast
                    ? "bg-gray-200 hover:bg-gray-300"
                    : "bg-gray-50 border border-gray-100"
                )}
                style={{ height: isLoaded ? `${heightPercentage}%` : "0%" }}
              ></div>

              {/* X-Axis Label */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-20">
                <span
                  className={cn(
                    "text-[10px] font-medium whitespace-nowrap transition-colors",
                    isActive ? "text-gray-900 font-bold" : "text-gray-400",
                    !shouldShowLabel && "opacity-0"
                  )}
                >
                  {labelText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
