import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from '../services/firebaseConfig'
import { Loader2, MapPin, Plus, Plane } from 'lucide-react'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'
import TripCardItem from '../components/trip-details/TripCardItem'

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

    // Try Firestore first
    try {
      const q = query(
        collection(db, "trips-ai"),
        where("userEmail", "==", user?.email)
      )
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc) => {
        allTrips.push(doc.data())
      })
    } catch (err) {
      console.warn("Firestore fetch error, loading from local storage:", err)
    }

    // Also load from localStorage as fallback/supplement
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('trip_'))
      keys.forEach(key => {
        try {
          const localTrip = JSON.parse(localStorage.getItem(key))
          // Avoid duplicates - check if already fetched from Firestore
          if (localTrip && !allTrips.find(t => t.id === localTrip.id)) {
            // Only show trips that belong to this user
            if (localTrip.userEmail === user?.email) {
              allTrips.push(localTrip)
            }
          }
        } catch (e) {
          // skip malformed entries
        }
      })
    } catch (e) {
      console.warn("LocalStorage read error:", e)
    }

    // Sort by id (timestamp) descending - newest first
    allTrips.sort((a, b) => Number(b.id) - Number(a.id))
    setTrips(allTrips)
    setLoading(false)
  }

  useEffect(() => {
    fetchUserTrips()
  }, [])

  const user = JSON.parse(localStorage.getItem("user"))

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-b from-indigo-50/50 to-white flexCenter p-4 pt-20">
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full space-y-4">
          <div className="bg-indigo-100 w-16 h-16 rounded-2xl flexCenter mx-auto">
            <Plane className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-gray-900">Sign in to view your trips</h3>
          <p className="text-gray-500">Login to access your AI-generated travel plans and itineraries.</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl w-full cursor-pointer mt-2"
          >
            Go to Home
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-indigo-50/50 to-white flexCenter p-4">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-25" />
            <div className="relative bg-white p-4 rounded-full shadow-xl">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
          </div>
          <p className="text-gray-600 font-medium text-lg mt-6">Loading your trips...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              My Trips
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              All your AI-generated travel plans in one place.
            </p>
          </div>
          <Button
            onClick={() => navigate('/create-trip')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Trip
          </Button>
        </div>

        {/* No Trips */}
        {trips.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="bg-indigo-100 w-20 h-20 rounded-2xl flexCenter mx-auto mb-6">
              <MapPin className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Start planning your first adventure! Our AI will create a perfect itinerary for you.
            </p>
            <Button
              onClick={() => navigate('/create-trip')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 cursor-pointer"
            >
              Plan Your First Trip
            </Button>
          </div>
        )}

        {/* Trips Grid */}
        {trips.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, index) => (
              <TripCardItem key={trip.id || index} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTrips
