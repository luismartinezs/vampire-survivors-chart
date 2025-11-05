import { mergeIntoNestedObjects } from "@/lib/utils"
import { TItem } from "./types"
import { base, lotm, todf, em, og, otc, ed, ante } from "./constants"

const baseWeapons: Record<string, Omit<TItem, 'type' | 'dlc'>> = {
  whip: {
    name: 'Whip',
    image: 'icon-whip'
  },
  magicWand: {
    name: 'Magic Wand',
    image: 'icon-magicwand'
  },
  knife: {
    name: 'Knife',
    image: 'icon-knife'
  },
  axe: {
    name: 'Axe',
    image: 'icon-axe'
  },
  cross: {
    name: 'Cross',
    image: 'icon-cross'
  },
  king_bible: {
    name: 'King Bible',
    image: 'icon-bible'
  },
  firewand: {
    name: 'Fire Wand',
    image: 'icon-firewand'
  },
  garlic: {
    name: 'Garlic',
    image: 'icon-garlic'
  },
  santa_water: {
    name: 'Santa Water',
    image: 'icon-water'
  },
  runeTracer: {
    name: 'Rune Tracer',
    image: 'icon-runetracer'
  },
  lightning: {
    name: 'Lightning Ring',
    image: 'icon-lightning',
  },
  pentagram: {
    name: 'Pentagram',
    image: 'icon-pentagram',
  },
  peachone: {
    name: 'Peachone',
    image: 'icon-bird1',
  },
  ebonyWings: {
    name: 'Ebony Wings',
    image: 'icon-bird2',
  },
  phiera_del_tuphello: {
    name: 'Phiera Der Tuphello',
    image: 'icon-guns1',
  },
  eight_the_sparrow: {
    name: 'Eight The Sparrow',
    image: 'icon-guns2',
  },
  gatti_amari: {
    name: 'Gatti Amari',
    image: 'icon-cat',
  },
  song_of_mana: {
    name: 'Song of Mana',
    image: 'icon-mana',
  },
  shadow_pinion: {
    name: 'Shadow Pinion',
    image: 'icon-pinion',
  },
  clock_lancet: {
    name: 'Clock Lancet',
    image: 'icon-lancet',
  },
  laurel: {
    name: 'Laurel',
    image: 'icon-laurel',
  },
  vento_sacro: {
    name: 'Vento Sacro',
    image: 'icon-vento',
  },
  bracelet: {
    name: 'Bracelet',
    image: 'icon-bracelet',
  },
  pako_battiliar: {
    name: 'Pako Battiliar',
    image: 'icon-pako',
  },
  ammo_appalate: {
    name: 'Ammo Appalate',
    image: 'icon-Ammo_Appalate'
  },
  victory_sword: {
    name: 'Victory Sword',
    image: 'icon-sword',
  },
  flames_of_muspell: {
    name: 'Flames of Muspell',
    image: 'icon-flame',
  },
  glass_fandango: {
    name: 'Glass Fandango',
    image: 'icon-fandango',
  },
  santa_javelin: {
    name: 'Santa Javelin',
    image: 'icon-javelin',
  },
  phas3r: {
    name: 'Phas3r',
    image: 'icon-phas3r',
  },
  gazeOfGaea: {
    name: 'Gaze of Gaea',
    image: 'icon-Gaze_of_Gaea',
  },
  magiStone: {
    name: 'Magi-Stone',
    image: 'icon-Magi-Stone',
  },
  chaosRune: {
    name: 'Chaos Rune',
    image: 'icon-Chaos_Rune',
  },
}

const lotmWeapons: Record<string, Omit<TItem, 'type' | 'dlc'>> = {
  silverWind: {
    name: 'Silver Wind',
    image: 'icon-wind',
  },
  fourSeasons: {
    name: 'Four Seasons',
    image: 'icon-seasons',
  },
  summonNight: {
    name: 'Summon Night',
    image: 'icon-night',
  },
  mirageRobe: {
    name: 'Mirage Robe',
    image: 'icon-mirage',
  },
  milleBolleBlu: {
    name: 'Mille Bolle Blu',
    image: 'icon-bolle',
  },
  nightSword: {
    name: 'Night Sword',
    image: 'icon-muramasa',
  },
}

