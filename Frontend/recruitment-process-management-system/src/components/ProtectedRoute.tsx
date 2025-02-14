// components/ProtectedRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../auth";

const ProtectedRoute = () => {
  const isAuth = isAuthenticated();

  // If user is not authenticated, redirect to login page
  if (!isAuth) {
    return <Navigate to="/auth/signin" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;