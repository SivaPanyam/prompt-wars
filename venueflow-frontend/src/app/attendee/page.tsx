"use client";

import React, { useState, useEffect, useRef } from 'react';

export default function AttendeeApp() {
  const [dbState, setDbState] = useState({
    global_status: "NORMAL",
    total_attendance: 68241,
    gates: {},
    alerts: []
  });

  const [conciergeMsg, setConciergeMsg] = useState("");
  const [conciergeInput, setConciergeInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data) setDbState(data);
      } catch (e) {
        console.error("Failed to parse websocket message", e);
      }
    };
    return () => ws.close();
  }, []);

  const handleConciergeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conciergeInput.trim()) return;
    
    setIsTyping(true);
    const query = conciergeInput;
    setConciergeInput("");
    
    try {
      const res = await fetch("http://localhost:8000/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query, location: "Sec 142" })
      });
      const data = await res.json();
      setConciergeMsg(data.reply);
    } catch(err) {
      setConciergeMsg("Sorry, I'm having trouble connecting to the network right now.");
    }
    setIsTyping(false);
  };

  const { global_status, alerts } = dbState;
  const isEmergency = global_status === "EMERGENCY";
  const latestAlert = alerts.length > 0 ? alerts[0] : null;

  if (isEmergency) {
    return (
      <div className="w-full flex items-center justify-center pt-8 animate-fade-in bg-black">
        <div className="max-w-sm w-full bg-red-600 rounded-[3rem] border-[6px] border-red-800 shadow-2xl shadow-red-500/50 overflow-hidden relative h-[800px] flex flex-col justify-center items-center text-center p-8 animate-pulse duration-1000">
           <div className="text-6xl mb-4">🚨</div>
           <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-4">Evacuate Now</h1>
           <p className="text-white/90 font-medium mb-8">
             Medical anomaly detected near Section 142. Please proceed calmly to the North Exit immediately. All concessions are closed.
           </p>
           <div className="bg-red-900/50 border-4 border-white/20 rounded-xl w-full h-48 flex items-center justify-center">
             <span className="text-white/50 text-sm font-bold">[ Interactive AR Map Placeholder ]<br/>Routing to North Exit...</span>
           </div>
        </div>
      </div>
    );
  }

  // Normal / Post-Game States
  return (
    <div className="w-full flex items-center justify-center pt-8 animate-fade-in">
      <div className="max-w-sm w-full bg-[#12141a] rounded-[3rem] border-[6px] border-white/10 shadow-2xl overflow-hidden relative">
        {/* Dynamic Island Simulation */}
        <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
          <div className="w-32 h-6 bg-black rounded-b-2xl"></div>
        </div>

        <div className="h-[800px] overflow-y-auto pt-10 pb-20 relative bg-gradient-to-b from-[#12141a] to-[#0a0c10]">
          
          <div className="px-6 flex justify-between items-center mb-6">
            <div>
              <p className="text-white/50 text-sm font-medium">Sat, Nov 12 • Section 142</p>
              <h1 className="text-2xl font-bold text-white mt-1">Hello, Alex</h1>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/20" />
          </div>

          <div className="px-6">  
            {/* AI Concierge Chat Interface */}
            <div className="bg-gradient-to-tr from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-2xl p-4 mb-6 relative overflow-hidden backdrop-blur-xl">
               <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                 <span className="text-xl">✨</span>
                 <h2 className="text-sm font-bold text-white">Ask VenueFlow AI</h2>
               </div>
               
               {conciergeMsg && (
                 <div className="bg-black/40 rounded-xl p-3 mb-3 border border-white/5 animate-fade-in">
                   <p className="text-sm text-blue-100/90 leading-relaxed">{conciergeMsg}</p>
                 </div>
               )}
               
               <form onSubmit={handleConciergeSubmit} className="relative">
                 <input 
                   type="text" 
                   value={conciergeInput}
                   onChange={e => setConciergeInput(e.target.value)}
                   disabled={isTyping}
                   placeholder="e.g. Where is the shortest bathroom line?"
                   className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-colors"
                 />
                 <button type="submit" disabled={isTyping} className="absolute right-1 top-1 w-7 h-7 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                   {isTyping ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <span className="text-white text-[10px]">➤</span>}
                 </button>
               </form>
               <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                 <button onClick={() => setConciergeInput("Find food fastest route")} className="whitespace-nowrap bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1 text-[10px] text-white/70 transition-colors">🍔 Fastest Food</button>
                 <button onClick={() => setConciergeInput("Find restroom near me")} className="whitespace-nowrap bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1 text-[10px] text-white/70 transition-colors">🚻 Find Restrooms</button>
               </div>
            </div>

            {/* Predictive Push Banner */}
            {global_status === "POST_GAME" && (
                <div className="bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl p-4 mb-6 shadow-lg shadow-orange-500/20 animate-bounce">
                  <h3 className="font-black text-white text-sm uppercase tracking-wide">Beat the Rush</h3>
                  <p className="text-white/90 text-xs mt-1">The South Exit will be jammed in 10 mins. Walk to the North Exit now and get a 50% discount on an Uber.</p>
                </div>
            )}
            
            {/* Mascot Hype Push Banner */}
            {latestAlert && latestAlert.title.includes("Sentiment") && (
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-4 mb-6 shadow-lg shadow-pink-500/20 animate-fade-in">
                  <h3 className="font-black text-white text-sm uppercase tracking-wide">Surprise Incoming! 🎉</h3>
                  <p className="text-white/90 text-xs mt-1">We see the lines are long near you. Hold tight, the Mascot is bringing free merch your way!</p>
                </div>
            )}

            {/* Tickets Section */}
            <h2 className="text-lg font-bold text-white mb-3">Your Event</h2>
            <div className="bg-white rounded-3xl p-5 shadow-xl">
              <div className="flex justify-between items-center border-b border-black/10 pb-4 mb-4">
                <div>
                  <p className="text-black/50 text-[10px] font-bold uppercase tracking-wider">Gate Entrance</p>
                  <p className="text-black font-bold text-lg">VIP South</p>
                </div>
                <div className="text-right">
                  <p className="text-black/50 text-[10px] font-bold uppercase tracking-wider">Row • Seat</p>
                  <p className="text-black font-bold text-lg">12 • 4A</p>
                </div>
              </div>
              <div className="flex justify-center flex-col items-center">
                <div className="w-full h-12 bg-black/5 rounded flex items-center justify-center space-x-1 opacity-60">
                   {[...Array(24)].map((_, i) => <div key={i} className={`h-8 bg-black ${i % 3 === 0 ? 'w-2' : 'w-1'}`}></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fake iOS Bottom Navigation */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-black/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center px-4 pb-2 z-50">
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <span className="text-[10px] text-white/50 font-medium">Home</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <span className="text-[10px] text-white/50 font-medium">Map AR</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <span className="text-[10px] text-white/50 font-medium">Order</span>
          </div>
        </div>

      </div>
    </div>
  );
}
