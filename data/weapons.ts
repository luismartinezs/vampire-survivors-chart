import { mergeIntoNestedObjects } from "@/lib/utils"
import { TItem } from "./types"
import { base, lotm, todf, em, og, otc } from "./constants"

const _baseWeapons: Record<string, Omit<TItem, 'type'>> = {
  whip: {
    name: 'Whip',
    image: 'icon-whip',
    dlc: base
  },
  magicWand: {
    name: 'Magic Wand',
    image: 'icon-magicwand',
    dlc: base
  },
  knife: {
    name: 'Knife',
    image: 'icon-knife',
    dlc: base
  },
  axe: {
    name: 'Axe',
    image: 'icon-axe',
    dlc: base
  },
  cross: {
    name: 'Cross',
    image: 'icon-cross',
    dlc: base
  },
  king_bible: {
    name: 'King Bible',
    image: 'icon-bible',
    dlc: base
  },
  firewand: {
    name: 'Fire Wand',
    image: 'icon-firewand',
    dlc: base
  },
  garlic: {
    name: 'Garlic',
    image: 'icon-garlic',
    dlc: base
  },
  santa_water: {
    name: 'Santa Water',
    image: 'icon-water',
    dlc: base
  },
  runeTracer: {
    name: 'Rune Tracer',
    image: 'icon-runetracer',
    dlc: base
  },
  lightning: {
    name: 'Lightning Ring',
    image: 'icon-lightning',
    dlc: base
  },
  pentagram: {
    name: 'Pentagram',
    image: 'icon-pentagram',
    dlc: base
  },
  peachone: {
    name: 'Peachone',
    image: 'icon-bird1',
    dlc: base
  },
  ebonyWings: {
    name: 'Ebony Wings',
    image: 'icon-bird2',
    dlc: base
  },
  phiera_del_tuphello: {
    name: 'Phiera Der Tuphello',
    image: 'icon-guns1',
    dlc: base
  },
  eight_the_sparrow: {
    name: 'Eight The Sparrow',
    image: 'icon-guns2',
    dlc: base
  },
  gatti_amari: {
    name: 'Gatti Amari',
    image: 'icon-cat',
    dlc: base
  },
  song_of_mana: {
    name: 'Song of Mana',
    image: 'icon-mana',
    dlc: base
  },
  shadow_pinion: {
    name: 'Shadow Pinion',
    image: 'icon-pinion',
    dlc: base
  },
  clock_lancet: {
    name: 'Clock Lancet',
    image: 'icon-lancet',
    dlc: base
  },
  laurel: {
    name: 'Laurel',
    image: 'icon-laurel',
    dlc: base
  },
  vento_sacro: {
    name: 'Vento Sacro',
    image: 'icon-vento',
    dlc: base
  },
  bracelet: {
    name: 'Bracelet',
    image: 'icon-bracelet',
    dlc: base
  },
  pako_battiliar: {
    name: 'Pako Battiliar',
    image: 'icon-pako',
    dlc: base
  },
  victory_sword: {
    name: 'Victory Sword',
    image: 'icon-sword',
    dlc: base
  },
  flames_of_muspell: {
    name: 'Flames of Muspell',
    image: 'icon-flame',
    dlc: base
  },
  glass_fandango: {
    name: 'Glass Fandango',
    image: 'icon-fandango',
    dlc: base
  },
  santa_javelin: {
    name: 'Santa Javelin',
    image: 'icon-javelin',
    dlc: base
  },
  phas3r: {
    name: 'Phas3r',
    image: 'icon-phas3r',
    dlc: base
  },
  silverWind: {
    name: 'Silver Wind',
    image: 'icon-wind',
    dlc: lotm
  },
  fourSeasons: {
    name: 'Four Seasons',
    image: 'icon-seasons',
    dlc: lotm
  },
  summonNight: {
    name: 'Summon Night',
    image: 'icon-night',
    dlc: lotm
  },
  mirageRobe: {
    name: 'Mirage Robe',
    image: 'icon-mirage',
    dlc: lotm
  },
  milleBolleBlu: {
    name: 'Mille Bolle Blu',
    image: 'icon-bolle',
    dlc: lotm
  },
  nightSword: {
    name: 'Night Sword',
    image: 'icon-muramasa',
    dlc: lotm
  },
  spellString: {
    name: 'Spell String',
    image: 'icon-spell1',
    dlc: todf
  },
  spellStream: {
    name: 'Spell Stream',
    image: 'icon-spell2',
    dlc: todf
  },
  spellStrike: {
    name: 'Spell Strike',
    image: 'icon-spell3',
    dlc: todf
  },
  eskizzibur: {
    name: 'Eskizzibur',
    image: 'icon-eskizzibur',
    dlc: todf
  },
  flashArrow: {
    name: 'Flash Arrow',
    image: 'icon-arrow',
    dlc: todf
  },
  prismaticMissile: {
    name: 'Prismatic Missile',
    image: 'icon-prism',
    dlc: todf
  },
  shadowServant: {
    name: 'Shadow Servant',
    image: 'icon-servant',
    dlc: todf
  },
  report: {
    name: 'Report!',
    image: 'icon-report',
    dlc: em
  },
  luckySwipe: {
    name: 'Lucky Swipe',
    image: 'icon-swipe',
    dlc: em
  },
  lifesignScan: {
    name: 'Lifesign Scan',
    image: 'icon-scan',
    dlc: em
  },
  justVent: {
    name: 'Just Vent',
    image: 'icon-vent',
    dlc: em
  },
  clearDebris: {
    name: 'Clear Debris',
    image: 'icon-debris',
    dlc: em
  },
  sharpTongue: {
    name: 'Sharp Tongue',
    image: 'icon-tongue',
    dlc: em
  },
  scienceRocks: {
    name: 'Science Rocks',
    image: 'icon-rocks',
    dlc: em
  },
  longGun: {
    name: 'Long Gun',
    image: 'icon-longgun',
    dlc: og
  },
  shortGun: {
    name: 'Short Gun',
    image: 'icon-shortgun',
    dlc: og
  },
  spreadShot: {
    name: 'Spread Shot',
    image: 'icon-spreadshot',
    dlc: og
  },
  cuLaser: {
    name: 'C-U-Laser',
    image: 'icon-laser',
    dlc: og
  },
  firearm: {
    name: 'Firearm',
    image: 'icon-firearm',
    dlc: og
  },
  sonicBloom: {
    name: 'Sonic Bloom',
    image: 'icon-sonic',
    dlc: og
  },
  homingMissile: {
    name: 'Homing Missile',
    image: 'icon-homingmiss',
    dlc: og
  },
  diverMines: {
    name: 'Diver Mines',
    image: 'icon-mines',
    dlc: og
  },
  bladeCrossbow: {
    name: 'Blade Crossbow',
    image: 'icon-crossbow',
    dlc: og
  },
  prismLass: {
    name: 'Prism Lass',
    image: 'icon-lass',
    dlc: og
  },
  metalClaw: {
    name: 'Metal Claw',
    image: 'icon-claw',
    dlc: og
  },
  alchemyWhip: {
    name: 'Alchemy Whip',
    image: 'icon-Alchemy_Whip',
    dlc: otc
  },
  windWhip: {
    name: 'Wind Whip',
    image: 'icon-Wind_Whip',
    dlc: otc
  },
  platinumWhip: {
    name: 'Platinum Whip',
    image: 'icon-Platinum_Whip',
    dlc: otc
  },
  dragonWaterWhip: {
    name: 'Dragon Water Whip',
    image: 'icon-Dragon_Water_Whip',
    dlc: otc
  },
  sonicWhip: {
    name: 'Sonic Whip',
    image: 'icon-Sonic_Whip',
    dlc: otc
  },
  jetBlackWhip: {
    name: 'Jet Black Whip',
    image: 'icon-Jet_Black_Whip',
    dlc: otc
  },
  vibhutiWhip: {
    name: 'Vibhuti Whip',
    image: 'icon-Vibhuti_Whip',
    dlc: otc
  },
  vanitasWhip: {
    name: 'Vanitas Whip',
    image: 'icon-Vanitas_Whip',
    dlc: otc
  },
  shuriken: {
    name: 'Shuriken',
    image: 'icon-Shuriken',
    dlc: otc
  },
  curvedKnife: {
    name: 'Curved Knife',
    image: 'icon-Curved_Knife',
    dlc: otc
  },
  javelin: {
    name: 'Javelin',
    image: 'icon-Javelin',
    dlc: otc
  },
  discus: {
    name: 'Discus',
    image: 'icon-Discus',
    dlc: otc
  },
  ironBall: {
    name: 'Iron Ball',
    image: 'icon-Iron_Ball',
    dlc: otc
  },
  handGrenade: {
    name: 'Hand Grenade',
    image: 'icon-Hand_Grenade',
    dlc: otc
  },
  wineGlass: {
    name: 'Wine Glass',
    image: 'icon-Wine_Glass',
    dlc: otc
  },
  ragingFire: {
    name: 'Raging Fire',
    image: 'icon-Raging_Fire',
    dlc: otc
  },
  iceFang: {
    name: 'Ice Fang',
    image: 'icon-Ice_Fang',
    dlc: otc
  },
  galeForce: {
    name: 'Gale Force',
    image: 'icon-Gale_Force',
    dlc: otc
  },
  rockRiot: {
    name: 'Rock Riot',
    image: 'icon-Rock_Riot',
    dlc: otc
  },
  fulgur: {
    name: 'Fulgur',
    image: 'icon-Fulgur',
    dlc: otc
  },
  keremetBubbles: {
    name: 'Keremet Bubbles',
    image: 'icon-Keremet_Bubbles',
    dlc: otc
  },
  hex: {
    name: 'Hex',
    image: 'icon-Hex',
    dlc: otc
  },
  refectio: {
    name: 'Refectio',
    image: 'icon-Refectio',
    dlc: otc
  },
  mace: {
    name: 'Mace',
    image: 'icon-Mace',
    dlc: otc
  },
  starFlail: {
    name: 'Star Flail',
    image: 'icon-Star_Flail',
    dlc: otc
  },
  alucardSpear: {
    name: 'Alucard Spear',
    image: 'icon-Alucard_Spear',
    dlc: otc
  },
  trident: {
    name: 'Trident',
    image: 'icon-Trident',
    dlc: otc
  },
  ironShield: {
    name: 'Iron Shield',
    image: 'icon-Iron_Shield',
    dlc: otc
  },
  guardiansTarge: {
    name: 'Guardians Targe',
    image: 'icon-Guardians_Targe',
    dlc: otc
  },
  alucartSworb: {
    name: 'Alucart Sworb',
    image: 'icon-Alucart_Sworb',
    dlc: otc
  },
  silverRevolver: {
    name: 'Silver Revolver',
    image: 'icon-Silver_Revolver',
    dlc: otc
  },
  tyrfing: {
    name: 'Tyrfing',
    image: 'icon-Tyrfing',
    dlc: otc
  },
  confodere: {
    name: 'Confodere',
    image: 'icon-Confodere',
    dlc: otc
  },
  opticalShot: {
    name: 'Optical Shot',
    image: 'icon-Optical_Shot',
    dlc: otc
  },
  luminatio: {
    name: 'Luminatio',
    image: 'icon-Luminatio',
    dlc: otc
  },
  umbra: {
    name: 'Umbra',
    image: 'icon-Umbra',
    dlc: otc
  },
  globus: {
    name: 'Globus',
    image: 'icon-Globus',
    dlc: otc
  },
  sonicDash: {
    name: 'Sonic Dash',
    image: 'icon-Sonic_Dash',
    dlc: otc
  },
  dextroCustos: {
    name: 'Dextro Custos',
    image: 'icon-Dextro_Custos',
    dlc: otc
  },
  sinestroCustos: {
    name: 'Sinestro Custos',
    image: 'icon-Sinestro_Custos',
    dlc: otc
  },
  centralisCustos: {
    name: 'Centralis Custos',
    image: 'icon-Centralis_Custos',
    dlc: otc
  },
  dominusAnger: {
    name: 'Dominus Anger',
    image: 'icon-Dominus_Anger',
    dlc: otc
  },
  dominusHatred: {
    name: 'Dominus Hatred',
    image: 'icon-Dominus_Hatred',
    dlc: otc
  },
  dominusAgony: {
    name: 'Dominus Agony',
    image: 'icon-Dominus_Agony',
    dlc: otc
  },
  endoGears: {
    name: 'Endo Gears',
    image: 'icon-Endo_Gears',
    dlc: otc
  },
  periPendulum: {
    name: 'Peri Pendulum',
    image: 'icon-Peri_Pendulum',
    dlc: otc
  },
  myoLift: {
    name: 'Myo Lift',
    image: 'icon-Myo_Lift',
    dlc: otc
  },
  epiHead: {
    name: 'Epi Head',
    image: 'icon-Epi_Head',
    dlc: otc
  },
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
  }
}

const _weapons = { ...mergeIntoNestedObjects(_baseWeapons, { evolved: false }), ...mergeIntoNestedObjects(_evolvedWeapons, { evolved: true }) }

export const weapons = mergeIntoNestedObjects<
  typeof _weapons,
  { type: 'weapon' }
>(_weapons, { type: 'weapon' as const }) as Record<string, TItem>;