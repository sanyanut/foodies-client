import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../store/hooks.ts";
import { openModal } from "../features/ui/modalSlice.ts";

/** Guards private routes. While the initial session check is pending we render
 *  nothing; once resolved, unauthenticated users are sent home and the Sign In
 *  modal is opened (ТЗ: guests hitting a private route get the auth prompt). */
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, bootstrapped } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (bootstrapped && !isAuthenticated) dispatch(openModal("signin"));
  }, [bootstrapped, isAuthenticated, dispatch]);

  if (!bootstrapped) return null;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};
