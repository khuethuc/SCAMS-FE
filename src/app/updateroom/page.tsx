"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import UpdateRoom from "@/features/room_service/UpdateRoom";
import { BookingInfo } from "@/type/type";

// const mockdata: BookingInfo = {
//   id: "1",
//   room: "101",
//   date: "2024-06-15",
//   startTime: "10:00",
//   endTime: "12:00",
//   courseName: "Computer Network",
//   notes: "Project discussion"
// };

export default function BookRoomPage() {
  return (
    // <ProtectedRoute>
    //   <UpdateRoom existingBooking={mockdata} onBookingUpdate={(updatedBooking) => {
    //     console.log("Updated Booking:", updatedBooking);
    //   }} />
    // </ProtectedRoute>
    <ProtectedRoute>
      <UpdateRoom />
    </ProtectedRoute>
  );
}
