import React from 'react';

interface WeeklyProgressProps {
  logs: { date: string; score: number }[];
  totalScore: number;
}

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ logs, totalScore }) => {
  // Get last 7 days including today
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const getScoreForDate = (date: string) => {
    return logs.find(l => l.date === date)?.score || 0;
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-black text-brand-text uppercase tracking-tight">Linha do Tempo</h4>
        <div className="text-right">
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Acumulado</span>
          <span className="text-2xl font-black text-brand-gold">{totalScore} <small className="text-xs text-gray-300">pts</small></span>
        </div>
      </div>

      <div className="flex justify-between items-end h-24 gap-3 bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
        {days.map((date, idx) => {
          const score = getScoreForDate(date);
          const height = (score / 10) * 100;
          const isToday = date === new Date().toISOString().split('T')[0];
          
          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-help">
              <div className="w-full relative flex flex-col justify-end h-full">
                {/* Score tooltip on hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-brand-text text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap z-20">
                  {score} pts
                </div>
                
                {/* The Bar */}
                <div 
                  style={{ height: `${height}%` }}
                  className={`w-full rounded-full transition-all duration-700 ease-out border-b-2 border-white/20 ${
                    score >= 10 ? 'bg-brand-gold' : 
                    score >= 5 ? 'bg-brand-gold/60' : 
                    score > 0 ? 'bg-brand-gold/30' : 'bg-gray-200'
                  }`}
                />
              </div>
              <span className={`text-[8px] font-black uppercase tracking-tighter ${isToday ? 'text-brand-gold' : 'text-gray-300'}`}>
                {isToday ? 'Hoje' : new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }).split('.')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyProgress;
