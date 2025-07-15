import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getCookie } from "@/lib/utils";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  adminOnly?: boolean; // 관리자 전용 라우트 여부
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly }) => {
  const { user, isLoading } = useUser();
  const token = getCookie("access_token");

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner component
  }

  if (!token || !user) {
    // User is not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // 관리자 전용 라우트인데 관리자가 아닌 경우
  if (adminOnly && user.role?.toLowerCase() !== 'admin') {
    // 관리자가 아니면 홈으로 리디렉션
    return <Navigate to="/home" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;