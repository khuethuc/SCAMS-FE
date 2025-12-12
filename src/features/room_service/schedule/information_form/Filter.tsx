"use client";

import { format, addDays, startOfWeek, endOfWeek } from "date-fns";
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
import { useMemo } from "react";

export default function Filter({
  filters,
  onFiltersChange,
  rooms,
}: ScheduleFilterProps) {
  const { startDate, endDate, room, day } = filters;

  const today = new Date();
  const tomorrow = addDays(today, 1);

  const weekStart =
    day === "this-week" ? startOfWeek(today, { weekStartsOn: 1 }) : null;
  const weekEnd =
    day === "this-week" ? endOfWeek(today, { weekStartsOn: 1 }) : null;

  const isPristine = !room && !day && !startDate && !endDate;

  // Forces re-render of UI when reset
  const filterKey = useMemo(
    () =>
      `${room ?? "none"}-${day ?? "none"}-${startDate ?? "none"}-${
        endDate ?? "none"
      }`,
    [room, day, startDate, endDate]
  );

  // Room handlers
  const handleRoomChange = (value: string) => {
    onFiltersChange({ ...filters, room: value });
  };

  const handleClearRoom = () => {
    onFiltersChange({ ...filters, room: null });
  };

  // Day handlers
  const handleDayChange = (value: string) => {
    const nextDay = value as ScheduleFilters["day"];

    let nextStart = null;
    let nextEnd = null;

    if (nextDay === "today") {
      nextStart = today;
      nextEnd = today;
    } else if (nextDay === "tomorrow") {
      nextStart = tomorrow;
      nextEnd = tomorrow;
    } else if (nextDay === "this-week") {
      nextStart = weekStart ?? today;
      nextEnd = weekEnd ?? today;
    }

    onFiltersChange({
      ...filters,
      day: nextDay,
      startDate: nextStart,
      endDate: nextEnd,
    });
  };

  const handleClearDay = () =>
    onFiltersChange({
      ...filters,
      day: null,
      startDate: null,
      endDate: null,
    });

  // Date handlers
  const handleSelectStart = (date: Date | undefined) => {
    const newStart = date ?? null;
    let newEnd = endDate;

    if (newStart && newEnd && newEnd < newStart) newEnd = null;

    onFiltersChange({
      ...filters,
      startDate: newStart,
      endDate: newEnd,
      day: null,
    });
  };

  const handleSelectEnd = (date: Date | undefined) =>
    onFiltersChange({
      ...filters,
      endDate: date ?? null,
      day: null,
    });

  // Reset
  const handleReset = () =>
    onFiltersChange({
      room: null,
      day: null,
      startDate: null,
      endDate: null,
    });

  // Disable logic
  const disableStartDate = (date: Date) => {
    if (day === "today") return date.toDateString() !== today.toDateString();
    if (day === "tomorrow")
      return date.toDateString() !== tomorrow.toDateString();
    if (day === "this-week" && weekStart && weekEnd)
      return date < weekStart || date > weekEnd;
    return false;
  };

  const disableEndDate = (date: Date) => {
    if (startDate && date < startDate) return true;

    if (day === "today") return date.toDateString() !== today.toDateString();
    if (day === "tomorrow")
      return date.toDateString() !== tomorrow.toDateString();
    if (day === "this-week" && weekStart && weekEnd)
      return date < weekStart || date > weekEnd;

    return false;
  };

  return (
    <div className="space-y-6" key={filterKey}>
      <div className="flex items-center justify-between text-gray-700">
        <div className="flex items-center gap-2">
          <FilterIcon size={20} />
          <span className="font-medium">Filters</span>
        </div>

        <Button
          type="button"
          onClick={handleReset}
          disabled={isPristine}
          variant="ghost"
          className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 text-sm"
        >
          Reset
        </Button>
      </div>

      {/* Row 1: Room + Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ROOM */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="font-medium text-gray-700">Room</label>
            {room && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearRoom}
                className="text-blue-600 text-xs px-2"
              >
                Clear
              </Button>
            )}
          </div>

          <Select value={room ?? undefined} onValueChange={handleRoomChange}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((r) => (
                <SelectItem value={r} key={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* DAY */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="font-medium text-gray-700">Day</label>
            {day && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearDay}
                className="text-blue-600 text-xs px-2"
              >
                Clear
              </Button>
            )}
          </div>

          <Select value={day ?? undefined} onValueChange={handleDayChange}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="tomorrow">Tomorrow</SelectItem>
              <SelectItem value="this-week">This week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2: Start + End Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* START DATE */}
        <div className="space-y-1">
          <label className="font-medium text-gray-700">Start Date</label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-12 rounded-xl w-full justify-start"
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
                disabled={disableStartDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* END DATE */}
        <div className="space-y-1">
          <label className="font-medium text-gray-700">End Date</label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={!startDate}
                className="h-12 rounded-xl w-full justify-start"
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
                disabled={disableEndDate}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
