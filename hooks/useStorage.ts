import { useState, useEffect } from 'react';

type StorageType = 'local' | 'session';

export function useStorage<T>(
  key: string,
  initialValue: T,
  storageType: StorageType = 'local'
): [T, (value: T | ((prev: T) => T)) => void] {
  // Get storage object based on type
  const storage = storageType === 'local' ? localStorage : sessionStorage;

  // Initialize state from storage or initial value
  const [value, setValue] = useState<T>(() => {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${key} from ${storageType} storage:`, error);
      return initialValue;
    }
  });

  // Update storage whenever value changes
  useEffect(() => {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to ${storageType} storage:`, error);
    }
  }, [key, value, storage]);

  return [value, setValue];
}