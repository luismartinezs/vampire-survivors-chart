/**
 * Wire-id codec for analytics. The tracker stores only compact ids (e.g. "w8",
 * "p3", "d1", "e8"); names and icons never leave the frontend. This module is
 * the single place that maps between the two, shared by the client (encoding
 * what to send) and the server-side stats fetch (decoding what came back).
 *
 * Ids are stable and name-independent: see data/ids.ts. A wiki rename changes a
 * display name but not the id, so history stays intact.
 */

import { WEAPON_IDS, PASSIVE_IDS, DLC_IDS } from "@/data/ids";
import { weapons } from "@/data/weapons";
import { passives } from "@/data/passives";
import { evolutions } from "@/data/evolutions";
import { DLC_LABELS } from "@/components/controls/constants";
import type { TDlc, TEvolutionItem } from "@/data/types";

export type TWireCategory = "weapon" | "passive" | "dlc" | "evo";

export type TWireMeta = {
  name: string;
  image?: string;
  category: TWireCategory;
};

const PREFIX: Record<TWireCategory, string> = {
  weapon: "w",
  passive: "p",
  dlc: "d",
  evo: "e",
};

// name -> wire id, for the two categories the client toggles by display name.
const weaponNameToWire = new Map<string, string>();
const passiveNameToWire = new Map<string, string>();

// wire id -> display metadata, for decoding stats responses.
const wireToMeta = new Map<string, TWireMeta>();

function indexItems(
  record: Record<string, { name: string; image?: string }>,
  ids: Record<string, number>,
  category: "weapon" | "passive",
  nameMap: Map<string, string>
) {
  for (const [key, item] of Object.entries(record)) {
    const id = ids[key];
    if (id == null) continue;
    const wire = `${PREFIX[category]}${id}`;
    nameMap.set(item.name, wire);
    wireToMeta.set(wire, { name: item.name, image: item.image, category });
  }
}

indexItems(weapons, WEAPON_IDS, "weapon", weaponNameToWire);
indexItems(passives, PASSIVE_IDS, "passive", passiveNameToWire);

for (const [dlc, id] of Object.entries(DLC_IDS)) {
  wireToMeta.set(`d${id}`, {
    name: DLC_LABELS[dlc as TDlc]?.full ?? dlc,
    category: "dlc",
  });
}

// Evolutions are labelled by their resulting item (the last element).
for (const evo of evolutions) {
  const result = [...evo.elements]
    .reverse()
    .find((el): el is TEvolutionItem => typeof el !== "string");
  if (!result) continue;
  wireToMeta.set(`e${evo.id}`, {
    name: result.item.name,
    image: result.item.image,
    category: "evo",
  });
}

/** Encode a selected weapon's display name to its wire id, if known. */
export const encodeWeapon = (name: string): string | undefined =>
  weaponNameToWire.get(name);

/** Encode a selected passive's display name to its wire id, if known. */
export const encodePassive = (name: string): string | undefined =>
  passiveNameToWire.get(name);

/** Encode a DLC key to its wire id. */
export const encodeDlc = (dlc: TDlc): string | undefined =>
  DLC_IDS[dlc] != null ? `d${DLC_IDS[dlc]}` : undefined;

/** Encode an evolution's stable numeric id to its wire id. */
export const encodeEvo = (id: number): string => `e${id}`;

/** Decode a wire id back to display metadata, if known. */
export const decodeWire = (wire: string): TWireMeta | undefined =>
  wireToMeta.get(wire);

/** Category implied by a wire id's prefix char. */
export function wireCategory(wire: string): TWireCategory | undefined {
  switch (wire[0]) {
    case "w":
      return "weapon";
    case "p":
      return "passive";
    case "d":
      return "dlc";
    case "e":
      return "evo";
    default:
      return undefined;
  }
}

/**
 * The full set of active wire ids (weapons + passives + dlcs) for a controls
 * snapshot. This is the "what else was active" context attached to each event.
 * Unknown names are dropped rather than sent as garbage.
 */
export function activeWire(c: {
  selectedWeapons: string[];
  selectedPassives: string[];
  selectedDlcs: TDlc[];
}): string[] {
  const out: string[] = [];
  for (const n of c.selectedWeapons) {
    const w = encodeWeapon(n);
    if (w) out.push(w);
  }
  for (const n of c.selectedPassives) {
    const p = encodePassive(n);
    if (p) out.push(p);
  }
  for (const d of c.selectedDlcs) {
    const dd = encodeDlc(d);
    if (dd) out.push(dd);
  }
  return out;
}
