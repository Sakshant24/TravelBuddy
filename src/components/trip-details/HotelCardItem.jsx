import React from 'react'
import { MapPin, Star, ExternalLink } from 'lucide-react'
import useGooglePhoto from '../../hooks/useGooglePhoto'

const HotelCardItem = ({ hotel, destination }) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    hotel?.hotelName + ", " + (hotel?.hotelAddress || destination)
  )}`

  // Fetch real photo, clean query for maximum hit rate
  const searchQuery = hotel?.hotelName + ", " + destination
  const fallbackImg = hotel?.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
  const hotelImage = useGooglePhoto(searchQuery, fallbackImg)

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noreferrer"
      className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative h-48 w-full overflow-hidden bg-stone-100">
        <img
          src={hotelImage}
          alt={hotel?.hotelName || "Hotel"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = fallbackImg
          }}
        />
        {hotel?.rating && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-black text-stone-900 flex items-center gap-1 shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{hotel.rating}</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between space-y-3">
        <div>
          <h4 className="font-black text-stone-900 group-hover:text-[#C85A32] transition-colors line-clamp-1">
            {hotel?.hotelName}
          </h4>
          <p className="text-xs text-stone-500 flex items-start gap-1 mt-1 line-clamp-2 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#C85A32] shrink-0 mt-0.5" />
            <span>{hotel?.hotelAddress}</span>
          </p>
        </div>

        {hotel?.description && (
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-medium">
            {hotel.description}
          </p>
        )}

        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <span className="text-xs font-black text-[#C85A32] bg-orange-50 px-2.5 py-1 rounded-xl border border-orange-100">
            {hotel?.priceRange || "$$"}
          </span>
          <span className="text-xs font-extrabold text-stone-400 group-hover:text-[#C85A32] flex items-center gap-1 transition-colors">
            View on Map <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </a>
  )
}

export default HotelCardItem
