import React, { useEffect, useState } from 'react';

const LegalVault = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await fetch('http://localhost:8000/legal-logs');
            if (response.ok) {
                const data = await response.json();
                // Sort by timestamp descending
                setLogs(data.reverse());
            }
        } catch (error) {
            console.error("Failed to fetch legal logs:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center p-10 text-slate-400 animate-pulse">Loading Immutable Ledger...</div>;

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-700/50">
            <table className="min-w-full bg-slate-800/20 backdrop-blur-sm text-slate-300">
                <thead className="bg-slate-900/50">
                    <tr>
                        <th className="py-4 px-6 text-left text-xs font-bold text-teal-500 uppercase tracking-wider">Timestamp (UTC)</th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-teal-500 uppercase tracking-wider">Event Type</th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-teal-500 uppercase tracking-wider">Cryptographic Hash (SHA-256)</th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-teal-500 uppercase tracking-wider">Verification</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                    {logs.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="py-8 px-6 text-center text-slate-500 italic">No events recorded yet.</td>
                        </tr>
                    ) : (
                        logs.map((log) => (
                            <tr key={log.hash} className="hover:bg-slate-700/30 transition-colors duration-150">
                                <td className="py-4 px-6 text-sm font-mono text-slate-300">
                                    {new Date(log.timestamp).toISOString()}
                                </td>
                                <td className="py-4 px-6 text-sm">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${log.event_type === 'CALIBRATION'
                                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                        {log.event_type}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-xs font-mono text-slate-500 truncate max-w-[150px] hover:text-slate-300 transition-colors cursor-help" title={log.hash}>
                                    {log.hash}
                                </td>
                                <td className="py-4 px-6 text-sm text-teal-500 font-semibold flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Verified
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LegalVault;
