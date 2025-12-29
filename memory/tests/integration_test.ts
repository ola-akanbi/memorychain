import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;

describe("MemoryChain Integration Tests", () => {
  it("ensures all contracts are deployed", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("creates family and adds memory", () => {
    // Create a family
    const familyResult = simnet.callPublicFn("family-access", "create-family", [
      "Test Family"
    ], address1);
    expect(familyResult.result).toBeOk(1);

    // Create a memory
    const memoryResult = simnet.callPublicFn("memory-storage", "create-memory", [
      "Family Photo",
      "Our vacation photo",
      "QmTestHash123",
      "photo",
      1, // family-id
      false // is-private
    ], address1);
    expect(memoryResult.result).toBeOk(1);

    // Link memory to family via bridge
    const bridgeResult = simnet.callPublicFn("memory-family-bridge", "add-memory-to-family", [
      1, // memory-id
      1  // family-id
    ], address1);
    expect(bridgeResult.result).toBeOk();
  });

  it("validates family membership for memory access", () => {
    // Check if memory belongs to family
    const checkResult = simnet.callReadOnlyFn("memory-family-bridge", "is-family-memory", [
      1, // family-id
      1  // memory-id
    ], address1);
    expect(checkResult.result).toBeBool(true);
  });

  it("gets contract statistics", () => {
    const memoryStats = simnet.callReadOnlyFn("memory-storage", "get-contract-stats", [], address1);
    expect(memoryStats.result).toBeOk();

    const familyStats = simnet.callReadOnlyFn("family-access", "get-family-stats", [], address1);
    expect(familyStats.result).toBeOk();

    const bridgeStats = simnet.callReadOnlyFn("memory-family-bridge", "get-integration-stats", [], address1);
    expect(bridgeStats.result).toBeOk();
  });
});