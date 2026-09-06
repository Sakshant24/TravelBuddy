import os
import re
import json
import time
from typing import Dict, Any, Optional
from typing_extensions import TypedDict
from dotenv import load_dotenv

import uvicorn
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from langgraph.graph import StateGraph, START, END
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI

# --- DB imports from dedicated modules ---
from database import get_db, engine, Base
from models import User, Trip, ApiLog, TripPayload, GenerateTripRequest

load_dotenv()

# Create all tables on startup (safe to call repeatedly — skips existing tables)
Base.metadata.create_all(bind=engine)


# --- 2. AI Model Setup ---
GEMINI_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_KEY:
    print("WARNING: GEMINI_API_KEY is not set!")

# Use gemini-2.0-flash (stable, fast, free-tier friendly)
llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    google_api_key=GEMINI_KEY,
    temperature=0.7
)

def extract_text_from_response(content) -> str:
    """Safely extract plain text from LLM response content.
    Handles both plain strings and list-of-block formats from newer langchain-google-genai."""
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        # New format: [{"type": "text", "text": "...", ...}, ...]
        for block in content:
            if isinstance(block, dict) and block.get("type") == "text":
                return block.get("text", "")
        # Fallback: join all string-like items
        return " ".join(str(b) for b in content)
    return str(content)

def clean_json_str(raw_content) -> Any:
    """Extract and parse JSON from LLM response, handling markdown fences and list-block formats."""
    text = extract_text_from_response(raw_content).strip()
    # Remove markdown code fences if present
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        text = match.group(1).strip()
    else:
        # Extract the outermost JSON object or array
        start_obj = text.find('{')
        start_arr = text.find('[')
        if start_obj == -1 and start_arr == -1:
            raise ValueError("No JSON structure found in response")
        # Pick whichever starts first
        if start_arr != -1 and (start_obj == -1 or start_arr < start_obj):
            end = text.rfind(']')
            if end != -1:
                text = text[start_arr:end+1]
        else:
            end = text.rfind('}')
            if end != -1:
                text = text[start_obj:end+1]
    return json.loads(text)

# --- 3. LangGraph State ---
class TripState(TypedDict):
    destination: str
    no_of_days: int
    traveler: str
    budget: str
    final_trip_data: Dict[str, Any]

# --- 4. Master Planner Agent (Optimized Few-Shot Prompt) ---
SYSTEM_PROMPT = """You are TravelBuddy AI, an elite travel planner. Your ONLY job is to output a single, valid JSON object.

CRITICAL RULES:
1. Output RAW JSON only — no markdown, no ```json fences, no commentary before or after
2. The response must start with { and end with }
3. Use ONLY double quotes for strings and keys (never single quotes)
4. All coordinates must be real, accurate latitude/longitude floats for the actual location
5. All imageUrl values must be valid Unsplash URLs in the format: https://images.unsplash.com/photo-XXXXXXXXXXXXXXXX?auto=format&fit=crop&w=600&q=80
6. Each day must have exactly 3 activities
7. hotelOptions must contain exactly 3 hotels"""

FEW_SHOT_HUMAN = """Generate a 2-day travel plan for New York City for a couple on an economy budget."""

FEW_SHOT_AI = """{"tripNote":"A romantic 2-day escape to New York City for a couple on an economy budget, balancing iconic landmarks with hidden gems and wallet-friendly dining.","hotelOptions":[{"hotelName":"The Jane Hotel","hotelAddress":"113 Jane St, New York, NY 10014","priceRange":"$99 - $159 per night","imageUrl":"https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80","rating":4.2,"description":"A historic bohemian-chic hotel in the West Village with cozy private rooms and iconic charm.","coordinates":{"latitude":40.7381,"longitude":-74.0097}},{"hotelName":"Pod 51 Hotel","hotelAddress":"230 E 51st St, New York, NY 10022","priceRange":"$89 - $149 per night","imageUrl":"https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80","rating":4.1,"description":"Modern micro-rooms in Midtown with smart design and a rooftop terrace.","coordinates":{"latitude":40.7567,"longitude":-73.9705}},{"hotelName":"HI NYC Hostel","hotelAddress":"891 Amsterdam Ave, New York, NY 10025","priceRange":"$60 - $110 per night","imageUrl":"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80","rating":4.0,"description":"Budget-friendly Upper West Side hostel near Central Park with private and shared rooms.","coordinates":{"latitude":40.7963,"longitude":-73.9663}}],"itinerary":[{"dayNumber":1,"theme":"Iconic Midtown & Park Romance","activities":[{"activityName":"Central Park Morning Walk","description":"Begin the day with a scenic stroll through Bethesda Terrace, Bow Bridge, and Strawberry Fields in Central Park.","imageUrl":"https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80","ticketPrice":"Free","timeRange":"09:00 AM - 11:00 AM","timeToTravel":"Starting point","coordinates":{"latitude":40.7711,"longitude":-73.9741}},{"activityName":"Times Square & Broadway Walk","description":"Explore the electric heart of NYC — snap photos, browse TKTS for discounted shows, and soak in the energy.","imageUrl":"https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=600&q=80","ticketPrice":"Free","timeRange":"12:00 PM - 02:00 PM","timeToTravel":"20 mins from Central Park","coordinates":{"latitude":40.7580,"longitude":-73.9855}},{"activityName":"Brooklyn Bridge at Sunset","description":"Walk the iconic Brooklyn Bridge at golden hour for breathtaking skyline views, then explore DUMBO.","imageUrl":"https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=600&q=80","ticketPrice":"Free","timeRange":"05:30 PM - 07:30 PM","timeToTravel":"35 mins from Times Square","coordinates":{"latitude":40.7061,"longitude":-73.9969}}]},{"dayNumber":2,"theme":"Culture, Art & Local Eats","activities":[{"activityName":"The Metropolitan Museum of Art","description":"Explore world-class art collections spanning 5,000 years of history in this legendary museum.","imageUrl":"https://images.unsplash.com/photo-1583922606661-0822ed0bd916?auto=format&fit=crop&w=600&q=80","ticketPrice":"$30 suggested donation","timeRange":"10:00 AM - 01:00 PM","timeToTravel":"15 mins from hotel","coordinates":{"latitude":40.7794,"longitude":-73.9632}},{"activityName":"Chelsea Market Food Hall","description":"Taste your way through NYC's most iconic food market with artisan vendors, bakeries, and fresh lobster.","imageUrl":"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80","ticketPrice":"Free entry","timeRange":"02:00 PM - 04:00 PM","timeToTravel":"25 mins from the Met","coordinates":{"latitude":40.7424,"longitude":-74.0060}},{"activityName":"High Line Park Stroll","description":"Walk this elevated urban park built on a historic freight rail line, with art installations and skyline views.","imageUrl":"https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=600&q=80","ticketPrice":"Free","timeRange":"04:30 PM - 06:30 PM","timeToTravel":"5 mins from Chelsea Market","coordinates":{"latitude":40.7480,"longitude":-74.0048}}]}]}"""

