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
  // missing: parm aegis, karoma's mana
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
  noFuture: {
    name: 'NO FUTURE',
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
  },
  phiera_del_tuphello: {
    name: 'Phiera Der Tuphello',
    image: 'icon-guns1'
  },
  eight_the_sparrow: {
    name: 'Eight The Sparrow',
    image: 'icon-guns2'
  },
  phieraggi: {
    name: 'Phieraggi',
    image: 'icon-guns_'
  },
  flames_of_muspell: {
    name: 'Flames of Muspell',
    image: 'icon-flame'
  },
  ashes_of_muspell: {
    name: 'Ashes of Muspell',
    image: 'icon-flame_'
  },
  victory_sword: {
    name: 'Victory Sword',
    image: 'icon-sword'
  },
  sole_solution: {
    name: 'Sole Solution',
    image: 'icon-sword_'
  },
  bracelet: {
    name: 'Bracelet',
    image: 'icon-bracelet'
  },
  bi_bracelet: {
    name: 'Bi-Bracelet',
    image: 'icon-bracelet_'
  },
  tri_bracelet: {
    name: 'Tri-Bracelet',
    image: 'icon-bracelet__'
  },
  santa_javelin: {
    name: 'Santa Javelin',
    image: 'icon-javelin'
  },
  seraphic_cry: {
    name: 'Seraphic Cry',
    image: 'icon-javelin_'
  },
  pako_battiliar: {
    name: 'Pako Battiliar',
    image: 'icon-pako'
  },
  mazo_familiar: {
    name: 'Mazo Familiar',
    image: 'icon-pako_'
  },
  phas3r: {
    name: 'Phas3r',
    image: 'icon-laser'
  },
  photonstorm: {
    name: 'Photonstorm',
    image: 'icon-laser_'
  },
  glass_fandango: {
    name: 'Glass Fandango',
    image: 'icon-fandango'
  },
  celestial_voulge: {
    name: 'Celestial Voulge',
    image: 'icon-fandango_'
  },
  vento_sacro: {
    name: 'Vento Sacro',
    image: 'icon-vento'
  },
  fuwalafuwaloo: {
    name: 'Fuwalafuwaloo',
    image: 'icon-vento_'
  },
  shadow_pinion: {
    name: 'Shadow Pinion',
    image: 'icon-pinion'
  },
  valkyrie_turner: {
    name: 'Valkyrie Turner',
    image: 'icon-pinion_'
  },
  gatti_amari: {
    name: 'Gatti Amari',
    image: 'icon-cat'
  },
  vicious_hunger: {
    name: 'Vicious Hunger',
    image: 'icon-cat_'
  },

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