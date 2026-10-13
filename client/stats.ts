/**
 * Stats page behavior. The dashboard is rendered at build time; this adds the
 * interactive bits: sortable tables and scroll-depth analytics.
 */

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
