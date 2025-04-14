import { TWeaponEvolution } from "./types"
import { items } from "./items";
import { base, otc, em, lotm, og, todf, ed } from "./constants";

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
  },
  {
    id: 25,
    elements: [{ item: items.phiera_del_tuphello }, '+', { item: items.eight_the_sparrow }, '+', { item: items.tiragisu }, '=', { item: items.phieraggi }]
  },
  {
    id: 18,
    elements: [{ item: items.clock_lancet }, '+', { item: items.silver_ring, tags: ['max'] }, '+', { item: items.goldRing, tags: ['max'] }, '=', { item: items.infiniteCorridor }]
  },
  {
    id: 19,
    elements: [{ item: items.laurel }, '+', { item: items.metaglio_left, tags: ['max'] }, '+', { item: items.metaglio_right, tags: ['max'] }, '=', { item: items.crimsonShroud }]
  },
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
const otcEvolutions: TWeaponEvolution[] = [
  {
    id: 58,
    elements: [{ item: items.alchemyWhip }, '+', { item: items.tiragisu }, '=', { item: items.vampireKiller }]
  },
  {
    id: 59,
    elements: [{ item: items.windWhip }, '+', { item: items.crown }, '=', { item: items.spiritTornadoTip }]
  },
  {
    id: 60,
    elements: [{ item: items.platinumWhip }, '+', { item: items.clover }, '=', { item: items.crossCrasherTip }]
  },
  {
    id: 61,
    elements: [{ item: items.dragonWaterWhip }, '+', { item: items.attractorb }, '=', { item: items.hydrostormerTip }]
  },
  {
    id: 62,
    elements: [{ item: items.sonicWhip }, '+', { item: items.skull_o_maniac }, '=', { item: items.crissaegrimTip }]
  },
  {
    id: 63,
    elements: [{ item: items.jetBlackWhip }, '+', { item: items.stone_mask }, '=', { item: items.mormegilTip }]
  },
  {
    id: 64,
    elements: [{ item: items.vibhutiWhip }, '+', { item: items.candelabrador }, '=', { item: items.daybreakerTip }]
  },
  {
    id: 65,
    elements: [{ item: items.vanitasWhip }, '+', { item: items.hollowHeart }, '=', { item: items.aurablasterTip }]
  },
  {
    id: 66,
    elements: [{ item: items.shuriken }, '+', { item: items.emptyTome }, '=', { item: items.yagyuShuriken }]
  },
  {
    id: 67,
    elements: [{ item: items.curvedKnife }, '+', { item: items.bracer }, '=', { item: items.bwakaKnife }]
  },
  {
    id: 68,
    elements: [{ item: items.javelin }, '+', { item: items.spellbinder }, '=', { item: items.longInus }]
  },
  {
    id: 69,
    elements: [{ item: items.discus }, '+', { item: items.parm_aegis, tags: ['max'] }, '=', { item: items.stellarBlade }]
  },
  {
    id: 70,
    elements: [{ item: items.ironBall }, '+', { item: items.armor }, '=', { item: items.wreckingBall }]
  },
  {
    id: 71,
    elements: [{ item: items.silverRevolver }, '+', { item: items.karomas_mana }, '=', { item: items.jewelGun }]
  },
  {
    id: 72,
    elements: [{ item: items.handGrenade }, '+', { item: items.candelabrador, tags: ['max'] }, '=', { item: items.theRpg }]
  },
  {
    id: 73,
    elements: [{ item: items.wineGlass }, '+', { item: items.tiragisu, tags: ['max'] }, '=', { item: items.mealTicket }]
  },
  {
    id: 74,
    elements: [{ item: items.ragingFire }, '+', { item: items.spinach, tags: ['max'] }, '=', { item: items.salamender }]
  },
  {
    id: 75,
    elements: [{ item: items.iceFang }, '+', { item: items.spellbinder, tags: ['max'] }, '=', { item: items.cocytus }]
  },
  {
    id: 76,
    elements: [{ item: items.galeForce }, '+', { item: items.bracer, tags: ['max'] }, '=', { item: items.pneumaTempestas }]
  },
  {
    id: 77,
    elements: [{ item: items.rockRiot }, '+', { item: items.stone_mask, tags: ['max'] }, '=', { item: items.gemmaTorpor }]
  },
  {
    id: 78,
    elements: [{ item: items.fulgur }, '+', { item: items.duplicator, tags: ['max'] }, '=', { item: items.tenebrisTonitrus }]
  },
  {
    id: 79,
    elements: [{ item: items.keremetBubbles }, '+', { item: items.armor, tags: ['max'] }, '=', { item: items.keremetMorbus }]
  },
  {
    id: 80,
    elements: [{ item: items.hex }, '+', { item: items.skull_o_maniac, tags: ['max'] }, '=', { item: items.nightmare }]
  },
  {
    id: 81,
    elements: [{ item: items.refectio }, '+', { item: items.clover, tags: ['max'] }, '=', { item: items.sanctuary }]
  },
  {
    id: 82,
    elements: [{ item: items.mace }, '+', { item: items.hollowHeart, tags: ['max'] }, '=', { item: items.stamazza }]
  },
  {
    id: 83,
    elements: [{ item: items.starFlail }, '+', { item: items.pummarola, tags: ['max'] }, '=', { item: items.moonRod }]
  },
  {
    id: 84,
    elements: [{ item: items.alucardSpear }, '+', { item: items.wings }, '=', { item: items.thunderboltSpear }]
  },
  {
    id: 85,
    elements: [{ item: items.trident }, '+', { item: items.duplicator, tags: ['max'] }, '=', { item: items.gungnirSouris }]
  },
  {
    id: 86,
    elements: [{ item: items.ironShield }, '+', { item: items.parm_aegis }, '=', { item: items.darkIronShield }]
  },
  {
    id: 87,
    elements: [{ item: items.guardiansTarge }, '+', { item: items.pummarola }, '=', { item: items.sacredBeastsTowerShield }]
  },
  {
    id: 88,
    elements: [{ item: items.tyrfing }, '+', { item: items.spinach }, '=', { item: items.runeSword }]
  },
  {
    id: 89,
    elements: [{ item: items.alucartSworb }, '⇒', { item: items.alucardSwords }, '⇒', { item: items.alucardShield, tags: ['six-evo'] }]
  },
  {
    id: 90,
    elements: [{ item: items.confodere }, '⇒', { item: items.volConfodere }, '⇒', { item: items.melioConfodere }]
  },
  {
    id: 91,
    elements: [{ item: items.globus }, '+', { item: items.emptyTome, tags: ['max'] }, '=', { item: items.nitesco }]
  },
  {
    id: 92,
    elements: [{ item: items.opticalShot }, '+', { item: items.karomas_mana, tags: ['max'] }, '=', { item: items.acerbatus }]
  },

  {
    id: 95,
    elements: [{ item: items.sonicDash }, '+', { item: items.wings, tags: ['max'] }, '=', { item: items.rapidusFio }]
  },
  {
    id: 96,
    elements: [{ item: items.luminatio }, '+', { item: items.crown, tags: ['max'] }, '=', { item: items.volLuminatio }]
  },
  {
    id: 97,
    elements: [{ item: items.umbra }, '+', { item: items.attractorb, tags: ['max'] }, '=', { item: items.volUmbra }]
  },
  {
    id: 98,
    elements: [{ item: items.volLuminatio }, '+', { item: items.volUmbra }, '=', { item: items.universitas }]
  },
  {
    id: 93,
    elements: [{ item: items.centralisCustos }, '+', { item: items.dextroCustos }, '+', { item: items.sinestroCustos }, '=', { item: items.trinumCustodem }]
  },
  {
    id: 94,
    elements: [{ item: items.dominusAgony }, '+', { item: items.dominusAnger }, '+', { item: items.dominusHatred }, '=', { item: items.powerOfSire }]
  },
  {
    id: 99,
    elements: [{ item: items.endoGears }, '+', { item: items.periPendulum }, '+', { item: items.myoLift }, '+', { item: items.epiHead }, '=', { item: items.clockTower }]
  }
]

