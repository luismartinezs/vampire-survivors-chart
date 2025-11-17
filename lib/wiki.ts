export const WIKI_BASE_URL = "https://vampire-survivors.fandom.com/wiki";

export function getWikiHref(
  wikiPath?: string | null
): string | null {
  if (!wikiPath) {
    return null;
  }

  return `${WIKI_BASE_URL}/${wikiPath}`;
}
