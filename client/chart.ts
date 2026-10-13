/**
 * Chart page behavior. The page arrives fully rendered (every card and control
 * in its default state); this script restores the visitor's saved filters and
 * keeps the DOM in sync with them by toggling classes, `hidden`, and card order.
 */

import { filterEvolutions, type TFilterEvo } from "@/lib/filter";
import type { TClientIndex, TItemKind } from "@/lib/chart-view";
import { track, type TTrackEvent } from "@/lib/track";
import { loadState, saveState, type TPersisted } from "./store";
import { initTooltip } from "./tooltip";

type FuseCtor = typeof import("fuse.js").default;

const index: TClientIndex = JSON.parse(document.getElementById("chart-index")!.textContent!);
const itemNo = new Map(index.items.map((item, t) => [item[0], t]));
const nameOf = (t: number) => index.items[t][0];
const kindOf = (t: number): TItemKind => index.items[t][3];
const evoById = new Map<number, TFilterEvo>(index.evos.map((e) => [e.id, e]));

let state: TPersisted = loadState(index.dlcs.map((d) => d.key));
/** Not persisted, matching the previous app: the drawer is on for every visit. */
let drawerEnabled = true;
let drawerItems: number[] = [];
let drawerOpen = false;
let searchMatches: Set<number> | null = null;

// ── DOM ────────────────────────────────────────────────────────────────────
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

const evosEl = $("#evos");
const excludedEl = $("#evos-excluded");
const separatorEl = $("#excluded-sep");
const cardEls = new Map($$("#evos [data-id]").map((el) => [Number(el.dataset.id), el]));
const dlcButtons = $$("[data-dlc-toggle]");
const sortButton = $("[data-action=sort]");
const weaponButtons = $$("[data-controls=w] [data-t]");
const passiveButtons = $$("[data-controls=p] [data-t]");
const resetWeaponsButton = $("[data-action=reset-w]");
const resetPassivesButton = $("[data-action=reset-p]");
const collapsibles = $$("[data-collapsible]");
const loadoutEl = $("#loadout");
const loadoutIcons = $$("#loadout [data-t]");
const searchInput = $<HTMLInputElement>("#search");
const searchClear = $("#search-clear");
const drawerEl = $("#drawer");
const drawerPanel = $("[data-panel]", drawerEl);
const drawerList = $("[data-list]", drawerEl);
const drawerRow = $<HTMLTemplateElement>("#drawer-row");
const settingsModal = $("#settings-modal");
const settingsToggle = $("#settings-toggle");
const settingsPing = $("#settings-ping");
const settingInputs = $$<HTMLInputElement>("[data-setting]");

const COLLAPSIBLE_DEFAULT_OPEN: Record<string, boolean> = { Weapons: false, Passives: true };
const collapsibleKey = (title: string) => `collapsible-${title}-open`;

// ── State changes ──────────────────────────────────────────────────────────
function commit(next: TPersisted) {
  state = next;
  saveState(state);
  render();
}

const controls = () => state.evolutionControls;

function activeWire(): string[] {
  const c = controls();
  const out: string[] = [];
  for (const n of [...c.selectedWeapons, ...c.selectedPassives]) {
    const t = itemNo.get(n);
    const wire = t === undefined ? "" : index.items[t][4];
    if (wire) out.push(wire);
  }
  for (const dlc of c.selectedDlcs) {
    const wire = index.dlcs.find((d) => d.key === dlc)?.wire;
    if (wire) out.push(wire);
  }
  return out;
}

/** Record a toggle with what else was active just before it. */
function trackToggle(wasOn: boolean, wire: string) {
  if (!wire) return;
  const ev: TTrackEvent = { a: wasOn ? "off" : "on", i: wire, c: activeWire() };
  track(ev);
}

const toggled = (list: string[], value: string) => {
  const set = new Set(list);
  if (set.has(value)) set.delete(value);
  else set.add(value);
  return Array.from(set);
};

function toggleDlc(dlc: string) {
  const c = controls();
  trackToggle(c.selectedDlcs.includes(dlc), index.dlcs.find((d) => d.key === dlc)?.wire ?? "");
  let selectedDlcs = toggled(c.selectedDlcs, dlc);
  // At least one DLC stays on.
  if (selectedDlcs.length === 0) selectedDlcs = ["base"];
  commit({ ...state, evolutionControls: { ...c, selectedDlcs } });
}

