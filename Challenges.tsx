import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Challenge, ChallengeLog, AppUser } from '../types';
import ChallengeCard from '../components/challenges/ChallengeCard';
import DailyScore from '../components/challenges/DailyScore';
import WeeklyProgress from '../components/challenges/WeeklyProgress';
import { useAuth } from '../contexts/AuthContext';

const Challenges: React.FC = () => {
  const { user } = useAuth();
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [logs, setLogs] = useState<ChallengeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyScore, setDailyScore] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      fetchChallengeAndLogs();
    }
  }, [user]);

  const fetchChallengeAndLogs = async () => {
    setLoading(true);
    // 1. Fetch active challenge
    const { data: challengeData } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (challengeData) {
      setActiveChallenge(challengeData);

      // 2. Fetch logs for this challenge and user in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: logData } = await supabase
        .from('challenge_logs')
        .select('*')
        .eq('challenge_id', challengeData.id)
        .eq('user_id', user?.id)
        .gte('log_date', sevenDaysAgo.toISOString().split('T')[0]);

      if (logData) {
        setLogs(logData);
        // Check if there's a score for today
        const today = new Date().toISOString().split('T')[0];
        const todayLog = logData.find(l => l.log_date === today);
        if (todayLog) setDailyScore(todayLog.score);
      }
    }
    setLoading(false);
  };

  const handleScoreSelect = async (score: number) => {
    if (!user || !activeChallenge) return;

    setDailyScore(score);
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('challenge_logs')
      .upsert({
        challenge_id: activeChallenge.id,
        user_id: user.id,
        log_date: today,
        score: score
      }, { onConflict: 'user_id, challenge_id, log_date' });

    if (!error) {
      fetchChallengeAndLogs();
      // Optionally update total points in user profile here or via trigger
    }
  };

  if (loading) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
    </div>
  );

  if (!activeChallenge) return (
    <div className="p-10 text-center space-y-4 bg-white rounded-[32px] border border-gray-100 shadow-sm">
      <div className="text-5xl">😴</div>
      <h3 className="text-xl font-black text-brand-text">Nenhum desafio ativo</h3>
      <p className="text-sm text-gray-400 font-medium">Fique de olho! O próximo desafio semanal começa em breve.</p>
    </div>
  );

  const totalScore = logs.reduce((sum, log) => sum + log.score, 0);
  const possibleScore = 70; // 7 days * 10 pts
  const weeklyProgress = Math.round((totalScore / possibleScore) * 100);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="px-1">
        <h2 className="text-2xl font-black text-brand-text">Desafio da Semana</h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Supere seus limites</p>
      </header>

      <ChallengeCard 
        challenge={activeChallenge} 
        weeklyProgress={weeklyProgress} 
      />

      <DailyScore 
        currentScore={dailyScore || 0} 
        onScoreSelect={handleScoreSelect}
        isCompletedToday={dailyScore !== null}
      />

      <WeeklyProgress 
        logs={logs.map(l => ({ date: l.log_date, score: l.score }))} 
        totalScore={totalScore}
      />

      <div className="bg-brand-gold/10 p-5 rounded-[32px] border border-brand-gold/20 flex items-center gap-4">
        <div className="w-12 h-12 bg-brand-gold rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-brand-gold/20">
          🏆
        </div>
        <div>
          <h4 className="font-black text-brand-gold text-sm">Rumo ao Ranking!</h4>
          <p className="text-[10px] text-brand-gold/70 font-bold uppercase tracking-tight">Quanto mais pontos, maior sua posição no ranking das criaturas.</p>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
