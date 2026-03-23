/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, List, MessageSquare, FileText } from 'lucide-react';

export function ResultsDashboard({ results }) {
  if (!results) return null;

  return (
    <div className="space-y-6 w-full max-w-xl card border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 p-6 bg-surface/80 backdrop-blur-xl h-full flex flex-col">
      <div className="absolute top-0 right-0 p-32 bg-green-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="flex items-center gap-3 border-b border-fuchsia-500/30 pb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]">
          <FileText className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">The Tea 🍵</h2>
          <p className="text-xs text-rose-200 font-bold bg-rose-900/50 px-2 py-0.5 rounded mt-1 inline-block border border-rose-500/30">Brainrot Core v3.0 Processing Complete ✨</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar pt-2">
        
        {/* Summary */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, type: "spring" }}>
          <h3 className="text-lg font-black text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            <MessageSquare className="w-5 h-5" /> TL;DR Vibes ✨
          </h3>
          <p className="text-white font-medium leading-relaxed text-base bg-gradient-to-br from-cyan-900/40 to-blue-900/40 p-5 rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-900/20">
            {results.summary || "No summary available. Big L."}
          </p>
        </motion.div>

        {/* Action Items */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
          <h3 className="text-lg font-black text-green-400 uppercase tracking-widest mb-3 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
            <CheckSquare className="w-5 h-5 text-green-400" /> Main Character Quests ⚔️
          </h3>
          {results.action_items && results.action_items.length > 0 ? (
            <ul className="space-y-3">
              {results.action_items.map((item, i) => (
                <li key={i} className="flex gap-4 items-center text-sm bg-gradient-to-br from-green-900/40 to-emerald-900/40 p-4 rounded-2xl border border-green-500/30 hover:border-green-400 hover:scale-[1.02] transition-all shadow-lg shadow-green-900/20">
                  <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 font-black text-lg">W</div>
                  <div>
                    <span className="text-white font-bold text-base block">{item.task}</span>
                    <span className="text-xs text-green-300 font-medium block mt-1 bg-green-900/50 px-2 py-0.5 rounded inline-block">NPC: {item.assignee || 'Unassigned'} • Due: {item.due_date || 'N/A'}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-bold text-green-500/50">No quests detected. Touch grass.</p>
          )}
        </motion.div>

        {/* Decisions */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, type: "spring" }}>
          <h3 className="text-lg font-black text-yellow-400 uppercase tracking-widest mb-3 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">
            <List className="w-5 h-5 text-yellow-400" /> Heavy Ws & Ls ⚖️
          </h3>
          {results.decisions && results.decisions.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-base font-bold text-yellow-100 bg-gradient-to-br from-yellow-900/40 to-orange-900/40 p-5 rounded-2xl border border-yellow-500/30 shadow-lg shadow-yellow-900/20">
              {results.decisions.map((decision, i) => (
                <li key={i}>{decision}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-bold text-yellow-500/50">No key decisions detected. Mid.</p>
          )}
        </motion.div>

      </div>
    </div>
  );
}
