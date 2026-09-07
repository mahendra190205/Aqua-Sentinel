import React from 'react';
import { Map, Anchor, ShieldCheck } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'map', label: 'Ganges Map', icon: Map },
        { id: 'sandbox', label: 'Training Sandbox', icon: Anchor },
        { id: 'vault', label: 'Legal Vault', icon: ShieldCheck },
    ];

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 glass-panel border-r border-slate-700/50 flex flex-col z-50">
            <div className="p-6 border-b border-slate-700/50">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                    Aqua-Sentinel
                </h1>
                <p className="text-xs text-slate-400 mt-1">Water Quality Monitoring</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? 'bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-500/10 border border-blue-500/20'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                }`}
                        >
                            <Icon
                                size={20}
                                className={`transition-colors duration-300 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-200'
                                    }`}
                            />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-700/50">
                <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-slate-900 font-bold text-xs">
                        AS
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-200">Agency Admin</p>
                        <p className="text-xs text-slate-500">Online</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