const todfWeapons: Record<string, Omit<TItem, 'type' | 'dlc'>> = {
  spellString: {
    name: 'Spell String',
    image: 'icon-spell1',
  },
  spellStream: {
    name: 'Spell Stream',
    image: 'icon-spell2',
  },
  spellStrike: {
    name: 'Spell Strike',
    image: 'icon-spell3',
  },
  eskizzibur: {
    name: 'Eskizzibur',
    image: 'icon-eskizzibur',
  },
  flashArrow: {
    name: 'Flash Arrow',
    image: 'icon-arrow',
  },
  prismaticMissile: {
    name: 'Prismatic Missile',
    image: 'icon-prism',
  },
  shadowServant: {
    name: 'Shadow Servant',
    image: 'icon-servant',
  },
}

const emWeapons: Record<string, Omit<TItem, 'type' | 'dlc'>> = {
  report: {
    name: 'Report!',
    image: 'icon-report',
  },
  luckySwipe: {
    name: 'Lucky Swipe',
    image: 'icon-swipe',
  },
  lifesignScan: {
    name: 'Lifesign Scan',
    image: 'icon-scan',
  },
  justVent: {
    name: 'Just Vent',
    image: 'icon-vent',
  },
  clearDebris: {
    name: 'Clear Debris',
    image: 'icon-debris',
  },
  sharpTongue: {
    name: 'Sharp Tongue',
    image: 'icon-tongue',
  },
  scienceRocks: {
    name: 'Science Rocks',
    image: 'icon-rocks',
  },
}

const ogWeapons: Record<string, Omit<TItem, 'type' | 'dlc'>> = {
  longGun: {
    name: 'Long Gun',
    image: 'icon-longgun',
  },
  shortGun: {
    name: 'Short Gun',
    image: 'icon-shortgun',
  },
  spreadShot: {
    name: 'Spread Shot',
    image: 'icon-spreadshot',
  },
  cuLaser: {
    name: 'C-U-Laser',
    image: 'icon-laser',
  },
  firearm: {
    name: 'Firearm',
    image: 'icon-firearm',
  },
  sonicBloom: {
    name: 'Sonic Bloom',
    image: 'icon-sonic',
  },
  homingMissile: {
    name: 'Homing Missile',
    image: 'icon-homingmiss',
  },
  diverMines: {
    name: 'Diver Mines',
    image: 'icon-mines',
  },
  bladeCrossbow: {
    name: 'Blade Crossbow',
    image: 'icon-crossbow',
  },
  prismLass: {
    name: 'Prism Lass',
    image: 'icon-lass',
  },
  metalClaw: {
    name: 'Metal Claw',
    image: 'icon-claw',
  },
}