function toggleItem(t: number) {
  const c = controls();
  const name = nameOf(t);
  const field = kindOf(t) === "p" ? "selectedPassives" : "selectedWeapons";
  trackToggle(c[field].includes(name), index.items[t][4]);
  commit({ ...state, evolutionControls: { ...c, [field]: toggled(c[field], name) } });
}

function reset(fields: ("selectedPassives" | "selectedWeapons")[]) {
  const c = { ...controls() };
  for (const field of fields) c[field] = [];
  commit({ ...state, evolutionControls: c });
}

// ── Rendering ──────────────────────────────────────────────────────────────
const setClass = (el: Element, cls: string) => {
  if (el.className !== cls) el.className = cls;
};

/**
 * Put exactly `ids` into `container`, in order, with the fewest DOM moves:
 * cards that stay put are never detached, so toggling a filter only restyles
 * the cards that actually appear or disappear.
 */
function placeCards(container: HTMLElement, ids: number[]) {
  const wanted = ids.map((id) => cardEls.get(id)!);
  const keep = new Set(wanted);
  for (const child of Array.from(container.children)) {
    if (!keep.has(child as HTMLElement)) child.remove();
  }
  let cursor = container.firstElementChild;
  for (const card of wanted) {
    if (card === cursor) {
      cursor = cursor.nextElementSibling;
    } else {
      container.insertBefore(card, cursor);
    }
  }
}

/** Selected names as item numbers; names no longer in the data are ignored. */
const toItems = (names: string[]) =>
  new Set(names.map((n) => itemNo.get(n)).filter((t): t is number => t !== undefined));

function render() {
  const c = controls();
  const selectedDlcs = new Set(c.selectedDlcs);
  const selectedPassives = toItems(c.selectedPassives);
  const selectedWeapons = toItems(c.selectedWeapons);

  const { filtered, excluded } = filterEvolutions(index, {
    selectedDlcs,
    selectedPassives,
    selectedWeapons,
    sortByPassive: c.sortByPassive,
    passivesShowDerivedRecipes: state.passivesShowDerivedRecipes,
    weaponsShowDerivedRecipes: state.weaponsShowDerivedRecipes,
  });
  const matchesSearch = (id: number) =>
    !searchMatches || evoById.get(id)!.all.some((t) => searchMatches!.has(t));
  const visible = filtered.filter(matchesSearch);
  const visibleExcluded = excluded.filter(matchesSearch);

  placeCards(evosEl, visible);
  placeCards(excludedEl, visibleExcluded);
  separatorEl.hidden = visibleExcluded.length === 0;

  for (const [i, button] of dlcButtons.entries()) {
    const dlc = index.dlcs[i];
    setClass(button, dlc.cls[selectedDlcs.has(dlc.key) ? 1 : 0]);
  }
  setClass(sortButton, index.sortCls[c.sortByPassive ? 1 : 0]);

  for (const button of weaponButtons) {
    const t = Number(button.dataset.t);
    const dlc = button.dataset.dlc as keyof TClientIndex["controlCls"];
    button.hidden = !selectedDlcs.has(dlc) || (searchMatches !== null && !searchMatches.has(t));
    setClass(button, index.controlCls[dlc][selectedWeapons.has(t) ? 1 : 0]);
  }
  for (const button of passiveButtons) {
    const t = Number(button.dataset.t);
    const dlc = button.dataset.dlc as keyof TClientIndex["controlCls"];
    button.hidden = searchMatches !== null && !searchMatches.has(t);
    setClass(button, index.controlCls[dlc][selectedPassives.has(t) ? 1 : 0]);
  }
  setClass(resetWeaponsButton, index.resetCls[c.selectedWeapons.length === 0 ? 1 : 0]);
  setClass(resetPassivesButton, index.resetCls[c.selectedPassives.length === 0 ? 1 : 0]);
  $("[data-count=w]").textContent = String(c.selectedWeapons.length);
  $("[data-count=p]").textContent = String(c.selectedPassives.length);

  for (const section of collapsibles) {
    const title = section.dataset.collapsible!;
    const open = state.collapsibleState[collapsibleKey(title)] ?? COLLAPSIBLE_DEFAULT_OPEN[title];
    section.toggleAttribute("data-open", open);
    setClass($("[data-action=collapse]", section), index.collapsibleCls[open ? 1 : 0]);
  }

  // Mini loadout: passives present in the cards on screen, once something is selected.
  const present = new Set(visible.flatMap((id) => evoById.get(id)!.p));
  const hasSelection = c.selectedPassives.length > 0 || c.selectedWeapons.length > 0;
  loadoutEl.hidden = !state.showPassivesLoadout || !hasSelection || present.size === 0;
  if (!loadoutEl.hidden) {
    for (const icon of loadoutIcons) icon.hidden = !present.has(Number(icon.dataset.t));
  }

  renderDrawer(selectedPassives, selectedWeapons);

  for (const input of settingInputs) {
    const key = input.dataset.setting!;
    input.checked =
      key === "isRecipeDrawerEnabled" ? drawerEnabled : Boolean(state[key as keyof TPersisted]);
  }

  document.documentElement.classList.remove("restoring");
}

