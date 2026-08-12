Claims Management Module
========================

Phase 4.2 – Claim APIs
======================
Method	Endpoint	                Description
POST	/api/v1/claims	            Create Claim
GET	    /api/v1/claims	            List Claims
GET	    /api/v1/claims/:id	        Claim Details
PUT	    /api/v1/claims/:id	        Update Claim
PATCH	/api/v1/claims/:id/status	Approve/Reject Claim
DELETE	/api/v1/claims/:id	        Delete Claim


A claim can only be created for an ACTIVE policy.
✅ The policy must not be expired.
✅ A customer can submit claims only for their own policies.
✅ A claim amount cannot exceed the policy's coverage amount.
✅ Every claim receives a unique claim number (e.g., CLM-2026-000001).
✅ Initial claim status is SUBMITTED.


SUBMITTED
      │
      ▼
UNDER_REVIEW
      │
      ├────────► REJECTED
      │
      ▼
APPROVED
      │
      ▼
PAID

Claim Timeline
===============
Every status change will be recorded:

| Claim   | Status       | Changed By | Date     |
| ------- | ------------ | ---------- | -------- |
| CLM-001 | SUBMITTED    | Customer   | Today    |
| CLM-001 | UNDER_REVIEW | Agent      | Today    |
| CLM-001 | APPROVED     | Admin      | Tomorrow |
