import { PrivateRoute } from "@/helpers/PrivateRoute";
import ManagerDashboard from "@/components/ManagerDashboard";

export default function ManagerPage() {
  return (
    <PrivateRoute roles={["manager", "admin"]}>
      <ManagerDashboard />
    </PrivateRoute>
  );
}

