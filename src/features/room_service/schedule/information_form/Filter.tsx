"use client";

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

import { ScheduleFilterProps, ScheduleFilters } from "@/type/type";

export default function Filter({
  filters,
  onFiltersChange,
  rooms,
}: ScheduleFilterProps) {
  const { startDate, endDate, room, day } = filters;
  const isPristine = !room && !day && !startDate && !endDate;

  const handleRoomChange = (value: string) => {
    onFiltersChange({
      ...filters,
      room: value,
    });
  };

  const handleDayChange = (value: string) => {
    onFiltersChange({
      ...filters,
      day: value as ScheduleFilters["day"],
    });
  };

  const handleClearRoom = () => {
    onFiltersChange({
      ...filters,
      room: null,
    });
  };

  const handleClearDay = () => {
    onFiltersChange({
      ...filters,
      day: null,
    });
  };

  const handleSelectStart = (date: Date | undefined) => {
    const normalizedStart = date ?? null;
    let nextEndDate = endDate;

    if (normalizedStart && nextEndDate && nextEndDate < normalizedStart) {
      nextEndDate = null;
    }

    onFiltersChange({
      ...filters,
      startDate: normalizedStart,
      endDate: nextEndDate,
    });
  };

  const handleSelectEnd = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      endDate: date ?? null,
    });
  };

  const handleReset = () => {
    onFiltersChange({
      room: null,
      day: null,
      startDate: null,
      endDate: null,
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters Title */}
      <div className="flex items-center justify-between text-gray-700">
        <div className="flex items-center gap-2">
          <FilterIcon size={20} />
          <span className="font-medium">Filters</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={handleReset}
          disabled={isPristine}
          className="h-auto px-2 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400"
        >
          Reset
        </Button>
      </div>

      {/* Row 1: Room + Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Room */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-gray-700 font-medium">Room</label>
            {room && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearRoom}
                className="h-auto px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Clear
              </Button>
            )}
          </div>
          <Select
            key={room ?? "__empty_room__"}
            value={room ?? undefined}
            onValueChange={handleRoomChange}
          >
            <SelectTrigger className="w-full rounded-xl h-14 text-base">
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((roomOption) => (
                <SelectItem key={roomOption} value={roomOption}>
                  {roomOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Day */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-gray-700 font-medium">Day</label>
            {day && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearDay}
                className="h-auto px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Clear
              </Button>
            )}
          </div>
          <Select
            key={day ?? "__empty_day__"}
            value={day ?? undefined}
            onValueChange={handleDayChange}
          >
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
                selected={startDate ?? undefined}
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
                selected={endDate ?? undefined}
                onSelect={handleSelectEnd}
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
