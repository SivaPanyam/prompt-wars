"use client";

import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [dbState, setDbState] = useState({
    global_status: "NORMAL",
    total_attendance: 68241,
    zones: [],
    alerts: [ { title: "Connecting", msg: "Connecting to IoT Camera Mesh...", severity: "low", time: "" } ]
  });

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onopen = () => setConnected(true);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setDbState(data);
      } catch (e) {
        console.error("Failed to parse websocket message", e);
      }
    };
    ws.onclose = () => setConnected(false);
    return () => ws.close();
  }, []);

  const { alerts, global_status, zones } = dbState;
  const isEmergency = global_status === "EMERGENCY";

  return (
    <div className={`w-full min-h-screen space-y-6 pt-4 px-4 transition-colors duration-500 animate-fade-in ${isEmergency ? 'bg-red-950/40 border-4 border-red-500 rounded-2xl' : ''}`}>
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEmergency ? <span className="text-red-500 animate-pulse">⚠️ EVACUATION PROTOCOL ACTIVE</span> : "Ops Command Center"}
          </h1>
          <p className="text-white/50 mt-1">Multi-Camera CV Mesh & Gemini Dispatch Matrix</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${connected ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className={`text-xs font-medium ${connected ? 'text-emerald-400' : 'text-red-400'}`}>
            {connected ? "Mesh Matrix Online" : "System Disconnected"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
        {/* Camera Mesh Visualizer */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-6 flex flex-col relative overflow-hidden">
          <h3 className="font-semibold text-lg text-white mb-4 flex justify-between">
            <span>Camera Mesh Output</span>
            <span className="text-xs text-white/40">Powered by OpenCV</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             {zones && zones.map((zone: any) => {
                const isAngry = zone.sentiment === "angry";
                const isHeavy = zone.density > 60;
                
                return (
                  <div key={zone.id} className={`p-4 rounded-xl border transition-colors duration-300 ${isEmergency ? 'bg-red-500/20 border-red-500/50' : isAngry ? 'bg-purple-500/20 border-purple-500/50 scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : isHeavy ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-bold text-white/60 tracking-wider flex items-center gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${isAngry ? 'bg-purple-500 animate-ping' : 'bg-emerald-500'}`}></div>
                          CAM: {zone.name.toUpperCase()}
                       </span>
                       <span className="text-xl">{isAngry ? '🤬' : zone.sentiment === 'happy' ? '😀' : '😐'}</span>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                       <div>
                         <p className="text-[10px] text-white/40 uppercase">Density</p>
                         <p className={`text-3xl font-bold ${isHeavy ? 'text-orange-400' : 'text-blue-400'}`}>{zone.density}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] text-white/40 uppercase">Wait</p>
                         <p className="text-sm font-bold text-white/80">{zone.wait_time}</p>
                       </div>
                    </div>
                    {isAngry && !isEmergency && (
                       <div className="mt-3 text-[10px] bg-purple-500 text-white font-bold text-center py-1 rounded w-full animate-bounce">
                          HYPE SQUAD DISPATCHED
                       </div>
                    )}
                    {isEmergency && (
                       <div className="mt-3 text-[10px] bg-red-600 text-white font-bold text-center py-1 rounded w-full border border-red-400 animate-pulse">
                          CRITICAL ZONE
                       </div>
                    )}
                  </div>
                );
             })}
          </div>
          
          <div className="absolute bottom-4 left-6 text-xs text-white/30 font-mono">
            Scanning 140,242 sqft • Frame Rate: 33fps • Edge Node: Active
          </div>
        </div>

        {/* Dispatch Log */}
        <div className="glass-panel rounded-xl p-6 flex flex-col border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-white">Gemini Ops Log</h3>
          </div>
          <div className="flex-grow overflow-y-auto space-y-4 pr-2">
            {alerts && alerts.map((alert: any, i: number) => (
               <div key={i} className={`bg-white/5 border rounded-lg p-3 transition-colors ${alert.severity === 'high' ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : alert.severity === 'medium' ? 'bg-purple-500/10 border-purple-500/30' : 'border-white/5'}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    alert.severity === 'high' ? 'text-red-400' : alert.severity === 'medium' ? 'text-purple-400' : 'text-blue-400'
                  }`}>
                    {alert.title}
                  </span>
                  <span className="text-[10px] text-white/40">{alert.time}</span>
                </div>
                <p className="text-sm text-white/90 leading-relaxed font-mono mt-1">{alert.msg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
