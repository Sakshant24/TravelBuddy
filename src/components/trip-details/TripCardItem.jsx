import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Wallet, Users } from 'lucide-react'
import useGooglePhoto from '../../hooks/useGooglePhoto'

const TripCardItem = ({ trip }) => {
  const navigate = useNavigate()
  const destination = trip?.userSelection?.destination?.label || "Unknown Destination"
  const shortDest = destination.split(',')[0]
  const days = trip?.userSelection?.noOfDays || trip?.tripData?.itinerary?.length || "?"
  const budget = trip?.userSelection?.budget || "Moderate"
  const traveler = trip?.userSelection?.traveler || "Group"

  // Pick a fallback cover image from the first hotel or first activity
  const hotels = trip?.tripData?.hotelOptions || trip?.tripData?.hotelsOptions || []
  const firstActivity = trip?.tripData?.itinerary?.[0]?.activities?.[0]
  const fallbackImg = hotels[0]?.imageUrl || firstActivity?.imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80"

  // Fetch real photo of the destination
  const coverImg = useGooglePhoto(shortDest, fallbackImg)

  return (
    <div
      onClick={() => navigate('/trips/' + trip.id)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      {/* Cover Image */}
      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
        <img
          src={coverImg}
          alt={shortDest}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h4 className="text-white font-bold text-lg drop-shadow-md line-clamp-1">
            {shortDest}
          </h4>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        <p className="text-xs text-gray-500 line-clamp-1 flex items-start gap-1">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
          <span>{destination}</span>
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
            <Calendar className="w-3 h-3" /> {days} Days
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
            <Wallet className="w-3 h-3" /> {budget}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium">
            <Users className="w-3 h-3" /> {traveler}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TripCardItem
