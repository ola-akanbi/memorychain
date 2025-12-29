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
            {family-id: family-id, memory-id: memory-id}
            {
                added-by: caller,
                added-at: memory-id,
                is-active: true
            }
        )
        
        (ok {family-id: family-id, memory-id: memory-id})
    )
)

;; Remove memory from family collection
(define-public (remove-memory-from-family (memory-id uint) (family-id uint))
    (let (
        (caller tx-sender)
        (association (unwrap! (map-get? family-memories {family-id: family-id, memory-id: memory-id}) 
                             ERR-MEMORY-NOT-FOUND))
    )
        ;; Check permissions (simplified)
        (asserts! (is-eq caller (get added-by association)) ERR-INSUFFICIENT-PERMISSIONS)
        
        ;; Remove association
        (map-set family-memories
            {family-id: family-id, memory-id: memory-id}
            (merge association {is-active: false})
        )
        
        (ok {family-id: family-id, memory-id: memory-id})
    )
)

;; Check if memory belongs to family
(define-read-only (is-family-memory (family-id uint) (memory-id uint))
    (match (map-get? family-memories {family-id: family-id, memory-id: memory-id})
        association (get is-active association)
        false
    )
)

;; Get family memory association details
(define-read-only (get-family-memory-info (family-id uint) (memory-id uint))
    (map-get? family-memories {family-id: family-id, memory-id: memory-id})
)

;; Get integration statistics
(define-read-only (get-integration-stats)
    (ok {
        bridge-version: "1.0.0",
        integration-active: true
    })
)