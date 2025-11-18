/**
 * Common API Response
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Pagination Info
 */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

/**
 * User roles
 */
export type UserRole = "admin" | "student";

/**
 * Document status
 */
export type DocumentStatus = "pending" | "verified" | "rejected";

/**
 * Request status
 */
export type RequestStatus = "pending" | "approved" | "rejected" | "in-progress";

/**
 * Document type
 */
export interface Document {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  enrollmentNumber?: string;
  title: string;
  description?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  status: DocumentStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request type
 */
export interface Request {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  enrollmentNumber?: string;
  requestType: string;
  description: string;
  status: RequestStatus;
  documents?: string[];
  response?: string;
  handledBy?: string;
  handledAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User type
 */
export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  enrollmentNumber?: string;
  course?: string;
  year?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Notification type
 */
export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  link?: string;
  createdAt: string;
}

/**
 * Statistics type
 */
export interface Statistics {
  totalDocuments: number;
  pendingDocuments: number;
  verifiedDocuments: number;
  rejectedDocuments: number;
  totalUsers: number;
  totalStudents: number;
  totalRequests: number;
  pendingRequests: number;
}

/**
 * Form field error type
 */
export interface FormError {
  field: string;
  message: string;
}

/**
 * File upload progress
 */
export interface UploadProgress {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}
