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