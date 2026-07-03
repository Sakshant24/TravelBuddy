import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

const LocationAutocomplete = ({
  value = "",
  onChange,
  placeholder = "Search for a city...",
  className = "",
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const searchLocation = async (text) => {
    setQuery(text);

    if (text.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        "https://api.geoapify.com/v1/geocode/autocomplete",
        {
          params: {
            text,
            apiKey: API_KEY,
            limit: 5,
          },
        }
      );

      setSuggestions(res.data.features || []);
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    setQuery(item.properties.formatted);
    setSuggestions([]);

    onChange({
        label: item.properties.formatted,
        value: item.properties,
    });
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => searchLocation(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 ${className}`}
      />

      {loading && (
        <div className="absolute right-4 top-3 text-gray-400 text-sm">
          ...
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {suggestions.map((item) => (
            <div
              key={item.properties.place_id}
              onClick={() => handleSelect(item)}
              className="cursor-pointer px-4 py-3 text-sm hover:bg-indigo-50 transition-colors"
            >
              {item.properties.formatted}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;