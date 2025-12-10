import Login from "@/features/authentication/Login";
import PublicRoute from "@/components/PublicRoute";

export default function LoginPage() {
  return (
    <PublicRoute>
      <Login />
    </PublicRoute>
  );
}
