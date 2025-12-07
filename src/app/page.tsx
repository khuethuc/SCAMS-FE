import Login from "@/features/authentication/Login";
import PublicRoute from "@/components/PublicRoute";

export default function Home() {
  return (
    <PublicRoute>
      <Login />
    </PublicRoute>
  );
}
