import React from 'react';

export function Header() {
  return (
    <nav className="border-b border-pink-500/30 px-6 sm:px-8 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-cyan-500 flex items-center justify-center text-white font-black tracking-tighter shadow-[0_0_15px_rgba(232,121,249,0.5)] rotate-3 hover:-rotate-6 transition-transform">
          M
        </div>
        <span className="font-black text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">MeetSync<span className="text-muted ml-2 font-medium text-sm">✨ fr fr</span></span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-xs font-bold text-white hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-ping"></div>
          v3.0 Brainrot Core 🧠
        </div>
      </div>
    </nav>
  );
}
