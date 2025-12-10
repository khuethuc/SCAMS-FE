"use client";

import { CalendarDays, Plus } from "lucide-react";
import { format } from "date-fns";

import InformationForm from "@/features/schedule/InformationForm";
import { Schedule } from "@/features/schedule/Schedule";
import { BookingCardProps } from "@/type/type";
import mockBookings from "./mock_data.json";

export default function Page() {
  // Get mock data
  const items: BookingCardProps[] = mockBookings.map((b) => {
    const isLab =
      b.notes?.toLowerCase().includes("lab") ||
      b.course_name.toLowerCase().includes("lab");

    return {
      courseName: b.course_name,
      courseCode: b.course_id,
      typeLabel: isLab ? "Lab" : "Lecture",
      weekday: format(new Date(b.date), "EEEE"),
      startTime: b.start_time,
      endTime: b.end_time,
      room: b.room_id,
      lecturer: b.lecturer_id || "TBA",
      onEdit: () => {
        console.log("Edit booking", b.booking_id);
      },
      onDelete: () => {
        console.log("Delete booking", b.booking_id);
      },
    };
  });

  return (
    <main className="min-h-screen bg-[#F5F7FB] px-4 py-8">
      <div className="mx-auto w-full max-w-5xl space-y-4">
        {/* Top tabs: View Schedule / Book Room */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="flex">
            <button className="flex flex-1 items-center justify-center gap-2 border-b-2 border-[#155DFC] bg-[#F3F6FF] px-4 py-4 text-sm font-medium text-[#155DFC]">
              <CalendarDays className="h-4 w-4" />
              <span>View Schedule</span>
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 border-b px-4 py-4 text-sm font-medium text-gray-600">
              <Plus className="h-4 w-4" />
              <span>Book Room</span>
            </button>
          </div>
        </div>

        {/* InformationForm */}
        <InformationForm />

        {/* Schedule */}
        <div className="w-full rounded-2xl border bg-white p-6 shadow-sm">
          <Schedule items={items} pageSize={5} />
        </div>
      </div>
    </main>
  );
}
