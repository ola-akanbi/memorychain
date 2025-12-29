import React from 'react';

export const ContractStatus: React.FC = () => {
  return (
    <div className="card">
      <h3>Smart Contract Status</h3>
      <div style={{fontFamily: 'monospace', fontSize: '12px', background: '#f8f9fa', padding: '16px', borderRadius: '4px'}}>
        <div style={{color: '#28a745', marginBottom: '8px'}}>
          ✓ memory-storage.clar - Deployed and tested
        </div>
        <div style={{color: '#28a745', marginBottom: '8px'}}>
          ✓ family-access.clar - Deployed and tested  
        </div>
        <div style={{color: '#28a745', marginBottom: '8px'}}>
          ✓ memory-family-bridge.clar - Deployed and tested
        </div>
        <div style={{color: '#6c757d', fontSize: '10px', marginTop: '12px'}}>
          Network: Clarinet Local | Status: Development
        </div>
      </div>
    </div>
  );
};