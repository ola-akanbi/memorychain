import React, { useState } from 'react';

interface AnalyticsData {
  totalMemories: number;
  memoriesByCategory: Record<string, number>;
  memoriesOverTime: Array<{month: string, count: number}>;
  familyStats: {
    totalFamilies: number;
    totalMembers: number;
    avgMembersPerFamily: number;
  };
  storageStats: {
    totalStorageUsed: number;
    avgFileSize: number;
    largestFile: number;
  };
  activityStats: {
    memoriesThisMonth: number;
    invitationsThisMonth: number;
    activeUsers: number;
  };
}

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    totalMemories: 847,
    memoriesByCategory: {
      photo: 456,
      video: 123,
      document: 98,
      letter: 87,
      audio: 45,
      other: 38
    },
    memoriesOverTime: [
      { month: 'Jan 24', count: 23 },
      { month: 'Feb 24', count: 45 },
      { month: 'Mar 24', count: 67 },
      { month: 'Apr 24', count: 89 },
      { month: 'May 24', count: 112 },
      { month: 'Jun 24', count: 134 },
      { month: 'Jul 24', count: 178 },
      { month: 'Aug 24', count: 199 }
    ],
    familyStats: {
      totalFamilies: 156,
      totalMembers: 743,
      avgMembersPerFamily: 4.8
    },
    storageStats: {
      totalStorageUsed: 2.4, // GB
      avgFileSize: 3.2, // MB
      largestFile: 45.6 // MB
    },
    activityStats: {
      memoriesThisMonth: 89,
      invitationsThisMonth: 34,
      activeUsers: 234
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} GB`;
    return `${bytes.toFixed(1)} MB`;
  };

  const getMaxCount = () => Math.max(...Object.values(analyticsData.memoriesByCategory));

  return (
    <div className="card">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h3>Analytics Dashboard</h3>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          style={{padding: '4px 8px', fontSize: '12px'}}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px'}}>
          <div style={{fontSize: '24px', fontWeight: 'bold', color: '#007bff'}}>
            {analyticsData.totalMemories}
          </div>
          <div style={{fontSize: '12px', color: '#666'}}>Total Memories</div>
        </div>

        <div style={{textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px'}}>
          <div style={{fontSize: '24px', fontWeight: 'bold', color: '#28a745'}}>
            {analyticsData.familyStats.totalFamilies}
          </div>
          <div style={{fontSize: '12px', color: '#666'}}>Active Families</div>
        </div>

        <div style={{textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px'}}>
          <div style={{fontSize: '24px', fontWeight: 'bold', color: '#17a2b8'}}>
            {formatBytes(analyticsData.storageStats.totalStorageUsed * 1024)}
          </div>
          <div style={{fontSize: '12px', color: '#666'}}>Storage Used</div>
        </div>

        <div style={{textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '8px'}}>
          <div style={{fontSize: '24px', fontWeight: 'bold', color: '#ffc107'}}>
            {analyticsData.activityStats.activeUsers}
          </div>
          <div style={{fontSize: '12px', color: '#666'}}>Active Users</div>
        </div>
      </div>

      {/* Category Distribution */}
      <div style={{marginBottom: '24px'}}>
        <h4>Memory Categories</h4>
        <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          {Object.entries(analyticsData.memoriesByCategory)
            .sort(([,a], [,b]) => b - a)
            .map(([category, count]) => {
              const percentage = (count / analyticsData.totalMemories) * 100;
              const barWidth = (count / getMaxCount()) * 100;
              
              return (
                <div key={category} style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{minWidth: '80px', fontSize: '14px', textTransform: 'capitalize'}}>
                    {category}
                  </div>
                  <div style={{flex: 1, background: '#eee', borderRadius: '4px', height: '20px', position: 'relative'}}>
                    <div style={{
                      width: `${barWidth}%`,
                      height: '100%',
                      background: '#007bff',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <div style={{minWidth: '60px', fontSize: '14px', textAlign: 'right'}}>
                    {count} ({percentage.toFixed(1)}%)
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Growth Chart */}
      <div style={{marginBottom: '24px'}}>
        <h4>Memory Growth Over Time</h4>
        <div style={{
          display: 'flex', 
          alignItems: 'end', 
          gap: '8px', 
          height: '120px',
          padding: '8px',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          {analyticsData.memoriesOverTime.map((data, index) => {
            const maxCount = Math.max(...analyticsData.memoriesOverTime.map(d => d.count));
            const height = (data.count / maxCount) * 100;
            
            return (
              <div key={index} style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '100%',
                  height: `${height}%`,
                  background: '#007bff',
                  borderRadius: '2px 2px 0 0',
                  minHeight: '4px'
                }} />
                <div style={{fontSize: '10px', color: '#666', textAlign: 'center'}}>
                  {data.month}
                </div>
                <div style={{fontSize: '10px', fontWeight: 'bold'}}>
                  {data.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Stats */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
        <div>
          <h4>Family Statistics</h4>
          <div style={{fontSize: '14px', color: '#666', lineHeight: '1.8'}}>
            <div>Total Members: {analyticsData.familyStats.totalMembers}</div>
            <div>Avg Members/Family: {analyticsData.familyStats.avgMembersPerFamily}</div>
            <div>New Invitations: {analyticsData.activityStats.invitationsThisMonth}/month</div>
          </div>
        </div>

        <div>
          <h4>Storage Statistics</h4>
          <div style={{fontSize: '14px', color: '#666', lineHeight: '1.8'}}>
            <div>Average File Size: {formatBytes(analyticsData.storageStats.avgFileSize)}</div>
            <div>Largest File: {formatBytes(analyticsData.storageStats.largestFile)}</div>
            <div>New Memories: {analyticsData.activityStats.memoriesThisMonth}/month</div>
          </div>
        </div>
      </div>
    </div>
  );
};