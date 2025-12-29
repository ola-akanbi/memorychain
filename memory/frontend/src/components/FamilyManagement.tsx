import React, { useState } from 'react';
import { createFamily } from '../lib/stacks';

interface FamilyManagementProps {
  userAddress: string | null;
}

export const FamilyManagement: React.FC<FamilyManagementProps> = ({ userAddress }) => {
  const [familyName, setFamilyName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAddress) return;

    setLoading(true);
    try {
      await createFamily(userAddress, familyName);
      setFamilyName('');
    } catch (error) {
      console.error('Error creating family:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Family Management</h3>
      {!userAddress ? (
        <p style={{color: '#666'}}>Connect your wallet to manage families</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Family Name</label>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="The Smith Family"
              disabled={!userAddress}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn" 
            disabled={!userAddress || loading}
          >
            {loading ? 'Creating...' : 'Create Family'}
          </button>
        </form>
      )}
    </div>
  );
};