import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc } from "firebase/firestore"
import { db } from '../services/firebaseConfig'
import { Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'
import InfoSection from '../components/trip-details/InfoSection'
import Hotels from '../components/trip-details/Hotels'
import PlacesToVisit from '../components/trip-details/PlacesToVisit'

export const TripDetails = () => {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchTripData = async () => {
    setLoading(true)
    try {
      // Try Firestore first
      const docRef = doc(db, "trips-ai", tripId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setTrip(docSnap.data())
        setLoading(false)
        return
      }
    } catch (err) {
      console.warn("Firestore fetch error, checking local fallback:", err)
    }

    // Fallback to LocalStorage
    try {
      const localData = localStorage.getItem('trip_' + tripId)
      if (localData) {
        setTrip(JSON.parse(localData))
      } else {
        toast.error("Trip not found!")
      }
    } catch (localErr) {
      console.error("Local storage error:", localErr)
      toast.error("Could not load trip details.")
    } finally {
      setLoading(false)
    }
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
            <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-30" />
            <div className="relative bg-white/90 backdrop-blur-xl p-5 rounded-full shadow-xl border border-slate-200/80">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
          </div>
          <p className="text-slate-600 font-semibold text-base mt-6">Loading your travel plan...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-warm-editorial bg-grid-dots-light flexCenter p-4">
        <div className="text-center bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-slate-200/80 max-w-md w-full">
          <h3 className="text-slate-900 font-bold text-xl mb-2">Trip Not Found</h3>
          <p className="text-slate-500 mb-6 text-sm">We couldn't find the trip details you're looking for.</p>
          <Button onClick={() => navigate('/create-trip')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl w-full cursor-pointer py-3">
            Plan a New Trip
          </Button>
        </div>
      </div>
    )
  }

  const { userSelection, tripData } = trip
  const destination = userSelection?.destination?.label || "Your Destination"
  const hotels = tripData?.hotelOptions || tripData?.hotelsOptions || []
  const itinerary = tripData?.itinerary || []

  return (
    <div className="min-h-screen bg-warm-editorial bg-grid-dots-light pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Info Section - Hero Banner with clear photo */}
        <InfoSection trip={trip} />

        {/* Hotel Recommendations */}
        <Hotels hotels={hotels} destination={destination} />

        {/* Day-by-Day Itinerary */}
        <PlacesToVisit itinerary={itinerary} destination={destination} />
      </div>
    </div>
  )
}

export default TripDetails