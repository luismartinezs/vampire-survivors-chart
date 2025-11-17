export const WIKI_BASE_URL = "https://vampire.survivors.wiki/w";

export function getWikiHref(
  wikiPath?: string | null
): string | null {
  if (!wikiPath) {
    return null;
  }

  return `${WIKI_BASE_URL}/${wikiPath}`;
}
