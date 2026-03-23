import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-auto px-6 sm:px-8 bg-surface/30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-medium text-muted">
        <p className="flex items-center gap-2 text-fuchsia-300">
          <span className="w-5 h-5 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 flex items-center justify-center text-[10px] text-white font-black shadow-[0_0_10px_rgba(217,70,239,0.5)]">🔥</span>
          © {new Date().getFullYear()} Puneet Divedi 🐐. No cap. All rights reserved.
        </p>
        <div className="flex items-center gap-6 mt-6 sm:mt-0">
          <a href="#" className="hover:text-primary transition-colors">Documentation</a>
          <a href="#" className="hover:text-primary transition-colors">API Reference</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
