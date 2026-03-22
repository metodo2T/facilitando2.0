import React from 'react';
import { Challenge } from '../../types';

interface ChallengeCardProps {
  challenge: Challenge;
  weeklyProgress: number; // 0-100
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, weeklyProgress }) => {
  return (
    <div className="bg-gradient-to-br from-brand-dark to-brand-dark/90 p-6 rounded-[32px] border border-white/5 shadow-2xl overflow-hidden relative group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl group-hover:bg-brand-gold/20 transition-all duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] mb-2 block">Desafio da Semana</span>
            <h3 className="text-2xl font-black text-white leading-tight">{challenge.name}</h3>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 animate-bounce">
            <span className="text-xl">🔥</span>
          </div>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed mb-6 font-medium">
          {challenge.description}
        </p>

        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Progresso Semanal</span>
            <span className="text-xl font-black text-brand-gold">{weeklyProgress}%</span>
          </div>
          <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-brand-gold to-brand-gold-light transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(234,179,8,0.3)]"
              style={{ width: `${weeklyProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 text-[10px] font-black uppercase tracking-tighter text-gray-400">
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <svg className="w-3 h-3 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span>7 Dias</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            <svg className="w-3 h-3 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Meta: {challenge.goal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
