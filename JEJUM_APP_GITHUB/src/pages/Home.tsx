import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HomeCard from '../components/ui/HomeCard';
import FastingTimer from '../components/Home/FastingTimer';
import WaterTracker from '../components/Home/WaterTracker';
import FastingHistory from '../components/Home/FastingHistory';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const streakDays = user?.memberSince
    ? Math.max(1, Math.ceil((Date.now() - new Date(user.memberSince).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;
  const formattedStreak = streakDays.toString().padStart(2, '0');

  useEffect(() => {
    if ("Notification" in window && Notification.permission === 'default') {
      const timer = setTimeout(() => setShowNotificationPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const requestPermission = async () => {
    if ("Notification" in window) {
      await Notification.requestPermission();
      setShowNotificationPrompt(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-brand-gold/10 text-brand-gold text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md flex items-center gap-1 border border-brand-gold/20">
              🔥 {formattedStreak} Dias Seguidos
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-brand-text tracking-tight">Olá, {user?.name?.split(' ')[0]}</h2>
        </div>
        <Link to="/lives" className="relative h-10 w-10 bg-white rounded-2xl border border-gray-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-brand-red w-2.5 h-2.5 rounded-full absolute -top-0.5 -right-0.5 border-2 border-white live-dot"></div>
          <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </Link>
      </section>

      {showNotificationPrompt && (
        <div className="bg-white p-4 rounded-3xl text-brand-text flex items-center justify-between animate-in slide-in-from-top-4 duration-500 shadow-xl border border-brand-gold/20">
          <div className="flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold">Notificações</h4>
            <p className="text-[11px] opacity-90">Receba lembretes para beber água e quebrar o jejum!</p>
          </div>
          <button
            onClick={requestPermission}
            className="bg-brand-gold text-brand-dark px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight shadow-md hover:bg-brand-gold-light transition-all"
          >
            Ativar
          </button>
          <button
            onClick={() => setShowNotificationPrompt(false)}
            className="ml-3 text-gray-400 hover:text-gray-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* Timer Circular Estilizado */}
      <FastingTimer />

      {/* Water Tracker */}
      <WaterTracker />

      {/* Acesso Rápido */}
      <section>
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Acesso Rápido</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <HomeCard to="/kit" title="Kit Salva-vidas" subtitle="Ferramentas" color="bg-white" icon="🧰" />
          <HomeCard to="/mindset" title="Mentalidade" subtitle="Planos" color="bg-white" icon="🧠" />
          <HomeCard to="/progress" title="Meu Progresso" subtitle="Evolução" color="bg-white" icon="📈" />
          <HomeCard to="/community" title="Comunidade" subtitle="Comunidade" color="bg-white" icon="🔥" />
        </div>
      </section>

      {/* Histórico de Jejuns */}
      <FastingHistory />

      {/* SOS Fome Button */}
      <Link to="/mindset" className="block bg-brand-red/5 rounded-[24px] p-5 border border-brand-red/20 flex items-center justify-between group shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform border border-brand-red/20 shadow-sm">
            🚨
          </div>
          <div>
            <h4 className="font-bold text-brand-red">SOS Fome Emocional</h4>
            <p className="text-xs text-brand-red/70 mt-0.5">Quase quebrando o jejum? Clique aqui.</p>
          </div>
        </div>
        <svg className="w-5 h-5 text-brand-red/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
      </Link>
    </div>
  );
};

export default Home;