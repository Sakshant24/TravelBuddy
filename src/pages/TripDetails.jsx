import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'
import InfoSection from '../components/trip-details/InfoSection'
import Hotels from '../components/trip-details/Hotels'
import PlacesToVisit from '../components/trip-details/PlacesToVisit'
import { fetchTripFromBackend } from '../services/apiClient'

export const TripDetails = () => {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchTripData = async () => {
    setLoading(true)

    // 1. Primary: FastAPI SQLite
    try {
      const backendTrip = await fetchTripFromBackend(tripId)
      if (backendTrip){
        setTrip(backendTrip)
        setLoading(false)
        return
      }
    } catch (backendErr) {
      console.warn("Backend fetch failed, checking local storage:", backendErr?.message)
    }

    // 2. Offline LocalStorage fallback
    try {
      const localData = localStorage.getItem('trip_' + tripId)
      if (localData) {
        setTrip(JSON.parse(localData))
        setLoading(false)
        return
      }
    } catch (localErr) {}

    toast.error("Trip not found!")
    setLoading(false)
  }

  useEffect(() => {
    if (tripId) {
      fetchTripData()
    }
  }, [tripId])

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-editorial bg-grid-dots-light flexCenter p-4">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-orange-200 rounded-full animate-ping opacity-30" />
            <div className="relative bg-white/90 backdrop-blur-xl p-5 rounded-full shadow-xl border border-stone-200/80">
              <Loader2 className="w-10 h-10 text-[#C85A32] animate-spin" />
            </div>
          </div>
          <p className="text-stone-600 font-semibold text-base mt-6">Loading your travel plan...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-warm-editorial bg-grid-dots-light flexCenter p-4">
        <div className="text-center bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-stone-200/80 max-w-md w-full">
          <h3 className="text-stone-900 font-bold text-xl mb-2">Trip Not Found</h3>
          <p className="text-stone-500 mb-6 text-sm">We couldn't find the trip details you're looking for.</p>
          <Button onClick={() => navigate('/create-trip')} className="bg-[#C85A32] hover:bg-[#b04b27] text-white font-bold rounded-2xl w-full cursor-pointer py-3">
            Plan a New Trip
          </Button>
        </div>
      </div>
    )
  }

  const { userSelection, tripData } = trip
  const destination = userSelection?.destination?.label || userSelection?.destination || "Your Destination"
  const hotels = tripData?.hotelOptions || tripData?.hotelsOptions || []
  const itinerary = tripData?.itinerary || []

  return (
    <div className="min-h-screen bg-warm-editorial bg-grid-dots-light pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <InfoSection trip={trip} />
        <Hotels hotels={hotels} destination={destination} />
        <PlacesToVisit itinerary={itinerary} destination={destination} />
      </div>
    </div>
  )
}

export default TripDetails