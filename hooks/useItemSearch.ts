import { useMemo, useRef } from "react";
import Fuse, { type IFuseOptions } from "fuse.js";
import { items } from "@/data/items";
import { TItem } from "@/data/types";

const allItems: TItem[] = Object.values(items);

const fuseOptions: IFuseOptions<TItem> = {
  keys: ["name"],
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

export function useItemSearch(query: string): Set<string> | null {
  const fuseRef = useRef(new Fuse(allItems, fuseOptions));

  return useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return null;

    const results = fuseRef.current.search(trimmed);
    return new Set(results.map((r) => r.item.name));
  }, [query]);
}
