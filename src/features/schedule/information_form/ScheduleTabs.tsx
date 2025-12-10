"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function ScheduleTabs() {
  const [tab, setTab] = useState("room");

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
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
          className="
            px-6 py-5 rounded-xl text-sm font-medium border border-transparent
            data-[state=active]:bg-[#155DFC] data-[state=active]:text-white
            data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700
          "
        >
          My Schedule
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
