import { weapons } from "@/data/weapons";
import { passives } from "@/data/passives";
import { evolutions } from "@/data/evolutions";
import { DLC_IDS } from "@/data/ids";
import { encodeWeapon, encodePassive, encodeEvo } from "@/lib/wire";
import {
  shapeStats,
  type TRawTotal,
  type TRawBuilds,
  type TStats,
} from "@/lib/stats";

/**
 * Deterministic mock of a Worker /stats response, run through the real
 * shapeStats() so the preview is faithful. Numbers are seeded from each wire id,
 * so the page is stable across renders (no hydration drift) and looks the same
 * every time. This is purely illustrative — it is NOT real traffic.
 */

// FNV-1a hash -> unsigned 32-bit. Stable per string.
function hash(s: string): number {
  let x = 2166136261;
  for (let i = 0; i < s.length; i++) {
    x ^= s.charCodeAt(i);
    x = Math.imul(x, 16777619);
  }
  return x >>> 0;
}
// Deterministic 0..1 from a seed string.
const frac = (s: string): number => (hash(s) % 100000) / 100000;

// Wire ids per category, drawn straight from the real data.
const DLC_WIRES = (Object.values(DLC_IDS) as number[]).map((id) => `d${id}`);
const WEAPON_WIRES = Object.values(weapons)
  .filter((w) => !w.evolved)
  .map((w) => encodeWeapon(w.name))
  .filter((x): x is string => Boolean(x));
const PASSIVE_WIRES = Object.values(passives)
  .map((p) => encodePassive(p.name))
  .filter((x): x is string => Boolean(x));
const EVO_WIRES = evolutions.map((e) => encodeEvo(e.id));

/**
 * A realistic long-tail popularity curve. Zipf-ish (1/rank^0.7) rather than a
 * steep exponential, so the head is clearly more popular but the whole tail
 * still carries meaningful, varied numbers — i.e. almost every item has data,
 * the way real traffic looks once a chart has been live a while.
 */
function genRows(events: string[], peak: number): TRawTotal[] {
  return events.map((event, i) => {
    const total = Math.max(
      3,
      Math.round((peak / Math.pow(i + 1, 0.7)) * (0.6 + frac(event) * 0.8))
    );
    const last7 = Math.max(
      1,
      Math.round(total * (0.22 + frac(event + "l") * 0.26))
    );
    // trend: ~10% brand new, otherwise prior week within ~0.55x–1.65x of this
    // week, giving trend % roughly in [-45%, +65%].
    const t = frac(event + "t");
    const prev7 = t < 0.1 ? 0 : Math.max(1, Math.round(last7 / (0.55 + t * 1.1)));
    const d_today = Math.round(last7 * (0.08 + frac(event + "d") * 0.22));
    return { event, total, d_today, d_last7: last7, d_prev7: prev7 };
  });
}

// --- builds (co-occurrence) mock -------------------------------------------

const TYPE_OPERATORS = new Set(["=", "→", "⇒"]);

/** The base input items of an evolution recipe (everything before the '='). */
function recipeInputs(evo: (typeof evolutions)[number]): string[] {
  const ids: string[] = [];
  for (const el of evo.elements) {
    if (typeof el === "string") {
      if (TYPE_OPERATORS.has(el)) break;
      continue;
    }
    const wire = encodeWeapon(el.item.name) ?? encodePassive(el.item.name);
    if (wire) ids.push(wire);
  }
  return [...new Set(ids)];
}

/** Support: how many snapshots each build piece was active in (long-tail). */
function genSupport(): Record<string, number> {
  const support: Record<string, number> = {};
  WEAPON_WIRES.forEach((w, i) => {
    support[w] = Math.max(8, Math.round((1100 / Math.pow(i + 1, 0.6)) * (0.7 + frac(w) * 0.6)));
  });
  PASSIVE_WIRES.forEach((p, i) => {
    support[p] = Math.max(8, Math.round((900 / Math.pow(i + 1, 0.6)) * (0.7 + frac(p) * 0.6)));
  });
  return support;
}

function genBuilds(): TRawBuilds {
  const support = genSupport();
  const allItems = [...WEAPON_WIRES, ...PASSIVE_WIRES];
  // Staples: the popular pieces most things get paired with.
  const staples = [...WEAPON_WIRES.slice(0, 30), ...PASSIVE_WIRES.slice(0, 18)];

  const pairMap = new Map<string, { a: string; b: string; n: number }>();
  const addPair = (x: string, y: string) => {
    if (x === y) return;
    const a = x < y ? x : y;
    const b = x < y ? y : x;
    const key = `${a}|${b}`;
    const cap = Math.min(support[a] ?? 0, support[b] ?? 0);
    const n = Math.max(2, Math.round(cap * (0.14 + frac(`${a}~${b}`) * 0.5)));
    const prev = pairMap.get(key);
    if (!prev || n > prev.n) pairMap.set(key, { a, b, n });
  };

  // Every item co-occurs with a handful of staples, so nearly all items have
  // some build data (rare items lean on the popular staples, as in real play).
  allItems.forEach((item) => {
    const count = 2 + (hash(item) % 4); // 2–5 partners
    for (let k = 0; k < count; k++) {
      addPair(item, staples[hash(`${item}:${k}`) % staples.length]);
    }
  });
  // Dense mesh among the staples themselves for strong, popular pairings.
  for (let i = 0; i < staples.length; i++) {
    for (let j = i + 1; j < staples.length; j++) {
      if (frac(`${staples[i]}#${staples[j]}`) < 0.3) continue;
      addPair(staples[i], staples[j]);
    }
  }
  const pairs = [...pairMap.values()].sort((x, y) => y.n - x.n);

  // Loadouts: real recipe inputs as 2-item synergies, plus a few merged
  // 3–4 item builds, counted by how popular their members are.
  const loadoutMap = new Map<string, { items: string[]; n: number }>();
  const recipes = evolutions
    .map(recipeInputs)
    .filter((ids) => ids.length >= 2);

  const countFor = (ids: string[]): number => {
    const minSup = Math.min(...ids.map((id) => support[id] ?? 8));
    return Math.max(4, Math.round(minSup * (0.08 + frac(ids.join()) * 0.22)));
  };
  const add = (ids: string[]) => {
    const set = [...new Set(ids)].sort();
    if (set.length < 2) return;
    const key = set.join(",");
    const n = countFor(set);
    const prev = loadoutMap.get(key);
    if (!prev || n > prev.n) loadoutMap.set(key, { items: set, n });
  };

  recipes.forEach(add);
  // Merge adjacent recipes into bigger believable builds.
  for (let i = 0; i + 1 < recipes.length; i += 2) {
    if (frac("merge" + i) < 0.5) add([...recipes[i], ...recipes[i + 1]]);
  }

  const loadouts = [...loadoutMap.values()].sort((a, b) => b.n - a.n).slice(0, 60);

  // Generous cap so the broad per-item coverage survives into the shaped data
  // (this is the preview's "fully populated" view; the live Worker caps lower).
  return { support, pairs: pairs.slice(0, 1200), loadouts };
}

export function mockStats(): TStats {
  const totals: TRawTotal[] = [
    ...genRows(DLC_WIRES, 1900),
    ...genRows(WEAPON_WIRES, 640),
    ...genRows(PASSIVE_WIRES, 520),
    ...genRows(EVO_WIRES, 300),
    // 'reset' pseudo-event: a wiped build.
    ...genRows(["reset"], 180),
  ];
  return shapeStats(totals, genBuilds());
}
