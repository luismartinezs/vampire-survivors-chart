export interface TItem {
  name: string
  image: string
}

export type TOperand = '+' | '=' | '→' | '⇒'

export type TEvolutionElement = {
  item: TItem
  tags?: string[]
} | TOperand

export interface TWeaponEvolution {
  id: number
  elements: TEvolutionElement[]
}