def master_planner_node(state: TripState):
    destination = state.get("destination", "Unknown")
    no_of_days = state.get("no_of_days", 3)
    traveler = state.get("traveler", "solo")
    budget = state.get("budget", "Moderate")

    print(f"-> [AI] Crafting Premium Travel Plan for {destination}...")

    user_prompt = (
        f"Generate a {no_of_days}-day travel plan for {destination} "
        f"for a {traveler} traveler on a {budget} budget. "
        f"Include exactly 3 hotels in hotelOptions and exactly 3 activities per day in itinerary. "
        f"Use real place names, accurate coordinates, and realistic prices specific to {destination}. "
        f"Output ONLY the raw JSON object."
    )

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=FEW_SHOT_HUMAN),
        AIMessage(content=FEW_SHOT_AI),
        HumanMessage(content=user_prompt),
    ]

    res = None
    try:
        res = llm.invoke(messages)
        trip_data = clean_json_str(res.content)

        # Normalize: ensure both key variants exist for frontend compatibility
        if "hotelOptions" in trip_data and "hotelsOptions" not in trip_data:
            trip_data["hotelsOptions"] = trip_data["hotelOptions"]
        elif "hotelsOptions" in trip_data and "hotelOptions" not in trip_data:
            trip_data["hotelOptions"] = trip_data["hotelsOptions"]

        print("[SUCCESS] Travel plan generated successfully.")
    except Exception as e:
        raw_out = extract_text_from_response(res.content) if res else "(no response)"
        print("-> [ERROR] LLM Parsing Failed:", e)
        print("-> [RAW OUTPUT WAS]:", raw_out[:500])
        raise Exception("AI failed to return valid JSON format.")

    return {"final_trip_data": trip_data}

# --- 5. LangGraph Workflow ---
workflow = StateGraph(TripState)
workflow.add_node("planner_agent", master_planner_node)
workflow.add_edge(START, "planner_agent")
workflow.add_edge("planner_agent", END)

travel_agent = workflow.compile()

# --- 6. FastAPI App & Router Registration ---
from routers import auth, trips

app = FastAPI(title="TravelBuddy Backend")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(trips.router)


@app.get("/health")
def health():
    return {"status": "ok", "message": "Backend is active"}


@app.post("/api/v1/generate-trip")
def generate_trip_endpoint(req: GenerateTripRequest, db: Session = Depends(get_db)):
    dest_str = req.destination.get("label", str(req.destination)) if isinstance(req.destination, dict) else str(req.destination)
    print(f"\n[NEW REQUEST] Target: {dest_str} | Days: {req.noOfDays} | Budget: {req.budget}")

    start_time = time.time()
    status = 500
    try:
        initial_state = {
            "destination": dest_str,
            "no_of_days": int(req.noOfDays),
            "traveler": str(req.traveler),
            "budget": str(req.budget)
        }
        result = travel_agent.invoke(initial_state)
        status = 200
        print("[SUCCESS] Travel plan generated successfully.")
        return {"success": True, "tripData": result.get("final_trip_data", {})}
    except Exception as e:
        print("[ERROR] Agent generation failed:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        elapsed_ms = int((time.time() - start_time) * 1000)
        try:
            log = ApiLog(
                endpoint="/api/v1/generate-trip",
                method="POST",
                status_code=status,
                response_time_ms=elapsed_ms,
                destination=dest_str,
            )
            db.add(log)
            db.commit()
        except Exception:
            pass  # never let logging break the main flow


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)