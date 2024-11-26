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
  }
}

const _weapons: Record<string, Omit<TItem, 'type'>> = {
  whip: {
    name: 'Whip',
    image: 'icon-whip'
  },
  bloodyTear: {
    name: 'Bloody Tear',
    image: 'icon-whip_'
  },
  magicWand: {
    name: 'Magic Wand',
    image: 'icon-magicwand'
  },
  holyWand: {
    name: 'Holy Wand',
    image: 'icon-magicwand_'
  },
  knife: {
    name: 'Knife',
    image: 'icon-knife'
  },
  thousandEdge: {
    name: 'Thousand Edge',
    image: 'icon-knife_'
  },
  axe: {
    name: 'Axe',
    image: 'icon-axe'
  },
  deathSpiral: {
    name: 'Death Spiral',
    image: 'icon-axe_'
  },
  cross: {
    name: 'Cross',
    image: 'icon-cross'
  },
  heavenSword: {
    name: 'Heaven Sword',
    image: 'icon-cross_'
  },
  runeTracer: {
    name: 'Rune Tracer',
    image: 'icon-runetracer'
  },
  nineFold: {
    name: 'Nine Fold',
    image: 'icon-runetracer_'
  },
  firewand: {
    name: 'Fire Wand',
    image: 'icon-firewand'
  },
  hellfire: {
    name: 'Hellfire',
    image: 'icon-firewand_'
  },
  lightning: {
    name: 'Lightning Ring',
    image: 'icon-lightning'
  },
  thunderLoop: {
    name: 'Thunder Loop',
    image: 'icon-lightning_'
  },
  peachone: {
    name: 'Peachone',
    image: 'icon-bird1'
  },
  ebonyWings: {
    name: 'Ebony Wings',
    image: 'icon-bird2'
  },
  vandalier: {
    name: 'Vandalier',
    image: 'icon-bird_'
  },
  garlic: {
    name: 'Garlic',
    image: 'icon-garlic'
  },
  soulEater: {
    name: 'Soul Eater',
    image: 'icon-garlic_'
  },
  king_bible: {
    name: 'King Bible',
    image: 'icon-bible'
  },
  spellString: {
    name: 'Spell String',
    image: 'icon-spell1'
  },
  spellStream: {
    name: 'Spell Stream',
    image: 'icon-spell2'
  },
  spellStrike: {
    name: 'Spell Strike',
    image: 'icon-spell3'
  },
  holyBible: {
    name: 'Holy Bible',
    image: 'icon-bible'
  },
  unholyVespers: {
    name: 'Unholy Vespers',
    image: 'icon-bible_'
  },
  santa_water: {
    name: 'Santa Water',
    image: 'icon-water'
  },
  la_borra: {
    name: 'La Borra',
    image: 'icon-water_'
  },
  pentagram: {
    name: 'Pentagram',
    image: 'icon-pentagram'
  },
  gorgeous_moon: {
    name: 'Gorgeous Moon',
    image: 'icon-pentagram_'
  },
  laurel: {
    name: 'Laurel',
    image: 'icon-laurel'
  },
  crimsonShroud: {
    name: 'Crimson Shroud',
    image: 'icon-laurel_'
  },
  clock_lancet: {
    name: 'Clock Lancet',
    image: 'icon-lancet'
  },
  infiniteCorridor: {
    name: 'Infinite Corridor',
    image: 'icon-lancet_'
  },
  song_of_mana: {
    name: 'Song of Mana',
    image: 'icon-mana'
  },
  mannajja: {
    name: 'Mannajja',
    image: 'icon-mana_'
  }
}

// typescript... too complicated
export const passives = mergeIntoNestedObjects<
  typeof _passives,
  { type: 'passive' }
>(_passives, { type: 'passive' as const }) as Record<string, TItem>;
export const weapons = mergeIntoNestedObjects<
  typeof _weapons,
  { type: 'weapon' }
>(_weapons, { type: 'weapon' as const }) as Record<string, TItem>;

export const items = { ...passives, ...weapons }