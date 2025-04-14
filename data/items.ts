import { passives } from "./passives";
import { weapons } from "./weapons";

const misc = {
  fiveMaxPassives: {
    name: '5',
    image: 'icon-five-max'
  }
}

export const items = { ...passives, ...weapons, ...misc }