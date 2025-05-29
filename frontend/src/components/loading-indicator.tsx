export function LoadingIndicator() {
  return (
    <div className="relative w-20 h-20">
      {/* Orbital rings */}
      <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-spin-slow"></div>
      <div className="absolute inset-2 rounded-full border border-fuchsia-500/40 animate-spin-reverse"></div>
      <div className="absolute inset-4 rounded-full border border-cyan-400/50 animate-spin-slow-reverse"></div>
      
      {/* Core */}
      <div className="absolute inset-7 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 animate-pulse shadow-lg shadow-cyan-500/50"></div>
      
      {/* Particles */}
      <div className="absolute top-8 left-1 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping-slow"></div>
      <div className="absolute top-6 right-2 w-1 h-1 rounded-full bg-fuchsia-400 animate-ping-slow delay-150"></div>
      <div className="absolute bottom-3 left-6 w-1 h-1 rounded-full bg-cyan-300 animate-ping-slow delay-300"></div>
      <div className="absolute bottom-5 right-4 w-1.5 h-1.5 rounded-full bg-fuchsia-300 animate-ping-slow delay-500"></div>
    </div>
  );
}