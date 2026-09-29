// Wraps a page only logged-in visitors may see.
//
// The backend refuses the write anyway — this only spares the visitor a form that
// would fail on submit.

import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();

  // Redirecting here would throw out a visitor who IS logged in, just because the
  // token check has not come back yet.
  if (isLoading) return <p className="app-loading">Checking your session...</p>;

  if (!isLoggedIn) return <Navigate to="/" replace />;

  return <>{children}</>;
}

export default PrivateRoute;
