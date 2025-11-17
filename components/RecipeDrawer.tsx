"use client";

import { Item } from "./Item";
import { useAppStore } from "@/hooks/useAppStore";
import { cn } from "@/lib/utils";
import { getWikiHref } from "@/lib/wiki";
import { X } from "lucide-react";

export function RecipeDrawer() {
  const {
    recipeDrawerElements,
    isRecipeDrawerOpen,
    closeRecipeDrawer,
    isRecipeDrawerEnabled,
  } = useAppStore((state) => ({
    recipeDrawerElements: state.recipeDrawerElements,
    isRecipeDrawerOpen: state.isRecipeDrawerOpen,
    closeRecipeDrawer: state.closeRecipeDrawer,
    isRecipeDrawerEnabled: state.isRecipeDrawerEnabled,
  }));

  if (!isRecipeDrawerEnabled || recipeDrawerElements.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-0 sm:bottom-4 sm:px-4">
      <div
        className={cn(
          "relative w-full max-w-3xl rounded-none bg-primary-800/60 text-slate-50 shadow-2xl backdrop-blur",
          "sm:rounded-xl sm:border sm:border-white/50",
          "sm:w-auto sm:max-w-fit sm:min-w-[18rem]",
          "px-3 py-3 sm:px-4",
          "transition-all duration-200",
          isRecipeDrawerOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        )}
        aria-hidden={!isRecipeDrawerOpen}
        role="dialog"
      >
        <button
          type="button"
          onClick={closeRecipeDrawer}
          className="absolute right-4 top-3 inline-flex size-7 items-center justify-center rounded-full border border-white/20 text-xs font-semibold text-white transition hover:bg-white/10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white/60"
          aria-label="Close recipe drawer"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
        <div className="max-h-40 overflow-y-auto pr-4 pt-1 sm:pr-14">
          <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
            {recipeDrawerElements.map(({ item }, index) => {
              const href = getWikiHref(item.wikiPath);

              return (
                <li
                  key={`${item.name}-${index}`}
                  className="flex items-center gap-2 whitespace-nowrap sm:gap-3"
                >
                  <Item item={item} size="xs" className="sm:size-7" />
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm font-medium text-slate-50 underline-offset-2 hover:underline"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-slate-200">
                      {item.name}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
