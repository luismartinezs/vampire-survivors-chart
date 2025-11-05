'use client';

import { useCallback, useMemo } from "react";
import { useAppStore } from "@/hooks/useAppStore";

export function useCollapsible(key: string, defaultOpen = false) {
  const storedValue = useAppStore(
    useCallback((state) => state.collapsibleState[key], [key])
  );
  const setCollapsibleState = useAppStore(
    (state) => state.setCollapsibleState
  );
  const toggleCollapsibleState = useAppStore(
    (state) => state.toggleCollapsibleState
  );

  const isOpen = useMemo(() => {
    return storedValue === undefined ? defaultOpen : storedValue;
  }, [storedValue, defaultOpen]);

  const setIsOpen = useCallback(
    (value: boolean) => {
      setCollapsibleState(key, value);
    },
    [setCollapsibleState, key]
  );

  const toggle = useCallback(() => {
    toggleCollapsibleState(key);
  }, [toggleCollapsibleState, key]);

  return {
    isOpen,
    setIsOpen,
    toggle,
  };
}
