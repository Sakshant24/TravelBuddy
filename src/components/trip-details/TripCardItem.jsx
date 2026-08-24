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

  // Fetch exact real photo of the destination (e.g. Pune, London, Goa)
  const coverImg = useGooglePhoto(destination, null)

  return (
    <div
      onClick={() => navigate('/trips/' + trip.id)}
      className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      {/* Cover Image */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-[#C85A32] via-[#B84E29] to-[#8C3415]">
        {coverImg && (
          <img
            src={coverImg}
            alt={shortDest}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h4 className="text-white font-black text-lg drop-shadow-md line-clamp-1">
            {shortDest}
          </h4>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-3">
        <p className="text-xs text-stone-500 line-clamp-1 flex items-start gap-1 font-medium">
          <MapPin className="w-3.5 h-3.5 text-[#C85A32] shrink-0 mt-0.5" />
          <span>{destination}</span>
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 text-[#C85A32] text-xs font-bold border border-orange-100">
            <Calendar className="w-3 h-3" /> {days} Days
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
            <Wallet className="w-3 h-3" /> {budget}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
            <Users className="w-3 h-3" /> {traveler}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TripCardItem
