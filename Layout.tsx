import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user } = useAuth();
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
