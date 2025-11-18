import { useEffect, useState } from "react";
import { getCurrentUser, isLoggedIn } from "@/lib/auth";
import { useAuthStore } from "@/lib/store";

/**
 * Hook to get current authenticated user
 */
export function useAuth() {
  const { user, setUser, setToken, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage
    if (typeof window !== "undefined") {
      const storedUser = getCurrentUser();
      const token = localStorage.getItem("token");
      
      if (storedUser && token) {
        setUser(storedUser);
        setToken(token);
      }
      
      setIsLoading(false);
    }
  }, [setUser, setToken]);

  return {
    user,
    isAuthenticated: isLoggedIn(),
    isAdmin: user?.role === "admin",
    isStudent: user?.role === "student",
    isLoading,
    logout,
  };
}
