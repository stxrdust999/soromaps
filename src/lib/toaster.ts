import { toast } from "sonner";

interface ToastProps {
  title: string;
  description?: string;
}

/**
 * Variantes de Toaster para uso global
 */
export const responseToast = {
  success: ({ title, description }: ToastProps) => {
    toast.success(title, {
      description,
    });
  },
  error: ({ title, description }: ToastProps) => {
    toast.error(title, {
      description,
    });
  },
};
