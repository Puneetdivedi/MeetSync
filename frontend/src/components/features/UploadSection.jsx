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

      <h3 className="font-semibold text-xl flex items-center gap-2">
        <Zap className="w-5 h-5 text-yellow-500" />
        Initialize Pipeline
      </h3>

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer relative group flex flex-col items-center justify-center gap-4
          ${isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-muted hover:bg-white/5'}
          ${file ? 'border-green-500/30 bg-green-500/5' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {file ? (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-2">
              <FileAudio className="w-8 h-8" />
            </div>
            <p className="text-primary font-medium text-lg">{file.name}</p>
            <p className="text-muted text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for synthesis</p>
          </motion.div>
        ) : (
          <>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isDragActive ? 'bg-primary/20 text-primary' : 'bg-surface text-muted group-hover:bg-surface group-hover:text-primary'}`}>
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-medium text-primary transition-colors">
                {isDragActive ? "Drop to engage neural link..." : "Drag & drop recording or document here"}
              </p>
              <p className="text-muted text-sm">or click to browse local files (Audio, PDF, DOCX, XLSX, TXT)</p>
            </div>
          </>
        )}
      </div>

      <Button 
        className="w-full text-base py-6 font-semibold tracking-wide" 
        onClick={handleExecute} 
        disabled={!file || status === 'processing'}
        isLoading={status === 'processing'}
      >
        {status === 'done' ? (
          <span className="flex items-center gap-2 text-green-400">
            <CheckCircle2 className="w-5 h-5" /> Pipeline Complete
          </span>
        ) : status === 'processing' ? (
          'Executing Neural Extraction...'
        ) : (
          'Execute Analysis'
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
