// * * * Layout * * * //
export type MainLayoutProps = {
  children: React.ReactNode;
};

export interface HeaderProps {
  currentPage?: "login" | "register";
  isAuthenticated?: boolean;
  user?: { name: string; email: string; id?: string };
  onLogout?: () => void;
}

// * * * Authentication * * * //

export interface LoginProps {
  onLogin?: (email: string, password: string) => void;
  onSwitchToRegister?: () => void;
}

export interface RegisterProps {
  onRegister?: (name: string, email: string, password: string) => void;
  onSwitchToLogin?: () => void;
}

// * * * Room services * * * //
// Book room
export interface BookingProps {
  onBookingCreate?: (
    room: string,
    date: string,
    startTime: string,
    endTime: string,
    courseName: string,
    notes: string,
  ) => Promise<void>;
}

export interface BookingInfo {
  id: string;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  courseName: string;
  notes: string;
}

// Update room
export interface UpdateBookingProps {
  existingBooking?: BookingInfo;
  onBookingUpdate?: (BookingInfo: BookingInfo) => void;
}

// * * * View schedule * * * //

// --- Booking Card (single booking rendered to user) ---
export interface BookingCardProps {
  courseName: string;
  courseCode: string;
  typeLabel?: string;
  weekday: string;      
  startTime: string;
  endTime: string;
  room: string;
  lecturer: string;     
  createdBy?: string;    
  date?: string;
  userId?: string;   
  onEdit?: () => void;
  onDelete?: () => void;
  canManage?: boolean;
}

// --- Schedule list / pagination wrapper ---
export interface ScheduleProps {
  items: BookingCardProps[];
  pageSize?: number;
  searchTerm?: string;
}

// --- Information form props ---
export type InformationFormProps = {
  selectedTab: "room" | "my";
  onTabChange: (nextValue: "room" | "my") => void;
  canViewMySchedule: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: ScheduleFilters;
  onFiltersChange: (nextFilters: ScheduleFilters) => void;
  availableRooms: string[];
};

// Tabs above the schedule (Room / My)
export type ScheduleTabsProps = {
  value: "room" | "my";
  onChange: (nextValue: "room" | "my") => void;
  isAuthenticated: boolean;
};

// Filter pill rows
export type ScheduleFilters = {
  room: string | null;
  day: "this-week" | "today" | "tomorrow" | null;
  startDate: Date | null;
  endDate: Date | null;
};

// Filter component props
export type ScheduleFilterProps = {
  filters: ScheduleFilters;
  onFiltersChange: (nextFilters: ScheduleFilters) => void;
  rooms: string[];
};

export type TabValue = "room" | "my";

// Raw booking directly from backend
export type RawBooking = {
  booking_id?: string;
  room_id?: string;
  user_id?: string; 
  created_by?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  course_id?: string;
  course_name?: string;
  notes?: string;
};

// Search input props
export type SearchProps = {
  value: string;
  onChange: (value: string) => void;
};

// Response shape for /schedule
export type ApiRoomSchedule = {
  room: string;
  from: string;
  to: string;
  booking: RawBooking[];
};

// * * * Pagination * * * //
export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
};

export type PageItem = number | "dots";
