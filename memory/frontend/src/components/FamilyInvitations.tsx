import React, { useState } from 'react';

interface Invitation {
  id: number;
  familyId: number;
  familyName: string;
  inviterAddress: string;
  role: string;
  invitedAt: string;
  expiresAt: string;
}

interface FamilyInvitationsProps {
  userAddress: string | null;
}

export const FamilyInvitations: React.FC<FamilyInvitationsProps> = ({ userAddress }) => {
  const [inviteAddress, setInviteAddress] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [selectedFamily, setSelectedFamily] = useState(1);
  const [loading, setLoading] = useState(false);

  // Mock data - in production this would come from contract queries
  const mockInvitations: Invitation[] = [
    {
      id: 1,
      familyId: 2,
      familyName: "The Johnson Family",
      inviterAddress: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
      role: "member",
      invitedAt: "2024-08-20T10:00:00Z",
      expiresAt: "2024-08-27T10:00:00Z"
    }
  ];

  const mockFamilies = [
    { id: 1, name: "My Family", role: "owner" },
    { id: 2, name: "Extended Family", role: "admin" }
  ];

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAddress || !inviteAddress) return;

    setLoading(true);
    try {
      // Simulate invite process
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Invited:', inviteAddress, 'to family:', selectedFamily, 'as:', inviteRole);
      setInviteAddress('');
      alert('Invitation sent successfully!');
    } catch (error) {
      console.error('Error sending invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId: number) => {
    if (!userAddress) return;
    
    setLoading(true);
    try {
      // Simulate accepting invitation
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Accepted invitation:', invitationId);
      alert('Invitation accepted! Welcome to the family.');
    } catch (error) {
      console.error('Error accepting invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineInvitation = async (invitationId: number) => {
    if (!userAddress) return;
    
    try {
      console.log('Declined invitation:', invitationId);
      alert('Invitation declined.');
    } catch (error) {
      console.error('Error declining invitation:', error);
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return '#28a745';
      case 'admin': return '#007bff';
      case 'member': return '#6c757d';
      case 'viewer': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <div className="card">
      <h3>Family Invitations</h3>
      
      {!userAddress ? (
        <p style={{color: '#666'}}>Connect your wallet to manage family invitations</p>
      ) : (
        <>
          {/* Send Invitation Section */}
          <div style={{marginBottom: '24px'}}>
            <h4>Send Invitation</h4>
            <form onSubmit={handleInvite}>
              <div className="form-group">
                <label>Family</label>
                <select
                  value={selectedFamily}
                  onChange={(e) => setSelectedFamily(Number(e.target.value))}
                  disabled={loading}
                >
                  {mockFamilies
                    .filter(f => f.role === 'owner' || f.role === 'admin')
                    .map(family => (
                      <option key={family.id} value={family.id}>
                        {family.name} (You are {family.role})
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="form-group">
                <label>Member Address</label>
                <input
                  type="text"
                  value={inviteAddress}
                  onChange={(e) => setInviteAddress(e.target.value)}
                  placeholder="SP1ABC123..."
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  disabled={loading}
                >
                  <option value="viewer">Viewer (can only view memories)</option>
                  <option value="member">Member (can add memories)</option>
                  <option value="admin">Admin (can manage members)</option>
                </select>
              </div>

              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Invitation'}
              </button>
            </form>
          </div>

          {/* Pending Invitations Section */}
          <div>
            <h4>Pending Invitations ({mockInvitations.length})</h4>
            {mockInvitations.length === 0 ? (
              <p style={{color: '#666', fontSize: '14px'}}>No pending invitations</p>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {mockInvitations.map(invitation => (
                  <div key={invitation.id} style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '16px',
                    background: isExpired(invitation.expiresAt) ? '#f8f9fa' : '#fff'
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px'}}>
                      <div>
                        <h5 style={{margin: '0 0 4px 0'}}>{invitation.familyName}</h5>
                        <p style={{margin: '0', fontSize: '14px', color: '#666'}}>
                          Invited by: {invitation.inviterAddress.substring(0, 8)}...
                        </p>
                      </div>
                      <span style={{
                        color: getRoleColor(invitation.role),
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {invitation.role}
                      </span>
                    </div>

                    <div style={{fontSize: '12px', color: '#999', marginBottom: '12px'}}>
                      {isExpired(invitation.expiresAt) ? (
                        <span style={{color: '#dc3545'}}>Expired on {new Date(invitation.expiresAt).toLocaleDateString()}</span>
                      ) : (
                        <span>Expires on {new Date(invitation.expiresAt).toLocaleDateString()}</span>
                      )}
                    </div>

                    {!isExpired(invitation.expiresAt) && (
                      <div style={{display: 'flex', gap: '8px'}}>
                        <button
                          className="btn"
                          style={{fontSize: '12px', padding: '4px 12px', background: '#28a745'}}
                          onClick={() => handleAcceptInvitation(invitation.id)}
                          disabled={loading}
                        >
                          Accept
                        </button>
                        <button
                          className="btn"
                          style={{fontSize: '12px', padding: '4px 12px', background: '#dc3545'}}
                          onClick={() => handleDeclineInvitation(invitation.id)}
                          disabled={loading}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};