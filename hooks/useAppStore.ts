'use client';

import { TDlc } from "@/data/types";
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  StateStorage,
} from "zustand/middleware";

const DEFAULT_DLC: TDlc = "base";

export interface EvolutionControlsState {
  sortByPassive: boolean;
  selectedDlcs: TDlc[];
  selectedPassives: string[];
  selectedWeapons: string[];
}

export const createInitialEvolutionControlsState =
  (): EvolutionControlsState => ({
    sortByPassive: false,
    selectedDlcs: ["base", "lotm", "todf", "em", "og", "otc", "ed", "ante"],
    selectedPassives: [],
    selectedWeapons: [],
  });

type CollapsibleState = Record<string, boolean>;

interface AppState {
  evolutionControls: EvolutionControlsState;
  collapsibleState: CollapsibleState;
  passivesShowUnions: boolean;
  setPassivesShowUnions: (value: boolean) => void;
  togglePassivesShowUnions: () => void;
  weaponsShowUnions: boolean;
  setWeaponsShowUnions: (value: boolean) => void;
  toggleWeaponsShowUnions: () => void;
  setCollapsibleState: (key: string, value: boolean) => void;
  toggleCollapsibleState: (key: string) => void;
  setEvolutionControls: (
    updater: (prev: EvolutionControlsState) => EvolutionControlsState
  ) => void;
  toggleEvolutionDlc: (dlc: TDlc) => void;
  toggleEvolutionPassive: (passiveName: string) => void;
  resetEvolutionPassives: () => void;
  toggleEvolutionWeapon: (weaponName: string) => void;
  resetEvolutionWeapons: () => void;
  toggleEvolutionSortByPassive: () => void;
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
      passivesShowUnions: false,
      setPassivesShowUnions: (value) =>
        set(() => ({ passivesShowUnions: value })),
      togglePassivesShowUnions: () =>
        set((state) => ({ passivesShowUnions: !state.passivesShowUnions })),
      weaponsShowUnions: false,
      setWeaponsShowUnions: (value) =>
        set(() => ({ weaponsShowUnions: value })),
      toggleWeaponsShowUnions: () =>
        set((state) => ({ weaponsShowUnions: !state.weaponsShowUnions })),
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
    }),
    {
      name: "app-store",
      storage,
      partialize: (state) => ({
        evolutionControls: state.evolutionControls,
        collapsibleState: state.collapsibleState,
        passivesShowUnions: state.passivesShowUnions,
        weaponsShowUnions: state.weaponsShowUnions,
      }),
    }
  )
);
