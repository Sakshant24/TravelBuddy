import os
import json
import re
from typing import TypedDict, List, Dict, Any
from dotenv import load_dotenv

from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is missing from backend/.env")

llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    google_api_key=GEMINI_API_KEY,
    temperature=0.7
)

def _extract_text(content) -> str:
    """Handle both plain string and list-of-block response formats."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        for block in content:
            if isinstance(block, dict) and block.get("type") == "text":
                return block.get("text", "")
        return " ".join(str(b) for b in content)
    return str(content)

def clean_json_response(raw_content) -> Any:
    text = _extract_text(raw_content).strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        text = match.group(1).strip()
    else:
        start_bracket = text.find('[')
        end_bracket = text.rfind(']')
        start_obj = text.find('{')
        end_obj = text.rfind('}')
        # Prefer array if it comes before object
        if start_bracket != -1 and (start_obj == -1 or start_bracket < start_obj):
            if end_bracket != -1 and end_bracket > start_bracket:
                text = text[start_bracket:end_bracket+1]
        elif start_obj != -1 and end_obj != -1:
            text = text[start_obj:end_obj+1]
    return json.loads(text)

class TravelGraphState(TypedDict):
    destination: str
    no_of_days: int
    traveler: str
    budget: str
    hotels: List[Dict[str, Any]]
    itinerary: List[Dict[str, Any]]
    trip_note: str
    final_output: Dict[str, Any]

# Node 1: Hotel Expert
def hotel_agent(state: TravelGraphState):
    print("-> [1/3] Hotel Agent running...")
    destination = state["destination"]
    budget = state["budget"]
    traveler = state["traveler"]

    prompt = f"""
    Destination: {destination}
    Budget Tier: {budget}
    Traveler Profile: {traveler}

    Generate exactly 3 top-rated hotels matching this budget.
    Return ONLY a raw JSON array of objects with camelCase keys:
    - hotelName (str)
    - hotelAddress (str)
    - priceRange (str, e.g. '$80 - $140 per night')
    - imageUrl (str, valid unsplash photo URL)
    - rating (float, 1.0 to 5.0)
    - description (str)
    - coordinates (object: {{"latitude": float, "longitude": float}})
    """
    try:
        res = llm.invoke([
            SystemMessage(content="Return strictly a valid JSON array. No markdown formatting."),
            HumanMessage(content=prompt)
        ])
        hotels = clean_json_response(res.content)
    except Exception as e:
        print("Hotel Agent fallback:", e)
        hotels = [
            {
                "hotelName": f"Grand {destination} Hotel",
                "hotelAddress": f"City Center, {destination}",
                "priceRange": "$100 - $160 per night",
                "imageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
                "rating": 4.3,
                "description": f"Comfortable and central stay in {destination}.",
                "coordinates": {"latitude": 0.0, "longitude": 0.0}
            }
        ]
    return {"hotels": hotels}

# Node 2: Itinerary Curator
def itinerary_agent(state: TravelGraphState):
    print("-> [2/3] Itinerary Agent running...")
    destination = state["destination"]
    no_of_days = state["no_of_days"]
    traveler = state["traveler"]
    budget = state["budget"]

    prompt = f"""
    Create a practical daily plan for {no_of_days} day(s) in {destination} for a {traveler} on a {budget} budget.
    Return ONLY a raw JSON array of objects with camelCase keys:
    - dayNumber (int: 1, 2, ...)
    - theme (str)
    - activities (array of 3 objects):
        - activityName (str)
        - description (str)
        - imageUrl (str, valid unsplash photo URL)
        - ticketPrice (str, e.g. 'Free' or '$15')
        - timeRange (str, e.g. '09:00 AM - 11:30 AM')
        - timeToTravel (str, e.g. '15 mins via Metro')
        - coordinates (object: {{"latitude": float, "longitude": float}})
    """
    try:
        res = llm.invoke([
            SystemMessage(content="Return strictly a valid JSON array. No markdown formatting."),
            HumanMessage(content=prompt)
        ])
        itinerary = clean_json_response(res.content)
    except Exception as e:
        print("Itinerary Agent fallback:", e)
        itinerary = [
            {
                "dayNumber": day,
                "theme": f"Exploring {destination}",
                "activities": [
                    {
                        "activityName": f"{destination} City Landmark Walk",
                        "description": "Discover local cultural spots.",
                        "imageUrl": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80",
                        "ticketPrice": "Free",
                        "timeRange": "10:00 AM - 01:00 PM",
                        "timeToTravel": "15 mins",
                        "coordinates": {"latitude": 0.0, "longitude": 0.0}
                    }
                ]
            }
            for day in range(1, no_of_days + 1)
        ]
    return {"itinerary": itinerary}

# Node 3: Synthesizer Agent
def synthesizer_agent(state: TravelGraphState):
    print("-> [3/3] Synthesizer Agent running...")
    destination = state["destination"]
    no_of_days = state["no_of_days"]
    traveler = state["traveler"]
    budget = state["budget"]

    note_prompt = f"Write a warm 2-sentence summary for a {no_of_days}-day {traveler} getaway to {destination} on a {budget} budget. Return raw text only."
    try:
        res = llm.invoke([HumanMessage(content=note_prompt)])
        note = _extract_text(res.content).strip()
    except Exception:
        note = f"A customized {no_of_days}-day trip to {destination} designed for {traveler} travelers on a {budget} budget."

    hotels = state.get("hotels", [])
    itinerary = state.get("itinerary", [])

    compiled_result = {
        "tripNote": note,
        "hotelOptions": hotels,
        "hotelsOptions": hotels,
        "itinerary": itinerary
    }
    return {"trip_note": note, "final_output": compiled_result}

# Strictly Sequential Workflow to eliminate INVALID_CONCURRENT_GRAPH_UPDATE
builder = StateGraph(TravelGraphState)
builder.add_node("hotel_agent", hotel_agent)
builder.add_node("itinerary_agent", itinerary_agent)
builder.add_node("synthesizer_agent", synthesizer_agent)

builder.add_edge(START, "hotel_agent")
builder.add_edge("hotel_agent", "itinerary_agent")
builder.add_edge("itinerary_agent", "synthesizer_agent")
builder.add_edge("synthesizer_agent", END)

travel_graph = builder.compile()

def run_travel_agent_workflow(destination: str, no_of_days: int, traveler: str, budget: str) -> Dict[str, Any]:
    state = {
        "destination": destination,
        "no_of_days": no_of_days,
        "traveler": traveler,
        "budget": budget,
        "hotels": [],
        "itinerary": [],
        "trip_note": "",
        "final_output": {}
    }
    result = travel_graph.invoke(state)
    return result["final_output"]