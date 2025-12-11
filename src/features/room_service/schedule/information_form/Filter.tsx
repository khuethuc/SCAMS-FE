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

export default function Filter({
  filters,
  onFiltersChange,
  rooms,
}: ScheduleFilterProps) {
  const { startDate, endDate, room, day } = filters;

  const today = new Date();
  const tomorrow = addDays(today, 1);

  // Tuần hiện tại Thứ 2 → Chủ nhật
  const weekStart =
    day === "this-week" ? startOfWeek(today, { weekStartsOn: 1 }) : null;
  const weekEnd =
    day === "this-week" ? endOfWeek(today, { weekStartsOn: 1 }) : null;

  const isPristine = !room && !day && !startDate && !endDate;

  // ----------------------
  // ROOM HANDLER
  // ----------------------
  const handleRoomChange = (value: string) => {
    onFiltersChange({
      ...filters,
      room: value,
    });
  };

  const handleClearRoom = () => {
    onFiltersChange({
      ...filters,
      room: null,
    });
  };

  // ----------------------
  // DAY HANDLER (SET START/END AUTO)
  // ----------------------
  const handleDayChange = (value: string) => {
    const nextDay = value as ScheduleFilters["day"];
    let nextStartDate = startDate;
    let nextEndDate = endDate;

    if (nextDay === "today") {
      nextStartDate = today;
      nextEndDate = today;
    } else if (nextDay === "tomorrow") {
      nextStartDate = tomorrow;
      nextEndDate = tomorrow;
    } else if (nextDay === "this-week") {
      nextStartDate = weekStart ?? today;
      nextEndDate = weekEnd ?? today;
    }

    onFiltersChange({
      ...filters,
      day: nextDay,
      startDate: nextStartDate,
      endDate: nextEndDate,
    });
  };

  const handleClearDay = () => {
    onFiltersChange({
      ...filters,
      day: null,
    });
  };

  // ----------------------
  // START / END DATE HANDLER
  // ----------------------
  const handleSelectStart = (date: Date | undefined) => {
    let newStart = date ?? null;
    let newEnd = endDate;

    if (newStart && newEnd && newEnd < newStart) {
      newEnd = null;
    }

    onFiltersChange({
      ...filters,
      startDate: newStart,
      endDate: newEnd,
    });
  };

  const handleSelectEnd = (date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      endDate: date ?? null,
    });
  };

  // ----------------------
  // RESET
  // ----------------------
  const handleReset = () => {
    onFiltersChange({
      room: null,
      day: null,
      startDate: null,
      endDate: null,
    });
  };

  // ----------------------
  // DISABLE LOGIC – PERFECT VERSION
  // ----------------------
  const disableStartDate = (date: Date) => {
    // TODAY → chỉ chọn đúng hôm nay
    if (day === "today") {
      return date.toDateString() !== today.toDateString();
    }

    // TOMORROW → chỉ chọn đúng ngày mai
    if (day === "tomorrow") {
      return date.toDateString() !== tomorrow.toDateString();
    }

    // THIS WEEK → chỉ chọn từ Thứ 2 đến Chủ nhật
    if (day === "this-week" && weekStart && weekEnd) {
      return date < weekStart || date > weekEnd;
    }

    return false;
  };

  const disableEndDate = (date: Date) => {
    // End date không được trước start date
    if (startDate && date < startDate) return true;

    // TODAY
    if (day === "today") {
      return date.toDateString() !== today.toDateString();
    }

    // TOMORROW
    if (day === "tomorrow") {
      return date.toDateString() !== tomorrow.toDateString();
    }

    // THIS WEEK
    if (day === "this-week" && weekStart && weekEnd) {
      return date < weekStart || date > weekEnd;
    }

    return false;
  };

  // ----------------------
  // UI COMPONENT
  // ----------------------
  return (
    <div className="space-y-6">
      {/* Title */}
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

      {/* Room + Day Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ROOM */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-gray-700 font-medium">Room</label>
            {room && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearRoom}
                className="h-auto px-2 py-1 text-xs font-medium text-blue-600"
              >
                Clear
              </Button>
            )}
          </div>

          <Select value={room ?? undefined} onValueChange={handleRoomChange}>
            <SelectTrigger className="w-full rounded-xl h-14 text-base">
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* DAY */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-gray-700 font-medium">Day</label>
            {day && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClearDay}
                className="h-auto px-2 py-1 text-xs font-medium text-blue-600"
              >
                Clear
              </Button>
            )}
          </div>

          <Select value={day ?? undefined} onValueChange={handleDayChange}>
            <SelectTrigger className="w-full rounded-xl h-14 text-base">
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

      {/* Start + End Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* START DATE */}
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
                disabled={disableStartDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* END DATE */}
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
                disabled={disableEndDate}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
