from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import asyncio
import json
import logging
import random
import os
from typing import List
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini Configuration
API_KEY = os.getenv("GOOGLE_API_KEY")
if API_KEY:
    try:
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        HAS_GEMINI = True
    except Exception:
        HAS_GEMINI = False
else:
    HAS_GEMINI = False

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
        for connection in list(self.active_connections):
            try:
                await connection.send_text(message)
            except Exception:
                self.disconnect(connection)

manager = ConnectionManager()

# --- God-Tier AI ---
class ConciergeAI:
    def __init__(self, model, enabled):
        self.model = model
        self.enabled = enabled
        self.system_prompt = """You are VenueFlow Core, the stadium's intelligent nervous system.
        You process live IoT mesh data and provide critical safety and convenience info.
        
        LOGIC RULES:
        1. IF stadium_status is 'EMERGENCY': Your EXCLUSIVE priority is life-safety. Direct users to the nearest empty gate (North Gate) and tell them to ignore concessions.
        2. IF sentiment is 'angry' in a zone: Suggest proactive staff intervention or a specific 'Hype Squad' move.
        3. IF a zone is 'density > 60': Route users to lower density alternatives (e.g., Sec 142 Cafe).
        
        Respond in strict JSON: {"reply": "..."}
        Keep replies professional, authoritative, and helpful."""

    async def get_response(self, query: str, state: dict):
        if self.enabled:
            try:
                # Provide a structured breakdown of the state for better context awareness
                state_context = f"STATUS: {state['global_status']}\nZONES: {json.dumps(state['zones'])}\nALERTS: {json.dumps(state['alerts'])}"
                full_prompt = f"{self.system_prompt}\n\nDATA:\n{state_context}\n\nUSER QUERY: {query}"
                response = self.model.generate_content(full_prompt)
                return json.loads(response.text.replace('```json', '').replace('```', '').strip())
            except Exception: pass
        return self.simulate(query, state)

    def simulate(self, query: str, state: dict):
        q = query.lower()
        if state["global_status"] == "EMERGENCY":
            return {"reply": "⚠️ CRITICAL: Follow red route to NORTH GATE."}
        if "beer" in q or "food" in q:
            return {"reply": "🍻 Cafe 142 is clear. VIP Lounge is empty."}
        return {"reply": "VenueFlow Core active. Mesh nominal."}

concierge = ConciergeAI(model if HAS_GEMINI else None, HAS_GEMINI)

# --- State & Endpoints ---
stadium_state = {
    "global_status": "NORMAL",
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

class ConciergeRequest(BaseModel):
    query: str
    location: str

@app.post("/api/concierge")
async def ai_endpoint(req: ConciergeRequest):
    return await concierge.get_response(req.query, stadium_state)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        await websocket.send_text(json.dumps(stadium_state))
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            if payload.get("type") == "mesh_update":
                stadium_state["zones"] = payload.get("zones", stadium_state["zones"])
                for zone in stadium_state["zones"]:
                    if zone.get("sentiment") == "angry" and stadium_state["global_status"] == "NORMAL":
                        alert = {
                            "title": "Sentiment Alert",
                            "msg": f"Negative sentiment at {zone['name']}. Dispatching Hype Squad.",
                            "severity": "medium",
                            "time": "Live"
                        }
                        if not any(a["title"] == "Sentiment Alert" for a in stadium_state["alerts"][:2]):
                            stadium_state["alerts"].insert(0, alert)
                stadium_state["alerts"] = stadium_state["alerts"][:5]
                await manager.broadcast(json.dumps(stadium_state))
            
            elif payload.get("type") == "global_override":
                stadium_state["global_status"] = payload.get("status", "NORMAL")
                if stadium_state["global_status"] == "EMERGENCY":
                    stadium_state["alerts"].insert(0, {"title": "RED ALERT", "msg": "Sector 142 Hazard. Evacuation Active.", "severity": "high", "time": "Live"})
                stadium_state["alerts"] = stadium_state["alerts"][:5]
                await manager.broadcast(json.dumps(stadium_state))
    except Exception:
        pass
    finally:
        manager.disconnect(websocket)

# --- God-Tier Static Asset & Route Fallback ---
# Next.js static exports use Clean URLs (e.g., /dashboard -> dashboard.html)
# This intelligent handler ensures refreshes and direct links work perfectly.
@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    static_dir = "static"
    if not os.path.exists(static_dir):
        return {"error": "Static directory not found"}

    # 1. Check if path is empty (root)
    if not full_path or full_path == "":
        return FileResponse(os.path.join(static_dir, "index.html"))

    # 2. Check if exact file exists (e.g., /_next/static/...)
    file_path = os.path.join(static_dir, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)

    # 3. Check for HTML version of clean URL (e.g., /dashboard -> dashboard.html)
    html_path = f"{file_path}.html"
    if os.path.isfile(html_path):
        return FileResponse(html_path)

    # 4. Fallback to index.html for SPA routing
    return FileResponse(os.path.join(static_dir, "index.html"))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
