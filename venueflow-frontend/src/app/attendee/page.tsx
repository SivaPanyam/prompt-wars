"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Map as MapIcon, 
  Clock, 
  Beer, 
  Navigation, 
  User, 
  Sparkles, 
  AlertCircle,
  ShieldCheck,
  ChevronUp,
  Globe,
  Eye,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Simulated translation dictionary
const TRANSLATIONS: any = {
  EN: { welcome: "Hello, Alex.", prompt: "Ask me anything...", island: "VENUEFLOW LIVE", safety: "Safety Score: Optimal" },
  ES: { welcome: "Hola, Alex.", prompt: "Pregúntame lo que sea...", island: "VENUEFLOW EN VIVO", safety: "Seguridad: Óptima" },
  JA: { welcome: "こんにちは、アレックス。", prompt: "何でも聞いてください...", island: "ライブ・ビュー", safety: "安全スコア：最適" },
  FR: { welcome: "Bonjour, Alex.", prompt: "Demandez-moi n'importe quoi...", island: "VENUEFLOW EN DIRECT", safety: "Score de sécurité : Optimal" }
};

export default function AttendeeApp() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("EN");
  const [highContrast, setHighContrast] = useState(false);
  const [status, setStatus] = useState({ state: "NORMAL", msg: "", eta: "" });
  const [isIslandExpanded, setIsIslandExpanded] = useState(false);
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.global_status !== status.state) {
          setStatus({ state: data.global_status, msg: data.alerts?.[0]?.msg || "", eta: "" });
          if (data.global_status === "EMERGENCY") setIsIslandExpanded(true);
        }
      } catch (e) {}
    };
    return () => ws.close();
  }, [status.state]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const response = await fetch("http://localhost:8000/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input, location: "Sec 142" })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "ai", text: data.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "ai", text: "I'm having trouble connecting to the stadium network. Please follow physical signage." }]);
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500 flex justify-center items-center p-4",
      highContrast ? "bg-black" : "bg-neutral-950",
      status.state === "EMERGENCY" && !highContrast ? "bg-red-950/20" : ""
    )}>
      
      {/* Phone Frame Mockup */}
      <div className={cn(
        "w-full max-w-[420px] h-[850px] rounded-[3.5rem] relative overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] border-8",
        highContrast ? "border-white" : "border-neutral-900 bg-[#0a0a0b]"
      )}>
        
        {/* Notch / Dynamic Island */}
        <div className="absolute top-0 inset-x-0 h-10 z-50 flex justify-center pt-2">
            <motion.div 
              layout
              onClick={() => setIsIslandExpanded(!isIslandExpanded)}
              className={cn(
                "bg-black rounded-full flex items-center justify-center cursor-pointer overflow-hidden border border-white/5",
                isIslandExpanded ? "w-[90%] h-32 mt-2" : "w-32 h-8"
              )}
            >
              <AnimatePresence mode="wait">
                {!isIslandExpanded ? (
                  <motion.div 
                    key="closed"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black text-white/40 tracking-widest">{t.island}</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="open"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 w-full flex items-center gap-4"
                  >
                    <div className="p-3 bg-white/5 rounded-2xl">
                      <ShieldCheck size={28} className={status.state === "EMERGENCY" ? "text-red-500" : "text-cyan-400"} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black tracking-widest text-white/30 uppercase">{t.safety}</h4>
                      <p className="text-sm font-bold text-white leading-tight">
                        {status.state === "EMERGENCY" ? "Emergency protocols active. Follow red routing." : "Stadium network health at 100% stable."}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col px-6 pt-16 pb-8 overflow-y-auto overflow-x-hidden custom-scrollbar">
          
          {/* Header Controls */}
          <div className="flex justify-between items-center mb-10">
             <div className="flex gap-2">
                {["EN", "ES", "JA"].map(l => (
                  <button 
                    key={l}
                    onClick={() => setLang(l)}
                    className={cn(
                      "w-8 h-8 rounded-full text-[10px] font-black border transition-all",
                      lang === l ? "bg-cyan-500 border-cyan-400 text-black scale-110" : "bg-white/5 border-white/10 text-white/40"
                    )}
                  >
                    {l}
                  </button>
                ))}
             </div>
             <button 
               onClick={() => setHighContrast(!highContrast)}
               className={cn(
                 "p-2 rounded-xl border transition-all",
                 highContrast ? "bg-white text-black" : "bg-white/5 text-white/40 border-white/10"
               )}
             >
               <Eye size={18} />
             </button>
          </div>

          <div className="mb-8 space-y-1">
            <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">November 12 • Sec 142</p>
            <h1 className="text-4xl font-black tracking-tighter flex items-center gap-2 italic">
              {t.welcome} <Sparkles size={24} className="text-cyan-400" />
            </h1>
          </div>

          {/* AI Concierge Box */}
          <div className={cn(
            "p-6 rounded-[2.5rem] border mb-8 transition-colors",
            highContrast ? "bg-black border-white" : "bg-white/5 border-white/10"
          )}>
             <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                  <Activity size={16} className="text-cyan-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500/60">Live Edge Assistant</span>
             </div>
             
             <div className="space-y-4 mb-6 max-h-[180px] overflow-y-auto custom-scrollbar pr-2">
                {messages.length === 0 ? (
                  <p className="text-white/40 italic font-medium leading-relaxed">
                    "Looking for the fastest route to Gate B? Or need a refreshment update? Ask me anything."
                  </p>
                ) : messages.map((m, i) => (
                  <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                    <p className={cn(
                      "max-w-[80%] px-4 py-2 rounded-2xl text-sm font-medium",
                      m.role === 'user' ? "bg-cyan-500 text-black font-bold" : "bg-white/10 text-white"
                    )}>
                      {m.text}
                    </p>
                  </div>
                ))}
                <div ref={chatEndRef} />
             </div>

             <div className="relative">
                <input 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder={t.prompt}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-2 p-2 bg-cyan-500 text-black rounded-xl hover:scale-105 transition-transform"
                >
                  <Send size={18} />
                </button>
             </div>
          </div>

          {/* AR MiniMap / Wayfinding */}
          <div className={cn(
            "p-6 rounded-[2.5rem] border flex-grow flex flex-col",
            highContrast ? "bg-black border-white" : "bg-white/[0.03] border-white/5 shadow-inner"
          )}>
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xs font-black uppercase tracking-widest text-white/30">Live Wayfinding</h3>
               <div className="flex items-center gap-1 text-[10px] font-black text-cyan-400">
                  <Navigation size={12} fill="currentColor" /> ACTIVE
               </div>
            </div>

            <div className="relative flex-grow bg-black/40 rounded-3xl overflow-hidden border border-white/5">
               <svg viewBox="0 0 200 200" className="w-full h-full p-8 transition-transform group-hover:scale-105 duration-700">
                  <path d="M40,40 L160,40 L180,100 L160,160 L40,160 L20,100 Z" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  
                  {/* Current Position */}
                  <circle cx="100" cy="140" r="4" fill="#06b6d4" className="animate-pulse" />
                  <circle cx="100" cy="140" r="10" stroke="#06b6d4" strokeWidth="1" fill="none" className="animate-ping" />

                  {/* Dynamic Route Line */}
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    d={status.state === "EMERGENCY" ? "M100,140 L100,80 L40,40" : "M100,140 L140,100 L140,50"}
                    fill="none" 
                    stroke={status.state === "EMERGENCY" ? "#ef4444" : "#06b6d4"} 
                    strokeWidth="3" 
                    strokeDasharray="8 4"
                  />
               </svg>

               <div className="absolute bottom-4 inset-x-4 flex justify-between">
                  <div className="bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                     <Clock size={12} className="text-cyan-400" />
                     <span className="text-[10px] font-black">{status.state === "EMERGENCY" ? "2m to Exit" : "5m to Entry"}</span>
                  </div>
               </div>
            </div>
          </div>

        </div>

        {/* Global Nav Bar */}
        <div className={cn(
          "h-20 border-t flex justify-around items-center px-4",
          highContrast ? "bg-black border-white" : "bg-neutral-900 border-white/5"
        )}>
           <button className="text-cyan-500 flex flex-col items-center gap-1">
              <Sparkles size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">Guide</span>
           </button>
           <button className="text-white/20 hover:text-white transition-colors flex flex-col items-center gap-1">
              <Beer size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">Orders</span>
           </button>
           <button className="text-white/20 hover:text-white transition-colors flex flex-col items-center gap-1">
              <MapIcon size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">Map</span>
           </button>
           <button className="text-white/20 hover:text-white transition-colors flex flex-col items-center gap-1">
              <User size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">Pass</span>
           </button>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
}
