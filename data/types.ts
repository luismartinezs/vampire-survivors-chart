import { base, em, lotm, og, otc, todf, ed, ante, lotbm, w40k, aos } from "./constants";

export type TItemType = "weapon" | "passive" | "misc";

export interface TItem {
  name: string;
  image: string;
  type: TItemType;
  evolved?: boolean;
  dlc?: TDlc;
  wikiPath?: string;
}

export type TOperand = "+" | "=" | "→" | "⇒";

export type TEvolutionItem = {
  item: TItem;
  tags?: string[];
};

export type TEvolutionElement = TEvolutionItem | TOperand;

export type TDlc =
  | typeof base
  | typeof lotm
  | typeof lotbm
  | typeof todf
  | typeof em
  | typeof og
  | typeof otc
  | typeof ed
  | typeof ante
  | typeof w40k
  | typeof aos;

export interface TWeaponEvolution {
  id: number;
  elements: TEvolutionElement[];
  dlc?: TDlc;
}
