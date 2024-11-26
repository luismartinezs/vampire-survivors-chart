import EvolutionCard from '@/components/EvolutionCard'
import { Items } from '@/components/Items'
import { weaponEvolutions } from '@/data/weapons'

export default function Home() {
  return (
    <main className="min-h-screen max-w-screen-2xl mx-auto py-4 2xl:px-0 px-4">
      <div className="flex flex-wrap justify-center gap-2">
        <Items />
        {weaponEvolutions.map((evolution) => (
          <EvolutionCard key={evolution.id} evolution={evolution} />
        ))}
      </div>
    </main>
  )
}

