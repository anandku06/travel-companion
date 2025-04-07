import TravelCompanion from "@/components/travel-companion"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Travel Companion</h1>
          <p className="text-slate-600">Discover restaurants, events, and travel tips for your next adventure</p>
        </header>
        <TravelCompanion />
      </div>
    </main>
  )
}

