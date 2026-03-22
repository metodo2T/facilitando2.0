import React from 'react';
import { RankingEntry } from '../../types';

interface CommunityRankingProps {
  ranking: RankingEntry[];
}

const CommunityRanking: React.FC<CommunityRankingProps> = ({ ranking }) => {
  return (
    <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/20">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <h4 className="font-black text-brand-text uppercase tracking-tight text-sm">Ranking do Jejum</h4>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PONTOS SEMANAIS</span>
      </div>

      <div className="divide-y divide-gray-50">
        {ranking.map((user, idx) => (
          <div key={user.user_id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
            {/* Position */}
            <div className="w-8 text-center">
              <span className={`text-sm font-black ${idx < 3 ? 'text-brand-gold' : 'text-gray-300'}`}>
                {idx + 1}º
              </span>
            </div>

            {/* User Photo */}
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm transition-transform group-hover:scale-105">
              <img 
                src={user.photo_url || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-brand-text truncate text-sm">{user.name}</h5>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-brand-gold">
                  {user.category}
                </span>
                {idx === 0 && <span className="text-[10px] animate-pulse">🔥</span>}
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <span className="text-sm font-black text-brand-text">{user.total_score}</span>
              <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-tighter">pontos</span>
            </div>
          </div>
        ))}

        {ranking.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            <p className="text-sm font-medium">Ninguém pontuou ainda esta semana. Seja a primeira!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityRanking;
