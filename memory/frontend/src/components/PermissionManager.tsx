import React, { useState } from 'react';

interface Permission {
  memoryId: number;
  memoryTitle: string;
  grantedTo: string;
  canView: boolean;
  canEdit: boolean;
  grantedBy: string;
  grantedAt: string;
}

interface PermissionManagerProps {
  userAddress: string | null;
}

export const PermissionManager: React.FC<PermissionManagerProps> = ({ userAddress }) => {
  const [selectedMemory, setSelectedMemory] = useState(1);
  const [granteeAddress, setGranteeAddress] = useState('');
  const [canView, setCanView] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock data for permissions
  const mockPermissions: Permission[] = [
    {
      memoryId: 1,
      memoryTitle: "Family Vacation 2024",
      grantedTo: "SP2ABC123...DEF789",
      canView: true,
      canEdit: false,
      grantedBy: userAddress || "SP1OWNER...",
      grantedAt: "2024-08-20T10:00:00Z"
    },
    {
      memoryId: 2,
      memoryTitle: "Grandma's Recipe",
      grantedTo: "SP3XYZ456...GHI012",
      canView: true,
      canEdit: true,
      grantedBy: userAddress || "SP1OWNER...",
      grantedAt: "2024-08-19T15:30:00Z"
    }
  ];

  const mockMemories = [
    { id: 1, title: "Family Vacation 2024", isPrivate: false },
    { id: 2, title: "Grandma's Recipe", isPrivate: true },
    { id: 3, title: "Birthday Celebration", isPrivate: false }
  ];

  const handleGrantPermission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAddress || !granteeAddress) return;

    setLoading(true);
    try {
      // Simulate granting permission
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Granted permission:', {
        memoryId: selectedMemory,
        grantee: granteeAddress,
        canView,
        canEdit
      });
      
      setGranteeAddress('');
      setCanView(true);
      setCanEdit(false);
      alert('Permission granted successfully!');
    } catch (error) {
      console.error('Error granting permission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokePermission = async (memoryId: number, grantee: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Revoked permission for memory:', memoryId, 'from:', grantee);
      alert('Permission revoked successfully!');
    } catch (error) {
      console.error('Error revoking permission:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPermissionBadge = (canView: boolean, canEdit: boolean) => {
    if (canEdit) return { text: 'Full Access', color: '#28a745' };
    if (canView) return { text: 'View Only', color: '#17a2b8' };
    return { text: 'No Access', color: '#dc3545' };
  };

  return (
    <div className="card">
      <h3>Permission Management</h3>
      
      {!userAddress ? (
        <p style={{color: '#666'}}>Connect your wallet to manage memory permissions</p>
      ) : (
        <>
          {/* Grant Permission Section */}
          <div style={{marginBottom: '24px'}}>
            <h4>Grant Memory Access</h4>
            <form onSubmit={handleGrantPermission}>
              <div className="form-group">
                <label>Memory</label>
                <select
                  value={selectedMemory}
                  onChange={(e) => setSelectedMemory(Number(e.target.value))}
                  disabled={loading}
                >
                  {mockMemories.map(memory => (
                    <option key={memory.id} value={memory.id}>
                      {memory.title} {memory.isPrivate ? '(Private)' : '(Family)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Grant Access To</label>
                <input
                  type="text"
                  value={granteeAddress}
                  onChange={(e) => setGranteeAddress(e.target.value)}
                  placeholder="SP1ABC123..."
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label>Permissions</label>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  <label style={{display: 'flex', alignItems: 'center', fontSize: '14px'}}>
                    <input
                      type="checkbox"
                      checked={canView}
                      onChange={(e) => {
                        setCanView(e.target.checked);
                        if (!e.target.checked) setCanEdit(false);
                      }}
                      disabled={loading}
                      style={{marginRight: '8px'}}
                    />
                    Can view this memory
                  </label>
                  <label style={{display: 'flex', alignItems: 'center', fontSize: '14px'}}>
                    <input
                      type="checkbox"
                      checked={canEdit}
                      onChange={(e) => {
                        setCanEdit(e.target.checked);
                        if (e.target.checked) setCanView(true);
                      }}
                      disabled={loading || !canView}
                      style={{marginRight: '8px'}}
                    />
                    Can edit memory details
                  </label>
                </div>
              </div>

              <button type="submit" className="btn" disabled={loading || !canView}>
                {loading ? 'Granting...' : 'Grant Permission'}
              </button>
            </form>
          </div>

          {/* Current Permissions Section */}
          <div>
            <h4>Active Permissions ({mockPermissions.length})</h4>
            {mockPermissions.length === 0 ? (
              <p style={{color: '#666', fontSize: '14px'}}>No permissions granted yet</p>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {mockPermissions.map(permission => {
                  const badge = getPermissionBadge(permission.canView, permission.canEdit);
                  return (
                    <div key={`${permission.memoryId}-${permission.grantedTo}`} style={{
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '16px',
                      background: '#fff'
                    }}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px'}}>
                        <div style={{flex: 1}}>
                          <h5 style={{margin: '0 0 4px 0'}}>{permission.memoryTitle}</h5>
                          <p style={{margin: '0', fontSize: '14px', color: '#666'}}>
                            Granted to: {permission.grantedTo.substring(0, 12)}...
                          </p>
                        </div>
                        <span style={{
                          color: badge.color,
                          fontSize: '12px',
                          fontWeight: 'bold',
                          padding: '2px 8px',
                          border: `1px solid ${badge.color}`,
                          borderRadius: '12px'
                        }}>
                          {badge.text}
                        </span>
                      </div>

                      <div style={{fontSize: '12px', color: '#999', marginBottom: '12px'}}>
                        <div>View: {permission.canView ? 'Yes' : 'No'} | Edit: {permission.canEdit ? 'Yes' : 'No'}</div>
                        <div>Granted on {new Date(permission.grantedAt).toLocaleDateString()}</div>
                      </div>

                      <button
                        className="btn"
                        style={{
                          fontSize: '12px', 
                          padding: '4px 12px', 
                          background: '#dc3545',
                          marginTop: '8px'
                        }}
                        onClick={() => handleRevokePermission(permission.memoryId, permission.grantedTo)}
                        disabled={loading}
                      >
                        Revoke Access
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};