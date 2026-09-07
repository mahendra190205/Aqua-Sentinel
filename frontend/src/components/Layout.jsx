import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, activeTab, setActiveTab }) => {
    const getTitle = () => {
        switch (activeTab) {
            case 'map': return 'Ganges Basin Monitoring';
            case 'sandbox': return 'Training Sandbox';
            case 'vault': return 'Legal Vault & Chain-of-Custody';
            default: return 'Dashboard';
        }
    };

    return (
        <div className="min-h-screen bg-ocean-gradient text-slate-200 font-sans selection:bg-teal-500/30">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="ml-64 flex flex-col min-h-screen">
                <Header title={getTitle()} />

                <main className="flex-1 pt-24 px-8 pb-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