const otcWeapons: Record<string, Omit<TItem, 'type' | 'dlc'>> = {
  alchemyWhip: {
    name: 'Alchemy Whip',
    image: 'icon-Alchemy_Whip',
  },
  windWhip: {
    name: 'Wind Whip',
    image: 'icon-Wind_Whip',
  },
  platinumWhip: {
    name: 'Platinum Whip',
    image: 'icon-Platinum_Whip',
  },
  dragonWaterWhip: {
    name: 'Dragon Water Whip',
    image: 'icon-Dragon_Water_Whip',
  },
  sonicWhip: {
    name: 'Sonic Whip',
    image: 'icon-Sonic_Whip',
  },
  jetBlackWhip: {
    name: 'Jet Black Whip',
    image: 'icon-Jet_Black_Whip',
  },
  vibhutiWhip: {
    name: 'Vibhuti Whip',
    image: 'icon-Vibhuti_Whip',
  },
  vanitasWhip: {
    name: 'Vanitas Whip',
    image: 'icon-Vanitas_Whip',
  },
  shuriken: {
    name: 'Shuriken',
    image: 'icon-Shuriken',
  },
  curvedKnife: {
    name: 'Curved Knife',
    image: 'icon-Curved_Knife',
  },
  javelin: {
    name: 'Javelin',
    image: 'icon-Javelin',
  },
  discus: {
    name: 'Discus',
    image: 'icon-Discus',
  },
  ironBall: {
    name: 'Iron Ball',
    image: 'icon-Iron_Ball',
  },
  handGrenade: {
    name: 'Hand Grenade',
    image: 'icon-Hand_Grenade',
  },
  wineGlass: {
    name: 'Wine Glass',
    image: 'icon-Wine_Glass',
  },
  ragingFire: {
    name: 'Raging Fire',
    image: 'icon-Raging_Fire',
  },
  iceFang: {
    name: 'Ice Fang',
    image: 'icon-Ice_Fang',
  },
  galeForce: {
    name: 'Gale Force',
    image: 'icon-Gale_Force',
  },
  rockRiot: {
    name: 'Rock Riot',
    image: 'icon-Rock_Riot',
  },
  fulgur: {
    name: 'Fulgur',
    image: 'icon-Fulgur',
  },
  keremetBubbles: {
    name: 'Keremet Bubbles',
    image: 'icon-Keremet_Bubbles',
  },
  hex: {
    name: 'Hex',
    image: 'icon-Hex',
  },
  refectio: {
    name: 'Refectio',
    image: 'icon-Refectio',
  },
  mace: {
    name: 'Mace',
    image: 'icon-Mace',
  },
  starFlail: {
    name: 'Star Flail',
    image: 'icon-Star_Flail',
  },
  alucardSpear: {
    name: 'Alucard Spear',
    image: 'icon-Alucard_Spear',
  },
  trident: {
    name: 'Trident',
    image: 'icon-Trident',
  },
  ironShield: {
    name: 'Iron Shield',
    image: 'icon-Iron_Shield',
  },
  guardiansTarge: {
    name: 'Guardians Targe',
    image: 'icon-Guardians_Targe',
  },
  alucartSworb: {
    name: 'Alucart Sworb',
    image: 'icon-Alucart_Sworb',
  },
  silverRevolver: {
    name: 'Silver Revolver',
    image: 'icon-Silver_Revolver',
  },
  tyrfing: {
    name: 'Tyrfing',
    image: 'icon-Tyrfing',
  },
  confodere: {
    name: 'Confodere',
    image: 'icon-Confodere',
  },
  opticalShot: {
    name: 'Optical Shot',
    image: 'icon-Optical_Shot',
  },
  luminatio: {
    name: 'Luminatio',
    image: 'icon-Luminatio',
  },
  umbra: {
    name: 'Umbra',
    image: 'icon-Umbra',
  },
  globus: {
    name: 'Globus',
    image: 'icon-Globus',
  },
  sonicDash: {
    name: 'Sonic Dash',
    image: 'icon-Sonic_Dash',
  },
  dextroCustos: {
    name: 'Dextro Custos',
    image: 'icon-Dextro_Custos',
  },
  sinestroCustos: {
    name: 'Sinestro Custos',
    image: 'icon-Sinestro_Custos',
  },
  centralisCustos: {
    name: 'Centralis Custos',
    image: 'icon-Centralis_Custos',
  },
  dominusAnger: {
    name: 'Dominus Anger',
    image: 'icon-Dominus_Anger',
  },
  dominusHatred: {
    name: 'Dominus Hatred',
    image: 'icon-Dominus_Hatred',
  },
  dominusAgony: {
    name: 'Dominus Agony',
    image: 'icon-Dominus_Agony',
  },
  endoGears: {
    name: 'Endo Gears',
    image: 'icon-Endo_Gears',
  },
  periPendulum: {
    name: 'Peri Pendulum',
    image: 'icon-Peri_Pendulum',
  },
  myoLift: {
    name: 'Myo Lift',
    image: 'icon-Myo_Lift',
  },
  epiHead: {
    name: 'Epi Head',
    image: 'icon-Epi_Head',
  },
  anura: {
    name: 'Anura',
    image: 'icon-Anura',
  },
  arrowOfGoth: {
    name: 'Arrow of Goth',
    image: 'icon-Arrow_of_Goth',
  },
  auraBlast: {
    name: 'Aura Blast',
    image: 'icon-Aura_Blast',
  },
  hydroStorm: {
    name: 'Hydro Storm',
    image: 'icon-Hydro_Storm',
  },
  icebrand: {
    name: 'Icebrand',
    image: 'icon-Icebrand',
  },
  kaiserKnuckle: {
    name: 'Kaiser Knuckle',
    image: 'icon-Kaiser_Knuckle',
  },
  pocketKnife: {
    name: 'Pocket Knife',
    image: 'icon-Pocket_Knife',
  },
  soulSteal: {
    name: 'Soul Steal',
    image: 'icon-Soul_Steal',
  },
  summonSpiritTornado: {
    name: 'Summon Spirit Tornado',
    image: 'icon-Spirit_Tornado',
  },
  summonSpirit: {
    name: 'Summon Spirit',
    image: 'icon-Summon_Spirit',
  },
  svarogStatue: {
    name: 'Svarog Statue',
    image: 'icon-Svarog_Statue',
  },
  swordBrothers: {
    name: 'Sword Brothers',
    image: 'icon-Sword_Brothers',
  },
  trollBomb: {
    name: 'Troll Bomb',
    image: 'icon-Troll_Bomb',
  },
  valmanway: {
    name: 'Valmanway',
    image: 'icon-Valmanway',
  },
  darkRift: {
    name: 'Dark Rift',
    image: 'icon-Dark_Rift',
  },
  grandCross: {
    name: 'Grand Cross',
    image: 'icon-Grand_Cross',
  },
}

