import { useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export default function LocationAutocomplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const search = async (value) => {
    setQuery(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        "https://api.geoapify.com/v1/geocode/autocomplete",
        {
          params: {
            text: value,
            apiKey: API_KEY,
            limit: 5,
          },
        }
      );

      setSuggestions(res.data.features);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => search(e.target.value)}
        placeholder="Search destination..."
        className="w-full h-12 rounded-md border border-gray-300 px-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 bg-white border rounded-lg shadow mt-1 z-50">
          {suggestions.map((item) => (
            <div
              key={item.properties.place_id}
              className="p-3 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setQuery(item.properties.formatted);
                setSuggestions([]);
                onSelect(item.properties);
              }}
            >
              {item.properties.formatted}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}