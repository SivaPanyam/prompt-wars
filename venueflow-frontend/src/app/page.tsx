"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Globe, 
  ChevronRight,
  Sparkles,
  Search,
  Users,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/5 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10">
        
        {/* Navigation / Header */}
        <nav className="flex justify-between items-center px-8 py-8 max-w-7xl mx-auto backdrop-blur-md sticky top-0 bg-black/10 rounded-b-3xl border-b border-white/5">
           <div className="flex items-center gap-2">
              <div className="p-2 bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20">
                 <ShieldCheck size={24} className="text-black" />
              </div>
              <span className="text-xl font-black tracking-tighter">VENUEFLOW <span className="font-extralight text-white/40 italic text-sm ml-1">v2.0</span></span>
           </div>
           <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              <a href="#" className="hover:text-cyan-400 transition-colors">Technology</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Fail-Safe Mesh</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Enterprise API</a>
           </div>
           <button className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              Live Network Status
           </button>
        </nav>

        {/* Hero Section */}
        <section className="px-8 pt-20 pb-40 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-10">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-full"
              >
                 <Sparkles size={14} className="text-cyan-400 animate-pulse" />
                 <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">GEMINI AI ACTIVATED</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] italic"
              >
                THE STADIUM <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">NERVOUS SYSTEM.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/60 text-lg md:text-xl font-medium leading-relaxed max-w-xl"
              >
                Zero latency. Zero congestion. Absolute safety. VenueFlow orchestrates millions of square feet using a 3.0 IoT multi-camera mesh—powering the most resilient live event infrastructure on Earth.
              </motion.p>

              <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.6 }}
                 className="flex flex-col sm:flex-row gap-6"
              >
                 <a 
                   href="/dashboard" 
                   className="group relative bg-cyan-500 text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:translate-y-[-4px] transition-all shadow-xl shadow-cyan-500/20"
                 >
                    Launch Ops Center
                    <Activity size={20} className="group-hover:rotate-12 transition-transform" />
                 </a>
                 <a 
                   href="/attendee" 
                   className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
                 >
                    Attendee Beta
                    <ChevronRight size={20} />
                 </a>
              </motion.div>
           </div>

           {/* Interactive Stadium Wireframe (SVG) */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: 1 }}
             className="relative aspect-square bg-[#0a0a0b] rounded-[4rem] border border-white/5 p-12 overflow-hidden shadow-2xl group"
           >
              {/* Animated Scan Lines */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent pointer-events-none group-hover:from-cyan-500/20 transition-all" />
              <div className="absolute top-0 inset-x-0 h-[1px] bg-cyan-500/50 animate-scan-line shadow-[0_0_20px_rgba(6,182,212,0.5)]" />

              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_40px_rgba(6,182,212,0.2)]">
                {/* 3D Polygon Stadium Simulator */}
                <motion.g 
                   animate={{ rotate: 360 }} 
                   transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                   className="origin-center"
                >
                   <path d="M50,50 L150,50 L180,100 L150,150 L50,150 L20,100 Z" fill="none" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="0.5" />
                   <path d="M70,70 L130,70 L145,100 L130,130 L70,130 L55,100 Z" fill="none" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="0.5" />
                   
                   {/* Grid Nodes */}
                   {[...Array(6)].map((_, i) => {
                     const angle = (i * 60) * (Math.PI / 180);
                     const x = 100 + 80 * Math.cos(angle);
                     const y = 100 + 80 * Math.sin(angle);
                     return (
                       <circle key={i} cx={x} cy={y} r="1.5" fill="#06b6d4" className="animate-pulse" />
                     );
                   })}
                   
                   {/* Connections */}
                   <path d="M100,20 L100,180 M20,100 L180,100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                </motion.g>

                {/* Tracking UI Overlays */}
                <rect x="10" y="10" width="30" height="2" fill="#06b6d4" />
                <rect x="10" y="10" width="2" height="30" fill="#06b6d4" />
                
                <text x="160" y="180" fill="white" className="text-[6px] font-mono opacity-20 uppercase tracking-widest">SEC: ACTIVE</text>
                <text x="160" y="190" fill="#06b6d4" className="text-[6px] font-mono opacity-40 uppercase tracking-widest animate-pulse">LOCK_ON</text>
              </svg>

              <div className="absolute bottom-12 inset-x-12 flex justify-between items-end border-t border-white/10 pt-6">
                 <div className="space-y-1">
                    <p className="text-[8px] font-black text-white/30 tracking-widest uppercase">System Load</p>
                    <p className="text-xl font-mono text-cyan-400 font-bold tracking-tighter">0.02ms</p>
                 </div>
                 <div className="text-right space-y-1">
                    <p className="text-[8px] font-black text-white/30 tracking-widest uppercase">Nodes Online</p>
                    <p className="text-xl font-mono text-white font-bold tracking-tighter">1,402</p>
                 </div>
              </div>
           </motion.div>
        </section>

        {/* Features Marquee */}
        <section className="bg-white/5 py-12 border-y border-white/10 relative overflow-hidden">
           <div className="flex gap-20 animate-marquee whitespace-nowrap">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-20 items-center">
                   <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-white/20">
                      <Cpu size={14} /> MULTI-CAM MESH ARRAY
                   </div>
                   <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-cyan-500">
                      <Zap size={14} /> GEMINI AI SYNCED
                   </div>
                   <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-white/20">
                      <Globe size={14} /> GLOBAL FALLBACK SYSTEM
                   </div>
                   <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-purple-500">
                      <Lock size={14} /> FAIL-SAFE PROTOCOLS
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Stats Section */}
        <section className="px-8 py-32 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { label: "Public Safety", value: "100%", sub: "Zero-Evacuation Latency", icon: <ShieldCheck className="text-cyan-400" /> },
              { label: "Crowd Smoothing", value: "3.4X", sub: "Faster Throughput Rate", icon: <Users className="text-blue-400" /> },
              { label: "Staff Dispatch", value: "Instant", sub: "Autonomous AI Rerouting", icon: <Zap className="text-purple-400" /> }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-4 hover:border-white/20 transition-all"
              >
                 <div className="p-3 bg-white/5 w-fit rounded-2xl">{stat.icon}</div>
                 <h3 className="text-4xl font-black italic tracking-tighter">{stat.value}</h3>
                 <div className="space-y-1">
                    <p className="text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                    <p className="text-xs text-white/40">{stat.sub}</p>
                 </div>
              </motion.div>
            ))}
        </section>

      </main>

      <style jsx global>{`
        @keyframes scan-line {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan-line {
          animation: scan-line 4s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>

    </div>
  );
}
