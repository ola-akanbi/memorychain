import { showConnect, openContractCall } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  stringAsciiCV,
  uintCV,
  boolCV,
  someCV,
  noneCV,
} from '@stacks/transactions';

// Use testnet for development
const network = new StacksTestnet();

export const connectWallet = () => {
  showConnect({
    appDetails: {
      name: 'MemoryChain',
      icon: window.location.origin + '/vite.svg',
    },
    redirectTo: '/',
    onFinish: () => {
      window.location.reload();
    },
    userSession: undefined,
  });
};

export const createMemory = async (
  userAddress: string,
  title: string,
  description: string,
  ipfsHash: string,
  category: string,
  familyId?: number,
  isPrivate: boolean = false
) => {
  const functionArgs = [
    stringAsciiCV(title),
    stringAsciiCV(description),
    stringAsciiCV(ipfsHash),
    stringAsciiCV(category),
    familyId ? someCV(uintCV(familyId)) : noneCV(),
    boolCV(isPrivate),
  ];

  const txOptions = {
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'memory-storage',
    functionName: 'create-memory',
    functionArgs,
    senderKey: userAddress,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };

  return openContractCall(txOptions);
};

export const createFamily = async (userAddress: string, familyName: string) => {
  const functionArgs = [stringAsciiCV(familyName)];

  const txOptions = {
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'family-access',
    functionName: 'create-family',
    functionArgs,
    senderKey: userAddress,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };

  return openContractCall(txOptions);
};