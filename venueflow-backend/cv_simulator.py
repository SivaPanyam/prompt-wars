import asyncio
import websockets
import json
import random

zones = [
    {"id": "gate_n", "name": "North Gate", "density": 20, "sentiment": "neutral", "wait_time": "2m"},
    {"id": "gate_s", "name": "South Gate", "density": 45, "sentiment": "neutral", "wait_time": "5m"},
    {"id": "cafe_142", "name": "Sec 142 Cafe", "density": 10, "sentiment": "happy", "wait_time": "1m"},
    {"id": "cafe_vip", "name": "VIP Lounge", "density": 5, "sentiment": "neutral", "wait_time": "0m"},
    {"id": "bath_144", "name": "Sec 144 Baths", "density": 15, "sentiment": "neutral", "wait_time": "2m"},
]

async def interactive_menu(websocket):
    print("\n" + "="*40)
    print("Hackathon God-Mode Simulator Controls:")
    print("[1] Trigger 'Hype Squad' (Angry Sentiment at Cafe 142)")
    print("[2] Trigger 'Red Alert' Emergency (Medical Issue)")
    print("[3] Trigger 'Post-Game Rush' (Predictive Analysis)")
    print("[4] Reset to NORMAL")
    print("="*40 + "\n")
    
    while True:
        choice = await asyncio.to_thread(input, "Enter command (1-4): ")
        if choice == '1':
            # Make someone angry due to high wait time
            for z in zones:
                if z["id"] == "cafe_142":
                    z["sentiment"] = "angry"
                    z["density"] = 120
                    z["wait_time"] = "45m"
            await websocket.send(json.dumps({"type": "mesh_update", "zones": zones}))
            print(">>> HYPE SQUAD DISPATCHED!")
            
        elif choice == '2':
            await websocket.send(json.dumps({"type": "global_override", "status": "EMERGENCY"}))
            print(">>> RED ALERT TRIGGERED!")
            
        elif choice == '3':
            await websocket.send(json.dumps({"type": "global_override", "status": "POST_GAME"}))
            print(">>> POST-GAME PREDICTIVE TRIGGERED!")
            
        elif choice == '4':
            for z in zones:
                z["sentiment"] = "neutral"
                z["density"] = random.randint(10, 30)
                z["wait_time"] = "3m"
            await websocket.send(json.dumps({"type": "global_override", "status": "NORMAL"}))
            await websocket.send(json.dumps({"type": "mesh_update", "zones": zones}))
            print(">>> SYSTEM RESET TO NORMAL.")

async def simulate_cv_feed():
    uri = "ws://localhost:8000/ws"
    print("Initiating Multi-Camera Mesh Stream...")
    async with websockets.connect(uri) as websocket:
        
        # Start the interactive thread
        asyncio.create_task(interactive_menu(websocket))
        
        while True:
            # Continuously pulse the data to keep it 'alive'
            for z in zones:
                # Don't overwrite our engineered override states
                if z["sentiment"] != "angry":
                    z["density"] += random.randint(-2, 3)
                    z["density"] = max(0, min(150, z["density"])) # clamp
                    
            await websocket.send(json.dumps({
                "type": "mesh_update", 
                "zones": zones
            }))
            
            await asyncio.sleep(2)

if __name__ == "__main__":
    asyncio.run(simulate_cv_feed())
