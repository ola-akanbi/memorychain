;; family-access.clar - Family Management and Access Control
;; MemoryChain - Decentralized Memory Palace on Bitcoin

;; Family group structure
(define-map families
    uint
    {
        name: (string-ascii 50),
        owner: principal,
        created-at: uint,
        member-count: uint,
        is-active: bool
    }
)

;; Family membership with roles
(define-map family-members
    {family-id: uint, member: principal}
    {
        role: (string-ascii 10),
        joined-at: uint,
        invited-by: principal,
        is-active: bool
    }
)

;; Pending invitations
(define-map family-invitations
    {family-id: uint, invitee: principal}
    {
        inviter: principal,
        role: (string-ascii 10),
        invited-at: uint,
        expires-at: uint
    }
)

;; Family counter for unique IDs
(define-data-var family-counter uint u0)

;; Error constants
(define-constant ERR-NOT-AUTHORIZED (err u200))
(define-constant ERR-FAMILY-NOT-FOUND (err u201))
(define-constant ERR-MEMBER-NOT-FOUND (err u202))
(define-constant ERR-INVALID-ROLE (err u203))
(define-constant ERR-MEMBER-ALREADY-EXISTS (err u204))
(define-constant ERR-INVITATION-NOT-FOUND (err u205))
(define-constant ERR-INVITATION-EXPIRED (err u206))
(define-constant ERR-INVALID-FAMILY-DATA (err u207))
(define-constant ERR-CANNOT-REMOVE-OWNER (err u208))

;; Role hierarchy constants
(define-constant ROLE-OWNER "owner")
(define-constant ROLE-ADMIN "admin") 
(define-constant ROLE-MEMBER "member")
(define-constant ROLE-VIEWER "viewer")

;; Validate family member role
(define-private (is-valid-role (role (string-ascii 10)))
    (or 
        (is-eq role ROLE-OWNER)
        (is-eq role ROLE-ADMIN)
        (is-eq role ROLE-MEMBER)
        (is-eq role ROLE-VIEWER)
    )
)

;; Check if user has admin privileges in family
(define-private (has-admin-privileges (family-id uint) (user principal))
    (match (map-get? family-members {family-id: family-id, member: user})
        member-data 
            (and 
                (get is-active member-data)
                (or 
                    (is-eq (get role member-data) ROLE-OWNER)
                    (is-eq (get role member-data) ROLE-ADMIN)
                )
            )
        false
    )
)

;; Generate next family ID
(define-private (get-next-family-id)
    (let ((current-id (var-get family-counter)))
        (var-set family-counter (+ current-id u1))
        (+ current-id u1)
    )
)

;; Check if invitation is still valid
(define-private (is-invitation-valid (family-id uint) (invitee principal))
    (match (map-get? family-invitations {family-id: family-id, invitee: invitee})
        invitation-data
            (> (get expires-at invitation-data) (get invited-at invitation-data))
        false
    )
)

;; Create new family group
(define-public (create-family (family-name (string-ascii 50)))
    (let (
        (family-id (get-next-family-id))
        (caller tx-sender)
    )
        ;; Validate input
        (asserts! (> (len family-name) u0) ERR-INVALID-FAMILY-DATA)
        
        ;; Create family record
        (map-set families family-id {
            name: family-name,
            owner: caller,
            created-at: family-id,
            member-count: u1,
            is-active: true
        })
        
        ;; Add creator as owner
        (map-set family-members 
            {family-id: family-id, member: caller}
            {
                role: ROLE-OWNER,
                joined-at: family-id,
                invited-by: caller,
                is-active: true
            }
        )
        
        (ok family-id)
    )
)

;; Invite member to family
(define-public (invite-member 
    (family-id uint) 
    (invitee principal) 
    (role (string-ascii 10))
)
    (let (
        (family-data (unwrap! (map-get? families family-id) ERR-FAMILY-NOT-FOUND))
        (caller tx-sender)
        (expiry-time (+ family-id u100)) ;; Simple expiry logic
    )
        ;; Check authorization
        (asserts! (has-admin-privileges family-id caller) ERR-NOT-AUTHORIZED)
        (asserts! (get is-active family-data) ERR-FAMILY-NOT-FOUND)
        (asserts! (is-valid-role role) ERR-INVALID-ROLE)
        
        ;; Check if already a member
        (asserts! (is-none (map-get? family-members {family-id: family-id, member: invitee})) 
                 ERR-MEMBER-ALREADY-EXISTS)
        
        ;; Create invitation
        (map-set family-invitations
            {family-id: family-id, invitee: invitee}
            {
                inviter: caller,
                role: role,
                invited-at: family-id,
                expires-at: expiry-time
            }
        )
        
        (ok family-id)
    )
)

