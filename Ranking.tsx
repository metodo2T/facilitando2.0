import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RankingEntry, AppUser } from '../types';
import Top3Leaderboard from '../components/challenges/Top3Leaderboard';
import CommunityRanking from '../components/challenges/CommunityRanking';

const Ranking: React.FC = () => {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    setLoading(true);
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users') 
        .select('id, nome, photoURL, category');
        
      const { data: logsData } = await supabase
        .from('challenge_logs')
        .select('user_id, score');

      if (usersData) {
        const calculatedRanking: RankingEntry[] = usersData.map(u => {
          const userScore = logsData
            ?.filter(l => l.user_id === u.id)
            .reduce((sum, current) => sum + current.score, 0) || 0;
            
          return {
            user_id: u.id,
            name: u.nome || 'Usuário Sem Nome',
            photo_url: u.photoURL,
            category: u.category || 'Iniciante no Jejum',
            total_score: userScore
          };
        });

        const sortedRanking = calculatedRanking
          .sort((a, b) => b.total_score - a.total_score)
          .map((item, index) => ({ ...item, position: index + 1 }));

        setRanking(sortedRanking);
      }
    } catch (err) {
      console.error("Erro ao carregar ranking:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
    </div>
  );

  const top3 = ranking.slice(0, 3);
  const others = ranking.slice(3);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-1000">
      <header className="px-1 text-center">
        <h2 className="text-2xl font-black text-brand-text">Ranking do Jejum</h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Maiores queimas de gordura da semana</p>
      </header>

      {ranking.length > 0 ? (
        <>
          <Top3Leaderboard top3={top3} />
          <CommunityRanking ranking={ranking} />
        </>
      ) : (
        <div className="p-20 text-center opacity-50">
          <div className="text-6xl mb-4">🏆</div>
          <p className="font-bold text-gray-400">O ranking ainda está sendo calculado...</p>
        </div>
      )}

      {/* Categories Legend */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm mt-8">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 text-center">Categorias de Evolução</h4>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Iniciante no Jejum', color: 'bg-gray-100 text-gray-500' },
            { name: 'Focada no Resultado', color: 'bg-blue-50 text-blue-500' },
            { name: 'Queimando Gordura', color: 'bg-pink-50 text-pink-500' },
            { name: 'Mestra do Emagrecimento', color: 'bg-brand-gold/10 text-brand-gold' },
          ].map(cat => (
            <div key={cat.name} className={`${cat.color} p-2 rounded-xl text-[9px] font-black text-center uppercase tracking-tighter`}>
              {cat.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ranking;
