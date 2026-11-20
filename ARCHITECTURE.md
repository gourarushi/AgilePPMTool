# PMTool Architecture

## System context

```mermaid
flowchart LR
    User[User]
    Browser[Browser<br/>React UI]
    Vite[Vite development server<br/>localhost:5174]
    API[Spring Boot REST API<br/>localhost:8080]
    Security[Spring Security<br/>JWT filter]
    DB[(MySQL<br/>ppmtool database)]

    User --> Browser
    Browser --> Vite
    Vite -->|/api requests; development proxy| API
    API --> Security
    Security -->|Authenticated request principal| API
    API --> DB
    API -->|JSON response / validation errors| Vite
    Vite --> Browser
```

In development, Vite forwards requests under `/api` to the Spring Boot server.
The frontend stores the issued JWT in browser local storage and sends it in the
`Authorization` header for subsequent API calls. The backend validates the
token and resolves the authenticated user for protected endpoints.

## Application components

```mermaid
flowchart TB
    subgraph Frontend["React frontend"]
        Entry["main.jsx / App.jsx"]
        Router["React Router<br/>public and SecureRoute-protected pages"]
        Screens["Screens and UI<br/>Landing, Login, Register, Dashboard,<br/>Projects, Project Board, Project Tasks"]
        Actions["Redux Thunk actions<br/>Axios API requests"]
        Store["Redux store"]
        Reducers["Reducers<br/>security, project, backlog, errors"]
        Token["JWT utilities<br/>decode, restore, Authorization header"]
        Entry --> Router --> Screens
        Screens --> Actions
        Actions --> Store
        Store --> Reducers
        Reducers --> Screens
        Actions --> Token
    end

    subgraph Backend["Spring Boot backend"]
        Controllers["REST controllers<br/>UserController<br/>ProjectController<br/>BacklogController"]
        Auth["Spring Security<br/>JWT authentication filter<br/>token provider"]
        Services["Services<br/>UserService<br/>ProjectService<br/>ProjectTaskService"]
        Validation["Bean and custom validation<br/>MapValidationErrorService<br/>exception handlers"]
        Repositories["Spring Data JPA repositories"]
        Entities["JPA domain entities<br/>User, Project, Backlog, ProjectTask"]
        Controllers --> Services
        Controllers --> Validation
        Auth --> Controllers
        Services --> Repositories --> Entities
    end

    Screens --> Actions
    Actions -->|HTTP / JSON| Controllers
    Token -->|Bearer JWT| Auth
    Entities --> Database[(MySQL)]
```

## Domain model

The diagram below reflects the tables, columns, key constraints, and foreign
keys declared in [`pmtool/schema.sql`](./pmtool/schema.sql).

```mermaid
erDiagram
    USER o|--o{ PROJECT : owns
    PROJECT ||--o| BACKLOG : has
    BACKLOG ||--o{ PROJECT_TASK : contains

    USER {
        BIGINT id PK
        VARCHAR_255 username UK
        VARCHAR_255 full_name
        VARCHAR_255 password
        DATETIME_6 create__at
        DATETIME_6 update__at
    }

    PROJECT {
        BIGINT id PK
        VARCHAR_255 project_name
        VARCHAR_255 project_identifier UK
        VARCHAR_255 description
        DATETIME_6 start_date
        DATETIME_6 end_date
        DATETIME_6 created__at
        DATETIME_6 updated__at
        VARCHAR_255 project_leader
        BIGINT user_id FK
    }

    BACKLOG {
        BIGINT id PK
        INT p_t_sequence
        VARCHAR_255 project_identifier
        BIGINT project_id FK,UK
    }

    PROJECT_TASK {
        BIGINT id PK
        VARCHAR_255 project_sequence UK
        VARCHAR_255 summary
        VARCHAR_255 acceptance_criteria
        DATETIME_6 due_date
        VARCHAR_255 project_identifier
        DATETIME_6 create__at
        DATETIME_6 update__at
        INT priority
        VARCHAR_255 status
        BIGINT backlog_id FK
    }
```

`UK` marks unique columns/keys; `FK,UK` on `BACKLOG.project_id` indicates that
the column is both a foreign key and unique. The SQL permits a project to have
zero or one backlog, a backlog to have zero or more tasks, and a project to
have no associated user (the `user_id` column is nullable). Each backlog must
belong to one project, and each task must belong to one backlog. `priority` is
an integer ordinal in the current schema; `status` is stored as text. Fields
without an explicit `NOT NULL` constraint are nullable in this DDL.

## Main request flows

```mermaid
sequenceDiagram
    actor User
    participant UI as React UI
    participant Redux as Redux thunk/store
    participant API as Spring REST API
    participant JWT as JWT security filter
    participant Service as Service layer
    participant DB as JPA repository / MySQL

    User->>UI: Submit registration
    UI->>Redux: registerUser
    Redux->>API: POST /api/users/register
    API->>Service: Validate and create user
    Service->>DB: Save user (BCrypt password)
    DB-->>API: Created user or field errors
    API-->>Redux: JSON response
    Redux-->>UI: Clear or display errors

    User->>UI: Submit login
    UI->>Redux: loginUser
    Redux->>API: POST /api/users/login
    API->>Service: Authenticate credentials
    API-->>Redux: Bearer JWT
    Redux->>Redux: Store token, set Authorization header, decode claims
    Redux-->>UI: SET_CURRENT_USER

    User->>UI: Load projects or project backlog
    UI->>Redux: Project/backlog thunk
    Redux->>API: GET /api/project/all or /api/backlog/{projectId}
    API->>JWT: Validate Authorization token
    JWT-->>API: Authenticated user principal
    API->>Service: Fetch owner-scoped data
    Service->>DB: Read/write entities
    DB-->>API: Domain data
    API-->>Redux: JSON response
    Redux-->>UI: Update project/backlog state
```

## API areas

| Area | Routes | Responsibility |
|---|---|---|
| Authentication | `POST /api/users/register`, `POST /api/users/login` | Register users, validate credentials, issue JWT |
| Projects | `/api/project` | Create, list, fetch, and delete owner-scoped projects |
| Backlog/tasks | `/api/backlog/{projectId}` | List/create project tasks; fetch/update/delete a task by sequence |

Validation errors are returned as JSON field-to-message maps and stored in the
frontend Redux `errors` state for form feedback.
