import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { RankingEntry, AppUser } from '../types';
import Top3Leaderboard from '../components/challenges/Top3Leaderboard';
import CommunityRanking from '../components/challenges/CommunityRanking';
import { useAuth } from '../contexts/AuthContext';

const Ranking: React.FC = () => {
  const { user } = useAuth();
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    setLoading(true);
    try {
      // Fallback: Busca nomes e fotos em community_posts, já que a tabela public.users não existe
      const { data: postsData } = await supabase.from('community_posts').select('author_id, author_name');
      const userMap: Record<string, string> = {};
      if (postsData) {
        postsData.forEach(p => {
          if (p.author_id && p.author_name) userMap[p.author_id] = p.author_name;
        });
      }

      const { data: logsData } = await supabase
        .from('challenge_logs')
        .select('user_id, score');

      if (logsData) {
        // Obter IDs únicos que receberam pontuação
        const uniqueUserIds = Array.from(new Set(logsData.map(l => l.user_id)));

        const calculatedRanking: RankingEntry[] = uniqueUserIds.map(uid => {
          const userScore = logsData
            .filter(l => l.user_id === uid)
            .reduce((sum, current) => sum + current.score, 0) || 0;
            
          let name = userMap[uid] || 'Criatura Focada';
          let photoURL = undefined;

          // Se for o próprio usuário logado, pega direto do AuthContext
          if (user && uid === user.id) {
             name = user.name || 'Você';
             photoURL = user.photoURL;
          }

          return {
            user_id: uid,
            name: name,
            photo_url: photoURL,
            category: 'Iniciante no Jejum',
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
        <h2 className="text-2xl font-black text-brand-gold-light">Ranking da Mentoria</h2>
        <p className="text-xs text-brand-text/60 font-bold uppercase tracking-widest mt-1">Desafio Mensal com Juliana</p>
      </header>

      {/* BANNER PRINCIPAL */}
      <div className="bg-gradient-to-r from-brand-gold to-brand-gold-light p-1 rounded-[32px] shadow-2xl shadow-brand-gold/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="bg-brand-dark/95 backdrop-blur-sm m-[2px] rounded-[30px] p-6 text-center relative z-10">
          <span className="text-4xl mb-3 block animate-bounce">🏆</span>
          <h3 className="text-[14px] font-black text-brand-gold uppercase tracking-widest mb-2 leading-tight">
            O 1º colocado deste mês ganha uma <br/><span className="text-brand-gold-light text-lg">Mentoria Particular</span><br/> com a Juliana!
          </h3>
          <p className="text-[10px] font-medium text-brand-text/50 uppercase tracking-wider mt-3 bg-brand-dark border border-white/5 py-2 px-3 rounded-xl">
            Ações repetitivas ou spam para ganhar pontos resultarão em desclassificação imediata.
          </p>
        </div>
      </div>

      {user && (
        <div className="bg-brand-card p-5 border border-brand-gold/20 rounded-[24px] shadow-lg flex items-center justify-between animate-in slide-in-from-bottom-4">
          <div className="flex items-center gap-4">
            <div className="bg-brand-dark w-12 h-12 rounded-2xl flex items-center justify-center font-black text-brand-text shadow-inner">
              {ranking.find(r => r.user_id === user.id)?.position || '-'}º
            </div>
            <div>
              <p className="text-[10px] font-black text-brand-text/50 uppercase tracking-widest">Sua Posição</p>
              <h4 className="font-bold text-brand-gold-light text-sm">{user.name || 'Você'}</h4>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-brand-text/50 uppercase tracking-widest">Pontuação</p>
            <span className="font-black text-xl text-brand-gold tracking-tighter">
              {ranking.find(r => r.user_id === user.id)?.total_score || 0} <span className="text-xs">pts</span>
            </span>
          </div>
        </div>
      )}

      {ranking.length > 0 ? (
        <>
          <Top3Leaderboard top3={top3} />
          <CommunityRanking ranking={ranking.slice(0, 10)} />
        </>
      ) : (
        <div className="p-20 text-center opacity-50">
          <div className="text-6xl mb-4">🏆</div>
          <p className="font-bold text-gray-400">O ranking ainda está sendo calculado...</p>
        </div>
      )}

      {/* REGRAS DO DESAFIO */}
      <div className="bg-brand-card p-6 rounded-[32px] border border-white/5 shadow-lg mt-8">
        <h4 className="text-[11px] font-black text-brand-text/60 uppercase tracking-[0.2em] mb-5 text-center flex items-center justify-center gap-2">
          <span>📋</span> Regras de Pontuação
        </h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-2">Comunidade & Engajamento</h5>
            <ul className="space-y-2">
              <li className="flex justify-between items-center text-xs text-brand-text/80 font-medium bg-brand-dark/50 p-2.5 rounded-xl border border-white/5"><span>Post na Comunidade</span> <strong className="text-brand-gold">+20 pts</strong></li>
              <li className="flex justify-between items-center text-xs text-brand-text/80 font-medium bg-brand-dark/50 p-2.5 rounded-xl border border-white/5"><span>Comentário em Post/Aula</span> <strong className="text-brand-gold">+10 pts</strong></li>
              <li className="flex justify-between items-center text-xs text-brand-text/80 font-medium bg-brand-dark/50 p-2.5 rounded-xl border border-white/5"><span>Acesso ao App (a cada 2h)</span> <strong className="text-brand-gold">+10 pts</strong></li>
              <li className="flex justify-between items-center text-xs text-brand-text/80 font-medium bg-brand-dark/50 p-2.5 rounded-xl border border-white/5"><span>Curtir Post de Colega</span> <strong className="text-brand-gold">+7 pts</strong></li>
            </ul>
          </div>

          <div className="pt-2">
            <h5 className="text-[10px] font-black text-brand-gold uppercase tracking-widest mb-2">Disciplina & Saúde</h5>
            <ul className="space-y-2">
              <li className="flex justify-between items-center text-xs text-brand-text/80 font-medium bg-brand-dark/50 p-2.5 rounded-xl border border-white/5"><span>Conclusão de Jejum</span> <strong className="text-brand-gold">+25 pts</strong></li>
              <li className="flex justify-between items-center text-xs text-brand-text/80 font-medium bg-brand-dark/50 p-2.5 rounded-xl border border-white/5"><span>Check-in de Exercício</span> <strong className="text-brand-gold">+20 pts</strong></li>
              <li className="flex justify-between items-center text-xs text-brand-text/80 font-medium bg-brand-dark/50 p-2.5 rounded-xl border border-white/5"><span>Conclusão de Aula</span> <strong className="text-brand-gold">+20 pts</strong></li>
              <li className="flex justify-between items-center text-xs text-brand-text/80 font-medium bg-brand-dark/50 p-2.5 rounded-xl border border-white/5"><span>Marcação de Hidratação</span> <strong className="text-brand-gold">+10 pts</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
