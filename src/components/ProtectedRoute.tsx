import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>; // or CyberLoadingSpinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
