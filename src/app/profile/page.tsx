import { PrivateRoute } from "@/helpers/PrivateRoute";
import Profile from "@/components/Profile";

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  );
}

