import { TWeaponEvolution } from "./types"
import { items } from "./items";

const baseEvolutions: TWeaponEvolution[] = [
  {
    id: 1,
    elements: [{ item: items.whip }, '+', { item: items.hollowHeart }, '=', { item: items.bloodyTear }],
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
    elements: [{ item: items.king_bible }, '+', { item: items.spellbinder }, '=', { item: items.unholyVespers }]
  },
  {
    id: 7,
    elements: [{ item: items.firewand }, '+', { item: items.spinach }, '=', { item: items.hellfire }]
  },
  {
    id: 8,
    elements: [{ item: items.garlic }, '+', { item: items.pummarola }, '=', { item: items.soulEater }]
  },
  {
    id: 9,
    elements: [{ item: items.santa_water }, '+', { item: items.attractorb }, '=', { item: items.la_borra }]
  },
  {
    id: 10,
    elements: [{ item: items.runeTracer }, '+', { item: items.armor }, '=', { item: items.noFuture }]
  },
  {
    id: 11,
    elements: [{ item: items.lightning }, '+', { item: items.duplicator }, '=', { item: items.thunderLoop }]
  },
  {
    id: 12,
    elements: [{ item: items.pentagram }, '+', { item: items.crown }, '=', { item: items.gorgeous_moon }]
  },
  {
    id: 13,
    elements: [{ item: items.gatti_amari }, '+', { item: items.stone_mask }, '=', { item: items.vicious_hunger }]
  },
  {
    id: 14,
    elements: [{ item: items.song_of_mana }, '+', { item: items.skull_o_maniac }, '=', { item: items.mannajja }]
  },
  {
    id: 15,
    elements: [{ item: items.shadow_pinion }, '+', { item: items.wings }, '=', { item: items.valkyrie_turner }]
  },
  {
    id: 16,
    elements: [{ item: items.flames_of_muspell }, '+', { item: items.torronas_box, tags: ['max'] }, '=', { item: items.ashes_of_muspell }]
  },
  {
    id: 17,
    elements: [{ item: items.glass_fandango }, '+', { item: items.wings, tags: ['max'] }, '=', { item: items.celestial_voulge }]
  },
  {
    id: 18,
    elements: [{ item: items.clock_lancet }, '+', { item: items.silver_ring, tags: ['max'] }, '+', { item: items.goldRing, tags: ['max'] }, '=', { item: items.infiniteCorridor }]
  },
  {
    id: 19,
    elements: [{ item: items.laurel }, '+', { item: items.metaglio_left, tags: ['max'] }, '+', { item: items.metaglio_right, tags: ['max'] }, '=', { item: items.crimsonShroud }]
  },
  {
    id: 20,
    elements: [{ item: items.phas3r }, '+', { item: items.emptyTome, tags: ['max'] }, '=', { item: items.photonstorm }]
  },
  {
    id: 21,
    elements: [{ item: items.pako_battiliar }, '+', { item: items.hollowHeart, tags: ['max'] }, '=', { item: items.mazo_familiar }]
  },
  {
    id: 22,
    elements: [{ item: items.santa_javelin }, '+', { item: items.clover, tags: ['max'] }, '=', { item: items.seraphic_cry }]
  },
  {
    id: 23,
    elements: [{ item: items.bracelet }, '⇒', { item: items.bi_bracelet }, '⇒', { item: items.tri_bracelet }]
  },
  {
    id: 25,
    elements: [{ item: items.phiera_del_tuphello }, '+', { item: items.eight_the_sparrow }, '+', { item: items.tiragisu }, '=', { item: items.phieraggi }]
  },
  {
    id: 26,
    elements: [{ item: items.peachone }, '+', { item: items.ebonyWings }, '=', { item: items.vandalier }]
  },
  {
    id: 27,
    elements: [{ item: items.vento_sacro }, '+', { item: items.bloodyTear }, '=', { item: items.fuwalafuwaloo }]
  },
  {
    id: 28,
    elements: [{ item: items.victory_sword }, '+', { item: items.torronas_box, tags: ['max'] }, '=', { item: items.sole_solution }]
  }
]

const lotmEvolutions: TWeaponEvolution[] = []
const todfEvolutions: TWeaponEvolution[] = []
const emEvolutions: TWeaponEvolution[] = []
const ogEvolutions: TWeaponEvolution[] = []
const otcEvolutions: TWeaponEvolution[] = []

export const evolutions = [
  ...baseEvolutions.map((evolution) => ({ ...evolution, dlc: 'base' as const })),
  ...lotmEvolutions.map((evolution) => ({ ...evolution, dlc: 'lotm' as const })),
  ...todfEvolutions.map((evolution) => ({ ...evolution, dlc: 'todf' as const })),
  ...emEvolutions.map((evolution) => ({ ...evolution, dlc: 'em' as const })),
  ...ogEvolutions.map((evolution) => ({ ...evolution, dlc: 'og' as const })),
  ...otcEvolutions.map((evolution) => ({ ...evolution, dlc: 'otc' as const })),
]
