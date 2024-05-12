"use client";

// components/ProtectedRoute.tsx

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const isValidSessionToken = (token: string | null): boolean => {
  // Example implementation: Check if the token exists and is not empty
  return !!token;
};

const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName.trim() === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = () => {
      // Check if a cookie named 'session_token' exists
      const sessionToken = getCookie("accessToken");
      const token = localStorage.getItem("onboardingCurrentStep");

      // Check if the session token is valid
      const isAuthenticated = isValidSessionToken(sessionToken) || !!token;

      return isAuthenticated;
    };

    const isAuthenticated = checkAuthentication();

    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, []);

  return <>{children}</>;
};

export default ProtectedRoute;
