;; memory-family-bridge.clar - Integration between Memory Storage and Family Access
;; MemoryChain - Decentralized Memory Palace on Bitcoin

;; Error constants
(define-constant ERR-NOT-FAMILY-MEMBER (err u300))
(define-constant ERR-INSUFFICIENT-PERMISSIONS (err u301))
(define-constant ERR-MEMORY-NOT-FOUND (err u302))
(define-constant ERR-FAMILY-NOT-FOUND (err u303))

;; Family memory associations
(define-map family-memories
    {family-id: uint, memory-id: uint}
    {
        added-by: principal,
        added-at: uint,
        is-active: bool
    }
)

;; Add memory to family collection
(define-public (add-memory-to-family (memory-id uint) (family-id uint))
    (let (
        (caller tx-sender)
    )
        ;; Check if caller can access the memory
        ;; This would call memory-storage contract in production
        
        ;; Check if caller is family member with appropriate permissions
        ;; This would call family-access contract in production
        
        ;; For now, simplified validation
        (asserts! (> memory-id u0) ERR-MEMORY-NOT-FOUND)
        (asserts! (> family-id u0) ERR-FAMILY-NOT-FOUND)
        
        ;; Add memory to family
        (map-set family-memories
