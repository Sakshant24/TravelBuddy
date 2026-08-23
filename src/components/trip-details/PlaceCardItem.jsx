import React from 'react'
import { Clock, Ticket, Navigation } from 'lucide-react'
import useGooglePhoto from '../../hooks/useGooglePhoto'

const PlaceCardItem = ({ activity, destination }) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    activity?.activityName + ", " + destination
  )}`

  // Fetch real Google Places photo, fallback to AI-provided URL
  const searchQuery = activity?.activityName + ", " + destination
  const fallbackImg = activity?.imageUrl || "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80"
  const actImage = useGooglePhoto(searchQuery, fallbackImg)

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noreferrer"
      className="group bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row gap-4 hover:-translate-y-0.5 cursor-pointer"
    >
      <div className="relative w-full sm:w-36 h-36 shrink-0 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={actImage}
          alt={activity?.activityName || "Activity"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = fallbackImg
          }}
        />
      </div>

      <div className="flex flex-col flex-1 justify-between space-y-2">
        <div>
          <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {activity?.activityName}
          </h4>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {activity?.description}
          </p>
        </div>

        <div className="space-y-1.5 text-xs text-gray-600 pt-1">
          {activity?.timeRange && (
            <div className="flex items-center gap-1.5 text-indigo-600 font-medium">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{activity.timeRange}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-gray-500">
            {activity?.ticketPrice && (
              <span className="flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{activity.ticketPrice}</span>
              </span>
            )}
            {activity?.timeToTravel && (
              <span className="flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{activity.timeToTravel}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  )
}

export default PlaceCardItem
