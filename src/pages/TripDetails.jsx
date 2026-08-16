import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { Loader2, MapPin, Calendar, DollarSign, Users, Hotel, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const TripDetails = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTripData = async () => {
      let foundTrip = null;
      try {
        setLoading(true);
        const docRef = doc(db, 'trips-ai', tripId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          foundTrip = docSnap.data();
        }
      } catch (error) {
        console.error('Error fetching trip from Firestore:', error);
      }

      if (!foundTrip) {
        const localTrip = localStorage.getItem('trip_' + tripId);
        if (localTrip) {
          try {
            foundTrip = JSON.parse(localTrip);
          } catch (e) {
            console.error('Error parsing local trip:', e);
          }
        }
      }

      if (foundTrip) {
        setTrip(foundTrip);
      } else {
        toast.error('Trip not found!');
      }

      setLoading(false);
    };

    if (tripId) {
      getTripData();
    }
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flexCenter flex-col p-4 pt-24">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading your trip details...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-white flexCenter flex-col p-4 pt-24">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Trip Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find the requested trip itinerary.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
          <ArrowLeft size={18} /> Go Back Home
        </Link>
      </div>
    );
  }

  const { userSelection, tripData } = trip;
  const hotels = tripData?.hotelOptions || tripData?.hotelsOptions || [];
  const itinerary = tripData?.itinerary || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 md:px-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
          <ArrowLeft size={18} /> Back to Planner
        </Link>

        {/* Trip Overview Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            {userSelection?.destination?.label || 'Your AI Trip Plan'}
          </h1>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
              <Calendar size={16} /> {userSelection?.noOfDays} Days
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold capitalize">
              <DollarSign size={16} /> {userSelection?.budget} Budget
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold capitalize">
              <Users size={16} /> {userSelection?.traveler} Traveler
            </div>
          </div>

          {tripData?.tripNote && (
            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
              💡 <span className="font-semibold text-gray-700">Trip Note:</span> {tripData.tripNote}
            </p>
          )}
        </div>

        {/* Recommended Hotels */}
        {hotels.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Hotel className="text-indigo-600" /> Recommended Accommodation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between">
                  {hotel.imageUrl && (
                    <img src={hotel.imageUrl} alt={hotel.hotelName} className="h-48 w-full object-cover" />
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{hotel.hotelName}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={14} className="shrink-0" /> {hotel.hotelAddress}
                      </p>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-3">{hotel.description}</p>
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm font-medium">
                      <span className="text-indigo-600">{hotel.priceRange}</span>
                      <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-xs font-semibold">⭐ {hotel.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Itinerary */}
        {itinerary.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Daily Itinerary</h2>
            <div className="space-y-8">
              {itinerary.map((day, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <div className="border-b border-gray-100 pb-3">
                    <h3 className="text-xl font-bold text-indigo-600">
                      Day {day.dayNumber}: {day.theme}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {day.activities?.map((act, actIdx) => (
                      <div key={actIdx} className="bg-gray-50 rounded-2xl p-4 space-y-2 border border-gray-100">
                        {act.imageUrl && (
                          <img src={act.imageUrl} alt={act.activityName} className="h-36 w-full object-cover rounded-xl mb-2" />
                        )}
                        <h4 className="font-bold text-gray-900">{act.activityName}</h4>
                        <p className="text-sm text-gray-600">{act.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 pt-2">
                          <span className="bg-white px-2 py-1 rounded-md border border-gray-200">⏰ {act.timeRange}</span>
                          <span className="bg-white px-2 py-1 rounded-md border border-gray-200">🎟️ {act.ticketPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TripDetails;