/**
 * Persisted chart preferences. Reads and writes the exact localStorage shape the
 * previous zustand `persist` store used (`{"state": {...}, "version": N}` under
 * "app-store"), so returning visitors keep their filters across the rewrite.
 */

const STORAGE_KEY = "app-store";

/**
 * Bump whenever a new DLC ships and add a migration below: a returning
 * visitor's saved selectedDlcs predates the new key, so without a migration the
 * DLC would land switched off for everyone who has used the site before.
 */
export const STORE_VERSION = 1;

const MIGRATIONS: Record<number, (state: TPersisted) => TPersisted> = {
  1: (state) => addDlc(state, "lotbm"),
};

export type TEvolutionControls = {
  sortByPassive: boolean;
  selectedDlcs: string[];
  selectedPassives: string[];
  selectedWeapons: string[];
};

export type TPersisted = {
  evolutionControls: TEvolutionControls;
  /** `collapsible-<Title>-open` -> open. Missing keys use the section default. */
  collapsibleState: Record<string, boolean>;
  passivesShowDerivedRecipes: boolean;
  weaponsShowDerivedRecipes: boolean;
  showPassivesLoadout: boolean;
};

function addDlc(state: TPersisted, dlc: string): TPersisted {
  const dlcs = new Set(state.evolutionControls.selectedDlcs);
  dlcs.add(dlc);
  return {
    ...state,
    evolutionControls: { ...state.evolutionControls, selectedDlcs: Array.from(dlcs) },
  };
}

export function defaultState(allDlcs: string[]): TPersisted {
  return {
    evolutionControls: {
      sortByPassive: false,
      selectedDlcs: [...allDlcs],
      selectedPassives: [],
      selectedWeapons: [],
    },
    collapsibleState: {},
    passivesShowDerivedRecipes: true,
    weaponsShowDerivedRecipes: true,
    showPassivesLoadout: true,
  };
}

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === "string");

/** Merge whatever was stored over the defaults, field by field. */
function merge(defaults: TPersisted, stored: Partial<TPersisted>): TPersisted {
  const c = (stored.evolutionControls ?? {}) as Partial<TEvolutionControls>;
  const d = defaults.evolutionControls;
  const bool = (v: unknown, fallback: boolean) => (typeof v === "boolean" ? v : fallback);
  return {
    evolutionControls: {
      sortByPassive: bool(c.sortByPassive, d.sortByPassive),
      selectedDlcs: isStringArray(c.selectedDlcs) ? c.selectedDlcs : d.selectedDlcs,
      selectedPassives: isStringArray(c.selectedPassives) ? c.selectedPassives : d.selectedPassives,
      selectedWeapons: isStringArray(c.selectedWeapons) ? c.selectedWeapons : d.selectedWeapons,
    },
    collapsibleState:
      stored.collapsibleState && typeof stored.collapsibleState === "object"
        ? stored.collapsibleState
        : {},
    passivesShowDerivedRecipes: bool(
      stored.passivesShowDerivedRecipes,
      defaults.passivesShowDerivedRecipes
    ),
    weaponsShowDerivedRecipes: bool(
      stored.weaponsShowDerivedRecipes,
      defaults.weaponsShowDerivedRecipes
    ),
    showPassivesLoadout: bool(stored.showPassivesLoadout, defaults.showPassivesLoadout),
  };
}

export function loadState(allDlcs: string[]): TPersisted {
  const defaults = defaultState(allDlcs);
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return defaults;
  }
  if (!raw) return defaults;

  try {
    const parsed = JSON.parse(raw) as { state?: Partial<TPersisted>; version?: unknown };
    let state = merge(defaults, parsed.state ?? {});
    // State written before versioning existed has no number, so floor it to 0.
    const from = typeof parsed.version === "number" ? parsed.version : 0;
    for (let v = from + 1; v <= STORE_VERSION; v++) {
      state = MIGRATIONS[v]?.(state) ?? state;
    }
    if (from < STORE_VERSION) saveState(state);
    return state;
  } catch {
    return defaults;
  }
}

export function saveState(state: TPersisted): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, version: STORE_VERSION }));
  } catch {
    // Storage full or blocked: preferences just won't persist.
  }
}
