"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  AlertTriangle, 
  Camera, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Zap,
  Users,
  Wifi,
  WifiOff,
  RefreshCcw,
  TrendingUp,
  Map as MapIcon,
  Pulse
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [dbState, setDbState] = useState({
    global_status: "NORMAL",
    total_attendance: 68241,
    zones: [],
    alerts: [ { title: "Connecting", msg: "Connecting to IoT Camera Mesh...", severity: "low", time: "" } ]
  });

  const [connected, setConnected] = useState(false);
  const [isResyncing, setIsResyncing] = useState(false);
  const [sentimentHistory, setSentimentHistory] = useState<number[]>([]);

  useEffect(() => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    ws.onopen = () => setConnected(true);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setDbState(data);
        
        // Update sentiment history for the pulse chart
        const avgSentiment = data.zones?.length > 0 
          ? data.zones.reduce((acc: number, z: any) => acc + (z.sentiment === 'happy' ? 100 : z.sentiment === 'angry' ? 20 : 60), 0) / data.zones.length
          : 60;
        
        setSentimentHistory(prev => [...prev.slice(-19), avgSentiment]);
      } catch (e) {
        console.error("Failed to parse websocket message", e);
      }
    };
    ws.onclose = () => setConnected(false);
    return () => ws.close();
  }, []);

  const handleResync = () => {
    setIsResyncing(true);
    setTimeout(() => setIsResyncing(false), 2000);
  };

  const { alerts, global_status, zones, total_attendance } = dbState;
  const isEmergency = global_status === "EMERGENCY";

  return (
    <div className={cn(
      "min-h-screen transition-all duration-700 ease-in-out p-6",
      isEmergency ? "bg-[#1a0505]" : "bg-[#05070a]",
      "text-white overflow-hidden"
    )}>
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-2xl shadow-lg transition-colors duration-500",
              isEmergency ? "bg-red-500 shadow-red-500/50" : "bg-cyan-600 shadow-cyan-500/50"
            )}>
              {isEmergency ? <ShieldAlert size={32} /> : <Activity size={32} />}
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
                VENUEFLOW <span className="font-extralight text-white/40 italic">CORE</span>
                {isEmergency && (
                  <motion.span 
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-red-500 text-sm font-bold tracking-widest ml-4 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30"
                  >
                    RED ALERT ACTIVE
                  </motion.span>
                )}
              </h1>
              <div className="flex items-center gap-4 text-xs font-bold text-white/40 uppercase tracking-widest mt-1">
                <span className="flex items-center gap-1.5"><Camera size={12} /> Live Mesh Analysis</span>
                <span className="flex items-center gap-1.5"><Zap size={12} className="text-amber-400" /> Gemini Engine Proxy</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden lg:flex items-center gap-8 mr-8">
                <div className="text-right">
                  <p className="text-[10px] text-white/30 uppercase font-black">Attendance</p>
                  <p className="text-xl font-mono font-bold">{total_attendance.toLocaleString()}</p>
                </div>
                <div className="h-10 w-[1px] bg-white/10" />
                <div className="text-right">
                  <p className="text-[10px] text-white/30 uppercase font-black">Sentiment Pulse</p>
                  <div className="flex items-center gap-2">
                     <TrendingUp size={16} className="text-emerald-400" />
                     <p className="text-xl font-mono font-bold text-emerald-400">Stable</p>
                  </div>
                </div>
             </div>

             <button 
               id="mesh-resync-btn"
               onClick={handleResync}
               disabled={isResyncing}
               aria-label="Manually resynchronize IoT camera mesh"
               className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50"
             >
               <RefreshCcw size={14} className={cn(isResyncing && "animate-spin")} aria-hidden="true" />
               {isResyncing ? "Re-syncing..." : "Mesh Resync"}
             </button>

             <div className={cn(
               "flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all duration-300",
               connected ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
             )}>
               <Wifi size={16} className={cn(connected && "animate-pulse")} />
               <span className="text-xs font-black tracking-tight uppercase">{connected ? "Nodes Synced" : "Nodes Offline"}</span>
             </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full min-h-[750px]">
          
          {/* Camera Mesh Feed */}
          <div className="xl:col-span-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-8 bg-cyan-500 rounded-full" />
                 <h2 className="text-xl font-black uppercase tracking-tight">Camera Mesh Array</h2>
              </div>
              
              {/* Sentiment Pulse SVG Component */}
              <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-2xl border border-white/5">
                 <span className="text-[10px] font-black text-white/30 uppercase">Sentiment Trend</span>
                 <svg id="sentiment-pulse-chart" width="100" height="24" className="overflow-visible" role="img" aria-label="Line chart showing real-time stadium sentiment trends">
                    <title>Stadium Sentiment Pulse</title>
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeLinecap="round"
                      points={sentimentHistory.map((val, i) => `${i * 5},${24 - (val / 100) * 20}`).join(' ')}
                    />
                 </svg>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
              <AnimatePresence mode="popLayout">
                {zones && zones.map((zone: any) => {
                  const isAngry = zone.sentiment === "angry";
                  const isHeavy = zone.density > 60;

                  return (
                    <motion.div
                      key={zone.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={cn(
                        "relative group p-6 rounded-[2rem] border transition-all duration-500 overflow-hidden shadow-lg",
                        isEmergency ? "bg-red-900/20 border-red-500/40" : 
                        isAngry ? "bg-purple-900/30 border-purple-500/50" :
                        "bg-white/5 border-white/10 hover:border-white/20"
                      )}
                    >
                      <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2">
                             <div className={cn(
                               "w-2 h-2 rounded-full",
                               isAngry ? "bg-purple-500 animate-ping" : "bg-emerald-500"
                             )} />
                             <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">ZONE {zone.id.split('_')[1] || '01'}</span>
                           </div>
                           <h3 className="font-bold text-lg">{zone.name}</h3>
                        </div>
                        <div className="text-3xl filter drop-shadow-lg" role="img" aria-label={`Current sentiment: ${zone.sentiment}`}>
                          {isAngry ? '🤬' : zone.sentiment === 'happy' ? '🤩' : '👀'}
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between items-end relative z-10">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-white/30 uppercase tracking-tighter">Density (pax)</p>
                          <span className={cn(
                            "text-4xl font-black tracking-tighter",
                            isHeavy ? "text-orange-400" : "text-cyan-400"
                          )}>{zone.density}</span>
                        </div>
                        <div className="text-right">
                           <div className="flex items-center gap-1.5 justify-end text-white/50 text-xs mb-1">
                             <Clock size={12} /> <span>Wait</span>
                           </div>
                           <p className="text-lg font-black">{zone.wait_time}</p>
                        </div>
                      </div>

                      {/* AI Action Indicator */}
                      <div className="mt-6 pt-4 border-t border-white/5 relative z-10">
                         {isAngry && !isEmergency ? (
                           <div className="flex items-center gap-2 text-[10px] font-black text-purple-400 animate-pulse bg-purple-500/10 p-2 rounded-xl">
                             <Zap size={14} fill="currentColor" /> HYPE SQUAD DISPATCHED
                           </div>
                         ) : isEmergency ? (
                           <div className="flex items-center gap-2 text-[10px] font-black text-red-400 bg-red-500/10 p-2 rounded-xl border border-red-500/20">
                             <ShieldAlert size={14} /> EVACUATION PRIORITY
                           </div>
                         ) : (
                           <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
                             <CheckCircle2 size={12} /> Nominal Ops
                           </div>
                         )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-black text-white/20 tracking-widest uppercase">
              <div className="flex gap-6">
                 <span className="flex items-center gap-1.5 text-cyan-500/40"><MapIcon size={12} /> Staff Heatmap: Active</span>
                 <span>Scan Complexity: 0.98</span>
                 <span>Models: Gemini 1.5</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                 GRID ENCRYPTED
              </div>
            </div>
          </div>

          {/* Gemini Dispatch Matrix (Log) */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col shadow-2xl relative overflow-hidden">
             <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="p-2 bg-white/10 rounded-xl text-cyan-400">
                  <Zap size={20} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight">AI Dispatch Log</h2>
             </div>

             <div className="flex-grow space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                <AnimatePresence mode="popLayout">
                  {alerts && alerts.map((alert: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "p-5 rounded-3xl border transition-all duration-300",
                        alert.severity === 'high' ? "bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]" :
                        alert.severity === 'medium' ? "bg-purple-500/10 border-purple-500/30" :
                        "bg-white/5 border-white/10"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                          alert.severity === 'high' ? "bg-red-500 text-white" :
                          alert.severity === 'medium' ? "bg-purple-500/20 text-purple-400" :
                          "bg-cyan-500/20 text-cyan-400"
                        )}>
                          {alert.title}
                        </span>
                        <span className="text-[10px] font-mono text-white/30">{alert.time || "LIVE"}</span>
                      </div>
                      <p className="text-sm font-medium text-white/90 leading-relaxed font-mono tracking-tight lowercase">
                        {alert.msg}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
             
             <div className="mt-6 p-4 rounded-2xl bg-black/40 border border-white/5 text-[10px] font-mono text-white/40 leading-snug">
                VENUEFLOW://MESH02_ACTIVE <br/>
                GEMINI_CORE://BOOTING... <br/>
                STADIUM_STATUS://100%_NOMINAL
             </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
    </div>
  );
}
