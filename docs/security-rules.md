# Security & Access Control Matrix

This document outlines the Firestore Database and Storage security policies that protect the production user data and limit resource access based on assigned user roles.

---

## 1. Access Matrix Reference

| Collection / Path | Public Read | Public Write | Authenticated Read | Authenticated Write | Role Restrictions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/users/{userId}` | No | No | Yes | Owner Only | Owner or Admin can write |
| `/missions/*` | No | No | Yes | No | Admins only can write |
| `/courses/*` | Yes | No | Yes | No | Instructors/Admins can write |
| `/datasets/*` | No | No | Yes | No | Admins only can write |
| `/certificates/*` | Yes | No | Yes | No | Public Read (for ledger verification) |
| `/submissions/*` | No | No | Owner Only | Owner Only | Admins can read all records |
| `/companies/*` | No | No | Yes | No | Recruiters/Admins can write |
| `/jobs/*` | No | No | Yes | No | Recruiters/Admins can write |

---

## 2. Firestore Security Rules Reference

The active security policy resides inside [firestore.rules](file:///c:/Users/Vidya/Desktop/AnalyticsRise/firebase/firestore.rules). Key functions include:

- `isAuthenticated()`: Ensures the client has passed a signed JWT token.
- `isOwner(userId)`: Restricts modification actions solely to the matching UID.
- `getUserProfile()`: Fetches the active user profile document to verify roles.
- `hasRole(role)`: Asserts whether the requesting profile has a specific string key under `profile.role` (`student`, `instructor`, `admin`, `recruiter`, `enterprise`).

---

## 3. Storage Security Rules Reference

The active storage policy resides inside [storage.rules](file:///c:/Users/Vidya/Desktop/AnalyticsRise/firebase/storage.rules). Key folders include:

- `/avatars/{userId}/`: Used for user avatar uploads. Restricted to read by authenticated accounts and write by the owner.
- `/resumes/{userId}/`: Stores career resumes. Only readable by the owner and validated recruiters, writeable by the owner only.
- `/certificates/`: Static issued credentials. Public read access, restricted write access to verified actions or admins.
- `/datasets/`: Downloadable laboratory CSV/JSON files. Read access restricted to authenticated users.
