import { base, em, lotm, og, otc, todf } from "./constants"

export type TItemType = 'weapon' | 'passive'

export interface TItem {
  name: string
  image: string,
  type: TItemType,
  evolved?: boolean,
  dlc?: TDlc
}

export type TOperand = '+' | '=' | '→' | '⇒'

export type TEvolutionItem = {
  item: TItem
  tags?: string[]
}

export type TEvolutionElement = TEvolutionItem | TOperand

export type TDlc = typeof base | typeof lotm | typeof todf | typeof em | typeof og | typeof otc

export interface TWeaponEvolution {
  id: number
  elements: TEvolutionElement[]
  dlc?: TDlc
}
