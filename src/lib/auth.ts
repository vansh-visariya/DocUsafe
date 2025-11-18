import { authApi } from "./api";
import type { User } from "@/types";

// Re-export User type for convenience
export type { User } from "@/types";

/**
 * Auth response type
 */
export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Signup data
 */
export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: "student";
  enrollmentNumber?: string;
  course?: string;
  year?: number;
}

/**
 * Store user data and token in localStorage
 */
export function setUserSession(token: string, user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

/**
 * Clear user session
 */
export function clearUserSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Get auth token
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/**
 * Check if user is logged in
 */
export function isLoggedIn(): boolean {
  return !!getToken();
}

/**
 * Check if user is admin
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "admin";
}

/**
 * Check if user is student
 */
export function isStudent(): boolean {
  const user = getCurrentUser();
  return user?.role === "student";
}

/**
 * Get redirect path based on user role
 */
export function getRedirectPath(role: string): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "student":
      return "/student/dashboard";
    default:
      return "/";
  }
}

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await authApi.login(credentials);
    if (response.success && response.data) {
      const { token, user } = response.data;
      setUserSession(token, user);
      return { success: true, token, user, message: "Login successful" };
    }
    return { success: false, message: response.message || "Login failed" };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || "Login failed. Please try again." 
    };
  }
}

/**
 * Signup user
 */
export async function signup(data: SignupData): Promise<AuthResponse> {
  try {
    const response = await authApi.register(data);
    if (response.success && response.data) {
      const { token, user } = response.data;
      setUserSession(token, user);
      return { success: true, token, user, message: "Registration successful" };
    }
    return { success: false, message: response.message || "Registration failed" };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.response?.data?.message || "Registration failed. Please try again." 
    };
  }
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  clearUserSession();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

/**
 * Verify token validity
 */
export async function verifyToken(): Promise<boolean> {
  try {
    const response = await authApi.getMe();
    return response.success;
  } catch {
    clearUserSession();
    return false;
  }
}
