import React from 'react';
import { Bell, Search } from 'lucide-react';

const Header = ({ title }) => {
    return (
        <header className="fixed top-0 left-64 right-0 h-16 glass-panel border-b border-slate-700/50 flex items-center justify-between px-8 z-40 bg-opacity-80">
            <div>
                <h2 className="text-xl font-semibold text-slate-200">{title}</h2>
            </div>

            <div className="flex items-center space-x-4">
                <div className="relative hidden md:block group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search data..."
                        className="bg-slate-900/50 border border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 w-64 transition-all"
                    />
                </div>

                <button className="p-2 rounded-full text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
