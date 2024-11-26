import EvolutionCard from '@/components/EvolutionCard'
import { weaponEvolutions } from '@/data/weapons'

export default function Home() {
  return (
    <main className="min-h-screen max-w-screen-3xl mx-auto py-4">
      <div className="flex flex-wrap justify-center gap-2">
        {weaponEvolutions.map((evolution) => (
          <EvolutionCard key={evolution.id} evolution={evolution} />
        ))}
      </div>
    </main>
  )
}