;; Accept family invitation
(define-public (accept-invitation (family-id uint))
    (let (
        (caller tx-sender)
        (invitation-data (unwrap! (map-get? family-invitations {family-id: family-id, invitee: caller}) 
                                 ERR-INVITATION-NOT-FOUND))
        (family-data (unwrap! (map-get? families family-id) ERR-FAMILY-NOT-FOUND))
    )
        ;; Check if invitation is still valid
        (asserts! (is-invitation-valid family-id caller) ERR-INVITATION-EXPIRED)
        (asserts! (get is-active family-data) ERR-FAMILY-NOT-FOUND)
        
        ;; Add member to family
        (map-set family-members
            {family-id: family-id, member: caller}
            {
                role: (get role invitation-data),
                joined-at: family-id,
                invited-by: (get inviter invitation-data),
                is-active: true
            }
        )
        
        ;; Update family member count
        (map-set families family-id 
            (merge family-data {
                member-count: (+ (get member-count family-data) u1)
            })
        )
        
        ;; Remove invitation
        (map-delete family-invitations {family-id: family-id, invitee: caller})
        
        (ok family-id)
    )
)

;; Remove member from family
(define-public (remove-member (family-id uint) (member principal))
    (let (
        (caller tx-sender)
        (family-data (unwrap! (map-get? families family-id) ERR-FAMILY-NOT-FOUND))
        (member-data (unwrap! (map-get? family-members {family-id: family-id, member: member}) 
                             ERR-MEMBER-NOT-FOUND))
    )
        ;; Check authorization
        (asserts! (has-admin-privileges family-id caller) ERR-NOT-AUTHORIZED)
        (asserts! (get is-active family-data) ERR-FAMILY-NOT-FOUND)
        (asserts! (get is-active member-data) ERR-MEMBER-NOT-FOUND)
        
        ;; Cannot remove family owner
        (asserts! (not (is-eq (get role member-data) ROLE-OWNER)) ERR-CANNOT-REMOVE-OWNER)
        
        ;; Remove member
        (map-set family-members
            {family-id: family-id, member: member}
            (merge member-data {is-active: false})
        )
        
        ;; Update family member count
        (map-set families family-id 
            (merge family-data {
                member-count: (- (get member-count family-data) u1)
            })
        )
        
        (ok family-id)
    )
)

;; Change member role
(define-public (change-member-role 
    (family-id uint) 
    (member principal) 
    (new-role (string-ascii 10))
)
    (let (
        (caller tx-sender)
        (family-data (unwrap! (map-get? families family-id) ERR-FAMILY-NOT-FOUND))
        (member-data (unwrap! (map-get? family-members {family-id: family-id, member: member}) 
                             ERR-MEMBER-NOT-FOUND))
    )
        ;; Check authorization (only family owner can change roles)
        (asserts! (is-eq caller (get owner family-data)) ERR-NOT-AUTHORIZED)
        (asserts! (get is-active family-data) ERR-FAMILY-NOT-FOUND)
        (asserts! (get is-active member-data) ERR-MEMBER-NOT-FOUND)
        (asserts! (is-valid-role new-role) ERR-INVALID-ROLE)
        
        ;; Cannot change owner role
        (asserts! (not (is-eq (get role member-data) ROLE-OWNER)) ERR-NOT-AUTHORIZED)
        (asserts! (not (is-eq new-role ROLE-OWNER)) ERR-NOT-AUTHORIZED)
        
        ;; Update role
        (map-set family-members
            {family-id: family-id, member: member}
            (merge member-data {role: new-role})
        )
        
        (ok family-id)
    )
)

;; Read-only functions
(define-read-only (get-family (family-id uint))
    (map-get? families family-id)
)

(define-read-only (get-member-details (family-id uint) (member principal))
    (map-get? family-members {family-id: family-id, member: member})
)

(define-read-only (is-family-member (family-id uint) (user principal))
    (match (map-get? family-members {family-id: family-id, member: user})
        member-data (get is-active member-data)
        false
    )
)

(define-read-only (has-family-role (family-id uint) (user principal) (required-role (string-ascii 10)))
    (match (map-get? family-members {family-id: family-id, member: user})
        member-data 
            (and 
                (get is-active member-data)
                (is-eq (get role member-data) required-role)
            )
        false
    )
)

(define-read-only (can-access-family-memories (family-id uint) (user principal))
    (match (map-get? family-members {family-id: family-id, member: user})
        member-data 
            (let ((user-role (get role member-data)))
                (and 
                    (get is-active member-data)
                    (or 
                        (is-eq user-role ROLE-OWNER)
                        (is-eq user-role ROLE-ADMIN)
                        (is-eq user-role ROLE-MEMBER)
                        (is-eq user-role ROLE-VIEWER)
                    )
                )
            )
        false
    )
)

(define-read-only (get-invitation (family-id uint) (invitee principal))
    (map-get? family-invitations {family-id: family-id, invitee: invitee})
)

(define-read-only (get-total-family-count)
    (var-get family-counter)
)

(define-read-only (get-family-stats)
    (ok {
        total-families: (var-get family-counter)
    })
)