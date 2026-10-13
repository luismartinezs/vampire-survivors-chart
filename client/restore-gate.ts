/**
 * Inlined into <head> and run before first paint. When the visitor has saved
 * filters that change what the chart shows, hide the chart until client/chart.ts
 * has applied them (it removes the class), instead of flashing the default
 * chart and then reshuffling it. A timeout reveals it anyway if that script
 * never runs.
 */

declare const __DLC_COUNT__: number;

try {
  const raw = localStorage.getItem("app-store");
  const s = raw && JSON.parse(raw).state;
  const c = s && s.evolutionControls;
  const collapsed = s && s.collapsibleState;
  if (
    c &&
    (c.sortByPassive ||
      c.selectedPassives?.length ||
      c.selectedWeapons?.length ||
      (c.selectedDlcs && c.selectedDlcs.length < __DLC_COUNT__) ||
      collapsed?.["collapsible-Weapons-open"] === true ||
      collapsed?.["collapsible-Passives-open"] === false)
  ) {
    const root = document.documentElement;
    root.classList.add("restoring");
    setTimeout(() => root.classList.remove("restoring"), 3000);
  }
} catch {
  // No storage access: nothing to restore.
}
