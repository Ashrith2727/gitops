

# Production-Grade GitOps CI/CD Platform

## Overview
This project demonstrates a **production-grade GitOps CI/CD platform** built using **Kubernetes, Jenkins, and Argo CD**, following real-world DevOps and Platform Engineering practices. The platform automates application build, containerization, deployment, monitoring, and recovery using Git as the single source of truth.

The entire system is deployed on **local Kubernetes infrastructure**, while maintaining the same architecture and workflows used in enterprise cloud environments.

---

## Architecture

```

Developer → GitHub
↓
Jenkins (CI)
↓
Container Registry
↓
GitOps Repository
↓
Argo CD
↓
Kubernetes (dev / staging / prod)
↓
Prometheus | Grafana | Loki | Alertmanager

```

---

## Key Features

- **CI/CD Separation**
  - Jenkins handles Continuous Integration
  - Argo CD handles Continuous Deployment using GitOps

- **GitOps Workflow**
  - Git is the single source of truth
  - No manual `kubectl apply` for application deployments
  - Automatic sync and self-healing

- **Kubernetes Best Practices**
  - Namespaces for dev, staging, and prod
  - Readiness & liveness probes
  - Resource requests and limits
  - Rolling and canary deployments

- **Observability**
  - Prometheus for metrics
  - Grafana dashboards for visualization
  - Loki for centralized logging
  - Alertmanager for automated alerts

- **Security**
  - Kubernetes RBAC (least privilege)
  - Kubernetes Secrets for sensitive data
  - Image vulnerability scanning in CI

- **Reliability & Resilience**
  - Pod failure recovery testing
  - Automated rollback using Git history
  - Horizontal scalability validation

---

## Technology Stack

| Category | Tools |
|--------|------|
| Containerization | Docker |
| Orchestration | Kubernetes |
| CI | Jenkins |
| CD | Argo CD (GitOps) |
| Monitoring | Prometheus |
| Visualization | Grafana |
| Logging | Loki |
| Alerting | Alertmanager |
| Packaging | Helm |
| Security | RBAC, Kubernetes Secrets |
| OS | Linux |

---

## Repository Structure

```

├── app/
│   ├── app.js
│   ├── package.json
│   └── Dockerfile
├── jenkins/
│   └── Jenkinsfile
├── gitops-repo/
│   └── environments/
│       ├── dev/
└── README.md

```

---

## CI Pipeline (Jenkins)

- Code checkout from GitHub
- Dependency installation
- Application build and test
- Docker image creation
- Image vulnerability scanning
- Push image to registry
- Update GitOps repository with new image tag

---

## CD Pipeline (GitOps with Argo CD)

- Argo CD continuously monitors GitOps repository
- Automatically syncs desired state to Kubernetes
- Self-healing and automatic rollback enabled
- Manual promotion for staging and production environments

---

## Observability

- Real-time monitoring of pods, nodes, CPU, and memory
- Centralized logging for debugging
- Alerts triggered on pod crashes and abnormal behavior
- Grafana dashboards used for operational visibility

---

## How to Run Locally

1. Create Kubernetes cluster using kind or k3s
2. Install Jenkins and configure CI pipeline
3. Install Argo CD and connect GitOps repository
4. Deploy observability stack using Helm
5. Access application via Kubernetes Service

---

## Learning Outcomes

- Hands-on experience with production-grade DevOps architecture
- Deep understanding of GitOps principles
- CI/CD pipeline design following industry standards
- Kubernetes observability and reliability practices
- Security and deployment strategy implementation

---

## Future Improvements

- Infrastructure as Code (Terraform)
- Service mesh integration
- Advanced traffic management
- Cloud migration (EKS/GKE)

---

## Author
Built as a hands-on DevOps platform project to demonstrate real-world CI/CD, GitOps, and Kubernetes production practices.

