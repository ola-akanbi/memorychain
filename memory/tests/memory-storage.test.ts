import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;

describe("memory-storage contract tests", () => {
  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("creates a memory successfully", () => {
    const { result } = simnet.callPublicFn("memory-storage", "create-memory", [
      "My First Memory",
      "A beautiful family photo", 
      "QmTestHash123",
      "photo"
    ], address1);
    
    expect(result).toBeOk(1);
  });

  it("gets total memory count initially", () => {
    const { result } = simnet.callReadOnlyFn("memory-storage", "get-total-memory-count", [], address1);
    expect(result).toBeUint(0);
  });

  it("validates memory categories", () => {
    const { result } = simnet.callPublicFn("memory-storage", "create-memory", [
      "Test Memory",
      "Test description",
      "QmTestHash456", 
      "invalid-category"
    ], address1);
    
    expect(result).toBeErr(104); // ERR-INVALID-CATEGORY
  });
});