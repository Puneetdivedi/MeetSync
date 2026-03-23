/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <div className="space-y-8 relative z-10 pt-16 lg:pt-24 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/80 backdrop-blur-sm text-xs font-medium text-muted hover:text-primary transition-colors cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
        FastAPI Neural Engine Online — 12ms latency
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.05]"
      >
        Meeting Intelligence,<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-600">
          without the noise.
        </span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg sm:text-xl text-muted max-w-xl leading-relaxed font-medium"
      >
        Upload your raw audio or transcripts and let Groq's Llama-3 70B instantly 
        extract structural action items, decisions, and context using deterministic 
        Pydantic logic.
      </motion.p>
    </div>
  );
}
