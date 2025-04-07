"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, MapPin, Utensils, Calendar, LightbulbIcon } from "lucide-react"
import { getRecommendations } from "@/app/actions"

type Recommendation = {
  restaurants: string[]
  events: string[]
  tips: string[]
}

export default function TravelCompanion() {
  const [location, setLocation] = useState("")
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!location.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await getRecommendations(location)
      setRecommendations(result)
    } catch (err) {
      setError("Failed to get recommendations. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Enter a location (e.g., Paris, Tokyo, New York)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" disabled={isLoading || !location.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Get Recommendations"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">{error}</div>}

      {recommendations && !isLoading && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <Tabs defaultValue="restaurants">
              <TabsList className="mb-4">
                <TabsTrigger value="restaurants">
                  <Utensils className="h-4 w-4 mr-2" />
                  Restaurants
                </TabsTrigger>
                <TabsTrigger value="events">
                  <Calendar className="h-4 w-4 mr-2" />
                  Events
                </TabsTrigger>
                <TabsTrigger value="tips">
                  <LightbulbIcon className="h-4 w-4 mr-2" />
                  Travel Tips
                </TabsTrigger>
              </TabsList>

              <TabsContent value="restaurants" className="space-y-4">
                <h3 className="text-lg font-medium text-slate-800">Recommended Restaurants in {location}</h3>
                <ul className="space-y-2">
                  {recommendations.restaurants.map((restaurant, index) => (
                    <li key={index} className="p-3 bg-white rounded-md border border-slate-200">
                      {restaurant}
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                <h3 className="text-lg font-medium text-slate-800">Events & Activities in {location}</h3>
                <ul className="space-y-2">
                  {recommendations.events.map((event, index) => (
                    <li key={index} className="p-3 bg-white rounded-md border border-slate-200">
                      {event}
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="tips" className="space-y-4">
                <h3 className="text-lg font-medium text-slate-800">Travel Tips for {location}</h3>
                <ul className="space-y-2">
                  {recommendations.tips.map((tip, index) => (
                    <li key={index} className="p-3 bg-white rounded-md border border-slate-200">
                      {tip}
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {!recommendations && !isLoading && !error && (
        <div className="text-center p-12 bg-white rounded-lg border border-dashed border-slate-300">
          <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">Enter a location to get started</h3>
          <p className="text-slate-500">
            Get personalized recommendations for restaurants, events, and travel tips for any destination.
          </p>
        </div>
      )}
    </div>
  )
}