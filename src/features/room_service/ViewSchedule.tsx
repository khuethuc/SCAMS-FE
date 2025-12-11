"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { addDays, format, startOfWeek, endOfWeek } from "date-fns";
import { useRouter } from "next/navigation";

import InformationForm from "@/features/room_service/schedule/InformationForm";
import { Schedule } from "@/features/room_service/schedule/Schedule";
import { BookingCardProps, ScheduleFilters } from "@/type/type";
import { BOOK_ROOM_PATH, LOGIN_PATH } from "@/const/path";
import { RawBooking, TabValue, ApiRoomSchedule } from "@/type/type";
import { Card, CardContent } from "@/components/ui/card";

const API_URL = "https://ase-251.onrender.com";

const flattenApiBookings = (
  rooms: ApiRoomSchedule[] | RawBooking[]
): RawBooking[] => {
  if (!Array.isArray(rooms)) return [];

  // Trường hợp API trả dạng group theo room (room + booking[])
  if (rooms.length > 0 && "booking" in (rooms[0] as any)) {
    return (rooms as ApiRoomSchedule[]).flatMap((roomBlock) =>
      (roomBlock.booking ?? []).map((b) => ({
        ...b,
        // đảm bảo room_id luôn có
        room_id: (b as any).room_id ?? roomBlock.room,
      }))
    );
  }

  // Trường hợp API trả flat list
  return rooms as RawBooking[];
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

    // Chủ booking theo user_id
    const userId = record.user_id ?? "";
    const createdBy = userId || "";

    // Nếu không có user_id thì text lecturer = "Lecturer"
    const lecturerLabel = userId && userId.trim() !== "" ? userId : "Lecturer";

    const bookingId =
      record.booking_id ??
      `${record.course_id ?? "unknown"}-${record.date ?? "unknown"}`;

    return {
      courseName,
      courseCode: record.course_id ?? "",
      typeLabel: isLab ? "Lab" : "Lecture",
      weekday,
      startTime: record.start_time ?? "",
      endTime: record.end_time ?? "",
      room: record.room_id ?? "",
      lecturer: lecturerLabel,
      createdBy,
      date: record.date ?? "",
      // thêm userId để Schedule.tsx kiểm tra chủ sở hữu
      userId,
      // stub handler – sau này bạn hook vào API delete / update
      onEdit: () => {
        console.log("Edit booking", bookingId);
      },
      onDelete: () => {
        console.log("Delete booking", bookingId);
      },
    } as any;
  });

function buildScheduleQueryParams(filters: ScheduleFilters): URLSearchParams {
  const params = new URLSearchParams();
  const { room, day, startDate, endDate } = filters;
  const today = new Date();

  if (room) {
    params.set("room", room);
  }

  let from: Date | null = null;
  let to: Date | null = null;

  if (startDate && endDate) {
    from = startDate;
    to = endDate;
  } else if (startDate && !endDate) {
    from = startDate;
  } else if (!startDate && endDate) {
    from = today;
    to = endDate;
  } else if (day) {
    if (day === "today") {
      from = today;
      to = today;
    } else if (day === "tomorrow") {
      const tomorrow = addDays(today, 1);
      from = tomorrow;
      to = tomorrow;
    } else if (day === "this-week") {
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
      from = weekStart;
      to = weekEnd;
    }
  }

  if (from) params.set("from", format(from, "yyyy-MM-dd"));
  if (to) params.set("to", format(to, "yyyy-MM-dd"));

  return params;
}

// fallback theo email (trường hợp có createdBy là email cũ)
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
    id: string | null;
    name: string | null;
  }>({ email: null, role: null, id: null, name: null });

  const [rawBookings, setRawBookings] = useState<RawBooking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = useMemo(
    () => Boolean(currentUser.id),
    [currentUser.id]
  );

  useEffect(() => {
    const syncAuth = () => {
      const email = localStorage.getItem("userEmail");
      const role = localStorage.getItem("userRole");
      const id = localStorage.getItem("userId");
      const name = localStorage.getItem("userName");
      setCurrentUser({ email, role, id, name });
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // Không cho vào tab "my" nếu chưa login
  useEffect(() => {
    if (!isAuthenticated && selectedTab === "my") {
      setSelectedTab("room");
    }
  }, [isAuthenticated, selectedTab]);

  // Fetch schedule mỗi khi filter đổi
  useEffect(() => {
    const controller = new AbortController();

    const fetchSchedule = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = buildScheduleQueryParams(filters);
        const query = params.toString();
        const url = query
          ? `${API_URL}/schedule?${query}`
          : `${API_URL}/schedule`;

        const res = await fetch(url, {
          method: "GET",
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch schedule (${res.status})`);
        }

        const json = await res.json();
        const flattened = flattenApiBookings(json);
        setRawBookings(flattened);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("Error fetching schedule:", err);
        setError(err?.message || "Failed to load schedule");
        setRawBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();

    return () => controller.abort();
  }, [filters]); // không cần selectedTab, My Schedule lọc client-side

  // Map API -> BookingCardProps
  const allBookings: BookingCardProps[] = useMemo(
    () => mapBookingsToCards(rawBookings),
    [rawBookings]
  );

  const availableRooms = useMemo(() => {
    const uniqueRooms = new Set<string>();
    allBookings.forEach((item: any) => {
      if (item.room) uniqueRooms.add(item.room);
    });
    return Array.from(uniqueRooms).sort((a, b) => a.localeCompare(b));
  }, [allBookings]);

  // Room Schedule / My Schedule
  const bookingsByTab = useMemo(() => {
    if (selectedTab !== "my") {
      return allBookings;
    }

    if (!currentUser.id && !currentUser.email) {
      return [];
    }

    return allBookings.filter((item: any) => {
      const byId =
        currentUser.id && item.userId ? item.userId === currentUser.id : false;

      const byEmail =
        currentUser.email &&
        fallbackCreatorMatch(item.createdBy, currentUser.email);

      return byId || byEmail;
    });
  }, [allBookings, selectedTab, currentUser.id, currentUser.email]);

  const handleFiltersChange = (nextFilters: ScheduleFilters) => {
    setFilters(nextFilters);
  };

  // Search client-side
  const filteredBookings = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return bookingsByTab;
    }

    return bookingsByTab.filter((item) => {
      const candidates = [
        item.courseName,
        item.courseCode,
        item.typeLabel ?? "",
        item.room,
        item.weekday,
        item.lecturer,
      ];

      return candidates.some((value) =>
        value?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [bookingsByTab, searchTerm]);

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
        {/* Header tabs: View / Book */}
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
            <CalendarDays size={18} />
            View Schedule
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
            <Plus size={18} />
            Book Room
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
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading schedule...</div>
            ) : error ? (
              <div className="text-sm text-red-500">
                Error loading schedule: {error}
              </div>
            ) : (
              <Schedule
                items={filteredBookings}
                pageSize={5}
                searchTerm={searchTerm}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
