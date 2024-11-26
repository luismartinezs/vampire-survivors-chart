import { mergeIntoNestedObjects } from "@/lib/utils";
import { TItem } from "./types";

const _passives: Record<string, Omit<TItem, 'type'>> = {
  hollowHeart: {
    name: 'Hollow Heart',
    image: 'icon-health'
  },
  emptyTome: {
    name: 'Empty Tome',
    image: 'icon-cooldown'
  },
  bracer: {
    name: 'Bracer',
    image: 'icon-speed'
  },
  armor: {
    name: 'Armor',
    image: 'icon-armor'
  },
  candelabrador: {
    name: 'Candelabrador',
    image: 'icon-area'
  },
  clover: {
    name: 'Clover',
    image: 'icon-luck'
  },
  duplicator: {
    name: 'Duplicator',
    image: 'icon-amount'
  },
  spinach: {
    name: 'Spinach',
    image: 'icon-might'
  },
  wings: {
    name: 'Wings',
    image: 'icon-wings'
  },
  pummarola: {
    name: 'Pummarola',
    image: 'icon-recovery'
  },
  spellbinder: {
    name: 'Spellbinder',
    image: 'icon-duration'
  },
  attractorb: {
    name: 'Attractorb',
    image: 'icon-magnet'
  },
  crown: {
    name: 'Crown',
    image: 'icon-growth'
  },
  metaglio_left: {
    name: 'Metaglio Left',
    image: 'icon-sign1'
  },
  metaglio_right: {
    name: 'Metaglio Right',
    image: 'icon-sign2'
  },
  silver_ring: {
    name: 'Silver Ring',
    image: 'icon-ring1'
  },
  goldRing: {
    name: 'Gold Ring',
    image: 'icon-ring2'
  },
  skull_o_maniac: {
    name: "Skull O'Maniac",
    image: 'icon-curse'
  },
  tiragisu: {
    name: 'Tiragisú',
    image: 'icon-revival'
  },
  torronas_box: {
    name: "Torrona's Box",
    image: 'icon-torrona'
  },
  stone_mask: {
    name: 'Stone Mask',
    image: 'icon-greed'
  },
  miniCrewmate: {
    name: 'Mini Crewmate',
    image: 'icon-crewmate'
  },
  miniEngineer: {
    name: 'Mini Engineer',
    image: 'icon-engineer'
  },
  miniGhost: {
    name: 'Mini Ghost',
    image: 'icon-ghost'
  },
  miniShapeshifter: {
    name: 'Mini Shapeshifter',
    image: 'icon-shapeshifter'
  },
  miniGuardian: {
    name: 'Mini Guardian',
    image: 'icon-guardian'
  },
  miniImpostor: {
    name: 'Mini Impostor',
    image: 'icon-impostor'
  },
  miniScientist: {
    name: 'Mini Scientist',
    image: 'icon-scientist'
  },
  miniHorse: {
    name: 'Mini Horse',
    image: 'icon-horse'
  },
  weaponPowerUp: {
    name: 'Weapon Power-Up',
    image: 'icon-powerup'
  }
  // missing: parm aegis, karoma's mana
}

// typescript... too complicated
export const passives = mergeIntoNestedObjects<
  typeof _passives,
  { type: 'passive' }
>(_passives, { type: 'passive' as const }) as Record<string, TItem>;