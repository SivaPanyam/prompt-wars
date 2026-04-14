export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-10 animate-fade-in">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent pb-2">
          Synchronize the Stadium Experience.
        </h1>
        <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed">
          VenueFlow uses real-time IoT parsing and AI to dynamically route crowds, estimate concession times, and coordinate stadium staff before bottlenecks form. Select a perspective below to see the future of live events.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 mt-8">
        <a 
          href="/dashboard"
          className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-blue-500 to-blue-900/10 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
        >
          <div className="h-full w-full glass-panel rounded-2xl px-8 py-6 flex flex-col items-center justify-center gap-3 group-hover:bg-blue-950/20 transition-colors">
            <svg className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h2 className="text-xl font-bold text-white">Operations Dashboard</h2>
            <p className="text-sm text-white/50">Real-time crowd metrics & dispatch</p>
          </div>
        </a>

        <a 
          href="/attendee"
          className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-cyan-400 to-cyan-900/10 hover:shadow-2xl hover:shadow-cyan-400/20 transition-all duration-300"
        >
          <div className="h-full w-full glass-panel rounded-2xl px-8 py-6 flex flex-col items-center justify-center gap-3 group-hover:bg-cyan-950/20 transition-colors">
            <svg className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h2 className="text-xl font-bold text-white">Attendee Mobile View</h2>
            <p className="text-sm text-white/50">Zero-wait ordering & AR wayfinding</p>
          </div>
        </a>
      </div>
    </div>
  );
}
