import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentsApi, usersApi, requestsApi, authApi } from "@/lib/api";
import type { User } from "@/types";

// ===========================
// Query Keys
// ===========================
export const queryKeys = {
  // Documents
  documents: ["documents"] as const,
  documentsList: (params?: Record<string, unknown>) => ["documents", "list", params] as const,
  myDocuments: (params?: Record<string, unknown>) => ["documents", "my", params] as const,
  document: (id: string) => ["documents", id] as const,

  // Users
  users: ["users"] as const,
  usersList: (params?: Record<string, unknown>) => ["users", "list", params] as const,
  user: (id: string) => ["users", id] as const,
  currentUser: ["users", "me"] as const,

  // Requests
  requests: ["requests"] as const,
  requestsList: (params?: Record<string, unknown>) => ["requests", "list", params] as const,
  myRequests: (params?: Record<string, unknown>) => ["requests", "my", params] as const,
  request: (id: string) => ["requests", id] as const,
};

// ===========================
// Auth Hooks
// ===========================
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: () => authApi.getMe(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authApi.updatePassword(data),
  });
}

// ===========================
// Documents Hooks
// ===========================
export function useDocuments(params?: { status?: string; search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.documentsList(params),
    queryFn: () => documentsApi.getAllDocuments(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useMyDocuments(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.myDocuments(params),
    queryFn: () => documentsApi.getMyDocuments(params),
    staleTime: 1 * 60 * 1000,
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: queryKeys.document(id),
    queryFn: () => documentsApi.getDocument(id),
    enabled: !!id,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, onProgress }: { formData: FormData; onProgress?: (progress: number) => void }) =>
      documentsApi.uploadDocument(formData, onProgress),
    onSuccess: () => {
      // Invalidate documents queries
      queryClient.invalidateQueries({ queryKey: queryKeys.documents });
      queryClient.invalidateQueries({ queryKey: queryKeys.myDocuments() });
    },
  });
}

export function useVerifyDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks?: string }) =>
      documentsApi.verifyDocument(id, remarks ? { remarks } : undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents });
    },
  });
}

export function useRejectDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      documentsApi.rejectDocument(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentsApi.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents });
      queryClient.invalidateQueries({ queryKey: queryKeys.myDocuments() });
    },
  });
}

// ===========================
// Users Hooks
// ===========================
export function useUsers(params?: { search?: string; role?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.usersList(params),
    queryFn: () => usersApi.getAllUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => usersApi.getUser(id),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usersApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => usersApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
  });
}

// ===========================
// Requests Hooks
// ===========================
export function useRequests(params?: { status?: string; search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.requestsList(params),
    queryFn: () => requestsApi.getAllRequests(params),
    staleTime: 1 * 60 * 1000,
  });
}

export function useMyRequests(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.myRequests(params),
    queryFn: () => requestsApi.getMyRequests(params),
    staleTime: 1 * 60 * 1000,
  });
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: queryKeys.request(id),
    queryFn: () => requestsApi.getRequest(id),
    enabled: !!id,
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { type: string; description: string; documentId?: string }) =>
      requestsApi.createRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests });
      queryClient.invalidateQueries({ queryKey: queryKeys.myRequests() });
    },
  });
}

export function useApproveRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks?: string }) =>
      requestsApi.approveRequest(id, remarks ? { remarks } : undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests });
    },
  });
}

export function useRejectRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      requestsApi.rejectRequest(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests });
    },
  });
}

export function useCompleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks?: string }) =>
      requestsApi.completeRequest(id, remarks ? { remarks } : undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests });
    },
  });
}

export function useDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => requestsApi.deleteRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests });
      queryClient.invalidateQueries({ queryKey: queryKeys.myRequests() });
    },
  });
}
