import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, MapPin, Plus, Plane } from 'lucide-react'
import { Button } from '../components/ui/button'
import TripCardItem from '../components/trip-details/TripCardItem'
import { fetchUserTripsFromBackend } from '../services/apiClient'

const MyTrips = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchUserTrips = async () => {
    setLoading(true)
    const user = JSON.parse(localStorage.getItem("user"))

    if (!user) {
      setLoading(false)
      return
    }

    let allTrips = []

    // 1. Primary: FastAPI PostgreSQL Backend (Authenticated via JWT)
    try {
      const backendTrips = await fetchUserTripsFromBackend()
      if (Array.isArray(backendTrips) && backendTrips.length > 0) {
        allTrips = backendTrips
      }
    } catch (backendErr) {
      console.warn("Backend fetch failed, checking local storage:", backendErr?.message)
    }

    // 2. Offline LocalStorage fallback
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('trip_'))
      keys.forEach(key => {
        try {
          const localTrip = JSON.parse(localStorage.getItem(key))
          if (localTrip && !allTrips.find(t => t.id === localTrip.id)) {
            if (localTrip.userEmail === user?.email) {
              allTrips.push(localTrip)
            }
          }
        } catch (e) {}
      })
    } catch (e) {}

    allTrips.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))
    setTrips(allTrips)
    setLoading(false)
  }

  const handleDeleteTrip = (deletedId) => {
    setTrips((prev) => prev.filter((t) => t.id !== deletedId))
  }

  useEffect(() => {
    fetchUserTrips()
  }, [])

  const user = JSON.parse(localStorage.getItem("user"))

  if (!user) {
    return (
      <div className="min-h-screen bg-warm-editorial bg-grid-dots flexCenter p-4 pt-24">
        <div className="text-center bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-stone-200/80 max-w-md w-full space-y-4">
          <div className="w-16 h-16 bg-orange-50 text-[#C85A32] rounded-2xl flexCenter mx-auto">
            <Plane className="w-8 h-8" />
          </div>
          <h3 className="text-stone-900 font-bold text-xl">Sign in to view your trips</h3>
          <p className="text-stone-500 text-sm">You need to be logged in to see all your saved itineraries.</p>
          <Button onClick={() => navigate('/')} className="bg-[#C85A32] hover:bg-[#b04b27] text-white font-bold rounded-2xl w-full cursor-pointer py-3">
            Go to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-editorial bg-grid-dots pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">My Trips</h1>
            <p className="text-stone-500 text-sm mt-1">All your AI-crafted travel plans in one place.</p>
          </div>
          <Button
            onClick={() => navigate('/create-trip')}
            className="bg-[#C85A32] hover:bg-[#b04b27] text-white font-bold rounded-2xl cursor-pointer shadow-md hover:scale-105 transition-all text-sm py-2.5 px-5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Plan New Trip
          </Button>
        </div>

        {loading && (
          <div className="flexCenter py-20">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto" />
              <p className="text-stone-500 text-sm font-medium">Fetching your itineraries...</p>
            </div>
          </div>
        )}

        {!loading && trips.length === 0 && (
          <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-stone-300 p-12 space-y-4">
            <div className="w-16 h-16 bg-orange-50 text-[#C85A32] rounded-2xl flexCenter mx-auto">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-stone-900 font-bold text-lg">No trips planned yet</h3>
            <p className="text-stone-500 text-sm max-w-sm mx-auto">
              You haven't generated any travel itineraries yet. Start planning your dream getaway today!
            </p>
            <div className="pt-2">
              <Button
                onClick={() => navigate('/create-trip')}
                className="bg-[#C85A32] hover:bg-[#b04b27] text-white font-bold rounded-2xl cursor-pointer py-2.5 px-6"
              >
                Create Your First Trip
              </Button>
            </div>
          </div>
        )}

        {!loading && trips.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCardItem key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTrips