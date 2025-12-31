
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Map as MapIcon, Zap } from 'lucide-react';
import { getMatchStrategy } from '../services/geminiService.ts';

interface Props {
  map: string;
  mode: string;
}

export const AIScout: React.FC<Props> = ({ map, mode }) => {
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);

  const loadStrategy = async () => {
    setLoading(true);
    const tips = await getMatchStrategy(map, mode);
    setStrategy(tips);
    setLoading(false);
  };

  useEffect(() => {
    loadStrategy();
  }, [map, mode]);

  return (
    <div className="glass rounded-2xl border border-[#ff4d00]/20 overflow-hidden mb-6">
      <div className="bg-[#ff4d00]/10 px-4 py-3 border-b border-[#ff4d00]/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ff4d00]" />
          <h4 className="font-russo text-xs text-[#ff4d00] tracking-wider uppercase">AI Scout Report</h4>
        </div>
        <div className="text-[10px] font-bold text-gray-500 flex items-center gap-3">
           <span className="flex items-center gap-1"><MapIcon className="w-3 h-3" /> {map}</span>
           <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {mode}</span>
        </div>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-6 gap-3">
            <Loader2 className="w-5 h-5 text-[#ff4d00] animate-spin" />
            <span className="text-xs font-bold text-gray-500 uppercase animate-pulse">Analyzing Map Data...</span>
          </div>
        ) : (
          <div className="space-y-3">
             <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
               {strategy}
             </div>
             <button 
              onClick={loadStrategy}
              className="text-[10px] font-bold text-[#ff4d00] uppercase hover:underline flex items-center gap-1"
             >
               Regenerate Tactics
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
