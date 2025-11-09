import { PrivateRoute } from "@/helpers/PrivateRoute";
import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  return (
    <PrivateRoute roles={["admin"]}>
      <AdminDashboard />
    </PrivateRoute>
  );
}

