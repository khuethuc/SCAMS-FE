"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import {
  addDays,
  endOfDay,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameWeek,
  parseISO,
  startOfDay,
} from "date-fns";
import { useRouter } from "next/navigation";

import InformationForm from "@/features/room_service/schedule/InformationForm";
import { Schedule } from "@/features/room_service/schedule/Schedule";
import { BookingCardProps, ScheduleFilters } from "@/type/type";
import { BOOK_ROOM_PATH, LOGIN_PATH } from "@/const/path";
import mockBookings from "./mock_data.json";
import { RawBooking, TabValue } from "@/type/type";
import { Card, CardContent } from "@/components/ui/card";

const fallbackCreatorMatch = (
  createdBy: string | undefined,
  email: string | null
): boolean => {
  if (!createdBy || !email) return false;
  const creatorNormalized = createdBy.toLowerCase();
  const emailNormalized = email.toLowerCase();
  const emailPrefix = emailNormalized.split("@")[0];
  return (
    creatorNormalized === emailNormalized || creatorNormalized === emailPrefix
  );
};

const mapBookingsToCards = (records: RawBooking[]): BookingCardProps[] =>
  records.map((record) => {
    const notes = record.notes ?? "";
    const courseName = record.course_name ?? "Untitled Course";
    const isLab =
      (typeof notes === "string" && notes.toLowerCase().includes("lab")) ||
      (typeof courseName === "string" &&
        courseName.toLowerCase().includes("lab"));

    let weekday = "";
    if (record.date) {
      try {
        weekday = format(new Date(record.date), "EEEE");
      } catch {
        weekday = "";
      }
    }

    const createdBy = record.created_by || record.lecturer_id || "";

    return {
      courseName,
      courseCode: record.course_id ?? "",
      typeLabel: isLab ? "Lab" : "Lecture",
      weekday,
      startTime: record.start_time ?? "",
      endTime: record.end_time ?? "",
      room: record.room_id ?? "",
      lecturer: record.lecturer_id || createdBy || "TBA",
      createdBy,
      date: record.date ?? "",
      onEdit: () => {
        console.log(
          "Edit booking",
          record.booking_id ?? `${record.course_id}-${record.date}`
        );
      },
      onDelete: () => {
        console.log(
          "Delete booking",
          record.booking_id ?? `${record.course_id}-${record.date}`
        );
      },
    };
  });

export default function ViewSchedule() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<TabValue>("room");
  const [activeHeaderTab, setActiveHeaderTab] = useState<"schedule" | "book">(
    "schedule"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ScheduleFilters>({
    room: null,
    day: null,
    startDate: null,
    endDate: null,
  });
  const [currentUser, setCurrentUser] = useState<{
    email: string | null;
    role: string | null;
  }>({ email: null, role: null });

  const isAuthenticated = useMemo(
    () => Boolean(currentUser.email && currentUser.role),
    [currentUser.email, currentUser.role]
  );

  useEffect(() => {
    const syncAuth = () => {
      const email = localStorage.getItem("userEmail");
      const role = localStorage.getItem("userRole");
      setCurrentUser({ email, role });
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && selectedTab === "my") {
      setSelectedTab("room");
    }
  }, [isAuthenticated, selectedTab]);

  const allBookings = useMemo(
    () => mapBookingsToCards(mockBookings as RawBooking[]),
    []
  );

  const availableRooms = useMemo(() => {
    const uniqueRooms = new Set<string>();
    allBookings.forEach((item) => {
      if (item.room) {
        uniqueRooms.add(item.room);
      }
    });
    return Array.from(uniqueRooms).sort((a, b) => a.localeCompare(b));
  }, [allBookings]);

  const bookingsByTab = useMemo(() => {
    if (selectedTab !== "my") {
      return allBookings;
    }

    if (!currentUser.email) {
      return [];
    }

    return allBookings.filter((item) =>
      fallbackCreatorMatch(item.createdBy, currentUser.email)
    );
  }, [allBookings, selectedTab, currentUser.email]);

  const handleFiltersChange = (nextFilters: ScheduleFilters) => {
    setFilters(nextFilters);
  };

  const filteredBookings = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const startBoundary = filters.startDate
      ? startOfDay(filters.startDate)
      : null;
    const endBoundary = filters.endDate ? endOfDay(filters.endDate) : null;
    const today = new Date();

    return bookingsByTab.filter((item) => {
      if (filters.room && item.room !== filters.room) {
        return false;
      }

      let bookingDate: Date | null = null;
      if (filters.day || startBoundary || endBoundary) {
        if (!item.date) {
          return false;
        }

        try {
          bookingDate = parseISO(item.date);
        } catch {
          return false;
        }
      }

      if (filters.day && bookingDate) {
        if (filters.day === "today" && !isSameDay(bookingDate, today)) {
          return false;
        }

        if (
          filters.day === "tomorrow" &&
          !isSameDay(bookingDate, addDays(today, 1))
        ) {
          return false;
        }

        if (
          filters.day === "this-week" &&
          !isSameWeek(bookingDate, today, { weekStartsOn: 1 })
        ) {
          return false;
        }
      }

      if (
        startBoundary &&
        bookingDate &&
        isBefore(bookingDate, startBoundary)
      ) {
        return false;
      }

      if (endBoundary && bookingDate && isAfter(bookingDate, endBoundary)) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const candidates = [
        item.courseName,
        item.courseCode,
        item.typeLabel ?? "",
        item.lecturer,
        item.room,
        item.weekday,
      ];

      return candidates.some((value) =>
        value?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [bookingsByTab, filters, searchTerm]);

  const handleTabChange = (value: "room" | "my") => {
    if (value === selectedTab) return;
    setSelectedTab(value);
  };

  const handleBookRoomClick = () => {
    setActiveHeaderTab("book");
    if (isAuthenticated) {
      router.push(BOOK_ROOM_PATH);
    } else {
      router.push(LOGIN_PATH);
    }
  };

  return (
    <div className="flex min-h-screen justify-center py-10">
      <Card className="w-full max-w-4xl shadow-lg border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveHeaderTab("schedule")}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
              activeHeaderTab === "schedule"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <CalendarDays size={18} /> View Schedule
          </button>
          <button
            type="button"
            onClick={handleBookRoomClick}
            className={`flex-1 py-4 flex items-center justify-center gap-2 font-medium transition-colors ${
              activeHeaderTab === "book"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Plus size={18} /> Book Room
          </button>
        </div>

        <CardContent className="space-y-8">
          <InformationForm
            selectedTab={selectedTab}
            onTabChange={handleTabChange}
            canViewMySchedule={isAuthenticated}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            availableRooms={availableRooms}
          />

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <Schedule items={filteredBookings} pageSize={5} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
