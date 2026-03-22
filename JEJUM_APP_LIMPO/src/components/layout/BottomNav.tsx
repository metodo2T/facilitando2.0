import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ICONS } from '../../constants';

export const BottomNav: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[420px] bg-white border border-gray-200 rounded-[32px] flex justify-around py-2.5 px-2 z-40 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <NavItem to="/" icon={<ICONS.Home />} active={isActive('/')} />
            <NavItem to="/protocols" icon={<ICONS.Timer />} active={location.pathname.startsWith('/protocol') || location.pathname === '/protocols'} />
            <NavItem to="/challenges" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} active={isActive('/challenges')} />
            <NavItem to="/ranking" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} active={isActive('/ranking')} />
            <NavItem to="/community" icon={<ICONS.Community />} active={isActive('/community')} />
            <NavItem to="/profile" icon={<ICONS.Profile />} active={isActive('/profile')} />
        </nav>
    );
};

interface NavItemProps {
    to: string;
    icon: React.ReactNode;
    active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, active }) => (
    <Link
        to={to}
        className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${active
            ? 'bg-brand-gold text-brand-yellow shadow-md shadow-brand-gold/20'
            : 'text-gray-400 hover:text-brand-gold hover:bg-brand-yellow/10'
            }`}
    >
        {icon}
    </Link>
);
