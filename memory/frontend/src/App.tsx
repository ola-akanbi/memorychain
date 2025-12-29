import React, { useState } from 'react';
import { WalletConnection } from './components/WalletConnection';
import { MemoryUpload } from './components/MemoryUpload';
import { FamilyManagement } from './components/FamilyManagement';
import { MemoryGallery } from './components/MemoryGallery';
import { FamilyInvitations } from './components/FamilyInvitations';
import { PermissionManager } from './components/PermissionManager';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { Statistics } from './components/Statistics';
import { ContractStatus } from './components/ContractStatus';

function App() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('memories');

  const handleWalletConnect = (address: string) => {
    setUserAddress(address);
  };

  const tabs = [
    { id: 'memories', label: 'Memories' },
    { id: 'families', label: 'Families' },
    { id: 'permissions', label: 'Permissions' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'status', label: 'Status' }
  ];

  return (
    <div>
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo">MemoryChain</div>
            <WalletConnection onConnect={handleWalletConnect} />
          </nav>
        </div>
      </header>

      <main className="container">
        <div className="card">
          <h1>Family Memory Preservation on Bitcoin</h1>
          <p>
            Store, encrypt, and inherit your most precious memories across generations,
            secured by Bitcoin's immutability through Stacks.
          </p>
          <div style={{marginTop: '16px', padding: '12px', background: '#e3f2fd', borderRadius: '4px'}}>
            <strong>Level 2 Complete MVP:</strong> Production-ready features with analytics and advanced permissions
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{marginBottom: '20px'}}>
          <div style={{
            display: 'flex',
            borderBottom: '2px solid #eee',
            gap: '0',
            overflowX: 'auto'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  background: activeTab === tab.id ? '#007bff' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#666',
                  cursor: 'pointer',
                  borderRadius: '0',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'memories' && (
          <div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
              <MemoryUpload userAddress={userAddress} />
              <FamilyManagement userAddress={userAddress} />
            </div>
            <MemoryGallery userAddress={userAddress} />
          </div>
        )}

        {activeTab === 'families' && (
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            <FamilyManagement userAddress={userAddress} />
            <FamilyInvitations userAddress={userAddress} />
          </div>
        )}

        {activeTab === 'permissions' && (
          <PermissionManager userAddress={userAddress} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {activeTab === 'status' && (
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            <Statistics userAddress={userAddress} />
            <ContractStatus />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;