/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <div className="space-y-8 relative z-10 pt-16 lg:pt-24 pb-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 backdrop-blur-md text-sm font-bold text-fuchsia-300 hover:bg-fuchsia-500/20 hover:scale-105 transition-all cursor-pointer shadow-[0_0_20px_rgba(217,70,239,0.2)]"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 animate-pulse shadow-[0_0_8px_rgba(217,70,239,0.8)]"></span>
        Absolute Cinema — 12ms latency 🍿
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
        className="text-6xl lg:text-8xl font-black tracking-tighter leading-[1.05]"
      >
        Spill the tea on meetings,<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400 animate-pulse">
          no cap. 💅
        </span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg sm:text-2xl text-zinc-400 max-w-xl leading-relaxed font-semibold"
      >
        Drop your files down below and let Groq's Llama-3 70B absolutely cook. Extract W action items, dodge the Ls, and get that deterministic Pydantic logic rizz. ✨
      </motion.p>
    </div>
  );
}
