;; memory-storage.clar - Enhanced Memory Management Contract
;; MemoryChain - Decentralized Memory Palace on Bitcoin

;; Enhanced memory data structure
(define-map memories 
    uint 
    {
        title: (string-ascii 100),
        description: (string-ascii 500), 
        ipfs-hash: (string-ascii 100),
        owner: principal,
        category: (string-ascii 20),
        family-id: (optional uint),
        created-at: uint,
        updated-at: uint,
        is-active: bool,
        is-private: bool
    }
)

;; Memory counter for unique IDs
(define-data-var memory-counter uint u0)

;; User memory count tracking
(define-map user-memory-count principal uint)

;; Category statistics
(define-map category-count (string-ascii 20) uint)

;; Memory sharing permissions
(define-map memory-permissions 
    {memory-id: uint, user: principal}
    {
        can-view: bool,
        can-edit: bool,
        granted-by: principal,
        granted-at: uint
    }
)

;; Error constants
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-MEMORY-NOT-FOUND (err u101))
(define-constant ERR-EMPTY-TITLE (err u105))
(define-constant ERR-INVALID-CATEGORY (err u104))
(define-constant ERR-PERMISSION-DENIED (err u106))
(define-constant ERR-INVALID-MEMORY-ID (err u107))

;; Generate next memory ID
(define-private (get-next-memory-id)
    (let ((current-id (var-get memory-counter)))
        (var-set memory-counter (+ current-id u1))
        (+ current-id u1)
    )
)

;; Validate category
(define-private (is-valid-category (category (string-ascii 20)))
    (or 
        (is-eq category "photo")
        (is-eq category "document") 
        (is-eq category "video")
        (is-eq category "letter")
        (is-eq category "audio")
        (is-eq category "other")
    )
)

;; Update user memory count
(define-private (increment-user-count (user principal))
    (let ((current-count (default-to u0 (map-get? user-memory-count user))))
        (map-set user-memory-count user (+ current-count u1))
        true
    )
)

;; Update category count
(define-private (increment-category-count (category (string-ascii 20)))
    (let ((current-count (default-to u0 (map-get? category-count category))))
        (map-set category-count category (+ current-count u1))
        true
    )
)

;; Check if user can access memory
(define-private (can-access-memory (memory-id uint) (user principal))
    (match (map-get? memories memory-id)
        memory-data 
            (let ((is-owner (is-eq user (get owner memory-data)))
                  (is-public (not (get is-private memory-data)))
                  (has-permission (is-some (map-get? memory-permissions {memory-id: memory-id, user: user}))))
                (and (get is-active memory-data)
                     (or is-owner is-public has-permission)))
        false
    )
)

;; Create new memory
(define-public (create-memory 
    (title (string-ascii 100))
    (description (string-ascii 500))
    (ipfs-hash (string-ascii 100))
    (category (string-ascii 20))
    (family-id (optional uint))
    (is-private bool)
)
    (let (
        (memory-id (get-next-memory-id))
        (caller tx-sender)
    )
        ;; Input validation
        (asserts! (> (len title) u0) ERR-EMPTY-TITLE)
        (asserts! (> (len ipfs-hash) u0) ERR-EMPTY-TITLE)
        (asserts! (is-valid-category category) ERR-INVALID-CATEGORY)
        
        ;; Create memory record
        (map-set memories memory-id {
            title: title,
            description: description,
            ipfs-hash: ipfs-hash,
            owner: caller,
            category: category,
            family-id: family-id,
            created-at: memory-id,
            updated-at: memory-id,
            is-active: true,
            is-private: is-private
        })
        
        ;; Update counters
        (increment-user-count caller)
        (increment-category-count category)
        
        (ok memory-id)
    )
)

