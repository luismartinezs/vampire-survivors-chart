'use client';

import { useState, useEffect } from 'react';

type StorageType = 'local' | 'session';

export function useStorage<T>(
  key: string,
  initialValue: T,
  storageType: StorageType = 'local'
): [T, (value: T | ((prev: T) => T)) => void] {
  // Always start with initialValue during SSR and initial render
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from storage after mount (client-only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storage = storageType === 'local' ? localStorage : sessionStorage;
      const item = storage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading ${key} from ${storageType} storage:`, error);
    } finally {
      setHydrated(true);
    }
  }, [key, storageType]);

  // Save to storage when value changes (but only after hydration)
  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;

    try {
      const storage = storageType === 'local' ? localStorage : sessionStorage;
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to ${storageType} storage:`, error);
    }
  }, [key, value, storageType, hydrated]);

  return [value, setValue];
}