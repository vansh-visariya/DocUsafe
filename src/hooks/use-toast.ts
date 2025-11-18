import { useState, useCallback } from "react";

/**
 * Hook for managing toast notifications
 */
export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: "success" | "error" | "info" | "warning";
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({ title, description, type = "info" }: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, title, description, type };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);

      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toasts,
    toast,
    dismiss,
    success: (title: string, description?: string) => toast({ title, description, type: "success" }),
    error: (title: string, description?: string) => toast({ title, description, type: "error" }),
    info: (title: string, description?: string) => toast({ title, description, type: "info" }),
    warning: (title: string, description?: string) => toast({ title, description, type: "warning" }),
  };
}
