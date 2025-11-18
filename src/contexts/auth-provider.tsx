"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, clearUserSession, getRedirectPath, type User } from "@/lib/auth";
import { useAuthStore } from "@/lib/store";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, setUser, setToken, logout: storeLogout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from storage
    const initAuth = () => {
      try {
        const storedUser = getCurrentUser();
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (storedUser && token) {
          setUser(storedUser);
          setToken(token);
          
          // Set cookies for middleware
          document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
          document.cookie = `userRole=${storedUser.role}; path=/; max-age=86400; SameSite=Lax`;
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearUserSession();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [setUser, setToken]);

  const login = (token: string, userData: User) => {
    // Store in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    // Set cookies for middleware
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `userRole=${userData.role}; path=/; max-age=86400; SameSite=Lax`;

    // Update store
    setUser(userData);
    setToken(token);

    // Redirect to appropriate dashboard
    const redirectPath = getRedirectPath(userData.role);
    router.push(redirectPath);
  };

  const logout = () => {
    // Clear storage
    clearUserSession();

    // Clear cookies
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Clear store
    storeLogout();

    // Redirect to login
    router.push("/login");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin: user?.role === "admin",
    isStudent: user?.role === "student",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
