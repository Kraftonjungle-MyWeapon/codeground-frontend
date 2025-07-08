import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>; // 또는 CyberLoadingSpinner 같은 컴포넌트 써도 됨
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
