import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, List, MessageSquare, FileText } from 'lucide-react';

export function ResultsDashboard({ results }) {
  if (!results) return null;

  return (
    <div className="space-y-6 w-full max-w-xl card border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 p-6 bg-surface/80 backdrop-blur-xl h-full flex flex-col">
      <div className="absolute top-0 right-0 p-32 bg-green-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Analysis Results</h2>
          <p className="text-xs text-muted font-mono bg-black/50 px-2 py-0.5 rounded mt-1 inline-block">Neural Core v3.0 Processing Complete</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
        
        {/* Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> Summary
          </h3>
          <p className="text-primary/90 leading-relaxed text-sm bg-black/20 p-4 rounded-xl border border-white/5">
            {results.summary || "No summary available."}
          </p>
        </motion.div>

        {/* Action Items */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-green-400" /> Action Items
          </h3>
          {results.action_items && results.action_items.length > 0 ? (
            <ul className="space-y-2">
              {results.action_items.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm bg-black/20 p-3 rounded-xl border border-green-500/10 hover:border-green-500/30 transition-colors">
                  <div className="min-w-4 mt-0.5"><div className="w-4 h-4 rounded border border-green-500/50 flex items-center justify-center text-[10px] text-green-400 font-bold">✓</div></div>
                  <div>
                    <span className="text-primary block">{item.task}</span>
                    <span className="text-xs text-muted block mt-1">Assignee: {item.assignee || 'Unassigned'} • Due: {item.due_date || 'N/A'}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No action items detected.</p>
          )}
        </motion.div>

        {/* Decisions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
            <List className="w-4 h-4 text-yellow-400" /> Key Decisions
          </h3>
          {results.decisions && results.decisions.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 text-sm text-primary/80 bg-black/20 p-4 rounded-xl border border-yellow-500/10">
              {results.decisions.map((decision, i) => (
                <li key={i}>{decision}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No key decisions detected.</p>
          )}
        </motion.div>

      </div>
    </div>
  );
}
