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
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 flexCenter p-4 text-white">
        <div className="text-center space-y-6 max-w-md">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-50 animate-ping" />
            <div className="relative bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl">
              <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mx-auto" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">
              Curating your trip to {formData.destination?.label?.split(",")[0]}...
            </h3>
            <p className="text-sm text-indigo-200/80 animate-pulse">
              Our AI is finding the best hotels, daily activities, and hidden spots for your {formData.noOfDays}-day trip...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 pt-24 pb-16 flexCenter px-4">
      {/* Background Dot Grid */}
      <div className="absolute inset-0 bg-grid-dots opacity-30 pointer-events-none" />

      {/* Ambient Glowing Orbs */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-3xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden flex flex-col min-h-[75vh]">
        {/* Top Gradient Accent & Progress */}
        <div className="relative h-2 bg-gray-100 w-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-10 md:p-12 flex flex-col flex-1">
          {/* Header & Step Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Step {step} of 3
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
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
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    step === s
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : step > s
                      ? "bg-indigo-100 text-indigo-700 cursor-pointer hover:bg-indigo-200"
                      : "bg-gray-100 text-gray-400"
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
                  <p className="text-gray-500 text-sm">
                    Enter your target destination and planned duration (up to 5 days).
                  </p>
                </div>

                {/* Destination Search */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-indigo-600" /> Target Destination
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
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-600" /> Number of Days (Max 5)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={5}
                      placeholder="e.g. 3"
                      value={formData.noOfDays}
                      onChange={(e) => handleInputChange("noOfDays", e.target.value)}
                      className="block w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50/50 text-gray-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all text-base shadow-xs"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleInputChange("noOfDays", num.toString())}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                            formData.noOfDays === num.toString()
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200/70 text-gray-600 hover:bg-gray-300"
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
                  <p className="text-gray-500 text-sm">
                    Select a budget tier so our AI recommends accommodations and spots matching your spend level.
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
                        className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center space-y-3 cursor-pointer ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/80 shadow-lg shadow-indigo-600/10 scale-105"
                            : "border-gray-100 bg-gray-50/50 hover:border-indigo-200 hover:bg-white hover:shadow-md"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 text-indigo-600">
                            <CheckCircle className="w-5 h-5 fill-indigo-600 text-white" />
                          </div>
                        )}
                        <div
                          className={`w-14 h-14 rounded-2xl flexCenter text-2xl transition-transform duration-300 group-hover:scale-110 ${
                            isSelected
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                              : "bg-white text-gray-700 shadow-xs border border-gray-100"
                          }`}
                        >
                          {opt.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base">{opt.title || opt.label}</h4>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Traveler Type */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center max-w-sm mx-auto space-y-1">
                  <p className="text-gray-500 text-sm">
                    Tell us who you're traveling with to get tailored activity choices and hotel sizes.
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
                        className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center text-center space-y-2.5 cursor-pointer ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/80 shadow-lg shadow-indigo-600/10 scale-105"
                            : "border-gray-100 bg-gray-50/50 hover:border-indigo-200 hover:bg-white hover:shadow-md"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 text-indigo-600">
                            <CheckCircle className="w-4 h-4 fill-indigo-600 text-white" />
                          </div>
                        )}
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                          {opt.icon}
                        </span>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{opt.title}</h4>
                          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
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
          <div className="flexBetween pt-6 mt-8 border-t border-gray-100">
            <button
              type="button"
              onClick={handleBack}
              className={`inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-gray-900 px-4 py-2.5 rounded-xl transition-colors cursor-pointer ${
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
              className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-base text-white transition-all shadow-lg cursor-pointer ${
                (step === 1 && (!formData.destination || !formData.noOfDays)) ||
                (step === 2 && !formData.budget) ||
                (step === 3 && !formData.traveler)
                  ? "bg-gray-300 cursor-not-allowed opacity-70 shadow-none"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-600/30 hover:scale-105 active:scale-95"
              }`}
            >
              <span>{step === 3 ? "Generate Plan" : "Continue"}</span>
              {step === 3 ? (
                <Sparkles className="w-5 h-5 text-amber-300" />
              ) : (
                <ArrowRight className="w-5 h-5" />
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