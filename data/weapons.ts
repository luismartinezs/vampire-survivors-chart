export interface WeaponEvolution {
  id: number
  baseWeapon: {
    name: string
    image: string
  }
  requiredItem: {
    name: string
    image: string
  }
  evolution: {
    name: string
    image: string
  }
}

export const weaponEvolutions: WeaponEvolution[] = [
  {
    id: 1,
    baseWeapon: {
      name: 'Whip',
      image: 'icon-whip'
    },
    requiredItem: {
      name: 'Hollow Heart',
      image: 'icon-health'
    },
    evolution: {
      name: 'Bloody Tear',
      image: 'icon-whip_'
    }
  },
  {
    id: 2,
    baseWeapon: {
      name: 'Magic Wand',
      image: 'icon-magicwand'
    },
    requiredItem: {
      name: 'Empty Tome',
      image: 'icon-cooldown'
    },
    evolution: {
      name: 'Holy Wand',
      image: 'icon-magicwand_'
    }
  },
  {
    id: 3,
    baseWeapon: {
      name: 'Knife',
      image: 'icon-knife'
    },
    requiredItem: {
      name: 'Bracer',
      image: 'icon-speed'
    },
    evolution: {
      name: 'Thousand Edge',
      image: 'icon-knife_'
    }
  },
  {
    id: 4,
    baseWeapon: {
      name: 'Axe',
      image: 'icon-axe'
    },
    requiredItem: {
      name: 'Candelabrador',
      image: 'icon-area'
    },
    evolution: {
      name: 'Death Spiral',
      image: 'icon-axe_'
    }
  },
  {
    id: 5,
    baseWeapon: {
      name: 'Cross',
      image: 'icon-cross'
    },
    requiredItem: {
      name: 'Clover',
      image: 'icon-luck'
    },
    evolution: {
      name: 'Heaven Sword',
      image: 'icon-cross_'
    }
  }
]

export interface Weapon {
  name: string
  image: string
  baseWeapon: string
  requiredItem: string
}
