from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
import json
import logging
import random
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                logging.error(f"Error broadcasting: {e}")

manager = ConnectionManager()

# Multi-Camera Mesh State
stadium_state = {
    "global_status": "NORMAL", # NORMAL, EMERGENCY, POST_GAME
    "total_attendance": 68241,
    "zones": [
        {"id": "gate_n", "name": "North Gate", "density": 20, "sentiment": "neutral", "wait_time": "2m"},
        {"id": "gate_s", "name": "South Gate", "density": 45, "sentiment": "neutral", "wait_time": "5m"},
        {"id": "cafe_142", "name": "Sec 142 Cafe", "density": 10, "sentiment": "happy", "wait_time": "1m"},
        {"id": "cafe_vip", "name": "VIP Lounge", "density": 5, "sentiment": "neutral", "wait_time": "0m"},
        {"id": "bath_144", "name": "Sec 144 Baths", "density": 15, "sentiment": "neutral", "wait_time": "2m"},
    ],
    "alerts": [
        { "title": "Mesh Online", "msg": "IoT Cameras syncing 5 active tracking zones...", "severity": "low", "time": "Just now" }
    ]
}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        await websocket.send_text(json.dumps(stadium_state))
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            # Allow simulator to push entire state updates or specific overrides
            if payload.get("type") == "mesh_update":
                stadium_state["zones"] = payload.get("zones", stadium_state["zones"])
                
                # Check for automatic alerts based on new mesh data
                for zone in stadium_state["zones"]:
                    # Hype Squad triggers on 'angry' sentiment
                    if zone.get("sentiment") == "angry" and stadium_state["global_status"] == "NORMAL":
                        alert = {
                            "title": "Sentiment Alert (Gemini)",
                            "msg": f"Negative sentiment detected at {zone['name']} due to overcrowding ({zone['density']} pax). Dispatching Hype Squad and T-Shirt Cannon to diffuse wait time friction.",
                            "severity": "medium",
                            "time": "Live"
                        }
                        if len(stadium_state["alerts"]) == 0 or stadium_state["alerts"][0]["title"] != "Sentiment Alert (Gemini)":
                            stadium_state["alerts"].insert(0, alert)
                            
                stadium_state["alerts"] = stadium_state["alerts"][:5]
                await manager.broadcast(json.dumps(stadium_state))
            
            elif payload.get("type") == "global_override":
                stadium_state["global_status"] = payload.get("status", "NORMAL")
                
                if stadium_state["global_status"] == "EMERGENCY":
                    stadium_state["alerts"].insert(0, {
                        "title": "CRITICAL EMERGENCY",
                        "msg": "Medical anomaly detected in Sector 142. Executing venue-wide AR evacuation protocols.",
                        "severity": "high",
                        "time": "Live"
                    })
                elif stadium_state["global_status"] == "POST_GAME":
                    stadium_state["alerts"].insert(0, {
                        "title": "Predictive AI: Post-Game",
                        "msg": "Match ending in 10 mins. South Gate predict 45m delay. Executing crowd-smoothing flash sales on Attendee App.",
                        "severity": "medium",
                        "time": "Live"
                    })
                
                stadium_state["alerts"] = stadium_state["alerts"][:5]
                await manager.broadcast(json.dumps(stadium_state))

    except WebSocketDisconnect:
        manager.disconnect(websocket)

class ConciergeRequest(BaseModel):
    query: str
    location: str

@app.post("/api/concierge")
async def ai_concierge(req: ConciergeRequest):
    """
    Acts as the Gemini API proxy. In a real environment, you'd pass stadium_state + req.query to google-genai. 
    Here, we use smart parsing to ensure the demo is instantaneous and flawless.
    """
    query = req.query.lower()
    
    # Analyze live state to give accurate responses 
    # (e.g. If cafe_142 is crowded, tell them to go to VIP or Cafe 110)
    cafe_142 = next(z for z in stadium_state["zones"] if z["id"] == "cafe_142")
    
    response_msg = "I can guide you! Are you looking for food, restrooms, or exits?"
    
    if "food" in query or "burger" in query or "hungry" in query:
        if cafe_142["density"] > 30:
            response_msg = f"Sec 142 Cafe near you is very busy right now (wait: {cafe_142['wait_time']}). I recommend the VIP Lounge which has a 0m wait right now. I've sent an AR route to your screen."
        else:
            response_msg = f"You're in luck! Sec 142 Cafe right next to you has only a {cafe_142['wait_time']} wait. I've sent the mobile-order menu to your screen."
            
    elif "bathroom" in query or "restroom" in query:
        response_msg = "The Sec 144 Baths are right around the corner with a 2m wait. I'll highlight the path for you."
    
    elif "emergency" in query or "help" in query:
        response_msg = "I am flagging your location for Security and Medical dispatch. Please stay calm, help is inbound."

    elif "leave" in query or "exit" in query or "home" in query:
        south_gate = next(z for z in stadium_state["zones"] if z["id"] == "gate_s")
        if south_gate["density"] > 40:
             response_msg = "The South Gate is heavily congested right now. Head towards the North Gate for an immediate exit and a 20% Uber discount!"
        else:
             response_msg = "The South Gate is clear! Have a safe trip home."

    return {
        "reply": response_msg,
        "action": "ROUTE_DRAWN"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
