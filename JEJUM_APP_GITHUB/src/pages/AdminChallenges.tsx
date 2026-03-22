import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Challenge, AppUser } from '../types';

const AdminChallenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Partial<Challenge> | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState(7);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setChallenges(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const payload = {
      name,
      description,
      goal,
      duration_days: duration,
    };

    if (editingChallenge?.id) {
      await supabase.from('challenges').update(payload).eq('id', editingChallenge.id);
    } else {
      await supabase.from('challenges').insert([payload]);
    }

    setShowModal(false);
    setEditingChallenge(null);
    setName('');
    setDescription('');
    setGoal('');
    fetchChallenges();
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    // If activating, deactivate others first (optional, but usually one weekly challenge)
    if (!currentStatus) {
      await supabase.from('challenges').update({ is_active: false }).neq('id', id);
    }
    
    await supabase.from('challenges').update({ is_active: !currentStatus }).eq('id', id);
    fetchChallenges();
  };

  const deleteChallenge = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este desafio?')) {
      await supabase.from('challenges').delete().eq('id', id);
      fetchChallenges();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-center bg-white/50 p-4 rounded-3xl border border-white/20 backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-black text-brand-gold uppercase tracking-tight">Painel Admin - Desafios</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Gerencie os desafios semanais</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-brand-gold text-white p-3 rounded-2xl shadow-lg shadow-brand-gold/20 hover:scale-105 active:scale-95 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {challenges.map(c => (
            <div key={c.id} className="bg-white p-5 rounded-[28px] border border-gray-100 shadow-sm flex items-center justify-between group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${c.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                  <h4 className="font-bold text-brand-text">{c.name}</h4>
                </div>
                <p className="text-[10px] text-gray-400 font-medium line-clamp-1">{c.description}</p>
                <div className="mt-2 flex gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{c.duration_days} dias</span>
                  <span className="text-[9px] font-black uppercase tracking-widest bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-full">{c.goal}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleActive(c.id, c.is_active)}
                  className={`p-2 rounded-xl border transition-all ${c.is_active ? 'bg-brand-gold text-white border-brand-gold' : 'bg-white text-gray-400 border-gray-100 hover:border-brand-gold/30'}`}
                >
                  {c.is_active ? 'Ativo' : 'Ativar'}
                </button>
                <button 
                  onClick={() => deleteChallenge(c.id)}
                  className="p-2 rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
            <h3 className="text-xl font-black text-brand-text mb-6">Novo Desafio</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nome do Desafio</label>
                <input 
                  value={name} onChange={(e) => setName(e.target.value)} 
                  placeholder="Ex: Beber 2L de Água"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Descrição</label>
                <textarea 
                  value={description} onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Explique como funciona..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 h-24"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Meta</label>
                  <input 
                    value={goal} onChange={(e) => setGoal(e.target.value)} 
                    placeholder="Ex: 70 Pontos"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Duração (Dias)</label>
                  <input 
                    type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 py-4 rounded-2xl font-black text-white bg-brand-gold shadow-lg shadow-brand-gold/20 hover:bg-brand-gold-light transition-all"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChallenges;
