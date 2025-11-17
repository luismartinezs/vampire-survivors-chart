import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function inferWikiPath(name: string) {
  if (!name) return "";
  const underscored = name.trim().replace(/\s+/g, "_");
  return encodeURIComponent(underscored);
}

export function ensureWikiPaths<
  T extends Record<string, { name: string; wikiPath?: string }>
>(items: T, overrides: Record<string, string> = {}): T {
  return Object.fromEntries(
    Object.entries(items).map(([key, value]) => {
      const override =
        overrides[value.name] ??
        overrides[key];
      if (override || value.wikiPath) {
        return [key, { ...value, wikiPath: value.wikiPath ?? override }];
      }
      return [key, { ...value, wikiPath: inferWikiPath(value.name) }];
    })
  ) as T;
}

export function mergeIntoNestedObjects<
  TObj extends Record<string, unknown>,
  TMerge extends Record<string, unknown>,
  TValue = TObj extends Record<string, infer V> ? V : never
>(
  obj: TObj,
  toMerge: TMerge
): Record<keyof TObj, TValue & TMerge> {
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('First argument must be an object');
  }

  if (typeof toMerge !== 'object' || toMerge === null) {
    throw new Error('Second argument must be an object');
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (typeof value !== 'object' || value === null) {
        throw new Error(`Value for key "${key}" must be an object`);
      }
      return [
        key,
        { ...value, ...toMerge }
      ];
    })
  ) as Record<keyof TObj, TValue & TMerge>;
}
