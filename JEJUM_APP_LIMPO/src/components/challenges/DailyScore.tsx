import React from 'react';

interface DailyScoreProps {
  currentScore: number;
  onScoreSelect: (score: number) => void;
  isCompletedToday: boolean;
}

const DailyScore: React.FC<DailyScoreProps> = ({ currentScore, onScoreSelect, isCompletedToday }) => {
  const scores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-lg font-black text-brand-text">Avaliação de Hoje</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">O quanto você se dedicou?</p>
        </div>
        {isCompletedToday && (
          <span className="bg-green-100 text-green-600 text-[10px] font-black uppercase px-3 py-1 rounded-full animate-pulse">Salvo!</span>
        )}
      </div>

      <div className="flex justify-between gap-1.5">
        {scores.map((s) => (
          <button
            key={s}
            onClick={() => onScoreSelect(s)}
            className={`flex-1 aspect-square rounded-2xl flex items-center justify-center text-xs font-black transition-all transform active:scale-95 ${
              currentScore === s
                ? 'bg-brand-gold text-white shadow-lg shadow-brand-gold/30 scale-110 z-10 border-2 border-white'
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100 border border-transparent'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-between px-2 text-[9px] font-black text-gray-300 uppercase tracking-tighter">
        <span>Não fiz</span>
        <span>Parcial</span>
        <span>Completo</span>
      </div>
      
      {currentScore === 10 && (
        <div className="mt-4 p-3 bg-brand-gold/5 border border-brand-gold/10 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <span className="text-xl">⭐</span>
          <p className="text-xs font-bold text-brand-gold leading-tight">Incrível! Você atingiu o nível máximo hoje! 🔥</p>
        </div>
      )}
    </div>
  );
};

export default DailyScore;
