import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

let idCounter = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((opts) => {
    const id = idCounter++;
    const t = {
      id,
      title: opts?.title || "",
      description: opts?.description || "",
      variant: opts?.variant || "default", // default | success | error | warning
      duration: typeof opts?.duration === "number" ? opts.duration : 4000,
    };
    setToasts((prev) => [...prev, t]);
    if (t.duration > 0) {
      setTimeout(() => dismiss(id), t.duration);
    }
    return id;
  }, [dismiss]);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

export function Toaster({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      {toasts?.map((t) => (
        <div
          key={t.id}
          className={[
            "pointer-events-auto overflow-hidden rounded-md border shadow-lg bg-white text-gray-900",
            "border-gray-200",
          ].join(" ")}
          role="status"
        >
          <div className="p-3">
            {t.title ? <div className="font-semibold text-sm">{t.title}</div> : null}
            {t.description ? (
              <div className="text-sm text-gray-600 mt-0.5">{t.description}</div>
            ) : null}
          </div>
          <div className="flex items-center justify-end gap-2 px-3 pb-3">
            <button
              onClick={() => onDismiss(t.id)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
            >
              Dismiss
            </button>
          </div>
          <div
            className={[
              "h-1 w-full",
              t.variant === "success" ? "bg-green-500" :
              t.variant === "error" ? "bg-red-500" :
              t.variant === "warning" ? "bg-yellow-500" : "bg-sky-500",
            ].join(" ")}
          />
        </div>
      ))}
    </div>
  );
}
