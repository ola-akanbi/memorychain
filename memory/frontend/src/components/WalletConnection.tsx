import React, { useState, useEffect } from 'react';
import { connectWallet } from '../lib/stacks';

interface WalletConnectionProps {
  onConnect: (address: string) => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({ onConnect }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const handleConnect = () => {
    connectWallet();
  };

  return (
    <div className="wallet-connection">
      {!connected ? (
        <button className="btn" onClick={handleConnect}>
          Connect Wallet
        </button>
      ) : (
        <div className="status connected">
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
      )}
    </div>
  );
};