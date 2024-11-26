import { items } from '@/data/items'
import { Item } from './Item'

export const Items = () => {
  return (
    <div className="flex flex-wrap gap-4">
      {Object.values(items).map((item) => (
        <div className="flex flex-col items-center gap-1" key={item.name}>
          <Item item={item} size="sm" />
          <span className="text-xs">{item.name}</span>
        </div>
      ))}
    </div>
  )
}
