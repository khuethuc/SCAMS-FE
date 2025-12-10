"use client";

import {
  CalendarDays,
  Clock3,
  MapPin,
  User,
  Edit3,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingCardProps } from "@/type/type";
import { format, isValid, parseISO } from "date-fns";

export function BookingCard({
  courseName,
  courseCode,
  typeLabel = "Lecture",
  weekday,
  startTime,
  endTime,
  room,
  lecturer,
  onEdit,
  onDelete,
  canManage,
  date,
}: BookingCardProps) {
  let dayLabel = weekday;

  if (date) {
    const parsedDate = parseISO(date);
    if (isValid(parsedDate)) {
      const formattedDate = format(parsedDate, "dd/MM/yyyy");
      dayLabel = weekday ? `${weekday} (${formattedDate})` : formattedDate;
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      {/* Left: info */}
      <div className="flex-1 space-y-2">
        {/* Course + badge */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-base font-semibold text-gray-900">
            {courseName}
            <span className="ml-2 text-sm font-medium text-gray-500">
              ({courseCode})
            </span>
          </div>

          <Badge className="rounded-xl bg-blue-50 px-3 py-1 text-xs font-medium text-[#155DFC]">
            {typeLabel}
          </Badge>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>{dayLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            <span>
              {startTime} - {endTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{room}</span>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{lecturer}</span>
          </div>
        </div>
      </div>

      {/* Right: actions */}
      {canManage && (
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onEdit}
            className="flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-2 text-sm font-medium text-[#155DFC] hover:bg-blue-100"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onDelete}
            className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
