import React from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "./context/AdminContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}