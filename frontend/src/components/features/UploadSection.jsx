/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { UploadCloud, FileAudio, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

export function UploadSection({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setStatus('idle');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const handleExecute = async () => {
    if (!file) return;
    setStatus('processing');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('http://localhost:8000/api/process', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed.');
      }
      
      const data = await response.json();
      setStatus('done');
      if (onUploadSuccess) onUploadSuccess(data.results);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card p-6 sm:p-8 space-y-6 relative overflow-hidden ring-1 ring-white/5 bg-surface/50 backdrop-blur-xl"
    >
      <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

      <h3 className="font-bold text-2xl flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
        <Zap className="w-6 h-6 text-yellow-500 animate-bounce" />
        Feed the AI 🔥
      </h3>

      <div 
        {...getRootProps()} 
        className={`border-4 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer relative group flex flex-col items-center justify-center gap-4 hover:rotate-1 hover:scale-105
          ${isDragActive ? 'border-fuchsia-500 bg-fuchsia-500/10 scale-[1.05]' : 'border-pink-500/30 hover:border-fuchsia-400 hover:bg-white/5'}
          ${file ? 'border-green-500/50 bg-green-500/10' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {file ? (
          <motion.div initial={{ scale: 0.8, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white mb-2 shadow-[0_0_20px_rgba(52,211,153,0.5)]">
              <FileAudio className="w-10 h-10 animate-pulse" />
            </div>
            <p className="text-white font-black text-xl">{file.name}</p>
            <p className="text-emerald-400 text-sm font-bold">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to be cooked 🍳</p>
          </motion.div>
        ) : (
          <>
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all ${isDragActive ? 'bg-fuchsia-500 text-white scale-110 shadow-[0_0_20px_rgba(217,70,239,0.5)]' : 'bg-surface text-pink-500 group-hover:bg-fuchsia-500/20 group-hover:text-fuchsia-400'}`}>
              <UploadCloud className="w-10 h-10 group-hover:animate-bounce" />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 transition-colors">
                {isDragActive ? "Drop it like it's hot 🥵" : "Drop your files here to let him cook 🍳"}
              </p>
              <p className="text-fuchsia-300/70 text-sm font-medium">or click to browse local files (no cap)</p>
            </div>
          </>
        )}
      </div>

      <Button 
        className="w-full text-lg py-8 font-black tracking-widest uppercase bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 border-none shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:scale-[1.02] transition-transform" 
        onClick={handleExecute} 
        disabled={!file || status === 'processing'}
        isLoading={status === 'processing'}
      >
        {status === 'done' ? (
          <span className="flex items-center gap-2 text-white">
            <CheckCircle2 className="w-6 h-6" /> Slayed. It's giving insights 💅
          </span>
        ) : status === 'error' ? (
          <span className="flex items-center gap-2 text-red-200">
            Major L. Try again 💀
          </span>
        ) : status === 'processing' ? (
          'Cooking rn... 👨‍🍳🔥'
        ) : (
          'Cook This 🧑‍🍳'
        )}
      </Button>

      {status === 'done' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pt-4 border-t border-border mt-4"
        >
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400 font-mono text-center">
            Synthesis matched 42 data points. Insights extracted to dashboard.
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
