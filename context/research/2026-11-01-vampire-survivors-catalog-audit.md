# Vampire Survivors installed-game catalog audit — 2026-11-01

The chart covers every explicit `evoInto` relationship found in this install, after resolving localized names and four chart naming differences. It is not a complete inventory of the game's weapons and items: four character-transformation pairs, individual Penshin Fatcha forms, several selectors and standalone weapons, and three named passives are absent.

No application data, sprites, or recipes were changed by this review.

## Scope and method

- Game: `/home/luis/.local/share/Steam/steamapps/common/Vampire Survivors`.
- Steam app 1794680, installed build **25984009**, from `appmanifest_1794680.acf`.
- Repository commit: `37a2bff47aa5a68b099464fd14de081ce62045cb`.
- Chart: evaluated exports from `data/items.ts` and `data/evolutions.ts`: **324 weapons, 33 passives, one UI marker, 150 recipes**. `data/wikiPaths.ts` is a superset of the catalog and was not used as proof that an item exists.
- Followed the UnityPy 1.25.4 approach in `context/engineering/guides/warhammer-survivors-update.md`. That guide explicitly explains that weapons/passives with no evolution relationship are omitted intentionally.
- Extracted `WEAPON_DATA`, `ITEM_DATA`, and `CHARACTER_DATA` from `VampireSurvivors_Data/resources.assets`; extracted the eight DLC `weaponData_*` tables from `StreamingAssets/aa/StandaloneLinux64/*_persistent_assets_all.bundle`. Unlike the Warhammer demo, VS needs these Addressables bundles for its DLC tables.
- Also inspected the top-level DLC bundle copies. Those contain older/different data, so they were not allowed to overwrite the bundled current tables. All eight Windows and Linux bundled weapon tables are byte-identical.
- Resolved names with `I2Languages` in `resources.assets`, object path ID **9123**. Its serialized localization records contain 14 translations; the first is English. Parsed 1,638 weapon/item name, description, and tip records with length/alignment checks. Raw names alone produce many false gaps, especially for Bloodmoon and Emergency Meeting.
- Combined weapon tables contain **489 records**, including hidden effects. All **357 actual chart items** map to game records after the four aliases below. All **176 explicit `evoInto` links** have both endpoints together in a chart recipe. Every referenced `evolvesFrom`/`requires` member is also represented in the catalog. This does not validate every recipe's level requirement or bespoke runtime mechanic.

Extraction scripts, source hashes, raw tables, normalized names, catalog exports, and comparison results are retained in `/tmp/vs-audit/` for this session. The game was not launched or modified.

## Missing character transformations

These eight weapon entries are absent from `data/weapons.ts` and their four relationships are absent from `data/evolutions.ts`:

| Base weapon | Transformed weapon | Character | Relic whose description enables morphing at level 80 |
| --- | --- | --- | --- |
| Bone | Anima of Mortaccio | Mortaccio | Chaos Malachite |
| Cherry Bomb | Yatta Daikarin | Yatta Cavallo | Chaos Rosalia |
| Carréllo | Carrozza! | Bianca Ramba | Chaos Lazulia |
| Celestial Dusting | Profusione D'Amore | O'Sole Meeo | Chaos Altemanna |

Evidence in the extracted base tables:

- `WEAPON_DATA`: `BONE2`, `CHERRY2`, `CART2EVO`, `FLOWER2` explicitly describe the evolved base weapons (lines 1981, 2061, 2138, 2213). Each has `isEvolution`, `alwaysHidden`, and `isSpecialOnly` set. They have no ordinary `evoInto` relationship, so an audit that filters hidden entries or follows only that field misses them.
- `CHARACTER_DATA`: `MORTACCIO`, `CAVALLO`, `MARIA`, `TATANKA` have the corresponding starting weapons (lines 2028, 2158, 2327, 2456).
- `ITEM_DATA`: the four relic descriptions explicitly name the characters and level 80 (lines 919, 938, 957, 976). These relics are also absent from the chart.

**Acquisition limitation:** all four output weapons' raw and localized tips say `Requires: Tetraforce.` `TETRAFORCE` (weapon table line 5557) is an absent, hidden, special-only passive whose `evoSynergy` lists Bone, Cherry Bomb, Carréllo, Celestial Dusting, and La Robba. These static records do not establish another player-accessible recipe, or prove that character morphing is the only acquisition route. Verify runtime behavior before adding a Tetraforce recipe. The four transformation pairs themselves are explicitly identified by the data.

