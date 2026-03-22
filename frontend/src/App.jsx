import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');

  const handleUpload = () => {
    setStatus('processing');
    setTimeout(() => setStatus('done'), 2000); // placeholder until backend connected
  };

  return (
    <div className="min-h-screen bg-background text-primary selection:bg-white/10">
      <nav className="border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-background font-bold tracking-tighter">M</div>
          <span className="font-semibold text-lg tracking-tight">MeetSync Enterprise</span>
        </div>
        <div className="text-sm font-medium text-muted">v3.0 Neural Core</div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-20">
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

            <div className="card p-6 space-y-4">
              <h3 className="font-semibold text-lg">Initialize Pipeline</h3>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer relative group">
                <input type="file" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="file" />
                <label className="text-muted group-hover:text-primary transition-colors cursor-pointer">
                  {file ? <span className="text-primary font-medium">{file.name}</span> : "Drop recording here or click to browse (MP3, WAV)"}
                </label>
              </div>
              <button onClick={handleUpload} disabled={!file || status === 'processing'} className="btn-primary w-full flex justify-center py-3 text-base">
                {status === 'processing' ? 'Executing Neural Extraction...' : 'Execute Analysis'}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent blur-3xl rounded-full"></div>
            <div className="card border-white/10 overflow-hidden relative shadow-2xl">
              <div className="bg-surface border-b border-border px-4 py-3 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
              <img src="/hero-mockup.png" alt="SaaS Dashboard Demo" className="w-full h-auto opacity-90 mix-blend-screen" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
