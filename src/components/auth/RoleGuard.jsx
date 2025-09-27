import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function RoleGuard({ allow = [], children }) {
  const { role, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) return null; // or spinner
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  if (allow.length > 0 && !allow.includes(role)) return <Navigate to="/" replace />;
  return children;
}
