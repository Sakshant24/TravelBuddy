import React, { useState } from "react";
import LocationAutocomplete from "../components/LocationAutocomplete";
import { ArrowRight, Calendar, CheckCircle, Loader2, Sparkles, MapPin, Wallet, Users, ChevronLeft } from "lucide-react";
import { BUDGET_OPTIONS, TRAVELER_OPTIONS } from "../assets/data";
import { toast } from "sonner";
import { generateTripWithAI } from "../services/aiModel";
import LoginDialog from "../components/shared/LoginDialog";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [step, setstep] = useState(1);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const [formData, setformData] = useState({
    destination: null,
    noOfDays: "",
    traveler: "",
    budget: "",
  });

  const handleInputChange = (name, value) => {
    setformData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBack = () => {
    if (step > 1) setstep(step - 1);
  };

  const handleNext = () => {
    if (step < 3) {
      setstep(step + 1);
    } else {
      generateTrip();
    }
  };

  const generateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      return setOpenDialog(true);
    }
    if (!formData.destination || !formData.noOfDays || !formData.budget || !formData.traveler) {
      return toast.error("Please fill all details.");
    }
    if (formData.noOfDays > 5) {
      return toast.error("AI can currently generate up to 5 days only.");
    }
    setloading(true);

    const DYNAMIC_PROMPT = `Generate a travel plan for Location: ${formData?.destination?.label} for ${formData?.noOfDays} days for a ${formData?.traveler} traveler on ${formData?.budget} budget. Return the result strictly as a single JSON object using camelCase keys, the travel plan with trip note and must feature hotelOptions array, each hotel with hotelName, hotelAddress, priceRange, imageUrl, rating, description, and a coordinates, alongside an itinerary array of daily plans. Each day must include a dayNumber, theme, and an activities array, where each activity contains activityName, description, imageUrl, ticketPrice, timeRange, timeToTravel and coordinates`;
    try {
      const tripData = await generateTripWithAI(DYNAMIC_PROMPT);
      await saveToDB(tripData);
    } catch (error) {
      setloading(false);
      console.log("AI Error:", error);
      toast.error(error.message?.includes("429") ? "Rate limit hit! Wait 60s." : "Generation failed.");
    }
  };

  const saveToDB = async (tripData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const docId = Date.now().toString();

      const cleanData = JSON.parse(
        JSON.stringify({
          userSelection: formData,
          tripData: tripData,
          userEmail: user?.email || "",
          id: docId,
        })
      );

      localStorage.setItem("trip_" + docId, JSON.stringify(cleanData));

      try {
        await setDoc(doc(db, "trips-ai", docId), cleanData);
        toast.success("Trip generated and saved!");
      } catch (dbError) {
        console.error("Firebase Save Error:", dbError);
        if (
          dbError?.code === "permission-denied" ||
          dbError?.message?.includes("permission") ||
          dbError?.message?.includes("permissions")
        ) {
          toast.warning(
            "Trip generated! (Note: Firebase permission denied. Saved locally.)",
            { duration: 6000 }
          );
        } else {
          toast.warning(
            `Trip generated! (Saved locally. Firebase: ${dbError?.message || "Error saving"})`
          );
        }
      }

      setloading(false);
      navigate("/trips/" + docId);
    } catch (error) {
      console.error("Save Error:", error);
      setloading(false);
      toast.error(
        error?.message ? `Failed to process trip: ${error.message}` : "Failed to save trip."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-editorial bg-grid-dots flexCenter p-4 text-stone-900">
        <div className="text-center space-y-6 max-w-md">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-40 animate-ping" />
            <div className="relative bg-white/90 backdrop-blur-2xl p-6 rounded-3xl border border-amber-200 shadow-2xl">
              <Loader2 className="w-12 h-12 text-[#C85A32] animate-spin mx-auto" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-stone-900">
              Curating your trip to {formData.destination?.label?.split(",")[0]}...
            </h3>
            <p className="text-sm text-stone-600 font-semibold animate-pulse">
              Our AI is finding the best hotels, daily activities, and hidden spots for your {formData.noOfDays}-day trip...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-warm-editorial bg-grid-dots pt-24 pb-16 flexCenter px-4">
      {/* Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-300/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-300/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-emerald-200/25 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Form Container Card with Rich Warm Terracotta & Sand Gradient Background */}
      <div className="relative z-10 w-full max-w-3xl card-vibrant-bg backdrop-blur-2xl rounded-[32px] overflow-hidden flex flex-col min-h-[75vh]">
        {/* Top Progress Accent */}
        <div className="relative h-2.5 bg-orange-100/60 w-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#C85A32] via-amber-500 to-emerald-600 transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-10 md:p-12 flex flex-col flex-1">
          {/* Header & Step Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-orange-200/60">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#C85A32] text-white text-xs font-black mb-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Step {step} of 3
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {step === 1 && "Where & How Long?"}
                {step === 2 && "Select Your Budget"}
                {step === 3 && "Who's Travelling?"}
              </h2>
            </div>

            {/* Visual Step Tabs */}
            <div className="flex items-center gap-2">
              {[
                { s: 1, label: "Destination", icon: MapPin },
                { s: 2, label: "Budget", icon: Wallet },
                { s: 3, label: "Group", icon: Users },
              ].map(({ s, icon: Icon }) => (
                <div
                  key={s}
                  onClick={() => s < step && setstep(s)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black transition-all ${
                    step === s
                      ? "bg-[#C85A32] text-white shadow-md shadow-amber-900/15"
                      : step > s
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-pointer hover:bg-emerald-200"
                      : "bg-white/80 text-stone-400 border border-stone-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Step Body */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Step 1: Destination & Duration */}
            {step === 1 && (
              <div className="space-y-6 max-w-xl mx-auto w-full">
                <div className="text-center space-y-1 mb-6">
                  <p className="text-stone-600 text-sm font-semibold">
                    Enter your target destination and planned duration (up to 5 days).
                  </p>
                </div>

                {/* Destination Search */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#C85A32]" /> Target Destination
                  </label>
                  <LocationAutocomplete
                    value={formData.destination?.label || ""}
                    onChange={(place) => handleInputChange("destination", place)}
                    placeholder="Search city or landmark (e.g., Paris, Goa, Tokyo)..."
                    className="w-full"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-black uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#C85A32]" /> Number of Days (Max 5)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={5}
                      placeholder="e.g. 3"
                      value={formData.noOfDays}
                      onChange={(e) => handleInputChange("noOfDays", e.target.value)}
                      className="block w-full px-4 py-3.5 border-2 border-stone-300/80 rounded-2xl bg-white text-stone-900 font-black focus:ring-2 focus:ring-[#C85A32] focus:outline-none transition-all text-base shadow-xs"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleInputChange("noOfDays", num.toString())}
                          className={`w-7 h-7 rounded-xl text-xs font-black transition-all cursor-pointer ${
                            formData.noOfDays === num.toString()
                              ? "bg-[#C85A32] text-white shadow-xs"
                              : "bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200"
                          }`}
                        >
                          {num}d
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Budget */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center max-w-sm mx-auto space-y-1">
                  <p className="text-stone-600 text-sm font-semibold">
                    Select a budget tier so our AI recommends accommodations matching your spend.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {BUDGET_OPTIONS.map((opt) => {
                    const isSelected = formData.budget === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleInputChange("budget", opt.id)}
                        className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center text-center space-y-3 cursor-pointer ${
                          isSelected
                            ? "border-[#C85A32] bg-gradient-to-br from-[#C85A32] to-[#b04b27] text-white shadow-xl shadow-amber-900/20 scale-105"
                            : "border-stone-200/90 bg-white/90 text-stone-900 hover:border-[#C85A32] hover:shadow-lg hover:bg-white"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3.5 right-3.5">
                            <CheckCircle className="w-5 h-5 fill-emerald-400 text-stone-900" />
                          </div>
                        )}
                        <div
                          className={`w-13 h-13 rounded-2xl flexCenter transition-transform duration-300 group-hover:scale-110 ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-orange-50 text-[#C85A32] border border-orange-200"
                          }`}
                        >
                          {opt.icon}
                        </div>
                        <div>
                          <h4 className={`font-black text-base ${isSelected ? "text-white" : "text-stone-900"}`}>
                            {opt.label || opt.title}
                          </h4>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Traveler Type (Emojis Kept 100% Intact) */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center max-w-sm mx-auto space-y-1">
                  <p className="text-stone-600 text-sm font-semibold">
                    Tell us who you're traveling with to get tailored activity choices.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  {TRAVELER_OPTIONS.map((opt) => {
                    const isSelected = formData.traveler === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleInputChange("traveler", opt.id)}
                        className={`group relative p-5 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center text-center space-y-3 cursor-pointer ${
                          isSelected
                            ? "border-[#C85A32] bg-gradient-to-br from-[#C85A32] to-[#b04b27] text-white shadow-xl shadow-amber-900/20 scale-105"
                            : "border-stone-200/90 bg-white/90 text-stone-900 hover:border-[#C85A32] hover:shadow-lg hover:bg-white"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle className="w-4 h-4 fill-emerald-400 text-stone-900" />
                          </div>
                        )}
                        {/* Emojis kept 100% intact */}
                        <span className="text-4xl group-hover:scale-115 transition-transform duration-300 transform-gpu leading-none">
                          {opt.icon}
                        </span>
                        <div>
                          <h4 className={`font-black text-sm ${isSelected ? "text-white" : "text-stone-900"}`}>
                            {opt.title}
                          </h4>
                          <p className={`text-[11px] mt-1 leading-relaxed font-semibold ${isSelected ? "text-amber-100" : "text-stone-500"}`}>
                            {opt.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flexBetween pt-6 mt-8 border-t border-orange-200/60">
            <button
              type="button"
              onClick={handleBack}
              className={`inline-flex items-center gap-1 text-xs font-black text-stone-500 hover:text-stone-900 px-4 py-2.5 rounded-xl transition-colors cursor-pointer ${
                step === 1 && "invisible"
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={
                (step === 1 && (!formData.destination || !formData.noOfDays)) ||
                (step === 2 && !formData.budget) ||
                (step === 3 && !formData.traveler)
              }
              className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm text-white transition-all shadow-lg cursor-pointer ${
                (step === 1 && (!formData.destination || !formData.noOfDays)) ||
                (step === 2 && !formData.budget) ||
                (step === 3 && !formData.traveler)
                  ? "bg-stone-300 cursor-not-allowed opacity-70 shadow-none"
                  : "bg-[#C85A32] hover:bg-[#b04b27] shadow-amber-900/20 hover:scale-105 active:scale-95"
              }`}
            >
              <span>{step === 3 ? "Generate Plan" : "Continue"}</span>
              {step === 3 ? (
                <Sparkles className="w-4 h-4 text-amber-300" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <LoginDialog open={openDialog} onClose={() => setOpenDialog(false)} onLoginSuccess={generateTrip} />
    </div>
  );
};

export default CreateTrip;