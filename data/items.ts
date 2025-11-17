import { passives } from "./passives";
import { weapons } from "./weapons";
import { TItem } from "./types";
const misc: Record<string, TItem> = {
  fiveMaxPassives: {
    name: '5',
    image: 'icon-five-max',
    type: 'misc',
    wikiPath: ''
  }
}

export const items = { ...passives, ...weapons, ...misc }
