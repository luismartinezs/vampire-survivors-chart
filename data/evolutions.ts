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

const lotmEvolutions: TWeaponEvolution[] = [
  {
    id: 29,
    elements: [{ item: items.silverWind }, '+', { item: items.pummarola, tags: ['max'] }, '=', { item: items.festiveWind }]
  },
  {
    id: 30,
    elements: [{ item: items.fourSeasons }, '+', { item: items.candelabrador, tags: ['max'] }, '=', { item: items.godaiShuffle }]
  },
  {
    id: 31,
    elements: [{ item: items.summonNight }, '+', { item: items.duplicator, tags: ['max'] }, '=', { item: items.echoOfNight }]
  },
  {
    id: 32,
    elements: [{ item: items.mirageRobe }, '+', { item: items.attractorb, tags: ['max'] }, '=', { item: items.jOdore }]
  },
  {
    id: 33,
    elements: [{ item: items.nightSword }, '+', { item: items.stone_mask, tags: ['max'] }, '=', { item: items.muramasa }]
  },
  {
    id: 34,
    elements: [{ item: items.milleBolleBlu }, '+', { item: items.spellbinder, tags: ['max'] }, '=', { item: items.booRooBolle }]
  }
]
const todfEvolutions: TWeaponEvolution[] = [
  {
    id: 35,
    elements: [{ item: items.spellString }, '+', { item: items.spellStream }, '+', { item: items.spellStrike }, '=', { item: items.spellStorm }]
  },
  {
    id: 36,
    elements: [{ item: items.eskizzibur }, '+', { item: items.armor, tags: ['max'] }, '=', { item: items.legionnaire }]
  },
  {
    id: 37,
    elements: [{ item: items.flashArrow }, '+', { item: items.bracer, tags: ['max'] }, '=', { item: items.millionaire }]
  },
  {
    id: 38,
    elements: [{ item: items.prismaticMissile }, '+', { item: items.crown, tags: ['max'] }, '=', { item: items.luminaire }]
  },
  {
    id: 39,
    elements: [{ item: items.shadowServant }, '+', { item: items.skull_o_maniac, tags: ['max'] }, '=', { item: items.ophion }]
  }
]
const emEvolutions: TWeaponEvolution[] = [
  {
    id: 40,
    elements: [{ item: items.report }, '+', { item: items.miniCrewmate, tags: ['max'] }, '=', { item: items.emergencyMeeting }]
  },
  {
    id: 41,
    elements: [{ item: items.luckySwipe }, '+', { item: items.miniEngineer, tags: ['max'] }, '=', { item: items.crossedWires }]
  },
  {
    id: 42,
    elements: [{ item: items.lifesignScan }, '+', { item: items.miniGhost, tags: ['max'] }, '=', { item: items.paranormalScan }]
  },
  {
    id: 43,
    elements: [{ item: items.justVent }, '+', { item: items.miniShapeshifter, tags: ['max'] }, '=', { item: items.unjustEjection }]
  },
  {
    id: 44,
    elements: [{ item: items.clearDebris }, '+', { item: items.miniGuardian, tags: ['max'] }, '=', { item: items.clearAsteroids }]
  },
  {
    id: 45,
    elements: [{ item: items.sharpTongue }, '+', { item: items.miniImpostor, tags: ['max'] }, '=', { item: items.impostongue }]
  },
  {
    id: 46,
    elements: [{ item: items.scienceRocks }, '+', { item: items.miniScientist, tags: ['max'] }, '=', { item: items.rocketScience }]
  }
]
const ogEvolutions: TWeaponEvolution[] = [
  {
    id: 47,
    elements: [{ item: items.longGun }, '+', { item: items.weaponPowerUp }, '=', { item: items.prototypeA }]
  },
  {
    id: 48,
    elements: [{ item: items.shortGun }, '+', { item: items.weaponPowerUp }, '+', { item: items.bracer }, '=', { item: items.prototypeB }]
  },
  {
    id: 49,
    elements: [{ item: items.spreadShot }, '+', { item: items.weaponPowerUp }, '+', { item: items.emptyTome }, '=', { item: items.prototypeC }]
  },
  {
    id: 50,
    elements: [{ item: items.cuLaser }, '+', { item: items.weaponPowerUp }, '+', { item: items.tiragisu }, '=', { item: items.prontoBeam }]
  },
  {
    id: 51,
    elements: [{ item: items.firearm }, '+', { item: items.weaponPowerUp }, '+', { item: items.candelabrador }, '=', { item: items.fireL3GS }]
  },
  {
    id: 52,
    elements: [{ item: items.sonicBloom }, '+', { item: items.weaponPowerUp }, '+', { item: items.armor }, '=', { item: items.waveBeam }]
  },
  {
    id: 53,
    elements: [{ item: items.homingMissile }, '+', { item: items.weaponPowerUp }, '+', { item: items.duplicator }, '=', { item: items.multistageMissiles }]
  },
  {
    id: 54,
    elements: [{ item: items.diverMines }, '+', { item: items.weaponPowerUp }, '+', { item: items.attractorb }, '=', { item: items.atmoTorpedo }]
  },
  {
    id: 55,
    elements: [{ item: items.bladeCrossbow }, '+', { item: items.weaponPowerUp }, '+', { item: items.clover }, '=', { item: items.bfc2000Ad }]
  },
  {
    id: 56,
    elements: [{ item: items.prismLass }, '+', { item: items.weaponPowerUp }, '+', { item: items.wings }, '=', { item: items.timeWarp }]
  },
  {
    id: 57,
    elements: [{ item: items.metalClaw }, '+', { item: items.weaponPowerUp }, '+', { item: items.hollowHeart }, '=', { item: items.bigFuzzyFist }]
  }
]
const otcEvolutions: TWeaponEvolution[] = []

export const evolutions = [
  ...baseEvolutions.map((evolution) => ({ ...evolution, dlc: 'base' as const })),
  ...lotmEvolutions.map((evolution) => ({ ...evolution, dlc: 'lotm' as const })),
  ...todfEvolutions.map((evolution) => ({ ...evolution, dlc: 'todf' as const })),
  ...emEvolutions.map((evolution) => ({ ...evolution, dlc: 'em' as const })),
  ...ogEvolutions.map((evolution) => ({ ...evolution, dlc: 'og' as const })),
  ...otcEvolutions.map((evolution) => ({ ...evolution, dlc: 'otc' as const })),
]