;; Update memory details
(define-public (update-memory 
    (memory-id uint)
    (title (string-ascii 100))
    (description (string-ascii 500))
)
    (let (
        (memory-data (unwrap! (map-get? memories memory-id) ERR-MEMORY-NOT-FOUND))
        (caller tx-sender)
    )
        ;; Authorization check
        (asserts! (is-eq caller (get owner memory-data)) ERR-NOT-AUTHORIZED)
        (asserts! (get is-active memory-data) ERR-MEMORY-NOT-FOUND)
        (asserts! (> (len title) u0) ERR-EMPTY-TITLE)
        
        ;; Update memory
        (map-set memories memory-id (merge memory-data {
            title: title,
            description: description,
            updated-at: memory-id
        }))
        
        (ok memory-id)
    )
)

;; Transfer memory ownership
(define-public (transfer-memory (memory-id uint) (new-owner principal))
    (let (
        (memory-data (unwrap! (map-get? memories memory-id) ERR-MEMORY-NOT-FOUND))
        (caller tx-sender)
    )
        ;; Authorization check
        (asserts! (is-eq caller (get owner memory-data)) ERR-NOT-AUTHORIZED)
        (asserts! (get is-active memory-data) ERR-MEMORY-NOT-FOUND)
        
        ;; Transfer ownership
        (map-set memories memory-id (merge memory-data {
            owner: new-owner,
            updated-at: memory-id
        }))
        
        (ok memory-id)
    )
)

;; Grant memory access permission
(define-public (grant-access 
    (memory-id uint) 
    (user principal) 
    (can-view bool) 
    (can-edit bool)
)
    (let (
        (memory-data (unwrap! (map-get? memories memory-id) ERR-MEMORY-NOT-FOUND))
        (caller tx-sender)
    )
        ;; Authorization check
        (asserts! (is-eq caller (get owner memory-data)) ERR-NOT-AUTHORIZED)
        (asserts! (get is-active memory-data) ERR-MEMORY-NOT-FOUND)
        
        ;; Grant permission
        (map-set memory-permissions 
            {memory-id: memory-id, user: user}
            {
                can-view: can-view,
                can-edit: can-edit,
                granted-by: caller,
                granted-at: memory-id
            }
        )
        
        (ok memory-id)
    )
)

;; Delete memory (soft delete)
(define-public (delete-memory (memory-id uint))
    (let (
        (memory-data (unwrap! (map-get? memories memory-id) ERR-MEMORY-NOT-FOUND))
        (caller tx-sender)
    )
        ;; Authorization check
        (asserts! (is-eq caller (get owner memory-data)) ERR-NOT-AUTHORIZED)
        (asserts! (get is-active memory-data) ERR-MEMORY-NOT-FOUND)
        
        ;; Soft delete
        (map-set memories memory-id (merge memory-data {
            is-active: false,
            updated-at: memory-id
        }))
        
        (ok memory-id)
    )
)

;; Read-only functions
(define-read-only (get-memory (memory-id uint))
    (match (map-get? memories memory-id)
        memory-data 
            (if (get is-active memory-data)
                (ok memory-data)
                ERR-MEMORY-NOT-FOUND
            )
        ERR-MEMORY-NOT-FOUND
    )
)

(define-read-only (get-memory-for-user (memory-id uint) (user principal))
    (if (can-access-memory memory-id user)
        (get-memory memory-id)
        ERR-PERMISSION-DENIED
    )
)

(define-read-only (get-total-memory-count)
    (var-get memory-counter)
)

(define-read-only (get-user-memory-count (user principal))
    (default-to u0 (map-get? user-memory-count user))
)

(define-read-only (get-category-count (category (string-ascii 20)))
    (default-to u0 (map-get? category-count category))
)

(define-read-only (is-memory-owner (memory-id uint) (user principal))
    (match (map-get? memories memory-id)
        memory-data 
            (and 
                (is-eq user (get owner memory-data))
                (get is-active memory-data)
            )
        false
    )
)

(define-read-only (get-memory-permissions (memory-id uint) (user principal))
    (map-get? memory-permissions {memory-id: memory-id, user: user})
)

(define-read-only (get-contract-stats)
    (ok {
        total-memories: (var-get memory-counter),
        photo-count: (get-category-count "photo"),
        document-count: (get-category-count "document"),
        video-count: (get-category-count "video"),
        letter-count: (get-category-count "letter"),
        audio-count: (get-category-count "audio"),
        other-count: (get-category-count "other")
    })
)