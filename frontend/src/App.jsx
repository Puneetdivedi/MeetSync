import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');

  const handleUpload = () => {
    setStatus('processing');
    setTimeout(() => setStatus('done'), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-primary selection:bg-white/10 flex flex-col">
      <nav className="border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-background font-bold tracking-tighter">M</div>
          <span className="font-semibold text-lg tracking-tight">MeetSync Enterprise</span>
        </div>
        <div className="text-sm font-medium text-muted hidden sm:block">v3.0 Neural Core</div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-xs font-medium text-muted">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              FastAPI Core Online
            </div>

            <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1]">
              Meeting Intelligence, <br />
              <span className="text-muted">without the noise.</span>
            </h1>

            <p className="text-lg text-muted max-w-lg leading-relaxed">
              Upload your raw audio or transcripts and let Groq's Llama-3 70B instantly extract structural action items, decisions, and chat interfaces using deterministic Pydantic logic.
            </p>

            <div className="card p-6 space-y-4 shadow-2xl shadow-black/50">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                Initialize Pipeline
              </h3>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer relative group flex flex-col items-center justify-center gap-3">
                <input type="file" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="file" />
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-primary transition-colors"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                <label className="text-muted group-hover:text-primary transition-colors cursor-pointer text-sm font-medium">
                  {file ? <span className="text-primary">{file.name}</span> : "Drop recording here or click to browse (MP3, WAV)"}
                </label>
              </div>
              <button onClick={handleUpload} disabled={!file || status === 'processing'} className="btn-primary w-full flex justify-center items-center gap-2 py-3 text-base duration-200">
                {status === 'processing' ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Executing Neural Extraction...
                  </>
                ) : 'Execute Analysis'}
              </button>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent blur-3xl rounded-full"></div>
            <div className="card border-white/10 overflow-hidden relative shadow-2xl ring-1 ring-white/5">
              <div className="bg-zinc-900 border-b border-border px-4 py-3 flex gap-2 items-center">
                <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-500"></div>
                <div className="ml-4 px-2 py-1 rounded bg-black/50 text-[10px] text-zinc-500 font-mono flex-1 text-center">localhost:5173</div>
              </div>
              <img src="/hero-mockup.png" alt="SaaS Dashboard Demo" className="w-full h-auto opacity-90 mix-blend-screen scale-[1.02] transform" />
            </div>
          </div>

        </div>
      </main>

      <footer className="border-t border-border py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs font-medium text-muted">
          <p>© 2026 MeetSync Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <span className="hover:text-primary cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-primary cursor-pointer transition-colors">API Reference</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
