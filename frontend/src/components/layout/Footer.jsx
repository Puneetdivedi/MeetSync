import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-border py-8 mt-auto px-6 sm:px-8 bg-surface/30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs font-medium text-muted">
        <p className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] text-primary">p</span>
          © {new Date().getFullYear()} Puneet Divedi. All rights reserved.
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