// ── Recipe drawer ──────────────────────────────────────────────────────────
function openDrawer(items: number[]) {
  if (!drawerEnabled) return;
  drawerItems = items.filter((t) => kindOf(t) !== "m");
  drawerOpen = true;
  buildDrawerRows();
  // Only the drawer changed; skip re-filtering the chart.
  renderDrawer(toItems(controls().selectedPassives), toItems(controls().selectedWeapons));
}

function buildDrawerRows() {
  drawerList.replaceChildren(
    ...drawerItems.map((t) => {
      const [name, icon, href, kind] = index.items[t];
      const row = drawerRow.content.firstElementChild!.cloneNode(true) as HTMLElement;
      const [checkbox, spacer, iconEl, link, label] = Array.from(row.children) as HTMLElement[];
      const selectable = kind === "p" || kind === "w";
      if (selectable) {
        checkbox.dataset.t = String(t);
        checkbox.setAttribute("aria-label", `Filter by ${name}`);
        spacer.remove();
      } else {
        checkbox.remove();
      }
      iconEl.classList.add(icon);
      iconEl.setAttribute("aria-label", name);
      if (href) {
        (link as HTMLAnchorElement).href = href;
        link.textContent = name;
        label.remove();
      } else {
        label.textContent = name;
        link.remove();
      }
      return row;
    })
  );
}

const DRAWER_OPEN = "pointer-events-auto translate-y-0 opacity-100";
const DRAWER_CLOSED = "pointer-events-none translate-y-4 opacity-0";

function renderDrawer(selectedPassives: Set<number>, selectedWeapons: Set<number>) {
  drawerEl.hidden = !drawerEnabled || drawerItems.length === 0;
  if (drawerEl.hidden) return;
  drawerPanel.classList.remove(...(drawerOpen ? DRAWER_CLOSED : DRAWER_OPEN).split(" "));
  drawerPanel.classList.add(...(drawerOpen ? DRAWER_OPEN : DRAWER_CLOSED).split(" "));
  drawerPanel.setAttribute("aria-hidden", String(!drawerOpen));
  for (const checkbox of $$<HTMLInputElement>("input[data-t]", drawerList)) {
    const t = Number(checkbox.dataset.t);
    checkbox.checked = kindOf(t) === "p" ? selectedPassives.has(t) : selectedWeapons.has(t);
  }
}

// ── Settings ───────────────────────────────────────────────────────────────
const SETTINGS_SEEN_KEY = "settings-widget-highlight-dismissed";
const SETTINGS_BUTTON =
  "flex items-center justify-center rounded-full border bg-primary-800/20 p-3 backdrop-blur-xs transition-colors duration-200 cursor-pointer";
const SETTINGS_DEFAULT =
  "border-primary-400/80 text-primary-400/80 hover:border-primary-400 hover:text-primary-400";
const SETTINGS_HIGHLIGHT =
  "border-amber-400 text-amber-100 ring-4 ring-amber-400/40 hover:border-amber-300 hover:text-white";

function setSettingsHighlight(on: boolean) {
  settingsPing.hidden = !on;
  setClass(settingsToggle, `${SETTINGS_BUTTON} ${on ? SETTINGS_HIGHLIGHT : SETTINGS_DEFAULT}`);
}

function openSettings() {
  settingsModal.hidden = false;
  settingsToggle.setAttribute("aria-expanded", "true");
  settingsToggle.setAttribute("aria-controls", "settings-modal");
  setSettingsHighlight(false);
  try {
    window.localStorage.setItem(SETTINGS_SEEN_KEY, "dismissed");
  } catch {
    // Best effort only.
  }
}

function closeSettings() {
  settingsModal.hidden = true;
  settingsToggle.setAttribute("aria-expanded", "false");
  settingsToggle.removeAttribute("aria-controls");
}

function applySetting(key: string, value: boolean) {
  if (key === "isRecipeDrawerEnabled") {
    drawerEnabled = value;
    if (!value) drawerOpen = false;
    render();
    return;
  }
  commit({ ...state, [key]: value });
}

