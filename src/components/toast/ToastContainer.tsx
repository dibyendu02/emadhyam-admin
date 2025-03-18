import React, { useState } from "react";
import Toast from "./Toast";

export interface ToastData {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
    duration: number = 3000
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
  };
};

interface ToastContainerProps {
  toasts: ToastData[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  removeToast,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
