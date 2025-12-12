"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "../../../../../lib/utils";
import { ScheduleTabsProps } from "@/type/type";

export default function ScheduleTabs({
  value,
  onChange,
  isAuthenticated,
}: ScheduleTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onChange(next === "my" ? "my" : "room")}
      className="w-full"
    >
      <TabsList className="flex gap-3 bg-transparent p-0">
        <TabsTrigger
          value="room"
          className="
            px-6 py-5 rounded-xl text-sm font-medium border border-transparent
            data-[state=active]:bg-[#155DFC] data-[state=active]:text-white
            data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700
          "
        >
          Room Schedule
        </TabsTrigger>
        <TabsTrigger
          value="my"
          disabled={!isAuthenticated}
          aria-hidden={!isAuthenticated}
          tabIndex={isAuthenticated ? 0 : -1}
          className={cn(
            `
              px-6 py-5 rounded-xl text-sm font-medium border border-transparent
              data-[state=active]:bg-[#155DFC] data-[state=active]:text-white
              data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700
            `,
            !isAuthenticated && "hidden"
          )}
        >
          My Schedule
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
