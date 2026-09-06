import React, { useState } from "react";
import {
  Calendar,
  Wallet,
  Users,
  Share2,
  Sparkles,
  Check,
  Compass,
  MapPin,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useGooglePhoto from "../../hooks/useGooglePhoto";
import { deleteTripFromBackend } from "../../services/apiClient";

const InfoSection = ({ trip }) => {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { userSelection, tripData } = trip;
  const destination = userSelection?.destination?.label || "Your Destination";
  const tripNote = tripData?.tripNote || "";
  const itinerary = tripData?.itinerary || [];

  const coverPhoto = useGooglePhoto(destination, null);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Trip link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTripFromBackend(trip.id);
      toast.success(`"${destination.split(',')[0]}" trip deleted.`);
      navigate("/my-trips");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete trip. Please try again.");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button
          onClick={handleShare}
          variant="outline"
          className="rounded-2xl border-stone-300 bg-white/90 backdrop-blur-md text-stone-800 hover:bg-stone-100 transition-all shadow-xs cursor-pointer px-5 font-extrabold text-xs"
        >
          {copied ? (
            <Check className="w-4 h-4 mr-2 text-emerald-600" />
          ) : (
            <Share2 className="w-4 h-4 mr-2 text-[#C85A32]" />
          )}
          {copied ? "Copied!" : "Share Trip"}
        </Button>

        <Button
          onClick={() => setShowDeleteConfirm(true)}
          variant="outline"
          className="rounded-2xl border-red-200 bg-white/90 backdrop-blur-md text-red-500 hover:bg-red-50 hover:border-red-300 transition-all shadow-xs cursor-pointer px-5 font-extrabold text-xs"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Trip
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 p-8 max-w-sm w-full space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <h3 className="font-black text-stone-900 text-lg">Delete this trip?</h3>
                <p className="text-stone-500 text-sm mt-1">
                  <span className="font-bold text-stone-700">{destination.split(',')[0]}</span> will be permanently removed from your trips.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 py-3 rounded-2xl border border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {deleting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</>
                ) : (
                  <><Trash2 className="w-4 h-4" /> Yes, Delete</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-[32px] shadow-xl min-h-[380px] sm:min-h-[420px] flex items-end">
        {/* Cover Photo Background - Crisp & Clear Visibility */}
        {coverPhoto && (
          <div className="absolute inset-0 z-0">
            <img
              src={coverPhoto}
              alt={destination}
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.target.style.display = "none";
              }}
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
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI-Generated
            Custom Itinerary
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
              <span>
                {userSelection?.noOfDays || itinerary.length || 1} Days
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/25 backdrop-blur-md text-white text-xs sm:text-sm font-black border border-white/20 shadow-md">
              <Wallet className="w-4 h-4 text-emerald-300" />
              <span>
                {userSelection?.budget === "Budget"
                  ? "Budget Friendly"
                  : `${userSelection?.budget || "Moderate"} Tier`}
              </span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/25 backdrop-blur-md text-white text-xs sm:text-sm font-black border border-white/20 shadow-md">
              <Users className="w-4 h-4 text-amber-300" />
              <span>{userSelection?.traveler || "Group"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
