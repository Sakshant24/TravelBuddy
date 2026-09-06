import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Wallet, Users, Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import useGooglePhoto from '../../hooks/useGooglePhoto'
import { deleteTripFromBackend } from '../../services/apiClient'

const TripCardItem = ({ trip, onDelete }) => {
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const destination = trip?.userSelection?.destination?.label || 'Unknown Destination'
  const shortDest = destination.split(',')[0]
  const days = trip?.userSelection?.noOfDays || trip?.tripData?.itinerary?.length || '?'
  const budget = trip?.userSelection?.budget || 'Moderate'
  const traveler = trip?.userSelection?.traveler || 'Group'

  const coverImg = useGooglePhoto(destination, null)

  const handleDelete = async (e) => {
    e.stopPropagation()
    setDeleting(true)
    try {
      await deleteTripFromBackend(trip.id)
      toast.success(`"${shortDest}" trip deleted.`)
      onDelete?.(trip.id)
    } catch (err) {
      console.error(err)
      toast.error('Could not reach server, removed locally.')
      onDelete?.(trip.id)
    } finally {
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

      {/* Delete Button — top-right, visible on hover */}
      <button
        onClick={(e) => { e.stopPropagation(); setShowConfirm(true) }}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm border border-stone-200 shadow-md flex items-center justify-center text-stone-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
        title="Delete trip"
        aria-label="Delete trip"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Inline Confirmation Overlay */}
      {showConfirm && (
        <div
          className="absolute inset-0 z-30 bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6 gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div className="text-center space-y-1">
            <p className="font-black text-stone-900 text-sm">Delete this trip?</p>
            <p className="text-stone-500 text-xs">
              <span className="font-bold text-stone-700">{shortDest}</span> will be permanently removed.
            </p>
          </div>
          <div className="flex gap-2 w-full">
            <button
              onClick={(e) => { e.stopPropagation(); setShowConfirm(false) }}
              className="flex-1 py-2.5 rounded-2xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-2.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-70 cursor-pointer"
            >
              {deleting ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting...</>
              ) : (
                <><Trash2 className="w-3.5 h-3.5" /> Delete</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Card body — navigates to trip */}
      <div onClick={() => navigate('/trips/' + trip.id)} className="cursor-pointer">
        {/* Cover Image */}
        <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-[#C85A32] via-[#B84E29] to-[#8C3415]">
          {coverImg && (
            <img
              src={coverImg}
              alt={shortDest}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h4 className="text-white font-black text-lg drop-shadow-md line-clamp-1">{shortDest}</h4>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          <p className="text-xs text-stone-500 line-clamp-1 flex items-start gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#C85A32] shrink-0 mt-0.5" />
            <span>{destination}</span>
          </p>
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
    </div>
  )
}

export default TripCardItem
