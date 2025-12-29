export interface Memory {
  id: number;
  title: string;
  description: string;
  ipfsHash: string;
  category: string;
  owner: string;
  familyId?: number;
  createdAt: number;
  isPrivate: boolean;
  isActive: boolean;
}

export interface Family {
  id: number;
  name: string;
  owner: string;
  memberCount: number;
  createdAt: number;
  isActive: boolean;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  loading: boolean;
}