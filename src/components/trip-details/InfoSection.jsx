import React, { useState } from 'react'
import { Calendar, Wallet, Users, Share2, Sparkles, Check, Compass, MapPin } from 'lucide-react'
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
          className="rounded-2xl border-stone-300 bg-white/90 backdrop-blur-md text-stone-800 hover:bg-stone-100 transition-all shadow-xs cursor-pointer px-5 font-extrabold text-xs"
        >
          {copied ? <Check className="w-4 h-4 mr-2 text-emerald-600" /> : <Share2 className="w-4 h-4 mr-2 text-[#C85A32]" />}
          {copied ? "Copied!" : "Share Trip"}
        </Button>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-[32px] shadow-xl min-h-[380px] sm:min-h-[420px] flex items-end">
        {/* Cover Photo Background - Crisp & Clear Visibility */}
        {coverPhoto && (
          <div className="absolute inset-0 z-0">
            <img
              src={coverPhoto}
              alt={destination}
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            {/* Subtle Gradient Vignette so the destination photo is 100% visible */}
            <div className="absolute inset-0 photo-vignette-subtle" />
          </div>
        )}

        {/* Handcrafted Warm Terracotta & Sand Fallback Background (NO Dark Navy/Blue) */}
        {!coverPhoto && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#C85A32] via-[#B84E29] to-[#8C3415] z-0 overflow-hidden">
            {/* Geometric Dot Grid Overlay */}
            <div className="absolute inset-0 bg-grid-dots opacity-30 pointer-events-none" />
            {/* Decorative Ambient Orbs */}
            <div className="absolute -top-10 -right-10 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />
            {/* Decorative Compass Icon */}
            <div className="absolute top-8 right-8 text-amber-200/10 pointer-events-none">
              <Compass className="w-48 h-48 stroke-[1]" />
            </div>
          </div>
        )}

        {/* Banner Content */}
        <div className="relative z-10 p-6 sm:p-10 space-y-4 max-w-3xl w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-black border border-white/25 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI-Generated Custom Itinerary
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
            {destination}
          </h1>

          {tripNote && (
            <p className="text-amber-50/95 text-sm sm:text-base leading-relaxed drop-shadow-xs max-w-2xl font-semibold">
              {tripNote}
            </p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/25 backdrop-blur-md text-white text-xs sm:text-sm font-black border border-white/20 shadow-md">
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>{userSelection?.noOfDays || itinerary.length || 1} Days</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/25 backdrop-blur-md text-white text-xs sm:text-sm font-black border border-white/20 shadow-md">
              <Wallet className="w-4 h-4 text-emerald-300" />
              <span>{userSelection?.budget || "Moderate"} Budget</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/25 backdrop-blur-md text-white text-xs sm:text-sm font-black border border-white/20 shadow-md">
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
