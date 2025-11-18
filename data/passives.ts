import { ensureWikiPaths, mergeIntoNestedObjects } from "@/lib/utils";
import { passiveWikiPaths } from "./wikiPaths";
import { TItem } from "./types";
import { em, ante, og, base } from "./constants";

const _passives: Record<string, Omit<TItem, 'type'>> = ensureWikiPaths({
  hollowHeart: {
    name: 'Hollow Heart',
    image: 'icon-health',
    dlc: base
  },
  emptyTome: {
    name: 'Empty Tome',
    image: 'icon-cooldown',
    dlc: base
  },
  bracer: {
    name: 'Bracer',
    image: 'icon-speed',
    dlc: base
  },
  armor: {
    name: 'Armor',
    image: 'icon-armor',
    dlc: base
  },
  candelabrador: {
    name: 'Candelabrador',
    image: 'icon-area',
    dlc: base
  },
  clover: {
    name: 'Clover',
    image: 'icon-luck',
    dlc: base
  },
  duplicator: {
    name: 'Duplicator',
    image: 'icon-amount',
    dlc: base
  },
  spinach: {
    name: 'Spinach',
    image: 'icon-might',
    dlc: base
  },
  wings: {
    name: 'Wings',
    image: 'icon-wings',
    dlc: base
  },
  pummarola: {
    name: 'Pummarola',
    image: 'icon-recovery',
    dlc: base
  },
  spellbinder: {
    name: 'Spellbinder',
    image: 'icon-duration',
    dlc: base
  },
  attractorb: {
    name: 'Attractorb',
    image: 'icon-magnet',
    dlc: base
  },
  crown: {
    name: 'Crown',
    image: 'icon-growth',
    dlc: base
  },
  skull_o_maniac: {
    name: "Skull O'Maniac",
    image: 'icon-curse',
    dlc: base
  },
  tiragisu: {
    name: 'Tiragisú',
    image: 'icon-revival',
    dlc: base
  },
  torronas_box: {
    name: "Torrona's Box",
    image: 'icon-torrona',
    dlc: base
  },
  stone_mask: {
    name: 'Stone Mask',
    image: 'icon-greed',
    dlc: base
  },
  parm_aegis: {
    name: 'Parm Aegis',
    image: 'icon-Parm_Aegis',
    dlc: base
  },
  karomas_mana: {
    name: "Karoma's Mana",
    image: 'icon-Karomas_Mana',
    dlc: base
  },
  metaglio_left: {
    name: 'Metaglio Left',
    image: 'icon-sign1',
    dlc: base
  },
  metaglio_right: {
    name: 'Metaglio Right',
    image: 'icon-sign2',
    dlc: base
  },
  silver_ring: {
    name: 'Silver Ring',
    image: 'icon-ring1',
    dlc: base
  },
  goldRing: {
    name: 'Gold Ring',
    image: 'icon-ring2',
    dlc: base
  },
  miniCrewmate: {
    name: 'Mini Crewmate',
    image: 'icon-crewmate',
    dlc: em
  },
  miniEngineer: {
    name: 'Mini Engineer',
    image: 'icon-engineer',
    dlc: em
  },
  miniGhost: {
    name: 'Mini Ghost',
    image: 'icon-ghost',
    dlc: em
  },
  miniShapeshifter: {
    name: 'Mini Shapeshifter',
    image: 'icon-shapeshifter',
    dlc: em
  },
  miniGuardian: {
    name: 'Mini Guardian',
    image: 'icon-guardian',
    dlc: em
  },
  miniImpostor: {
    name: 'Mini Impostor',
    image: 'icon-impostor',
    dlc: em
  },
  miniScientist: {
    name: 'Mini Scientist',
    image: 'icon-scientist',
    dlc: em
  },
  miniHorse: {
    name: 'Mini Horse',
    image: 'icon-horse',
    dlc: em
  },
  weaponPowerUp: {
    name: 'Weapon Power-Up',
    image: 'icon-powerup',
    dlc: og
  },
  outerSaboteur: {
    name: 'Outer Saboteur',
    image: 'icon-Outer_Saboteur',
    dlc: ante
  }
}, passiveWikiPaths);

// typescript... too complicated
export const passives = mergeIntoNestedObjects<
  typeof _passives,
  { type: 'passive' }
>(_passives, { type: 'passive' as const }) as Record<string, TItem>;
