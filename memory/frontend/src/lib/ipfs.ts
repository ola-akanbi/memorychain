// IPFS simulation
// In production, this would connect to actual IPFS nodes

export interface IPFSFile {
  hash: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

export const uploadToIPFS = async (file: File): Promise<IPFSFile> => {
  // Simulate IPFS upload with delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const hash = `Qm${Math.random().toString(36).substring(2, 15)}`;
  
  return {
    hash,
    name: file.name,
    size: file.size,
    type: file.type,
    preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
  };
};

export const retrieveFromIPFS = async (hash: string): Promise<string> => {
  // Simulate IPFS retrieval
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `https://ipfs.io/ipfs/${hash}`;
};

export const validateIPFSHash = (hash: string): boolean => {
  return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash);
};