const edEvolutions: TWeaponEvolution[] = [
  {
    id: 100,
    elements: [{ item: items.fleuret }, '⇒', { item: items.dressSword, tags: ['first-evo'] }, '⇒', { item: items.espadaRopera }]
  },
  {
    id: 101,
    elements: [{ item: items.splashers }, '+', { item: items.spellbinder }, '=', { item: items.pursuantBlades }]
  },
  {
    id: 102,
    elements: [{ item: items.superMissile }, '⇒', { item: items.hydraCannon, tags: ['first-evo'] }, '⇒', { item: items.hyperionBazooka }]
  },
  {
    id: 103,
    elements: [{ item: items.twinDragon }, '+', { item: items.karomas_mana }, '=', { item: items.gekkabijin }]
  },
  {
    id: 104,
    elements: [{ item: items.punch }, '⇒', { item: items.pressurePoint, tags: ['first-evo'] }, '⇒', { item: items.gildedHand }]
  },
  {
    id: 105,
    elements: [{ item: items.kick }, '+', { item: items.pummarola }, '=', { item: items.triangleKick }]
  },
  {
    id: 106, // Requires max level Spirit Rings and 5 max level passive items
    elements: [{ item: items.spiritRings }, '+', { item: items.fiveMaxPassives, tags: ['max'] }, '=', { item: items.ringsOfCalamity }]
  },
  {
    id: 107,
    elements: [{ item: items.saberMachineGun }, '⇒', { item: items.hecatonMachineGun, tags: ['first-evo'] }, '⇒', { item: items.divergence }]
  },
  {
    id: 108,
    elements: [{ item: items.eagleGun }, '+', { item: items.spinach }, '=', { item: items.pendragon }]
  },
  {
    id: 109,
    elements: [{ item: items.townSword }, '⇒', { item: items.lordstar, tags: ['first-evo'] }, '⇒', { item: items.dayblade }]
  },
  {
    id: 110,
    elements: [{ item: items.sanguineStar }, '+', { item: items.stone_mask }, '=', { item: items.bloodChalice }]
  },
  {
    id: 111,
    elements: [{ item: items.khukuri }, '+', { item: items.parm_aegis }, '=', { item: items.jetstream }]
  },
  {
    id: 112,
    elements: [{ item: items.bullova }, '+', { item: items.skull_o_maniac, tags: ['max'] }, '=', { item: items.falconwind }]
  },
  {
    id: 113,
    elements: [{ item: items.glaive }, '⇒', { item: items.featherSpear, tags: ['first-evo'] }, '⇒', { item: items.lohengrin }]
  },
  {
    id: 114,
    elements: [{ item: items.flamberge }, '⇒', { item: items.zweihander, tags: ['first-evo'] }, '⇒', { item: items.galatyn }]
  },
  {
    id: 115,
    elements: [{ item: items.emeraldRapture }, '+', { item: items.crown }, '=', { item: items.emeraldWave }]
  },
]

export const evolutions = [
  ...baseEvolutions.map((evolution) => ({ ...evolution, dlc: base })),
  ...lotmEvolutions.map((evolution) => ({ ...evolution, dlc: lotm })),
  ...todfEvolutions.map((evolution) => ({ ...evolution, dlc: todf })),
  ...emEvolutions.map((evolution) => ({ ...evolution, dlc: em })),
  ...ogEvolutions.map((evolution) => ({ ...evolution, dlc: og })),
  ...otcEvolutions.map((evolution) => ({ ...evolution, dlc: otc })),
  ...edEvolutions.map((evolution) => ({ ...evolution, dlc: ed })),
]
