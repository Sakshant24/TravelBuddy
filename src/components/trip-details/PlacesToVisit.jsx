import React from 'react'
import PlaceCardItem from './PlaceCardItem'

const PlacesToVisit = ({ itinerary, destination }) => {
  if (!itinerary || itinerary.length === 0) return null

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          📍 Places to Visit
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Your curated day-by-day roadmap of attractions, timings, and travel recommendations.
        </p>
      </div>
      <div className="space-y-10">
        {itinerary.map((day, dIdx) => (
          <div key={dIdx} className="space-y-4">
            {/* Day Header */}
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 text-white font-extrabold text-sm px-3.5 py-1.5 rounded-xl shadow-xs">
                Day {day?.dayNumber || dIdx + 1}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                {day?.theme || `Day ${day?.dayNumber || dIdx + 1} Exploration`}
              </h3>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {(day?.activities || []).map((activity, aIdx) => (
                <PlaceCardItem key={aIdx} activity={activity} destination={destination} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PlacesToVisit
