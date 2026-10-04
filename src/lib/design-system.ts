import { useState, useEffect, useCallback } from "react";

export type DesignSystemMode = "default" | "mobbin";

const STORAGE_KEY = "avaliatap-design-system";

export function getStoredDesignSystem(): DesignSystemMode {
  if (typeof window === "undefined") return "default";
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val === "mobbin" ? "mobbin" : "default";
  } catch {
    return "default";
  }
}

export function applyDesignSystemClass(mode: DesignSystemMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (mode === "mobbin") {
    root.classList.add("mobbin-theme");
  } else {
    root.classList.remove("mobbin-theme");
  }
}

export function useDesignSystem() {
  const [mode, setModeState] = useState<DesignSystemMode>(() => getStoredDesignSystem());

  useEffect(() => {
    const current = getStoredDesignSystem();
    setModeState(current);
    applyDesignSystemClass(current);

    const handleUpdate = () => {
      const updated = getStoredDesignSystem();
      setModeState(updated);
      applyDesignSystemClass(updated);
    };

    window.addEventListener("avaliatap-design-system-update", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("avaliatap-design-system-update", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const setMode = useCallback((next: DesignSystemMode) => {
    setModeState(next);
    applyDesignSystemClass(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new CustomEvent("avaliatap-design-system-update"));
    }
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === "mobbin" ? "default" : "mobbin");
  }, [mode, setMode]);

  return {
    mode,
    isMobbin: mode === "mobbin",
    setMode,
    toggleMode,
  };
}
