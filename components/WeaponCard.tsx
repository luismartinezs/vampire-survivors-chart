import Image from 'next/image'
import { Weapon } from '@/data/weapons'

export default function WeaponCard({ weapon }: { weapon: Weapon }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{weapon.name}</h2>
        <div className="flex items-center mb-4">
          <Image src={weapon.image} alt={weapon.name} width={64} height={64} className="mr-4" />
          <div>
            <p className="text-sm text-gray-600">Base Weapon</p>
            <p className="font-medium">{weapon.baseWeapon}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600">Required Item</p>
          <p className="font-medium">{weapon.requiredItem}</p>
        </div>
      </div>
    </div>
  )
}

