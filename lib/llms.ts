/**
 * /llms.txt: the site and every recipe as plain text, for AI assistants and
 * answer engines (https://llmstxt.org). Built from the same chart data as the
 * pages, so it can't drift from them.
 */

import type { TChart } from "@/lib/charts";
import { DLC_LABELS } from "@/lib/dlc";
import type { TEvolutionElement } from "@/data/types";

const recipe = (elements: TEvolutionElement[]) =>
  elements
    .map((el) =>
      typeof el === "string"
        ? el
        : el.item.name + (el.tags?.some((t) => t.toLowerCase() === "max") ? " (max level)" : "")
    )
    .join(" ");

function chartSection(chart: TChart, siteUrl: string): string {
  const lines = [`## ${chart.title}`, "", `Chart: ${siteUrl}${chart.path || "/"}`];
  const mainDlc = chart.dlcs[0];
  for (const dlc of chart.dlcs) {
    const evos = chart.evolutions.filter((e) => (e.dlc ?? mainDlc) === dlc);
    if (!evos.length) continue;
    if (chart.dlcs.length > 1) lines.push("", `### ${DLC_LABELS[dlc].full}`);
    lines.push("", ...evos.map((e) => `- ${recipe(e.elements)}`));
  }
  return lines.join("\n");
}

export function buildLlmsTxt(charts: TChart[], siteUrl: string): string {
  return [
    "# Vampire Survivors Evolution Chart",
    "",
    "> Interactive charts of every weapon evolution in Vampire Survivors (base game and all DLCs) and in Warhammer Survivors (Warhammer 40,000 and Age of Sigmar). Filter by the weapons and passives you have to see what they evolve into.",
    "",
    'Notation: "+" combines items, "=" gives the evolution, "⇒" leads to the next stage of a chained evolution (Bracelet ⇒ Bi-Bracelet ⇒ Tri-Bracelet). "(max level)" marks an item that must be at max level.',
    "",
    "## Pages",
    "",
    ...charts.map((c) => `- [${c.title}](${siteUrl}${c.path || "/"})`),
    `- [Filter stats](${siteUrl}/stats): which weapons and passives players filter for most, updated daily`,
    "",
    ...charts.map((c) => chartSection(c, siteUrl) + "\n"),
  ].join("\n");
}
