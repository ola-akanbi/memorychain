import React, { useState } from 'react';
import { createMemory } from '../lib/stacks';
import { uploadToIPFS, IPFSFile } from '../lib/ipfs';

interface MemoryUploadProps {
  userAddress: string | null;
}

export const MemoryUpload: React.FC<MemoryUploadProps> = ({ userAddress }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('photo');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<IPFSFile | null>(null);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setUploadProgress('Uploading to IPFS...');
    
    try {
      const ipfsFile = await uploadToIPFS(file);
      setUploadedFile(ipfsFile);
      setUploadProgress('');
    } catch (error) {
      console.error('IPFS upload error:', error);
      setUploadProgress('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAddress || !uploadedFile) return;

    setLoading(true);
    setUploadProgress('Creating memory on blockchain...');
    
    try {
      await createMemory(
        userAddress,
        title,
        description,
        uploadedFile.hash,
        category,
        undefined,
        isPrivate
      );

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('photo');
      setIsPrivate(false);
      setUploadedFile(null);
      setUploadProgress('Memory created successfully!');
    } catch (error) {
      console.error('Error creating memory:', error);
      setUploadProgress('Failed to create memory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Upload New Memory</h3>
      {!userAddress ? (
        <p style={{color: '#666'}}>Connect your wallet to upload memories</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>File Upload</label>
            <input
              type="file"
              onChange={handleFileUpload}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              disabled={loading}
            />
            {uploadedFile && (
              <div style={{marginTop: '8px', fontSize: '12px', color: '#28a745'}}>
                ✓ {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)}KB)
                <br />IPFS: {uploadedFile.hash}
                {uploadedFile.preview && (
                  <img 
                    src={uploadedFile.preview} 
                    alt="Preview" 
                    style={{maxWidth: '100px', maxHeight: '100px', marginTop: '8px'}}
                  />
                )}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Family Photo"
              disabled={!userAddress || loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A beautiful moment from our vacation..."
              disabled={!userAddress || loading}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              disabled={!userAddress || loading}
            >
              <option value="photo">Photo</option>
              <option value="document">Document</option>
              <option value="video">Video</option>
              <option value="letter">Letter</option>
              <option value="audio">Audio</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                disabled={!userAddress || loading}
              />
              Private Memory
            </label>
          </div>

          {uploadProgress && (
            <div style={{marginBottom: '16px', padding: '8px', background: '#f8f9fa', borderRadius: '4px'}}>
              {uploadProgress}
            </div>
          )}

          <button 
            type="submit" 
            className="btn" 
            disabled={!userAddress || loading || !uploadedFile}
          >
            {loading ? 'Processing...' : 'Create Memory'}
          </button>
        </form>
      )}
    </div>
  );
};