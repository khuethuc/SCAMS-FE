import PublicRoute from "@/components/PublicRoute";
import Register from "@/features/authentication/Register";

export default function RegisterPage() {
  return (
    <PublicRoute>
      <Register />
    </PublicRoute>
  );
}
