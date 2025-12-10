// * * * Layout * * * //
export type MainLayoutProps = {
  children: React.ReactNode;
};

export interface HeaderProps {
  currentPage?: "login" | "register";
  isAuthenticated?: boolean;
  user?: { name: string; email: string };
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
  room: string,
  date: string,
  startTime: string,
  endTime: string,
  courseName: string,
  notes: string,
}

export interface UpdateBookingProps {
  existingBooking?: BookingInfo;
  onBookingUpdate?: (
    BookingInfo: BookingInfo
   ) => void;
}

export interface BookingCardProps {
  courseName: string;
  courseCode: string;
  typeLabel?: string;
  weekday: string;
  startTime: string;
  endTime: string;
  room: string;
  lecturer: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface ScheduleProps {
  items: BookingCardProps[];
  pageSize?: number;
}

// * * * Pagination * * * //
export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
};

export type PageItem = number | "dots";
