import React from 'react';

export function Header() {
  return (
    <nav className="border-b border-border px-6 sm:px-8 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-background font-bold tracking-tighter shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          M
        </div>
        <span className="font-semibold text-lg tracking-tight">MeetSync<span className="text-muted ml-1 font-normal">Enterprise</span></span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-xs font-medium text-muted hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          v3.0 Neural Core
        </div>
      </div>
    </nav>
  );
}
