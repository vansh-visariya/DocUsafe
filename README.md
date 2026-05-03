# DocUsafe

DocUsafe is a role-based document management system for educational institutions. It enables students to upload documents, share them with selected teachers, and lets teachers/admins verify or reject those documents with audit remarks. The project focuses on secure access, clear ownership, and a simple workflow for document review.

## Problem We Solve
Schools and colleges often handle student documents through email or manual workflows. This creates delays, poor access control, and limited traceability. DocUsafe centralizes document submission and review with role-based access, selective sharing, and auditable decisions.

## Proposed Solution
- Students upload documents and share them with specific teachers.
- Teachers only see documents shared with them.
- Admins can see all documents and manage users.
- Review decisions (verify/reject) are tracked with remarks and reviewer identity.
- JWT secures APIs; Thymeleaf provides a simple server-rendered UI.

## Tech Stack
- Spring Boot, Spring Security, Spring Data JPA
- PostgreSQL + Flyway migrations
- Thymeleaf UI
- JWT authentication
- Docker + Docker Compose
- Prometheus + Grafana for monitoring
- GitHub Actions for CI/CD

## Core Features
- Role-based access: Admin, Student, Teacher
- Document upload, sharing, verification, and rejection
- Audit fields: review remarks + reviewer identity
- Thymeleaf dashboards for admin/student/teacher
- REST API with JWT
- Monitoring via Actuator + Prometheus + Grafana

## Environment Variables
Create a `.env` file (or export variables in your shell) with at least:

```
DOCUSAFE_JWT_SECRET=replace-with-a-strong-secret
```

Common variables:

```
SERVER_PORT=8080
DB_URL=jdbc:postgresql://localhost:5432/docusafe
DB_USER=docusafe
DB_PASSWORD=docusafe
JPA_DDL_AUTO=validate
DOCUSAFE_STORAGE_PATH=/data/documents
DOCUSAFE_MAX_FILE_SIZE=10485760
DOCUSAFE_ALLOWED_FILE_TYPES=application/pdf,image/jpeg,image/png,image/jpg
DOCUSAFE_JWT_EXPIRATION_MS=86400000
```

## Run With Docker (Recommended)
1. Ensure Docker and Docker Compose are installed.
2. Add `DOCUSAFE_JWT_SECRET` to your `.env` file.
3. Run:

```
docker compose up --build
```

Open:
- App: http://localhost:8080/login
- Portal (optional): http://localhost:8080/portal.html
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000

## Run Without Docker
1. Start PostgreSQL locally and create a database named `docusafe`.
2. Export env vars (or set in your IDE):

```
set DB_URL=jdbc:postgresql://localhost:5432/docusafe
set DB_USER=docusafe
set DB_PASSWORD=docusafe
set DOCUSAFE_JWT_SECRET=replace-with-a-strong-secret
```

3. Run the app:

```
./gradlew bootRun
```

## UI Routes
- Login: `/login`
- Admin dashboard: `/ui/admin`
- Student dashboard: `/ui/student`
- Teacher dashboard: `/ui/teacher`

## API Overview
- Auth: `/api/auth/register`, `/api/auth/login`
- Users (admin only): `/api/users`
- Documents: `/api/documents` (upload, list, share, verify, reject, download)
- Teachers list: `/api/teachers`

## First User Setup
The first registered user can choose the role (admin/teacher/student). After the first user exists, registration defaults to student.

## Monitoring
Spring Boot Actuator exposes metrics at `/actuator/prometheus`. Prometheus and Grafana are configured in Docker Compose.

## Tests
Run tests locally:

```
./gradlew test
```

## CI/CD
GitHub Actions runs tests on each push and builds a Docker image. The deploy step is currently disabled until a target server is configured.

## License
ISC (as configured in this repository).
