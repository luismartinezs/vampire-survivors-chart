import { mergeIntoNestedObjects } from "@/lib/utils"
import { TItem } from "./types"

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
    image: 'icon-phas3r'
  },
  photonstorm: {
    name: 'Photonstorm',
    image: 'icon-phas3r_'
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
  silverWind: {
    name: 'Silver Wind',
    image: 'icon-wind'
  },
  festiveWind: {
    name: 'Festive Wind',
    image: 'icon-wind_'
  },
  summonNight: {
    name: 'Summon Night',
    image: 'icon-night'
  },
  echoOfNight: {
    name: 'Echo of Night',
    image: 'icon-night_'
  },
  mirageRobe: {
    name: 'Mirage Robe',
    image: 'icon-mirage'
  },
  jOdore: {
    name: 'J Odore',
    image: 'icon-mirage_'
  },
  milleBolleBlu: {
    name: 'Mille Bolle Blu',
    image: 'icon-bolle'
  },
  booRooBolle: {
    name: 'Boo Roo Bolle',
    image: 'icon-bolle_'
  },
  nightSword: {
    name: 'Night Sword',
    image: 'icon-muramasa'
  },
  muramasa: {
    name: 'Muramasa',
    image: 'icon-muramasa_'
  },
  fourSeasons: {
    name: 'Four Seasons',
    image: 'icon-seasons'
  },
  godaiShuffle: {
    name: 'Godai Shuffle',
    image: 'icon-seasons_'
  },
  // totf
  eskizzibur: {
    name: 'Eskizzibur',
    image: 'icon-eskizzibur'
  },
  legionnaire: {
    name: 'Legionnaire',
    image: 'icon-eskizzibur_'
  },
  prismaticMissile: {
    name: 'Prismatic Missile',
    image: 'icon-prism'
  },
  luminaire: {
    name: 'Luminaire',
    image: 'icon-prism_'
  },
  shadowServant: {
    name: 'Shadow Servant',
    image: 'icon-servant'
  },
  ophion: {
    name: 'Ophion',
    image: 'icon-servant_'
  },
  flashArrow: {
    name: 'Flash Arrow',
    image: 'icon-arrow'
  },
  millionaire: {
    name: 'Millionaire',
    image: 'icon-arrow_'
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
  spellStorm: {
    name: 'Spell Storm',
    image: 'icon-spell_'
  },
  // em
  luckySwipe: {
    name: 'Lucky Swipe',
    image: 'icon-swipe'
  },
  crossedWires: {
    name: 'Crossed Wires',
    image: 'icon-swipe_'
  },
  report: {
    name: 'Report!',
    image: 'icon-report'
  },
  emergencyMeeting: {
    name: 'Emergency Meeting',
    image: 'icon-report_'
  },
  lifesignScan: {
    name: 'Lifesign Scan',
    image: 'icon-scan'
  },
  paranormalScan: {
    name: 'Paranormal Scan',
    image: 'icon-scan_'
  },
  justVent: {
    name: 'Just Vent',
    image: 'icon-vent'
  },
  unjustEjection: {
    name: 'Unjust Ejection',
    image: 'icon-vent_'
  },
  clearDebris: {
    name: 'Clear Debris',
    image: 'icon-debris'
  },
  clearAsteroids: {
    name: 'Clear Asteroids',
    image: 'icon-debris_'
  },
  sharpTongue: {
    name: 'Sharp Tongue',
    image: 'icon-tongue'
  },
  impostongue: {
    name: 'Impostongue',
    image: 'icon-tongue_'
  },
  scienceRocks: {
    name: 'Science Rocks',
    image: 'icon-rocks'
  },
  rocketScience: {
    name: 'Rocket Science',
    image: 'icon-rocks_'
  },
  longGun: {
    name: 'Long Gun',
    image: 'icon-longgun'
  },
  prototypeA: {
    name: 'Prototype A',
    image: 'icon-longgun_'
  },
  shortGun: {
    name: 'Short Gun',
    image: 'icon-shortgun'
  },
  prototypeB: {
    name: 'Prototype B',
    image: 'icon-shortgun_'
  },
  spreadShot: {
    name: 'Spread Shot',
    image: 'icon-spreadshot'
  },
  prototypeC: {
    name: 'Prototype C',
    image: 'icon-spreadshot_'
  },
  cuLaser: {
    name: 'C-U-Laser',
    image: 'icon-laser'
  },
  prontoBeam: {
    name: 'Pronto Beam',
    image: 'icon-laser_'
  },
  firearm: {
    name: 'Firearm',
    image: 'icon-firearm'
  },
  fireL3GS: {
    name: 'Fire-L3GS',
    image: 'icon-firearm_'
  },
  sonicBloom: {
    name: 'Sonic Bloom',
    image: 'icon-sonic'
  },
  waveBeam: {
    name: 'Wave Beam',
    image: 'icon-sonic_'
  },
  homingMissile: {
    name: 'Homing Missile',
    image: 'icon-homingmiss'
  },
  multistageMissiles: {
    name: 'Multistage Missiles',
    image: 'icon-homingmiss_'
  },
  diverMines: {
    name: 'Diver Mines',
    image: 'icon-mines'
  },
  atmoTorpedo: {
    name: 'Atmo-Torpedo',
    image: 'icon-mines_'
  },
  bladeCrossbow: {
    name: 'Blade Crossbow',
    image: 'icon-crossbow'
  },
  bfc2000Ad: {
    name: 'BFC2000-AD',
    image: 'icon-crossbow_'
  },
  prismLass: {
    name: 'Prism Lass',
    image: 'icon-lass'
  },
  timeWarp: {
    name: 'Time Warp',
    image: 'icon-lass_'
  },
  metalClaw: {
    name: 'Metal Claw',
    image: 'icon-claw'
  },
  bigFuzzyFist: {
    name: 'Big Fuzzy Fist',
    image: 'icon-claw_'
  },
  alchemyWhip: {
    name: 'Alchemy Whip',
    image: 'icon-Alchemy_Whip'
  },
  dragonWaterWhip: {
    name: 'Dragon Water Whip',
    image: 'icon-Dragon_Water_Whip'
  },
  platinumWhip: {
    name: 'Platinum Whip',
    image: 'icon-Platinum_Whip'
  },
  sonicWhip: {
    name: 'Sonic Whip',
    image: 'icon-Sonic_Whip'
  },
  windWhip: {
    name: 'Wind Whip',
    image: 'icon-Wind_Whip'
  },
  alucardSpear: {
    name: 'Alucard Spear',
    image: 'icon-Alucard_Spear'
  },
  alucartSworb: {
    name: 'Alucart Sworb',
    image: 'icon-Alucart_Sworb'
  },
  centralisCustos: {
    name: 'Centralis Custos',
    image: 'icon-Centralis_Custos'
  },
  confodere: {
    name: 'Confodere',
    image: 'icon-Confodere'
  },
  curvedKnife: {
    name: 'Curved Knife',
    image: 'icon-Curved_Knife'
  },
  dextroCustos: {
    name: 'Dextro Custos',
    image: 'icon-Dextro_Custos'
  },
  discus: {
    name: 'Discus',
    image: 'icon-Discus'
  },
  dominusAgony: {
    name: 'Dominus Agony',
    image: 'icon-Dominus_Agony'
  },
  dominusAnger: {
    name: 'Dominus Anger',
    image: 'icon-Dominus_Anger'
  },
  dominusHatred: {
    name: 'Dominus Hatred',
    image: 'icon-Dominus_Hatred'
  },
  endoGears: {
    name: 'Endo Gears',
    image: 'icon-Endo_Gears'
  },
  epiHead: {
    name: 'Epi Head',
    image: 'icon-Epi_Head'
  },
  fulgur: {
    name: 'Fulgur',
    image: 'icon-Fulgur'
  },
  galeForce: {
    name: 'Gale Force',
    image: 'icon-Gale_Force'
  },
  globus: {
    name: 'Globus',
    image: 'icon-Globus'
  },
  guardiansTarge: {
    name: 'Guardians Targe',
    image: 'icon-Guardians_Targe'
  },
  handGrenade: {
    name: 'Hand Grenade',
    image: 'icon-Hand_Grenade'
  },
  hex: {
    name: 'Hex',
    image: 'icon-Hex'
  },
  iceFang: {
    name: 'Ice Fang',
    image: 'icon-Ice_Fang'
  },
  ironBall: {
    name: 'Iron Ball',
    image: 'icon-Iron_Ball'
  },
  ironShield: {
    name: 'Iron Shield',
    image: 'icon-Iron_Shield'
  },
  javelin: {
    name: 'Javelin',
    image: 'icon-Javelin'
  },
  jetBlackWhip: {
    name: 'Jet Black Whip',
    image: 'icon-Jet_Black_Whip'
  },
  keremetBubbles: {
    name: 'Keremet Bubbles',
    image: 'icon-Keremet_Bubbles'
  },
  luminatio: {
    name: 'Luminatio',
    image: 'icon-Luminatio'
  },
  mace: {
    name: 'Mace',
    image: 'icon-Mace'
  },
  myoLift: {
    name: 'Myo Lift',
    image: 'icon-Myo_Lift'
  },
  opticalShot: {
    name: 'Optical Shot',
    image: 'icon-Optical_Shot'
  },
  periPendulum: {
    name: 'Peri Pendulum',
    image: 'icon-Peri_Pendulum'
  },
  ragingFire: {
    name: 'Raging Fire',
    image: 'icon-Raging_Fire'
  },
  refectio: {
    name: 'Refectio',
    image: 'icon-Refectio'
  },
  rockRiot: {
    name: 'Rock Riot',
    image: 'icon-Rock_Riot'
  },
  shuriken: {
    name: 'Shuriken',
    image: 'icon-Shuriken'
  },
  silverRevolver: {
    name: 'Silver Revolver',
    image: 'icon-Silver_Revolver'
  },
  sinestroCustos: {
    name: 'Sinestro Custos',
    image: 'icon-Sinestro_Custos'
  },
  sonicDash: {
    name: 'Sonic Dash',
    image: 'icon-Sonic_Dash'
  },
  starFlail: {
    name: 'Star Flail',
    image: 'icon-Star_Flail'
  },
  trident: {
    name: 'Trident',
    image: 'icon-Trident'
  },
  tyrfing: {
    name: 'Tyrfing',
    image: 'icon-Tyrfing'
  },
  umbra: {
    name: 'Umbra',
    image: 'icon-Umbra'
  },
  vanitasWhip: {
    name: 'Vanitas Whip',
    image: 'icon-Vanitas_Whip'
  },
  vibhutiWhip: {
    name: 'Vibhuti Whip',
    image: 'icon-Vibhuti_Whip'
  },
  wineGlass: {
    name: 'Wine Glass',
    image: 'icon-Wine_Glass'
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


export const weapons = mergeIntoNestedObjects<
  typeof _weapons,
  { type: 'weapon' }
>(_weapons, { type: 'weapon' as const }) as Record<string, TItem>;