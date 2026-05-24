# Application-Code

The application tier of the platform. This repository contains the source code for the **Platform Control Plane** (React UI + FastAPI Backend + PostgreSQL Database) that enables team self-service and infrastructure administration.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ED?logo=docker&logoColor=white)](https://docker.com)

---

## 3-Repo GitOps Architecture Role

This repository represents the **software development workspace** in our decoupled, three-tier architecture:

| Repository | Purpose | Primary Developer / Operator |
| :--- | :--- | :--- |
| **`Platform-Infrastructure`** | Provisions secure environments, resource limits, and network policies. | Platform / DevOps Team |
| **`Application-Code`** (this) | Contains the React web frontend, FastAPI backend, and DB schemas. | Software Development Team |
| **`Gitops-Manifests`** | Declarative Kubernetes specs synchronized automatically via ArgoCD. | CD / GitOps Engine |

```
[ Developers write & test code ]  →  [ Jenkins builds Docker Image ]  →  [ Image Tag updated in Gitops-Manifests ]
```

---

## Technical Overview

The Application-Code controls the Platform Control Plane using an approval-based infrastructure administration workflow:

```
User (UI) → Request Submitted → DB (PENDING) → Platform Admin Approves → Infrastructure Applied
```

1. **Users** register and request Kubernetes namespaces or ArgoCD applications.
2. **Requests** are written to a PostgreSQL database with a `PENDING` state.
3. **Administrators** review and approve requests inside the Admin Dashboard.
4. **Platform Ops** applies the approved resources through the automated `Platform-Infrastructure` pipelines.

---

## Project Structure

```
Application-Code/
├── backend/
│   ├── api/
│   │   ├── auth.py           # Register, Login, and JWT Token utilities
│   │   ├── admin.py          # Approve and reject infrastructure requests
│   │   ├── devplatform.py    # Namespace allocation request handling
│   │   └── argocd.py         # ArgoCD deployment requests
│   ├── models/
│   │   ├── user.py           # User and role definitions (e.g. admin, developer)
│   │   ├── request.py        # Infrastructure request logging schemas
│   │   └── schemas.py        # Pydantic validation structures
│   ├── utils/
│   │   ├── auth.py           # Role-based middleware guards
│   │   └── validators.py     # RFC-compliant K8s name check libraries
│   ├── database.py           # SQLAlchemy setup and session handling
│   ├── config.py             # Environment configurations
│   ├── main.py               # FastAPI entry point
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Secure developer login page
│   │   │   ├── Register.jsx       # Account sign up
│   │   │   ├── Dashboard.jsx      # Tracking user submitted requests
│   │   │   ├── DevPlatform.jsx    # Submitting a Namespace request
│   │   │   ├── ArgoCD.jsx         # Submitting an ArgoCD App request
│   │   │   ├── AdminDashboard.jsx # Panel to inspect pending infrastructure changes
│   │   │   └── RequestDetail.jsx  # Approver execution screen
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Context provider for user authorization
│   │   ├── components/
│   │   │   ├── Layout.jsx         # Global navigation bars
│   │   │   └── ProtectedRoute.jsx # Route authentication interceptors
│   │   └── services/
│   │       └── api.js             # HTTP Client configuration
│   ├── nginx.conf                 # Nginx production configurations
│   └── Dockerfile
├── docker-compose.yml             # Full localized Stack (Database, Backend, Frontend)
└── README.md
```

---

## REST API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user account. |
| `POST` | `/auth/login` | Authenticate credentials and return a JWT Token. |
| `GET` | `/auth/me` | Fetch active user credentials. |

### Infrastructure Requests (Requires Auth)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/devplatform/namespace` | Submit a request for a new namespace. |
| `POST` | `/argocd/application` | Submit a request for an ArgoCD application deployment. |
| `GET` | `/devplatform/my-requests` | List user's historically requested items. |

### Administration (Requires Admin Role)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/admin/requests` | List all historical user infrastructure requests. |
| `GET` | `/admin/requests/{id}` | Inspect a single request item. |
| `POST` | `/admin/approve/{id}` | Set a request status to `APPROVED`. |
| `POST` | `/admin/reject/{id}` | Set a request status to `REJECTED`. |

---

## Local Developer Environment

To test the application locally using Docker Compose:

```bash
# Boot the PostgreSQL, FastAPI backend, and React frontend services
docker compose up -d

# Exposed Services:
# - PostgreSQL DB  -> localhost:5434
# - Backend API    -> localhost:8001 (Interactive docs at http://localhost:8001/docs)
# - Frontend web   -> localhost:4000
```

### Initial Admin Setup
1. Visit `http://localhost:4000` and register a normal user account.
2. Elevate your database role directly inside the PostgreSQL container:
   ```bash
   docker exec -it postgres-gitops psql -U krishna -d postgresdb \
     -c "UPDATE users SET role='admin' WHERE username='YOUR_USERNAME';"
   ```
3. Log out and log back in to activate your administrative privileges.
