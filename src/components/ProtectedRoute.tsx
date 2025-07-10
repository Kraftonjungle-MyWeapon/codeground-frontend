import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getCookie } from "@/lib/utils";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useUser();
  const token = getCookie("access_token");

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner component
  }

  if (!token || !user) {
    // User is not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;