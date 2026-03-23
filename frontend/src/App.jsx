import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/features/Hero';
import { UploadSection } from './components/features/UploadSection';
import { ResultsDashboard } from './components/features/ResultsDashboard';

function App() {
  const [results, setResults] = useState(null);
  return (
    <div className="min-h-screen bg-background text-primary selection:bg-white/10 flex flex-col font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-6 sm:px-8 flex-1 w-full relative">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -pl-12"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-12 lg:py-0 min-h-[calc(100vh-140px)]">
          
          <div className="flex flex-col justify-center h-full">
            <Hero />
            <div className="mt-8 lg:mt-12 w-full max-w-md">
              <UploadSection onUploadSuccess={setResults} />
            </div>
          </div>

          <div className="relative mt-12 lg:mt-0 flex items-center justify-center lg:justify-end h-full w-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-transparent blur-3xl rounded-full translate-x-12 translate-y-12"></div>
            
            {results ? (
              <ResultsDashboard results={results} />
            ) : (
              <div className="w-full max-w-xl card border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="bg-zinc-900 border-b border-border px-4 py-3 flex gap-2 items-center">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  </div>
                  <div className="ml-4 px-3 py-1.5 rounded-md bg-black/60 text-[10px] text-zinc-400 font-mono flex-1 text-center shadow-inner border border-white/5">
                    app.meetsync.io/dashboard
                  </div>
                </div>
                <img 
                  src="/hero-mockup.png" 
                  alt="MeetSync Enterprise Dashboard Demo" 
                  className="w-full h-auto opacity-95 mix-blend-screen scale-[1.01] transform"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop";
                  }}
                />
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
