import { PrivateRoute } from "@/helpers/PrivateRoute";
import EmployeeDashboard from "@/components/EmployeeDashboard";

export default function SecuredPageRoute() {
  return (
    <PrivateRoute>
      <EmployeeDashboard />
    </PrivateRoute>
  );
}

