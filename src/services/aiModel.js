//This below code is as from docs of google gemini it is for server side we have make small changes
// and converted for client side but later will create as server side as separate service... this is for pure react(client side)

import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
// Initialize the Chat session with history to enforce the JSON schema
const chat = ai.chats.create({
    model: "gemini-3.5-flash",
    history:[
        {
            role: "user",
            parts: [
                {
                    text: "Generate a travel plan for Location: New York for 2 days for a couple traveler on economy budget. Return the result strictly as a single JSON object using camelCase keys, the travel plan with trip note and must feature hotelsOptions array, each hotel with hotelName, hotelAddress, priceRange, imageUrl, rating, description, and a coordinates, alongside an itinerary array of daily plans. Each day must include a dayNumber, theme, and an activities array, where each activity contains activityName, description, imageUrl, ticketPrice, timeRange, timeToTravel and coordinates",
                },
            ],
        },
        {
            role: "model",
            parts: [
                {
                    text: JSON.stringify({
                        "tripNote": "A romantic 2-day getaway to New York City tailored for a couple on an economy budget. This plan emphasizes free or low-cost scenic activities, budget-friendly eats, and affordable accommodations without losing the magical romance of the Big Apple.",
                        "hotelsOptions": [
                            {
                                "hotelName": "Pod 51 Hotel",
                                "hotelAddress": "230 E 51st St, New York, NY 10022",
                                "priceRange": "$120 - $220 per night",
                                "imageUrl": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
                                "rating": 4.1,
                                "description": "A modern, chic, and minimalist budget-friendly hotel in Midtown East. Offers compact but smart private rooms, a lively rooftop deck, and an outdoor courtyard garden perfect for budget-conscious couples.",
                                "coordinates": {
                                    "latitude": 40.7559,
                                    "longitude": -73.9691
                                }
                            },
                            {
                                "hotelName": "The Jane Hotel",
                                "hotelAddress": "113 Jane St, New York, NY 10014",
                                "priceRange": "$99 - $180 per night",
                                "imageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
                                "rating": 4.2,
                                "description": "A historic bohemian-chic hotel in the trendy West Village. Featuring cozy, ship-cabin style private rooms and historic charm, ideal for couples looking for a unique and romantic vibe.",
                                "coordinates": {
                                    "latitude": 40.7381,
                                    "longitude": -74.0097
                                }
                            }
                        ],
                        "itinerary": [
                            {
                                "dayNumber": 1,
                                "theme": "Midtown Icons, Skylines & Elevated Paths",
                                "activities": [
                                    {
                                        "activityName": "Central Park Romance Walk & Picnic",
                                        "description": "Stroll through iconic Central Park paths, including Bethesda Terrace, Bow Bridge, and the Mall. Grab a cheap picnic of classic NYC bagels and fruit from a local deli beforehand.",
                                        "imageUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80",
                                        "ticketPrice": "Free",
                                        "timeRange": "09:00 AM - 11:30 AM",
                                        "timeToTravel": "N/A (Starting point)",
                                        "coordinates": {
                                            "latitude": 40.7711,
                                            "longitude": -73.9741
                                        }
                                    },
                                    {
                                        "activityName": "Lunch at Grand Central Dining Concourse",
                                        "description": "Explore the architectural beauty of Grand Central, share secrets at the Whispering Gallery, and grab budget-friendly bites at the lower level dining concourse.",
                                        "imageUrl": "https://images.unsplash.com/photo-1533580436894-3e9118579d40?auto=format&fit=crop&w=600&q=80",
                                        "ticketPrice": "Free (Food self-funded)",
                                        "timeRange": "12:00 PM - 01:30 PM",
                                        "timeToTravel": "15 mins via Subway",
                                        "coordinates": {
                                            "latitude": 40.7527,
                                            "longitude": -73.9772
                                        }
                                    },
                                    {
                                        "activityName": "The High Line Park Scenic Walk",
                                        "description": "Walk along an elevated, public park built on a historic freight rail line. Take in beautiful city views and stop by Chelsea Market for affordable treats.",
                                        "imageUrl": "https://images.unsplash.com/photo-1534430480872-3498386e7a0c?auto=format&fit=crop&w=600&q=80",
                                        "ticketPrice": "Free",
                                        "timeRange": "02:30 PM - 05:00 PM",
                                        "timeToTravel": "20 mins via Subway",
                                        "coordinates": {
                                            "latitude": 40.7480,
                                            "longitude": -74.0048
                                        }
                                    },
                                    {
                                        "activityName": "Roosevelt Island Tram Sunset Ride",
                                        "description": "Take a beautiful, budget-friendly 4-minute aerial journey across the East River using a standard MetroCard. Enjoy spectacular sunset views of Manhattan.",
                                        "imageUrl": "https://images.unsplash.com/photo-1549880180-250a4e395ee0?auto=format&fit=crop&w=600&q=80",
                                        "ticketPrice": "$2.90 per person",
                                        "timeRange": "06:00 PM - 07:30 PM",
                                        "timeToTravel": "30 mins via Subway",
                                        "coordinates": {
                                            "latitude": 40.7618,
                                            "longitude": -73.9641
                                        }
                                    }
                                ]
                            },
                            {
                                "dayNumber": 2,
                                "theme": "Brooklyn Charm & Downtown NYC",
                                "activities": [
                                    {
                                        "activityName": "Brooklyn Bridge Morning Walk",
                                        "description": "Beat the heavy crowds by crossing the iconic Brooklyn Bridge in the morning. Capture stunning, classic NYC romantic photos with your partner.",
                                        "imageUrl": "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=600&q=80",
                                        "ticketPrice": "Free",
                                        "timeRange": "08:30 AM - 10:00 AM",
                                        "timeToTravel": "N/A (Starting point)",
                                        "coordinates": {
                                            "latitude": 40.7061,
                                            "longitude": -73.9969
                                        }
                                    },
                                    {
                                        "activityName": "DUMBO Waterfront & Jane's Carousel Ride",
                                        "description": "Head down to DUMBO, capture the famous Washington Street view of the Manhattan Bridge, and take a quick romantic ride on Jane's Carousel.",
                                        "imageUrl": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80",
                                        "ticketPrice": "$2.00 per person",
                                        "timeRange": "10:15 AM - 12:30 PM",
                                        "timeToTravel": "10 mins walking",
                                        "coordinates": {
                                            "latitude": 40.7032,
                                            "longitude": -73.9896
                                        }
                                    },
                                    {
                                        "activityName": "Scenic Staten Island Ferry",
                                        "description": "Take the totally free Staten Island Ferry to catch stellar, close-up views of the Statue of Liberty and the Manhattan skyline without paying for a tour boat.",
                                        "imageUrl": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
                                        "ticketPrice": "Free",
                                        "timeRange": "02:00 PM - 04:30 PM",
                                        "timeToTravel": "25 mins via Subway",
                                        "coordinates": {
                                            "latitude": 40.7011,
                                            "longitude": -74.0131
                                        }
                                    },
                                    {
                                        "activityName": "Greenwich Village Romantic Pizza & Jazz Crawl",
                                        "description": "Head to Greenwich Village. Share a legendary, cheap-yet-famous NYC slice at Joe's Pizza, sit in Washington Square Park, and listen to street jazz musicians.",
                                        "imageUrl": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
                                        "ticketPrice": "Approx $5 - $10 (Food self-funded)",
                                        "timeRange": "06:00 PM - 09:00 PM",
                                        "timeToTravel": "20 mins via Subway",
                                        "coordinates": {
                                            "latitude": 40.7308,
                                            "longitude": -73.9973
                                        }
                                    }
                                ]
                            }
                        ]
                    }),
                },
            ],
        },
    ],
});
//  Main function to generate the trip
export async function generateTripWithAI(DYNAMIC_PROMPT) {
    try{
        const response = await chat.sendMessage({
            message : DYNAMIC_PROMPT,
        });
        const textResponse = response.text;
        // console.log("Chat response:",textResponse);
        //Cleaning the string : Removing Markdown json formatting if the AI includes it
        const cleanJson = textResponse.replace(/```json|```/g, "").trim();
        // console.log("Clean json", cleanJson);
    }catch(error){
        console.error("Error generating trip:",error);
        throw error;
    }
}
