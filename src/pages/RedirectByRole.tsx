import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const RedirectByRole = () => {
  const { userRole, loading } = useAuth();

  if (loading) return null;

  if (userRole === "admin") return <Navigate to="/admin" replace />;
  if (userRole === "company") return <Navigate to="/dashboard" replace />;

  return <Navigate to="/auth" replace />;
};

export default RedirectByRole;
