export type MainLayoutProps = {
  children: React.ReactNode;
};

export interface HeaderProps {
  currentPage?: "login" | "register";
  isAuthenticated?: boolean;
  user?: { name: string; email: string };
  onLogout?: () => void;
}

export interface LoginProps {
  onLogin?: (email: string, password: string) => void;
  onSwitchToRegister?: () => void;
}

export interface RegisterProps {
  onRegister?: (name: string, email: string, password: string) => void;
  onSwitchToLogin?: () => void;
}

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
