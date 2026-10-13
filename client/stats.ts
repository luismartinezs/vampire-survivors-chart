/**
 * Stats page behavior. The dashboard is rendered at build time; this adds the
 * three interactive bits: sortable tables, the "Paired With" anchor picker,
 * and scroll-depth analytics.
 */

import { anchorPartners, type TAnchorData } from "@/lib/anchor";
import { trackUmami } from "@/lib/umami";

// ── Sortable tables ────────────────────────────────────────────────────────
type SortKey = "name" | "today" | "last7" | "total" | "trend" | "share";

const ACTIVE = "text-primary-300/80";
const INACTIVE = "text-white/30";
const ZEBRA = "bg-white/[0.025]";

function initTable(section: HTMLElement) {
  const list = section.querySelector<HTMLElement>("[data-rows]");
  if (!list) return;
  const rows = Array.from(list.children) as HTMLElement[];
  const headers = Array.from(section.querySelectorAll<HTMLElement>("[data-sort]"));
  const accentA = section.dataset.accentA!;
  const accentB = section.dataset.accentB!;
  const num = (row: HTMLElement, key: string) => Number(row.dataset[key]);
  let sort: SortKey = "total";
  let dir: "asc" | "desc" = "desc";

  const apply = () => {
    const sorted = [...rows].sort((a, b) => {
      const cmp =
        sort === "name"
          ? a.dataset.name!.localeCompare(b.dataset.name!)
          : num(a, sort) - num(b, sort) || num(b, "total") - num(a, "total");
      return dir === "asc" ? cmp : -cmp;
    });
    // Bars track today/7d when sorted by those, overall popularity otherwise.
    const barKey = sort === "today" || sort === "last7" ? sort : "total";
    const maxBar = Math.max(1, ...sorted.map((r) => num(r, barKey)));
    sorted.forEach((row, i) => {
      const alt = i % 2 === 1;
      row.classList.toggle(ZEBRA, alt);
      const bar = row.firstElementChild as HTMLElement;
      bar.classList.replace(alt ? accentA : accentB, alt ? accentB : accentA);
      bar.style.width = `${Math.max((num(row, barKey) / maxBar) * 100, 1.5)}%`;
      (bar.nextElementSibling as HTMLElement).textContent = String(i + 1);
    });
    list.replaceChildren(...sorted);

    for (const header of headers) {
      const active = header.dataset.sort === sort;
      header.classList.replace(active ? INACTIVE : ACTIVE, active ? ACTIVE : INACTIVE);
      header.setAttribute(
        "aria-sort",
        active ? (dir === "asc" ? "ascending" : "descending") : "none"
      );
      header.querySelector("[data-arrow]")!.textContent = active ? (dir === "asc" ? "▲" : "▼") : "";
    }
  };

  for (const header of headers) {
    header.addEventListener("click", () => {
      const col = header.dataset.sort as SortKey;
      trackUmami("stats-sort", { table: section.dataset.table!, column: col });
      if (col === sort) {
        dir = dir === "asc" ? "desc" : "asc";
      } else {
        sort = col;
        // Names read best A→Z; everything else most-first.
        dir = col === "name" ? "asc" : "desc";
      }
      apply();
    });
  }
}

document.querySelectorAll<HTMLElement>("[data-table]").forEach(initTable);

// ── Paired With ────────────────────────────────────────────────────────────
const SELECTED = ["border-primary-400/60", "bg-primary-400/15"];
const UNSELECTED = ["border-white/5"];
const pctFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** Same classes as the stat_icon template component. */
function iconClasses(icon: string, size: string, extra = "") {
  return (icon ? `ico ${size} shrink-0 ${icon} ${extra}` : `${size} shrink-0 ${extra}`).trim();
}

function initAnchor(widget: HTMLElement) {
  const dataEl = document.getElementById("anchor-data");
  const picker = widget.querySelector<HTMLElement>("[data-picker]");
  const partnersEl = widget.querySelector<HTMLElement>("[data-partners]");
  if (!dataEl || !picker || !partnersEl) return;
  const data = JSON.parse(dataEl.textContent!) as TAnchorData;
  const panel = picker.querySelector<HTMLElement>("[data-picker-panel]")!;

  const close = () => {
    picker.hidden = true;
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
  };

  const select = (anchor: number) => {
    const [, name, icon, support] = data.items[anchor];
    trackUmami("stats-anchor-pick", { item: name });

    // Selector button and heading icons are the elements just before each name.
    for (const nameEl of widget.querySelectorAll<HTMLElement>("[data-anchor-name]")) {
      nameEl.textContent = name;
      const iconEl = nameEl.previousElementSibling as HTMLElement;
      const size = iconEl.classList.contains("size-6") ? "size-6" : "size-4";
      iconEl.className = iconClasses(icon, size);
      if (icon) iconEl.setAttribute("role", "img");
      iconEl.setAttribute("aria-label", name);
    }
    widget.querySelector("[data-anchor-support]")!.textContent = pctFmt.format(support);

    const template = partnersEl.firstElementChild as HTMLElement | null;
    if (template) {
      partnersEl.replaceChildren(
        ...anchorPartners(data, anchor).map((p) => {
          const row = template.cloneNode(true) as HTMLElement;
          const [bar, iconEl, label, rate] = Array.from(row.children) as HTMLElement[];
          bar.style.width = `${p.width}%`;
          iconEl.className = iconClasses(p.icon, "size-5", "relative");
          iconEl.setAttribute("aria-label", p.name);
          label.textContent = p.name;
          rate.textContent = p.rate;
          return row;
        })
      );
    }

    for (const button of picker.querySelectorAll<HTMLElement>("[data-pick]")) {
      const on = Number(button.dataset.pick) === anchor;
      button.classList.remove(...(on ? UNSELECTED : SELECTED));
      button.classList.add(...(on ? SELECTED : UNSELECTED));
    }
    close();
  };

  widget.addEventListener("click", (e) => {
    const target = e.target as Element;
    if (target.closest("[data-action=open-picker]")) {
      picker.hidden = false;
      return;
    }
    if (target.closest("[data-action=close-picker]")) return close();
    const pick = target.closest<HTMLElement>("[data-pick]");
    if (pick) return select(Number(pick.dataset.pick));
    if (picker.contains(target) && !panel.contains(target)) close();
  });
  document.addEventListener("keydown", onKey);
}

const anchorWidget = document.getElementById("anchor");
if (anchorWidget) initAnchor(anchorWidget);

// ── Scroll depth ───────────────────────────────────────────────────────────
// One Umami event per depth threshold reached, then unbind. A page shorter than
// the viewport counts as 100% on the first scroll.
const THRESHOLDS = [25, 50, 75, 100];
const fired = new Set<number>();
const onScroll = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percent = scrollable <= 0 ? 100 : (window.scrollY / scrollable) * 100;
  for (const threshold of THRESHOLDS) {
    if (percent >= threshold && !fired.has(threshold)) {
      fired.add(threshold);
      trackUmami("stats-scroll", { depth: `${threshold}%` });
    }
  }
  if (fired.size === THRESHOLDS.length) window.removeEventListener("scroll", onScroll);
};
window.addEventListener("scroll", onScroll, { passive: true });
