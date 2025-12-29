import React, { useState } from 'react';

interface Memory {
  id: number;
  title: string;
  description: string;
  category: string;
  ipfsHash: string;
  isPrivate: boolean;
  createdAt: string;
}

interface MemoryGalleryProps {
  userAddress: string | null;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({ userAddress }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock memory data - in production this would come from contract queries
  const mockMemories: Memory[] = [
    {
      id: 1,
      title: "Family Vacation 2024",
      description: "Our amazing trip to the mountains",
      category: "photo",
      ipfsHash: "QmExampleHash123",
      isPrivate: false,
      createdAt: "2024-08-20"
    },
    {
      id: 2,
      title: "Grandma's Recipe",
      description: "Her famous chocolate chip cookie recipe",
      category: "document",
      ipfsHash: "QmExampleHash456",
      isPrivate: true,
      createdAt: "2024-08-19"
    },
    {
      id: 3,
      title: "Birthday Celebration",
      description: "Mom's 60th birthday party",
      category: "video",
      ipfsHash: "QmExampleHash789",
      isPrivate: false,
      createdAt: "2024-08-18"
    }
  ];

  const filteredMemories = mockMemories
    .filter(memory => 
      memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(memory => filterCategory === 'all' || memory.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return a.title.localeCompare(b.title);
    });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'photo': return '📸';
      case 'video': return '🎥';
      case 'document': return '📄';
      case 'letter': return '✉️';
      case 'audio': return '🎵';
      default: return '📁';
    }
  };

  return (
    <div className="card">
      <h3>Memory Gallery</h3>
      
      {!userAddress ? (
        <p style={{color: '#666'}}>Connect your wallet to view memories</p>
      ) : (
        <>
          {/* Search and Filter Controls */}
          <div style={{marginBottom: '16px'}}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Search memories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{marginBottom: '8px'}}
              />
            </div>
            
            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{flex: '1', minWidth: '120px'}}
              >
                <option value="all">All Categories</option>
                <option value="photo">Photos</option>
                <option value="video">Videos</option>
                <option value="document">Documents</option>
                <option value="letter">Letters</option>
                <option value="audio">Audio</option>
                <option value="other">Other</option>
              </select>
              
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{flex: '1', minWidth: '120px'}}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Memory Grid */}
          <div style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '16px'
          }}>
            {filteredMemories.map(memory => (
              <div key={memory.id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                background: '#fafafa'
              }}>
                <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                  <span style={{fontSize: '20px', marginRight: '8px'}}>
                    {getCategoryIcon(memory.category)}
                  </span>
                  <h4 style={{margin: 0, flex: 1}}>{memory.title}</h4>
                  {memory.isPrivate && (
                    <span style={{fontSize: '12px', color: '#ff6b6b'}}>🔒 Private</span>
                  )}
                </div>
                
                <p style={{
                  fontSize: '14px', 
                  color: '#666', 
                  margin: '8px 0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {memory.description}
                </p>
                
                <div style={{fontSize: '12px', color: '#999', marginBottom: '8px'}}>
                  IPFS: {memory.ipfsHash.substring(0, 12)}...
                </div>
                
                <div style={{fontSize: '12px', color: '#999'}}>
                  {new Date(memory.createdAt).toLocaleDateString()}
                </div>
                
                <div style={{marginTop: '12px'}}>
                  <button 
                    className="btn" 
                    style={{fontSize: '12px', padding: '4px 8px'}}
                    onClick={() => console.log('View memory:', memory.id)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredMemories.length === 0 && (
            <div style={{textAlign: 'center', color: '#666', marginTop: '32px'}}>
              {searchTerm || filterCategory !== 'all' 
                ? 'No memories found matching your criteria'
                : 'No memories yet. Upload your first memory above!'
              }
            </div>
          )}
        </>
      )}
    </div>
  );
};