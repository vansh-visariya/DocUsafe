import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

// API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const API_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000;

/**
 * Create axios instance with default config
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor - Add auth token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors globally
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      // Clear auth data
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/**
 * Generic GET request
 */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

/**
 * Generic POST request
 */
export async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

/**
 * Generic PUT request
 */
export async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
}

/**
 * Generic PATCH request
 */
export async function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
}

/**
 * Generic DELETE request
 */
export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}

/**
 * Upload file with progress tracking
 */
export async function uploadFile<T>(
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<T> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<T>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  return response.data;
}

/**
 * Handle API errors
 */
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || axiosError.message || "An error occurred";
  }
  return "An unexpected error occurred";
}

// ===========================
// API Endpoint Functions
// ===========================

import type { User, Document, Request, ApiResponse, PaginatedResponse } from "@/types";

// Auth API
export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    enrollmentNumber?: string;
    course?: string;
    year?: number;
  }) => post<ApiResponse<{ user: User; token: string }>>("/auth/register", data),

  login: (data: { email: string; password: string }) =>
    post<ApiResponse<{ user: User; token: string }>>("/auth/login", data),

  getMe: () => get<ApiResponse<User>>("/auth/me"),

  forgotPassword: (data: { email: string }) =>
    post<ApiResponse<{ message: string }>>("/auth/forgotpassword", data),

  resetPassword: (token: string, data: { password: string }) =>
    put<ApiResponse<{ message: string }>>(`/auth/resetpassword/${token}`, data),

  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    put<ApiResponse<{ message: string }>>("/auth/updatepassword", data),
};

// Documents API
export const documentsApi = {
  uploadDocument: (formData: FormData, onProgress?: (progress: number) => void) =>
    apiClient.post<ApiResponse<Document>>("/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress
        ? (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(progress);
            }
          }
        : undefined,
    }).then(res => res.data),

  getAllDocuments: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    get<PaginatedResponse<Document>>("/documents", { params }),

  getMyDocuments: (params?: { status?: string; page?: number; limit?: number }) =>
    get<PaginatedResponse<Document>>("/documents/my", { params }),

  getDocument: (id: string) => get<ApiResponse<Document>>(`/documents/${id}`),

  updateDocument: (id: string, data: Partial<Document>) =>
    put<ApiResponse<Document>>(`/documents/${id}`, data),

  deleteDocument: (id: string) => del<ApiResponse<void>>(`/documents/${id}`),

  verifyDocument: (id: string, data?: { remarks?: string }) =>
    put<ApiResponse<Document>>(`/documents/${id}/verify`, data),

  rejectDocument: (id: string, data: { reason: string }) =>
    put<ApiResponse<Document>>(`/documents/${id}/reject`, data),
};

// Users API
export const usersApi = {
  getAllUsers: (params?: { search?: string; role?: string; page?: number; limit?: number }) =>
    get<PaginatedResponse<User>>("/users", { params }),

  getUser: (id: string) => get<ApiResponse<User>>(`/users/${id}`),

  updateUser: (id: string, data: Partial<User>) =>
    put<ApiResponse<User>>(`/users/${id}`, data),

  deleteUser: (id: string) => del<ApiResponse<void>>(`/users/${id}`),

  updateProfile: (data: Partial<User>) =>
    put<ApiResponse<User>>("/users/profile/update", data),
};

// Requests API
export const requestsApi = {
  createRequest: (data: {
    type: string;
    description: string;
    documentId?: string;
  }) => post<ApiResponse<Request>>("/requests", data),

  getAllRequests: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    get<PaginatedResponse<Request>>("/requests", { params }),

  getMyRequests: (params?: { status?: string; page?: number; limit?: number }) =>
    get<PaginatedResponse<Request>>("/requests/my", { params }),

  getRequest: (id: string) => get<ApiResponse<Request>>(`/requests/${id}`),

  updateRequest: (id: string, data: Partial<Request>) =>
    put<ApiResponse<Request>>(`/requests/${id}`, data),

  deleteRequest: (id: string) => del<ApiResponse<void>>(`/requests/${id}`),

  approveRequest: (id: string, data?: { remarks?: string }) =>
    put<ApiResponse<Request>>(`/requests/${id}/approve`, data),

  rejectRequest: (id: string, data: { reason: string }) =>
    put<ApiResponse<Request>>(`/requests/${id}/reject`, data),

  completeRequest: (id: string, data?: { remarks?: string }) =>
    put<ApiResponse<Request>>(`/requests/${id}/complete`, data),
};

export default apiClient;
