"use client";

import { TDlc, TEvolutionElement, TEvolutionItem } from "@/data/types";
import { track } from "@/lib/track";
import { activeWire, encodeDlc, encodePassive, encodeWeapon } from "@/lib/wire";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

const DEFAULT_DLC: TDlc = "base";

export interface EvolutionControlsState {
  sortByPassive: boolean;
  selectedDlcs: TDlc[];
  selectedPassives: string[];
  selectedWeapons: string[];
}

export const createInitialEvolutionControlsState = (): EvolutionControlsState => ({
  sortByPassive: false,
  selectedDlcs: ["base", "lotm", "todf", "em", "og", "otc", "ed", "ante"],
  selectedPassives: [],
  selectedWeapons: [],
});

type CollapsibleState = Record<string, boolean>;

interface AppState {
  evolutionControls: EvolutionControlsState;
  collapsibleState: CollapsibleState;
  passivesShowDerivedRecipes: boolean;
  setPassivesShowDerivedRecipes: (value: boolean) => void;
  togglePassivesShowDerivedRecipes: () => void;
  weaponsShowDerivedRecipes: boolean;
  setWeaponsShowDerivedRecipes: (value: boolean) => void;
  toggleWeaponsShowDerivedRecipes: () => void;
  setCollapsibleState: (key: string, value: boolean) => void;
  toggleCollapsibleState: (key: string) => void;
  setEvolutionControls: (updater: (prev: EvolutionControlsState) => EvolutionControlsState) => void;
  toggleEvolutionDlc: (dlc: TDlc) => void;
  toggleEvolutionPassive: (passiveName: string) => void;
  resetEvolutionPassives: () => void;
  toggleEvolutionWeapon: (weaponName: string) => void;
  resetEvolutionWeapons: () => void;
  toggleEvolutionSortByPassive: () => void;
  recipeDrawerElements: TEvolutionItem[];
  isRecipeDrawerOpen: boolean;
  isRecipeDrawerEnabled: boolean;
  openRecipeDrawer: (elements: TEvolutionElement[]) => void;
  closeRecipeDrawer: () => void;
  setRecipeDrawerEnabled: (enabled: boolean) => void;
}

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const storage = createJSONStorage(() =>
  typeof window !== "undefined" ? window.localStorage : memoryStorage
);

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      evolutionControls: createInitialEvolutionControlsState(),
      collapsibleState: {},
      passivesShowDerivedRecipes: true,
      recipeDrawerElements: [],
      isRecipeDrawerOpen: false,
      isRecipeDrawerEnabled: true,
      setPassivesShowDerivedRecipes: (value) => set(() => ({ passivesShowDerivedRecipes: value })),
      togglePassivesShowDerivedRecipes: () =>
        set((state) => ({
          passivesShowDerivedRecipes: !state.passivesShowDerivedRecipes,
        })),
      weaponsShowDerivedRecipes: true,
      setWeaponsShowDerivedRecipes: (value) => set(() => ({ weaponsShowDerivedRecipes: value })),
      toggleWeaponsShowDerivedRecipes: () =>
        set((state) => ({
          weaponsShowDerivedRecipes: !state.weaponsShowDerivedRecipes,
        })),
      setCollapsibleState: (key, value) =>
        set((state) => ({
          collapsibleState: { ...state.collapsibleState, [key]: value },
        })),
      toggleCollapsibleState: (key) =>
        set((state) => {
          const current = state.collapsibleState[key] ?? false;
          return {
            collapsibleState: {
              ...state.collapsibleState,
              [key]: !current,
            },
          };
        }),
      setEvolutionControls: (updater) =>
        set((state) => ({
          evolutionControls: updater(state.evolutionControls),
        })),
      toggleEvolutionDlc: (dlc) =>
        set((state) => {
          const c = state.evolutionControls;
          const dlcId = encodeDlc(dlc);
          if (dlcId) {
            track({
              a: c.selectedDlcs.includes(dlc) ? "off" : "on",
              i: dlcId,
              c: activeWire(c),
            });
          }
          const next = new Set(state.evolutionControls.selectedDlcs);
          if (next.has(dlc)) {
            next.delete(dlc);
            if (next.size === 0) {
              next.add(DEFAULT_DLC);
            }
          } else {
            next.add(dlc);
          }

          return {
            evolutionControls: {
              ...state.evolutionControls,
              selectedDlcs: Array.from(next),
            },
          };
        }),
      toggleEvolutionPassive: (passiveName) =>
        set((state) => {
          const c = state.evolutionControls;
          const passiveId = encodePassive(passiveName);
          if (passiveId) {
            track({
              a: c.selectedPassives.includes(passiveName) ? "off" : "on",
              i: passiveId,
              c: activeWire(c),
            });
          }
          const current = new Set(state.evolutionControls.selectedPassives);
          if (current.has(passiveName)) {
            current.delete(passiveName);
          } else {
            current.add(passiveName);
          }

          return {
            evolutionControls: {
              ...state.evolutionControls,
              selectedPassives: Array.from(current),
            },
          };
        }),
      resetEvolutionPassives: () =>
        set((state) => ({
          evolutionControls: {
            ...state.evolutionControls,
            selectedPassives: [],
          },
        })),
      toggleEvolutionWeapon: (weaponName) =>
        set((state) => {
          const c = state.evolutionControls;
          const weaponId = encodeWeapon(weaponName);
          if (weaponId) {
            track({
              a: c.selectedWeapons.includes(weaponName) ? "off" : "on",
              i: weaponId,
              c: activeWire(c),
            });
          }
          const current = new Set(state.evolutionControls.selectedWeapons);
          if (current.has(weaponName)) {
            current.delete(weaponName);
          } else {
            current.add(weaponName);
          }

          return {
            evolutionControls: {
              ...state.evolutionControls,
              selectedWeapons: Array.from(current),
            },
          };
        }),
      resetEvolutionWeapons: () =>
        set((state) => ({
          evolutionControls: {
            ...state.evolutionControls,
            selectedWeapons: [],
          },
        })),
      toggleEvolutionSortByPassive: () =>
        set((state) => ({
          evolutionControls: {
            ...state.evolutionControls,
            sortByPassive: !state.evolutionControls.sortByPassive,
          },
        })),
      openRecipeDrawer: (elements) =>
        set((state) => {
          if (!state.isRecipeDrawerEnabled) {
            return {} as AppState;
          }
          return {
            recipeDrawerElements: elements.filter((element): element is TEvolutionItem => {
              if (typeof element === "string") {
                return false;
              }
              return element.item.type !== "misc";
            }),
            isRecipeDrawerOpen: true,
          };
        }),
      closeRecipeDrawer: () =>
        set(() => ({
          isRecipeDrawerOpen: false,
        })),
      setRecipeDrawerEnabled: (enabled) =>
        set((state) => ({
          isRecipeDrawerEnabled: enabled,
          isRecipeDrawerOpen: enabled ? state.isRecipeDrawerOpen : false,
        })),
    }),
    {
      name: "app-store",
      storage,
      partialize: (state) => ({
        evolutionControls: state.evolutionControls,
        collapsibleState: state.collapsibleState,
        passivesShowDerivedRecipes: state.passivesShowDerivedRecipes,
        weaponsShowDerivedRecipes: state.weaponsShowDerivedRecipes,
      }),
    }
  )
);
