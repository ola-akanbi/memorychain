import React from 'react';

interface StatisticsProps {
  userAddress: string | null;
}

export const Statistics: React.FC<StatisticsProps> = ({ userAddress }) => {
  const platformStats = {
    totalMemories: 847,
    totalFamilies: 156,
    totalUsers: 743,
    totalStorage: 2.4 // GB
  };

  const userStats = userAddress ? {
    myMemories: 12,
    myFamilies: 3,
    sharedMemories: 28,
    storageUsed: 0.15 // GB
  } : null;

  const formatStorage = (gb: number) => {
    if (gb < 1) return `${(gb * 1024).toFixed(0)} MB`;
    return `${gb.toFixed(1)} GB`;
  };

  return (
    <div className="card">
      <h3>Platform Statistics</h3>
      
      {/* Platform Stats */}
      <div style={{marginBottom: '20px'}}>
        <h4>Network Overview</h4>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
          <div>
            <strong>Total Memories</strong>
            <div style={{fontSize: '24px', color: '#007bff'}}>{platformStats.totalMemories}</div>
          </div>
          <div>
            <strong>Active Families</strong>
            <div style={{fontSize: '24px', color: '#007bff'}}>{platformStats.totalFamilies}</div>
          </div>
          <div>
            <strong>Total Users</strong>
            <div style={{fontSize: '24px', color: '#007bff'}}>{platformStats.totalUsers}</div>
          </div>
          <div>
            <strong>Storage Used</strong>
            <div style={{fontSize: '24px', color: '#007bff'}}>{formatStorage(platformStats.totalStorage)}</div>
          </div>
        </div>
      </div>

      {/* User Stats */}
      {userStats && (
        <div style={{marginBottom: '20px'}}>
          <h4>Your Activity</h4>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            <div>
              <strong>My Memories</strong>
              <div style={{fontSize: '18px', color: '#28a745'}}>{userStats.myMemories}</div>
            </div>
            <div>
              <strong>My Families</strong>
              <div style={{fontSize: '18px', color: '#28a745'}}>{userStats.myFamilies}</div>
            </div>
            <div>
              <strong>Shared Access</strong>
              <div style={{fontSize: '18px', color: '#28a745'}}>{userStats.sharedMemories}</div>
            </div>
            <div>
              <strong>My Storage</strong>
              <div style={{fontSize: '18px', color: '#28a745'}}>{formatStorage(userStats.storageUsed)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Network Info */}
      <div>
        <h4>Network Status</h4>
        <div style={{fontSize: '14px', color: '#666', lineHeight: '1.6'}}>
          <div>Network: <span style={{color: '#007bff'}}>Stacks Testnet</span></div>
          <div>Contracts: <span style={{color: '#28a745'}}>3 Deployed</span></div>
          <div>Status: <span style={{color: '#28a745'}}>Operational</span></div>
          <div>Last Block: <span style={{color: '#666'}}>#{Math.floor(Math.random() * 100000) + 50000}</span></div>
        </div>
      </div>
    </div>
  );
};