import { useState, useEffect } from 'react';
import { getPlacePhoto } from '../services/globalApi';

/**
 * React hook to fetch a real Google Places photo for a given place name.
 * Falls back to the provided fallback URL if the API call fails or key is not set.
 * 
 * @param {string} placeName - The name of the place (e.g. "Taj Mahal, Agra")
 * @param {string} fallbackUrl - Fallback image URL (e.g. from AI response)
 * @returns {string} - The best available photo URL
 */
const useGooglePhoto = (placeName, fallbackUrl) => {
  const [photoUrl, setPhotoUrl] = useState(fallbackUrl || '');

  useEffect(() => {
    let cancelled = false;

    if (placeName) {
      getPlacePhoto(placeName).then((url) => {
        if (!cancelled && url) {
          setPhotoUrl(url);
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, [placeName]);

  // If the hook fetched nothing, keep using the fallback
  return photoUrl || fallbackUrl || '';
};

export default useGooglePhoto;
