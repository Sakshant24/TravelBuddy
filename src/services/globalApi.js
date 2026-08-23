// Unsplash API - Fetches real, high-quality photos for hotels & places
// Free tier: 50 requests/hour | Production: 5000 requests/hour
// Docs: https://unsplash.com/documentation

import axios from 'axios';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const PHOTO_CACHE_PREFIX = 'place_photo_';
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Get a real photo URL for a given place name using Unsplash API.
 * Results are cached in localStorage for 7 days to minimize API calls.
 * 
 * @param {string} placeName - e.g. "Central Park, New York"
 * @returns {Promise<string|null>} - photo URL or null
 */
export const getPlacePhoto = async (placeName) => {
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_KEY_HERE' || !placeName) {
    return null;
  }

  // Generate a safe cache key
  const cacheKey = PHOTO_CACHE_PREFIX + placeName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 80);

  // Check localStorage cache first
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { url, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
        return url;
      }
    }
  } catch (e) {
    // Ignore cache read errors
  }

  // Call Unsplash Search API
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: placeName,
        per_page: 1,
        orientation: 'landscape',
        content_filter: 'high'
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    const photo = response.data?.results?.[0];

    if (photo) {
      // Use the "regular" size (1080px wide) - good balance of quality and speed
      const photoUrl = photo.urls?.regular || photo.urls?.small || null;

      if (photoUrl) {
        // Cache the result
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            url: photoUrl,
            timestamp: Date.now()
          }));
        } catch (e) {
          // Ignore cache write errors (quota exceeded etc.)
        }

        return photoUrl;
      }
    }
  } catch (err) {
    // Don't spam console on 403/rate limit - just fallback silently
    if (err?.response?.status === 403 || err?.response?.status === 401) {
      console.warn('Unsplash API: Invalid key or rate limited.');
    } else {
      console.warn('Unsplash API error for:', placeName, err?.message);
    }
  }

  return null;
};

/**
 * Build the Google Maps search URL for a place (for "View on Map" links)
 */
export const getGoogleMapsUrl = (placeName) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;
};
