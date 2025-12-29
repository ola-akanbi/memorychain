# MemoryChain - Decentralized Memory Palace on Bitcoin

## Overview
MemoryChain enables families to store, encrypt, and inherit their most precious memories across generations, secured by Bitcoin's immutability through Stacks.

## Architecture
- **memory-storage.clar**: Memory CRUD operations with privacy controls
- **family-access.clar**: Role-based family permission system
- **memory-family-bridge.clar**: Cross-contract integration layer
- **React Frontend**: Wallet integration and user interface

## Quick Start
```bash
# Test contracts
clarinet console
>> (contract-call? .memory-storage create-memory "Test" "Description" "QmHash" "photo" (some u1) false)

# Run frontend
cd frontend
npm run dev

Built with Bitcoin security, Stacks smart contracts, and family love.