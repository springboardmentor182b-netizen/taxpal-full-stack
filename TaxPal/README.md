## 📂 Project Folder Structure

### Root Structure
```text
mean-app/
├── client/                 # Angular Frontend
├── server/                 # Node + Express Backend
├── config/                 # Global configs (env, DB, etc.)
├── scripts/                # Deployment or automation scripts
├── docs/                   # Documentation, API specs
├── .env                    # Environment variables
├── package.json            # Root-level scripts for convenience
└── README.md


client/
├── src/
│   ├── app/
│   │   ├── core/            # Core services (auth, guards, interceptors)
│   │   ├── shared/          # Shared components, pipes, directives
│   │   ├── features/        # Feature modules (e.g., users, products)
│   │   ├── layouts/         # App layouts (e.g., admin, public)
│   │   ├── state/           # NgRx or Akita state management
│   │   └── app.module.ts
│   ├── assets/              # Images, styles, translations
│   ├── environments/        # environment.ts, environment.prod.ts
│   └── index.html
├── angular.json
└── package.json


server/
├── src/
│   ├── api/
│   │   ├── modules/         # Feature modules (users, products, orders)
│   │   │   ├── user/
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── user.routes.ts
│   │   │   │   └── user.service.ts
│   │   │   └── product/
│   │   │       └── ...
│   │   └── middlewares/     # Auth, validation, error handling
│   ├── config/              # DB connection, app settings
│   ├── utils/               # Helper functions, logger
│   ├── tests/               # Unit & integration tests
│   ├── app.ts               # Express app setup
│   └── server.ts            # Entry point
├── package.json
└── tsconfig.json            # (if using TypeScript)
