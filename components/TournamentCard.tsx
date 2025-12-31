
import React from 'react';
import { Tournament } from '../types';
import { Calendar, Clock, Users, Trophy } from 'lucide-react';

interface Props {
  tournament: Tournament;
  onJoin: (t: Tournament) => void;
}

export const TournamentCard: React.FC<Props> = ({ tournament, onJoin }) => {
  const progress = (tournament.joinedSlots / tournament.totalSlots) * 100;
  const isFull = tournament.joinedSlots >= tournament.totalSlots;

  return (
    <div className="glass rounded-2xl overflow-hidden mb-5 border border-white/5">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold bg-[#ff4d00]/10 text-[#ff4d00] px-2 py-1 rounded-md mb-2 inline-block">
              {tournament.type} • {tournament.map}
            </span>
            <h3 className="text-lg font-russo text-white leading-tight">{tournament.title}</h3>
          </div>
          <div className="text-right">
            <p className="text-[#ff4d00] font-russo text-xl">₹{tournament.entryFee}</p>
            <p className="text-[10px] text-gray-400 uppercase">Entry Fee</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Calendar className="w-4 h-4 text-[#ff4d00]" />
            <span>{tournament.date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Clock className="w-4 h-4 text-[#ff4d00]" />
            <span>{tournament.time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Trophy className="w-4 h-4 text-[#ff4d00]" />
            <span>Pool: ₹{tournament.prizePool}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Users className="w-4 h-4 text-[#ff4d00]" />
            <span>{tournament.joinedSlots}/{tournament.totalSlots} Slots</span>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex justify-between text-[10px] uppercase font-bold mb-1">
            <span className="text-gray-400">Filling Fast</span>
            <span className={isFull ? 'text-red-500' : 'text-[#ff4d00]'}>{Math.round(progress)}% Full</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-[#ff4d00]'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => onJoin(tournament)}
          disabled={isFull}
          className={`w-full py-3 rounded-xl font-russo transition-all text-sm ${
            isFull 
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
            : 'bg-white/10 text-white hover:bg-[#ff4d00] hover:text-white border border-white/10'
          }`}
        >
          {isFull ? 'MATCH FULL' : 'JOIN NOW'}
        </button>
      </div>
    </div>
  );
};
