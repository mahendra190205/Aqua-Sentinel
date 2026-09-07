import React, { useState } from 'react';

const Sandbox = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
        setResult(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a CSV file first.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/sandbox/train', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto text-slate-200">
            <h1 className="text-3xl font-display font-bold mb-6 text-teal-400">Training Sandbox</h1>
            <p className="mb-6 text-slate-300">
                Upload ground-truth CSV data (must contain <code>latitude</code>, <code>longitude</code>, <code>observed_cyanobacteria_density</code>) to fine-tune the CyFi thresholds.
            </p>

            <div className="mb-8 p-8 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-slate-400 mb-2">Upload CSV File</label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-slate-400
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-600/20 file:text-blue-400
                  hover:file:bg-blue-600/30 file:cursor-pointer
                  cursor-pointer bg-slate-900/50 rounded-lg border border-slate-700 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                        />
                    </div>
                    <button
                        onClick={handleUpload}
                        disabled={loading || !file}
                        className={`mt-6 md:mt-0 w-full md:w-auto px-8 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-blue-500/20 ${loading || !file
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white transform hover:scale-105'
                            }`}
                    >
                        {loading ? 'Processing...' : 'Run Calibration'}
                    </button>
                </div>
                {error && <p className="mt-4 text-red-400 font-medium bg-red-900/20 p-3 rounded-lg border border-red-900/50">{error}</p>}
            </div>

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                    <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm border-l-4 border-l-teal-500">
                        <h2 className="text-xl font-bold mb-4 font-display text-slate-100">Results Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-slate-700/50 pb-2">
                                <span className="text-slate-400">Current F1 Score</span>
                                <span className="font-mono font-bold text-orange-400">{result.results.current_f1.toFixed(3)}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-700/50 pb-2">
                                <span className="text-slate-400">Improved F1 Score</span>
                                <span className="font-mono font-bold text-teal-400 text-lg">{result.results.new_f1.toFixed(3)}</span>
                            </div>
                            <div className="mt-4 bg-slate-900/30 p-4 rounded-xl">
                                <p className="text-sm font-semibold text-slate-300 mb-2">Recommended Thresholds</p>
                                <ul className="space-y-2 text-sm text-slate-400">
                                    <li className="flex justify-between">
                                        <span>Tier 1 (Probable):</span>
                                        <span className="font-mono text-blue-400">{result.results.recommended_tier1_threshold.toFixed(2)}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Tier 2 (Confirmed):</span>
                                        <span className="font-mono text-blue-400">{result.results.recommended_tier2_threshold.toFixed(2)}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm border-l-4 border-l-purple-500">
                        <h2 className="text-xl font-bold mb-4 font-display text-slate-100">Legal Chain-of-Custody</h2>
                        <div className="text-xs font-mono bg-slate-950/50 p-4 rounded-xl overflow-auto max-h-60 border border-slate-800">
                            <p className="mb-2"><span className="font-bold text-teal-500">Log Hash:</span> <span className="text-slate-400 break-all">{result.hash}</span></p>
                            <div className="my-2 border-t border-slate-800"></div>
                            <pre className="text-slate-300">{JSON.stringify(result.legal_log, null, 2)}</pre>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-purple-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Cryptographically signed & immutable</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sandbox;
