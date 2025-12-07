import ProtectedRoute from "@/components/ProtectedRoute";
import BookRoom from "@/features/room_service/BookRoom";

export default function BookRoomPage() {
  return (
    <ProtectedRoute>
      <BookRoom />
    </ProtectedRoute>
  );
}
