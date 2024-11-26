import { TWeaponEvolution } from "./types"
import { items } from "./items";

export const weaponEvolutions: TWeaponEvolution[] = [
  {
    id: 1,
    elements: [{ item: items.whip }, '+', { item: items.hollowHeart }, '=', { item: items.bloodyTear }]
  },
  {
    id: 2,
    elements: [{ item: items.magicWand }, '+', { item: items.emptyTome }, '=', { item: items.holyWand }]
  },
  {
    id: 3,
    elements: [{ item: items.knife }, '+', { item: items.bracer }, '=', { item: items.thousandEdge }]
  },
  {
    id: 4,
    elements: [{ item: items.axe }, '+', { item: items.candelabrador }, '=', { item: items.deathSpiral }]
  },
  {
    id: 5,
    elements: [{ item: items.cross }, '+', { item: items.clover }, '=', { item: items.heavenSword }]
  },
  {
    id: 6,
    elements: [{ item: items.runeTracer }, '+', { item: items.duplicator }, '=', { item: items.nineFold }]
  },
  {
    id: 7,
    elements: [{ item: items.firewand }, '+', { item: items.spinach }, '=', { item: items.hellfire }]
  },
  {
    id: 8,
    elements: [{ item: items.lightning }, '+', { item: items.wings }, '=', { item: items.thunderLoop }]
  },
  {
    id: 9,
    elements: [{ item: items.peachone }, '+', { item: items.ebonyWings }, '=', { item: items.vandalier }]
  },
  {
    id: 10,
    elements: [{ item: items.garlic }, '+', { item: items.pummarola }, '=', { item: items.soulEater }]
  },
  {
    id: 13,
    elements: [{ item: items.song_of_mana }, '+', { item: items.skull_o_maniac }, '=', { item: items.mannajja }]
  },
  {
    id: 14,
    elements: [{ item: items.pentagram }, '+', { item: items.crown }, '=', { item: items.gorgeous_moon }]
  },
  {
    id: 15,
    elements: [{ item: items.santa_water }, '+', { item: items.attractorb }, '=', { item: items.la_borra }]
  },
  {
    id: 16,
    elements: [{ item: items.king_bible }, '+', { item: items.spellbinder }, '=', { item: items.unholyVespers }]
  },
  {
    id: 11,
    elements: [{ item: items.clock_lancet }, '+', { item: items.silver_ring, tags: ['max'] }, '+', { item: items.goldRing, tags: ['max'] }, '=', { item: items.infiniteCorridor }]
  },
  {
    id: 12,
    elements: [{ item: items.laurel }, '+', { item: items.metaglio_left, tags: ['max'] }, '+', { item: items.metaglio_right, tags: ['max'] }, '=', { item: items.crimsonShroud }]
  },

]