const edWeapons: Record<string, Omit<TItem, 'type' | 'dlc'>> = {
  fleuret: {
    name: 'Fleuret',
    image: 'icon-Fleuret',
  },
  splashers: {
    name: 'Splashers',
    image: 'icon-Splashers',
  },
  superMissile: {
    name: 'Super Missile',
    image: 'icon-Super_Missile',
  },
  twinDragon: {
    name: 'Twin Dragon',
    image: 'icon-Twin_Dragon',
  },
  punch: {
    name: 'Punch',
    image: 'icon-Punch',
  },
  kick: {
    name: 'Kick',
    image: 'icon-Kick',
  },
  spiritRings: {
    name: 'Spirit Rings',
    image: 'icon-Spirit_Rings',
  },
  saberMachineGun: {
    name: 'Saber Machine Gun',
    image: 'icon-Saber_Machine_Gun',
  },
  eagleGun: {
    name: 'Eagle Gun',
    image: 'icon-Eagle_Gun',
  },
  townSword: {
    name: 'Town Sword',
    image: 'icon-Town_Sword',
  },
  sanguineStar: {
    name: 'Sanguine Star',
    image: 'icon-Sanguine_Star',
  },
  khukuri: {
    name: 'Khukuri',
    image: 'icon-Khukuri',
  },
  bullova: {
    name: 'Bullova',
    image: 'icon-Bullova',
  },
  glaive: {
    name: 'Glaive',
    image: 'icon-Glaive',
  },
  flamberge: {
    name: 'Flamberge',
    image: 'icon-Flamberge',
  },
  emeraldRapture: {
    name: 'Emerald Rapture',
    image: 'icon-Emerald_Rapture',
  },
}

const anteWeapons: Record<string, Omit<TItem, 'type' | 'dlc'>> = {
  celestialBooster: {
    name: 'Celestial Booster',
    image: 'icon-Celestial_Booster',
  },
  fibonacciSpritz: {
    name: 'Fibonacci Spritz',
    image: 'icon-Fibonacci_Spritz',
  },
  grosMichel: {
    name: 'Gros Michel',
    image: 'icon-Gros_Michel',
  },
  infernolatro: {
    name: 'Infernolatro',
    image: 'icon-Infernolatro',
  },
}

const _baseWeapons: Record<string, Omit<TItem, 'type'>> = {
  ...mergeIntoNestedObjects(baseWeapons, { dlc: base }),
  ...mergeIntoNestedObjects(edWeapons, { dlc: ed }),
  ...mergeIntoNestedObjects(anteWeapons, { dlc: ante }),
  ...mergeIntoNestedObjects(lotmWeapons, { dlc: lotm }),
  ...mergeIntoNestedObjects(todfWeapons, { dlc: todf }),
  ...mergeIntoNestedObjects(emWeapons, { dlc: em }),
  ...mergeIntoNestedObjects(ogWeapons, { dlc: og }),
  ...mergeIntoNestedObjects(otcWeapons, { dlc: otc }),
}

