export type TItemType = 'weapon' | 'passive'

export interface TItem {
  name: string
  image: string,
  type: TItemType
}

export type TOperand = '+' | '=' | '→' | '⇒'

export type TEvolutionElement = {
  item: TItem
  tags?: string[]
} | TOperand

export type TDlc = 'base' | 'lotm' | 'todf' | 'em' | 'og' | 'otc'

export interface TWeaponEvolution {
  id: number
  elements: TEvolutionElement[]
  dlc?: TDlc
}
