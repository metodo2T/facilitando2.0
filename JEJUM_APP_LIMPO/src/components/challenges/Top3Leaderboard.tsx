import React from 'react';
import { RankingEntry } from '../../types';

interface Top3LeaderboardProps {
  top3: RankingEntry[];
}

const Top3Leaderboard: React.FC<Top3LeaderboardProps> = ({ top3 }) => {
  const sortedTop3 = [...top3].sort((a, b) => (a.position || 0) - (b.position || 0));
  
  // Reorder for visual: 2nd, 1st, 3rd
  const displayOrder = [
    sortedTop3.find(u => u.position === 2),
    sortedTop3.find(u => u.position === 1),
    sortedTop3.find(u => u.position === 3)
  ].filter(Boolean) as RankingEntry[];

  return (
    <div className="flex items-end justify-center gap-2 mb-10 pt-10">
      {displayOrder.map((user) => {
        const isFirst = user.position === 1;
        const isSecond = user.position === 2;
        
        return (
          <div 
            key={user.user_id} 
            className={`flex flex-col items-center relative ${isFirst ? 'z-20 -mt-8' : 'z-10'}`}
          >
            {/* Medal/Crown */}
            <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-3xl animate-bounce duration-[2000ms]`}>
              {isFirst ? '👑' : isSecond ? '🥈' : '🥉'}
            </div>
            
            {/* Avatar Circle */}
            <div className={`
              relative rounded-full p-1 shadow-2xl
              ${isFirst ? 'w-24 h-24 bg-gradient-to-b from-brand-gold to-yellow-600' : 'w-20 h-20 bg-gray-200'}
            `}>
              <div className="w-full h-full rounded-full overflow-hidden bg-white border-4 border-white">
                <img 
                  src={user.photo_url || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Score Badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-brand-text text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                {user.total_score} pts
              </div>
            </div>

            {/* Name & Title */}
            <div className="mt-4 text-center">
              <h4 className={`font-black text-brand-text leading-tight ${isFirst ? 'text-sm' : 'text-[11px]'}`}>
                {user.name.split(' ')[0]}
              </h4>
              <p className="text-[8px] font-bold text-brand-gold uppercase tracking-widest mt-0.5">
                {user.category}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Top3Leaderboard;
