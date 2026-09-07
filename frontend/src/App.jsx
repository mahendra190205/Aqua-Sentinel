import { useState } from 'react';
import Sandbox from './components/Sandbox';
import MapView from './components/MapView'; // Ensure this file exists
import LegalVault from './components/LegalVault'; // Ensure this file exists
import Layout from './components/Layout';

function App() {
  const [activeTab, setActiveTab] = useState('map');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'map' && (
        <div className="glass-panel p-6 animate-fade-in">
          <MapView />
        </div>
      )}

      {activeTab === 'sandbox' && (
        <div className="glass-panel p-6 animate-fade-in">
          <Sandbox />
        </div>
      )}

      {activeTab === 'vault' && (
        <div className="glass-panel p-6 animate-fade-in">
          <LegalVault />
        </div>
      )}
    </Layout>
  );
}

export default App;