const _evolvedWeapons: Record<string, Omit<TItem, 'type'>> = {
  bloodyTear: {
    name: 'Bloody Tear',
    image: 'icon-whip_'
  },
  holyWand: {
    name: 'Holy Wand',
    image: 'icon-magicwand_'
  },
  thousandEdge: {
    name: 'Thousand Edge',
    image: 'icon-knife_'
  },
  deathSpiral: {
    name: 'Death Spiral',
    image: 'icon-axe_'
  },
  heavenSword: {
    name: 'Heaven Sword',
    image: 'icon-cross_'
  },
  noFuture: {
    name: 'NO FUTURE',
    image: 'icon-runetracer_'
  },
  hellfire: {
    name: 'Hellfire',
    image: 'icon-firewand_'
  },
  thunderLoop: {
    name: 'Thunder Loop',
    image: 'icon-lightning_'
  },
  vandalier: {
    name: 'Vandalier',
    image: 'icon-bird_'
  },
  soulEater: {
    name: 'Soul Eater',
    image: 'icon-garlic_'
  },
  unholyVespers: {
    name: 'Unholy Vespers',
    image: 'icon-bible_'
  },
  la_borra: {
    name: 'La Borra',
    image: 'icon-water_'
  },
  gorgeous_moon: {
    name: 'Gorgeous Moon',
    image: 'icon-pentagram_'
  },
  crimsonShroud: {
    name: 'Crimson Shroud',
    image: 'icon-laurel_'
  },
  infiniteCorridor: {
    name: 'Infinite Corridor',
    image: 'icon-lancet_'
  },
  mannajja: {
    name: 'Mannajja',
    image: 'icon-mana_'
  },
  phieraggi: {
    name: 'Phieraggi',
    image: 'icon-guns_'
  },
  ashes_of_muspell: {
    name: 'Ashes of Muspell',
    image: 'icon-flame_'
  },
  sole_solution: {
    name: 'Sole Solution',
    image: 'icon-sword_'
  },
  bi_bracelet: {
    name: 'Bi-Bracelet',
    image: 'icon-bracelet_'
  },
  tri_bracelet: {
    name: 'Tri-Bracelet',
    image: 'icon-bracelet__'
  },
  seraphic_cry: {
    name: 'Seraphic Cry',
    image: 'icon-javelin_'
  },
  mazo_familiar: {
    name: 'Mazo Familiar',
    image: 'icon-pako_'
  },
  gunastrophe: {
    name: 'Gunastrophe',
    image: 'icon-Gunastrophe'
  },
  photonstorm: {
    name: 'Photonstorm',
    image: 'icon-phas3r_'
  },
  celestial_voulge: {
    name: 'Celestial Voulge',
    image: 'icon-fandango_'
  },
  fuwalafuwaloo: {
    name: 'Fuwalafuwaloo',
    image: 'icon-vento_'
  },
  valkyrie_turner: {
    name: 'Valkyrie Turner',
    image: 'icon-pinion_'
  },
  vicious_hunger: {
    name: 'Vicious Hunger',
    image: 'icon-cat_'
  },
  embraceOfGaea: {
    name: 'Embrace of Gaea',
    image: 'icon-Embrace_of_Gaea',
  },
  kyraStones: {
    name: 'Kyra-Stones',
    image: 'icon-Kyra-Stones',
  },
  festiveWind: {
    name: 'Festive Wind',
    image: 'icon-wind_'
  },
  echoOfNight: {
    name: 'Echo of Night',
    image: 'icon-night_'
  },
  jOdore: {
    name: 'J Odore',
    image: 'icon-mirage_'
  },
  booRooBolle: {
    name: 'Boo Roo Bolle',
    image: 'icon-bolle_'
  },
  muramasa: {
    name: 'Muramasa',
    image: 'icon-muramasa_'
  },
  godaiShuffle: {
    name: 'Godai Shuffle',
    image: 'icon-seasons_'
  },
  legionnaire: {
    name: 'Legionnaire',
    image: 'icon-eskizzibur_'
  },
  luminaire: {
    name: 'Luminaire',
    image: 'icon-prism_'
  },
  ophion: {
    name: 'Ophion',
    image: 'icon-servant_'
  },
  millionaire: {
    name: 'Millionaire',
    image: 'icon-arrow_'
  },
  spellStorm: {
    name: 'Spell Storm',
    image: 'icon-spell_'
  },
  crossedWires: {
    name: 'Crossed Wires',
    image: 'icon-swipe_'
  },
  emergencyMeeting: {
    name: 'Emergency Meeting',
    image: 'icon-report_'
  },
  paranormalScan: {
    name: 'Paranormal Scan',
    image: 'icon-scan_'
  },
  unjustEjection: {
    name: 'Unjust Ejection',
    image: 'icon-vent_'
  },
  clearAsteroids: {
    name: 'Clear Asteroids',
    image: 'icon-debris_'
  },
  impostongue: {
    name: 'Impostongue',
    image: 'icon-tongue_'
  },
  rocketScience: {
    name: 'Rocket Science',
    image: 'icon-rocks_'
  },
  prototypeA: {
    name: 'Prototype A',
    image: 'icon-longgun_'
  },
  prototypeB: {
    name: 'Prototype B',
    image: 'icon-shortgun_'
  },
  prototypeC: {
    name: 'Prototype C',
    image: 'icon-spreadshot_'
  },
  prontoBeam: {
    name: 'Pronto Beam',
    image: 'icon-laser_'
  },
  fireL3GS: {
    name: 'Fire-L3GS',
    image: 'icon-firearm_'
  },
  waveBeam: {
    name: 'Wave Beam',
    image: 'icon-sonic_'
  },
  multistageMissiles: {
    name: 'Multistage Missiles',
    image: 'icon-homingmiss_'
  },
  atmoTorpedo: {
    name: 'Atmo-Torpedo',
    image: 'icon-mines_'
  },
  bfc2000Ad: {
    name: 'BFC2000-AD',
    image: 'icon-crossbow_'
  },
  timeWarp: {
    name: 'Time Warp',
    image: 'icon-lass_'
  },
  bigFuzzyFist: {
    name: 'Big Fuzzy Fist',
    image: 'icon-claw_'
  },
  acerbatus: {
    name: 'Acerbatus',
    image: 'icon-Acerbatus'
  },
  alucardShield: {
    name: 'Alucard Shield',
    image: 'icon-Alucard_Shield'
  },
  alucardSwords: {
    name: 'Alucard Swords',
    image: 'icon-Alucard_Swords'
  },
  nitesco: {
    name: 'Nitesco',
    image: 'icon-Anima_of_Dracula'
  },
  aurablasterTip: {
    name: 'Aurablaster Tip',
    image: 'icon-Aurablaster_Tip'
  },
  bwakaKnife: {
    name: 'Bwaka Knife',
    image: 'icon-Bwaka_Knife'
  },
  clockTower: {
    name: 'Clock Tower',
    image: 'icon-Clock_Tower'
  },
  cocytus: {
    name: 'Cocytus',
    image: 'icon-Cocytus'
  },
  crissaegrimTip: {
    name: 'Crissaegrim Tip',
    image: 'icon-Crissaegrim_Tip'
  },
  crossCrasherTip: {
    name: 'Cross Crasher Tip',
    image: 'icon-Cross_Crasher_Tip'
  },
  darkIronShield: {
    name: 'Dark Iron Shield',
    image: 'icon-Dark_Iron_Shield'
  },
  daybreakerTip: {
    name: 'Daybreaker Tip',
    image: 'icon-Daybreaker_Tip'
  },
  gemmaTorpor: {
    name: 'Gemma Torpor',
    image: 'icon-Gemma_Torpor'
  },
  gungnirSouris: {
    name: 'Gungnir Souris',
    image: 'icon-GungnirSouris'
  },
  hydrostormerTip: {
    name: 'Hydrostormer Tip',
    image: 'icon-Hydrostormer_Tip'
  },
  jewelGun: {
    name: 'Jewel Gun',
    image: 'icon-Jewel_Gun'
  },
  keremetMorbus: {
    name: 'Keremet Morbus',
    image: 'icon-Keremet_Morbus'
  },
  longInus: {
    name: 'Long Inus',
    image: 'icon-Long_Inus'
  },
  mealTicket: {
    name: 'Meal Ticket',
    image: 'icon-Meal_Ticket'
  },
  melioConfodere: {
    name: 'Melio Confodere',
    image: 'icon-Melio_Confodere'
  },
  moonRod: {
    name: 'Moon Rod',
    image: 'icon-Moon_Rod'
  },
  mormegilTip: {
    name: 'Mormegil Tip',
    image: 'icon-Mormegil_Tip'
  },
  nightmare: {
    name: 'Nightmare',
    image: 'icon-Nightmare'
  },
  pneumaTempestas: {
    name: 'Pneuma Tempestas',
    image: 'icon-Pneuma_Tempestas'
  },
  powerOfSire: {
    name: 'Power of Sire',
    image: 'icon-Power_of_Sire'
  },
  rapidusFio: {
    name: 'Rapidus Fio',
    image: 'icon-Rapidus_Fio'
  },
  runeSword: {
    name: 'Rune Sword',
    image: 'icon-Rune_Sword'
  },
  sacredBeastsTowerShield: {
    name: 'Sacred Beasts Tower Shield',
    image: 'icon-Sacred_Beasts_Tower_Shield'
  },
  salamender: {
    name: 'Salamender',
    image: 'icon-Salamender'
  },
  sanctuary: {
    name: 'Sanctuary',
    image: 'icon-Sanctuary'
  },
  spiritTornadoTip: {
    name: 'Spirit Tornado Tip',
    image: 'icon-Spirit_Tornado_Tip'
  },
  stamazza: {
    name: 'Stamazza',
    image: 'icon-Stamazza'
  },
  stellarBlade: {
    name: 'Stellar Blade',
    image: 'icon-Stellar_Blade'
  },
  tenebrisTonitrus: {
    name: 'Tenebris Tonitrus',
    image: 'icon-Tenebris_Tonitrus'
  },
  theRpg: {
    name: 'The RPG',
    image: 'icon-The_RPG'
  },
  thunderboltSpear: {
    name: 'Thunderbolt Spear',
    image: 'icon-Thunderbolt_Spear'
  },
  trinumCustodem: {
    name: 'Trinum Custodem',
    image: 'icon-Trinum_Custodem'
  },
  universitas: {
    name: 'Universitas',
    image: 'icon-Universitas'
  },
  vampireKiller: {
    name: 'Vampire Killer',
    image: 'icon-Vampire_Killer'
  },
  volConfodere: {
    name: 'Vol Confodere',
    image: 'icon-Vol_Confodere'
  },
  volLuminatio: {
    name: 'Vol Luminatio',
    image: 'icon-Vol_Luminatio'
  },
  volUmbra: {
    name: 'Vol Umbra',
    image: 'icon-Vol_Umbra'
  },
  wreckingBall: {
    name: 'Wrecking Ball',
    image: 'icon-Wrecking_Ball'
  },
  yagyuShuriken: {
    name: 'Yagyu Shuriken',
    image: 'icon-Yagyu_Shuriken'
  },
  dressSword: {
    name: 'Dress Sword',
    image: 'icon-Dress_Sword'
  },
  pursuantBlades: {
    name: 'Pursuant Blades',
    image: 'icon-Pursuant_Blades'
  },
  hydraCannon: {
    name: 'Hydra Cannon',
    image: 'icon-Hydra_Cannon'
  },
  gekkabijin: {
    name: 'Gekkabijin',
    image: 'icon-Gekkabijin'
  },
  pressurePoint: {
    name: 'Pressure Point',
    image: 'icon-Pressure_Point'
  },
  triangleKick: {
    name: 'Triangle Kick',
    image: 'icon-Triangle_Kick'
  },
  ringsOfCalamity: {
    name: 'Rings of Calamity',
    image: 'icon-Rings_of_Calamity'
  },
  hecatonMachineGun: {
    name: 'Hecaton Machine Gun',
    image: 'icon-Hecaton_Machine_Gun'
  },
  pendragon: {
    name: 'Pendragon',
    image: 'icon-Pendragon'
  },
  lordstar: {
    name: 'Lordstar',
    image: 'icon-Lordstar'
  },
  bloodChalice: {
    name: 'Blood Chalice',
    image: 'icon-Blood_Chalice'
  },
  jetstream: {
    name: 'Jetstream',
    image: 'icon-Jetstream'
  },
  falconwind: {
    name: 'Falconwind',
    image: 'icon-Falconwind'
  },
  featherSpear: {
    name: 'Feather Spear',
    image: 'icon-Feather_Spear'
  },
  zweihander: {
    name: 'Zweihander',
    image: 'icon-Zweihander'
  },
  emeraldWave: {
    name: 'Emerald Wave',
    image: 'icon-Emerald_Wave'
  },
  espadaRopera: {
    name: 'Espada Ropera',
    image: 'icon-Espada_Ropera'
  },
  hyperionBazooka: {
    name: 'Hyperion Bazooka',
    image: 'icon-Hyperion_Bazooka'
  },
  gildedHand: {
    name: 'Gilded Hand',
    image: 'icon-Gilded_Hand'
  },
  divergence: {
    name: 'Divergence',
    image: 'icon-Divergence'
  },
  dayblade: {
    name: 'Dayblade',
    image: 'icon-Dayblade'
  },
  lohengrin: {
    name: 'Lohengrin',
    image: 'icon-Lohengrin'
  },
  galatyn: {
    name: 'Galatyn',
    image: 'icon-Galatyn'
  },
  darkFrogamorphosis: {
    name: 'Dark Frogamorphosis',
    image: 'icon-Dark_Frogamorphosis',
  },
  diesIrae: {
    name: 'Dies Irae',
    image: 'icon-Dies_Irae',
  },
  kardiaPhlegeton: {
    name: 'Kardía Phlegeton',
    image: 'icon-Kardía_Phlegeton',
  },
  hydroPumpClimax: {
    name: 'Hydro Pump Climax',
    image: 'icon-Hydro_Pump_Climax',
  },
  ninthCircle: {
    name: 'Ninth Circle',
    image: 'icon-Ninth_Circle',
  },
  lapisteTepisto: {
    name: 'Lapiste Tepisto',
    image: 'icon-Lapiste_Tepisto',
  },
  claimhSolais: {
    name: 'Claimh Solais',
    image: 'icon-Claimh_Solais',
  },
  powerOfLire: {
    name: 'Power of Lire',
    image: 'icon-Power_of_Lire',
  },
  venusCrescent: {
    name: 'Venus Crescent',
    image: 'icon-Venus_Crescent',
  },
  spiritOfLight: {
    name: 'Spirit of Light',
    image: 'icon-Spirit_of_Light',
  },
  darknessIllusion: {
    name: 'Darkness Illusion',
    image: 'icon-Darkness_Illusion',
  },
  vjayaSisters: {
    name: 'Vjaya Sisters',
    image: 'icon-Vjaya_Sisters',
  },
  carnageHeart: {
    name: 'Carnage Heart',
    image: 'icon-Carnage_Heart',
  },
  millionCut: {
    name: 'Million Cut',
    image: 'icon-Million_Cut',
  },
  legacyOfDeathSoulRiver: {
    name: 'Legacy of Death: Soul River',
    image: 'icon-Legacy_of_Death-_Soul_River',
  },
  archAngle: {
    name: 'Arch Angle',
    image: 'icon-Arch_Angle',
  },
  wickedRune: {
    name: 'Wicked Rune',
    image: 'icon-Wicked_Rune',
  },
  negativeSpace: {
    name: 'Negative Space',
    image: 'icon-Negative_Space',
  },
  royalFlush: {
    name: 'Royal Flush',
    image: 'icon-Royal_Flush',
  },
  cavendish: {
    name: 'Cavendish',
    image: 'icon-Cavendish',
  },
  naneInferno: {
    name: 'NaneInferno',
    image: 'icon-NaneInferno',
  },
}

const _weapons = { ...mergeIntoNestedObjects(_baseWeapons, { evolved: false }), ...mergeIntoNestedObjects(_evolvedWeapons, { evolved: true }) }

export const weapons = mergeIntoNestedObjects<
  typeof _weapons,
  { type: 'weapon' }
>(_weapons, { type: 'weapon' as const }) as Record<string, TItem>;
