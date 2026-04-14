<div align="center">
  
# 🏟️ VenueFlow
**The AI-Native Stadium Nervous System**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](#)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](#)
[![Google Gemini](https://img.shields.io/badge/AI_Engine-Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](#)
[![WebSockets](https://img.shields.io/badge/IoT-WebSockets-010101?style=for-the-badge&logo=socket.io&logoColor=white)](#)

*Synchronizing millions of square feet. Re-routing crowds in milliseconds. Saving lives instantly.*

---

</div>

## 🧨 The Problem: The Stadium "Black Box"
Modern stadiums operate blindly. Bottlenecks at gates, multi-hour wait times at concessions, and highly dangerous evacuation blind spots ruin the live entertainment experience and threaten public safety.

## 💎 The VenueFlow Solution
VenueFlow is a bidirectional nervous system for large-scale venues. By networking stadium security cameras into a real-time **Computer Vision mesh array**, VenueFlow uses **Generative AI** to instantly re-route crowds, deploy staff, execute dynamic flash sales, and automatically manage mass evacuations without human latency.

---

## 🔥 God-Tier Features Matrix

| Feature | Technology | Impact |
| :--- | :--- | :--- |
| **Multi-Camera CV Mesh 📸** | OpenCV / WebSockets | VenueFlow natively understands real pax density and crowd sentiment across millions of square feet in real-time, completely replacing guess-work. |
| **AI "Ops Concierge" 🧠** | Google Gemini LLM | Attendees query an AI ("Where is the fastest burger?"). The AI reads the live camera mesh and issues a customized AR route instantly. |
| **Predictive Flash Sales 💸** | AI Analytics | 10 mins before a game ends, VenueFlow dynamically pushes targeted UI alerts urging attendees to use empty exits in exchange for Uber discounts. |
| **"Hype Squad" Dispatch 🎉** | Sentiment Analysis | If a concession line generates heavy frustration (angry sentiment), the AI automatically dispatches the mascot with free merch to that GPS coordinate. |
| **Instant Red-Alerts 🚨** | Distributed System | In a crisis, the system executes a `< 1 second` venue-wide override. All Attendee apps lose commerce features and display pulsing emergency evacuation routes. |

---

## 🏗️ Technical Architecture

<div align="center">

```mermaid
graph TD;
    %% Data Ingestion
    CVScript[📸 Python CV Mesh Simulator] -->|Raw IoT Data| WSIngest(FastAPI WebSocket Server)
    
    %% Core Operations
    subgraph "VenueFlow Core (Brain)"
        WSIngest --> StateManager[(In-Memory State Engine)]
        StateManager -- Evaluates Logic --> LLMBridge[🧠 Google Gemini Bridge]
    end

    %% Edge Outputs
    subgraph "Edge / User Interfaces"
        StateManager -. 30fps Live Sync .-> StaffDash[🖥️ React Operations Command Center]
        LLMBridge -. Personalized Routing .-> AttendeeApp[📱 Next.js Attendee App]
        StateManager -. Red Alerts .-> AttendeeApp
    end
```

</div>

---

## 🚀 Presentation Guide (Running Locally)

For Hakathon Judges and Evaluators: This repository contains everything needed for the end-to-end demo.

### 1. Boot the AI Engine (Terminal 1)
```bash
cd venueflow-backend
python -m venv venv
# Activate the venv (env\Scripts\activate on Windows)
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Boot the Edge Displays (Terminal 2)
```bash
cd venueflow-frontend
npm install
npm run dev
# Open http://localhost:3000 to view the Operations Portal
```

### 3. Initiate the "God-Mode" CV Simulator (Terminal 3)
```bash
cd venueflow-backend
python cv_simulator.py
```

> **✨ MAGIC TRICK:** Once `cv_simulator.py` is running, use your keyboard's **Number Pad (1-4)** in that terminal to act as "God" during the pitch. You can manually trigger massive AI re-routing events, emergency screen-overrides, and Mascot dispatches that actively manipulate the frontend interfaces live in front of the judges!

---

<div align="center">

*Engineered with precision for the Hackathon Finals.* 🏆

</div>