## Other absent weapons/items

These are real named entries, but their absence generally fits the chart's existing evolution-only scope.

| Group | Missing entries | Relevance |
| --- | --- | --- |
| Base / Extra | La Robba; Greatest Jubilee | Standalone weapons without an explicit evolution link |
| Base / Extra | Candybox; Super Candybox II Turbo; Arma Dio | Selection items; Super Candybox II Turbo is flagged `isEvolution` but has no ordinary `evoInto`/`evolvesFrom` recipe |
| Penshin Fatcha | Tonno Subito; Tonnado; Tonn'omoto; Tonn'oddeeo; Tonne; Unsurpassed | Six individual forms omitted; the chart already summarizes Penshin Fatcha → Miracle of Multiplication and documents evolving it 6+ times |
| Legacy of the Moonspell | Pearl magatama | Passive/gift; no evolution ingredient reference |
| Tides of the Foscari | Party Popper; Academy Badge | Standalone weapon and passive; neither is an evolution ingredient |
| Emergency Meeting | Hats | No explicit evolution relationship |
| Ode to Castlevania | Morning Star; Coat of Arms; Belnades' Spellbook; Spectral Sword; Ebony Diabologue; Familiar Forge | Weapon selectors, with no ordinary evolution relationship of their own |
| Emerald Diorama | Intuition | Selector, with no explicit evolution relationship |
| Legacy of the Blood Moon | Velvet Dodecahedron | Passive/gift; no evolution ingredient reference |

The ordinary missing passives are **Pearl magatama, Velvet Dodecahedron, and Academy Badge**. Academy Badge is `isSpecialOnly`, but is a named passive rather than a damage effect. Hidden familiar accessories and internal skill passives also exist and are outside the chart's current scope.

The six tuna forms are a potential improvement to the existing Penshin explanation, rather than evidence that its final evolution is missing. Do not add `Tonnent` merely because localization contains it: its description says `Deprecated tuna`, and `EX_PENSHIN_EVO5` has no entry in this build's weapon table.

There are also **21 absent counter/sub-weapons** without `alwaysHidden`, all marked `isSpecialOnly`: Cygnus, Zhar Ptytsia, Red Muscle, Twice Upon a Time, Flock Destroyer, Horse Cartridge, Levelin'Eh, Speculo Globus, Speculo Raging Fire, Speculo Ice Fang, Speculo Rock Riot, Speculo Gale Force, Speculo Fulgur, Speculo Keremet Bubbles, Speculo Refectio, Speculo Hex, Speculo Anura, Silver Tongue, Prism Damsel, Silver Sliver, and Party Pooper. These are not missing ordinary evolution recipes. Additional `alwaysHidden` effects, hazards, familiar accessories, pickups, and unrelated relics were not promoted to chart additions.

## Naming differences, not missing weapons

| Existing chart label | Installed English label | Stable game key | Chart location |
| --- | --- | --- | --- |
| Wicked Rune | **Wicked Ruler** | `FOLLOWER_KNIFE2` | `data/weapons.ts:1286` |
| Flames of Muspell | **Flames of Misspell** | `MISSPELL` | `data/weapons.ts:103` |
| Homing Missile | **Homing Miss** | `FB_HOMING` | `data/weapons.ts:279` |
| Tiragisú | **Tirajisú** | `REVIVAL` | `data/passives.ts:78` |

These already have matching chart items and recipes. Names were compared after normalizing punctuation, whitespace, accents, and case; the four rows above required explicit aliases.

## Suggested follow-up

Correct the four labels if the chart should match this build's English localization. Consider adding the four character-transformation rows with their special conditions. Keep no-evolution passives, selectors, standalone weapons, and internal effects out unless intentionally broadening the product's scope. Expand the Penshin explanation only if showing its individual forms would help users.

No missing ordinary DLC evolution endpoint was found, including the current Bloodmoon and Moonspell additions. Static data review cannot prove that every special acquisition mechanism is covered; in-game verification remains necessary before publishing new transformation requirements.
