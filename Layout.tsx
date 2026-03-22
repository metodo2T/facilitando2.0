import React, { useEffect } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user } = useAuth();
    
    useEffect(() => {
        if (!user || (!user.id)) return;
        const lastAccess = localStorage.getItem('lastAppAccessPoints');
        const now = Date.now();
        if (!lastAccess || now - parseInt(lastAccess) > 2 * 60 * 60 * 1000) {
            localStorage.setItem('lastAppAccessPoints', now.toString());
            const isoDate = new Date().toISOString().split('T')[0];
            supabase.from('challenge_logs').insert([{
                user_id: user.id,
                log_date: isoDate,
                score: 10
            }]).then();
        }
    }, [user]);

    return (
        <div className="flex flex-col min-h-screen pb-24 max-w-md mx-auto bg-brand-dark shadow-2xl relative border-x border-white/5">
            <Header user={user} />

            <main className="flex-1 px-6 py-6 overflow-x-hidden">
                {children}
            </main>

            <BottomNav />
        </div>
    );
};
