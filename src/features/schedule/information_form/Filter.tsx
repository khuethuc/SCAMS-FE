"use client";

import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FilterIcon } from "lucide-react";

export default function Filter() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const handleSelectStart = (date: Date | undefined) => {
    setStartDate(date);
    if (date && endDate && endDate < date) {
      setEndDate(undefined);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Title */}
      <div className="flex items-center gap-2 text-gray-700">
        <FilterIcon size={20} />
        <span className="font-medium">Filters</span>
      </div>

      {/* Row 1: Room + Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Room */}
        <div className="space-y-1">
          <label className="text-gray-700 font-medium">Room</label>
          <Select>
            <SelectTrigger className="w-full rounded-xl h-14 text-base">
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="101">101</SelectItem>
              <SelectItem value="201">201</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Day */}
        <div className="space-y-1">
          <label className="text-gray-700 font-medium">Day</label>
          <Select>
            <SelectTrigger className="w-full rounded-xl h-14 text-base">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This week</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2: Start Time + End Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Time */}
        <div className="space-y-1">
          <label className="text-gray-700 font-medium">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl h-12"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate
                  ? format(startDate, "dd/MM/yyyy", { locale: vi })
                  : "dd/mm/yyyy"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleSelectStart}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Time */}
        <div className="space-y-1">
          <label className="text-gray-700 font-medium">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl h-12"
                disabled={!startDate}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate
                  ? format(endDate, "dd/MM/yyyy", { locale: vi })
                  : "dd/mm/yyyy"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date: Date) =>
                  !!startDate &&
                  date <
                    new Date(
                      startDate.getFullYear(),
                      startDate.getMonth(),
                      startDate.getDate()
                    )
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