// ── Search ─────────────────────────────────────────────────────────────────
let fuse: InstanceType<FuseCtor> | null = null;
let fuseLoading: Promise<void> | null = null;

/** Fuse is only fetched once someone actually searches. */
function loadFuse(): Promise<void> {
  fuseLoading ??= import("fuse.js").then(({ default: Fuse }) => {
    fuse = new Fuse(
      index.items.map((item, t) => ({ name: item[0], t })),
      { keys: ["name"], threshold: 0.3, ignoreLocation: true, minMatchCharLength: 2 }
    );
  });
  return fuseLoading;
}

async function runSearch() {
  const query = searchInput.value;
  searchClear.hidden = query === "";
  const trimmed = query.trim();
  if (!trimmed) {
    searchMatches = null;
    render();
    return;
  }
  await loadFuse();
  if (searchInput.value !== query) return; // a newer keystroke owns the render
  searchMatches = new Set(fuse!.search(trimmed).map((r) => (r.item as { t: number }).t));
  render();
}

// ── Events ─────────────────────────────────────────────────────────────────
function runAction(action: string, el: HTMLElement) {
  const c = controls();
  switch (action) {
    case "sort":
      return commit({ ...state, evolutionControls: { ...c, sortByPassive: !c.sortByPassive } });
    case "collapse": {
      const title = el.closest<HTMLElement>("[data-collapsible]")!.dataset.collapsible!;
      const key = collapsibleKey(title);
      const open = state.collapsibleState[key] ?? COLLAPSIBLE_DEFAULT_OPEN[title];
      return commit({ ...state, collapsibleState: { ...state.collapsibleState, [key]: !open } });
    }
    case "reset-w":
      return reset(["selectedWeapons"]);
    case "reset-p":
      return reset(["selectedPassives"]);
    case "reset-all":
      // Snapshot what was active right before wiping: a candidate "completed
      // build" the visitor assembled, then cleared to start another.
      track({ a: "reset", c: activeWire() });
      return reset(["selectedWeapons", "selectedPassives"]);
    case "close-drawer":
      drawerOpen = false;
      return render();
    case "open-settings":
      return openSettings();
    case "close-settings":
      return closeSettings();
  }
}

document.addEventListener("click", (e) => {
  const target = e.target as Element;
  if (target === settingsModal) return closeSettings();

  const actionEl = target.closest<HTMLElement>("[data-action]");
  if (actionEl) return runAction(actionEl.dataset.action!, actionEl);

  const dlcButton = target.closest<HTMLElement>("[data-dlc-toggle]");
  if (dlcButton) return toggleDlc(dlcButton.dataset.dlcToggle!);

  const control = target.closest<HTMLElement>("[data-controls] [data-t]");
  if (control) {
    const t = Number(control.dataset.t);
    openDrawer([t]);
    return toggleItem(t);
  }

  const card = target.closest<HTMLElement>("#evos [data-id], #evos-excluded [data-id]");
  if (card) {
    openDrawer(itemsInCard(card));
    track({ a: "evo", i: `e${card.dataset.id}`, c: activeWire() });
  }
});

/** Items in card order, duplicates kept, as the drawer lists them. */
const itemsInCard = (card: HTMLElement) => $$("[data-t]", card).map((el) => Number(el.dataset.t));

document.addEventListener("change", (e) => {
  const input = e.target as HTMLInputElement;
  if (input.dataset.setting) return applySetting(input.dataset.setting, input.checked);
  if (input.closest("#drawer") && input.dataset.t) toggleItem(Number(input.dataset.t));
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !settingsModal.hidden) closeSettings();
});

searchInput.addEventListener("input", runSearch);
searchInput.addEventListener("focus", () => void loadFuse(), { once: true });
searchClear.addEventListener("click", () => {
  searchInput.value = "";
  void runSearch();
});

initTooltip(
  "[data-tip], #evos [data-t], #evos-excluded [data-t], [data-controls] [data-t]",
  (trigger) => {
    if (trigger.dataset.tip) return { text: trigger.dataset.tip, size: "xs" };
    const [name, , href] = index.items[Number(trigger.dataset.t)];
    return { text: name, href: href || undefined };
  }
);

let settingsSeen = false;
try {
  settingsSeen = window.localStorage.getItem(SETTINGS_SEEN_KEY) === "dismissed";
} catch {
  settingsSeen = false;
}
setSettingsHighlight(!settingsSeen);

render();
// A search typed before this script ran (or restored by the browser) still applies.
if (searchInput.value) void runSearch();
