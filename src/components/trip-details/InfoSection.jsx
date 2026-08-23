import React, { useState } from 'react'
import { Calendar, Wallet, Users, Share2, Sparkles, Check } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import useGooglePhoto from '../../hooks/useGooglePhoto'

const InfoSection = ({ trip }) => {
  const [copied, setCopied] = useState(false)
  const { userSelection, tripData } = trip
  const destination = userSelection?.destination?.label || "Your Destination"
  const tripNote = tripData?.tripNote || ""
  const itinerary = tripData?.itinerary || []

  // Fetch a real cover photo of the destination
  const coverPhoto = useGooglePhoto(destination, null)

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    toast.success("Trip link copied to clipboard!")
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Share Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleShare}
          variant="outline"
          className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors shadow-xs cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Share2 className="w-4 h-4 mr-2" />}
          {copied ? "Copied!" : "Share Trip"}
        </Button>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">
        {/* Cover Photo Background */}
        {coverPhoto && (
          <div className="absolute inset-0 z-0">
            <img
              src={coverPhoto}
              alt={destination}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-indigo-800/85 to-purple-900/80" />
          </div>
        )}

        {/* Fallback gradient if no photo */}
        {!coverPhoto && (
          <div className="absolute inset-0 bg-linear-to-r from-indigo-900 via-indigo-800 to-purple-900 z-0" />
        )}

        {/* Decorative blob */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none z-1" />

        <div className="relative z-10 p-8 sm:p-12 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-medium border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI-Generated Custom Itinerary
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {destination}
          </h1>

          {tripNote && (
            <p className="text-indigo-100/90 text-sm sm:text-base leading-relaxed">
              {tripNote}
            </p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-xs sm:text-sm font-medium border border-white/10">
              <Calendar className="w-4 h-4 text-indigo-300" />
              <span>{userSelection?.noOfDays || itinerary.length || 1} Days</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-xs sm:text-sm font-medium border border-white/10">
              <Wallet className="w-4 h-4 text-emerald-300" />
              <span>{userSelection?.budget || "Moderate"} Budget</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-xs sm:text-sm font-medium border border-white/10">
              <Users className="w-4 h-4 text-amber-300" />
              <span>{userSelection?.traveler || "Group"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoSection
