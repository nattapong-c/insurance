# AGENTS.md — AI Agent Guidelines & Repository Guide

This document provides context, setup instructions, architectural design, and coding guidelines for AI coding agents operating on the **Insurance Invoice & Quotation Management System**.

---

## 📌 Project Overview

This repository contains a full-stack insurance management system designed to process vehicle and general insurance policies, manage customer and partner company records, calculate financial parameters (ACT compulsory insurance, stamp duty, 7% VAT), and export official PDF invoices and quotations.

---

## 🏗 Repository Structure & Architecture

```text
insurance/
├── docker-compose.yml     # Container orchestration (frontend on 3000, backend API on 3002)
├── app/                   # Frontend React Application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── component/     # Shared UI components (Layout, Table, Navbar, Modal)
│   │   ├── screen/        # Page components (home, login, customer, company, invoice, quotation)
│   │   ├── redux/         # Redux state stores & thunks
│   │   ├── route/         # React Router v6 routing & PrivateRoutes auth guard
│   │   ├── utils/         # Firebase auth, helpers, API client wrappers
│   │   ├── env.json       # Environment configurations
│   │   └── scripts/       # Environment switching scripts (set-environment.js)
│   ├── Dockerfile
│   └── package.json
└── service/               # Backend Express API Service
    ├── template/          # Mustache HTML templates for PDF generation (invoice.html, quotation.html)
    ├── src/
    │   ├── app.ts         # Express server entry point & middleware setup
    │   ├── config_env.ts  # Environment variable definitions
    │   ├── database/      # Mongoose DB connection setup & indexing
    │   ├── middleware/    # Auth token validator (handleToken), error handling
    │   ├── schema/        # Mongoose schemas (Invoice, Quotation, Customer, Company, User)
    │   ├── service/       # Feature domains (admin, company, customer, invoice, quotation)
    │   └── utils/         # Dynamic route loader, JWT helper
    ├── Dockerfile
    └── package.json
```

---

## 🛠 Commands & Scripts

### 1. Running with Docker (Full Stack)
```bash
# Start both frontend and backend
docker-compose up --build
```

### 2. Backend Service (`service/`)
```bash
# Install dependencies
yarn install

# Start development server with auto-reload (port 3002)
yarn dev

# Compile TypeScript
yarn build

# Run unit tests (Jest)
yarn test

# Create database indexes
yarn index_db
```

### 3. Frontend App (`app/`)
```bash
# Install dependencies
yarn install

# Start dev server with dev environment config (port 3000)
yarn start_dev

# Build production bundle
yarn build_prod

# Run tests
yarn test
```

---

## 🎯 Code Conventions & Rules for AI Agents

### Backend Guidelines (`service/`)
1. **Dynamic Routing**:
   - Backend routes are dynamically loaded via `glob` in [routes.ts](file:///Users/Boss/Desktop/workspace-ai/insurance/service/src/utils/routes.ts).
   - Any new module routes file MUST end in `.routes.ts` (e.g., `feature.routes.ts`) and export an Express `Router()`.

2. **Authentication & Authorization**:
   - Protected endpoints MUST apply the `handleToken` middleware from [authen.ts](file:///Users/Boss/Desktop/workspace-ai/insurance/service/src/middleware/authen.ts).
   - Tokens are RSA-signed JWTs. Verify that requests pass `Authorization: Bearer <token>`.

3. **Database Schemas & Mongoose**:
   - All Mongoose models reside in `service/src/schema/`.
   - Ensure unique indexes (e.g., `invoice_no`, `plate_number`, `id_company`, `email`) are maintained.
   - Use `express-async-errors` so async errors in route handlers bubble up to the centralized error middleware.

4. **PDF Generation**:
   - Invoice and Quotation PDF exports rely on Mustache templates in `service/template/` compiled via `html-pdf`.
   - Keep HTML templates clean and maintain inline CSS compatibility suitable for PDF rendering.

### Frontend Guidelines (`app/`)
1. **UI Components & Styling**:
   - UI uses **Ant Design (`antd`)** and `styled-components`. Follow existing component styling patterns.
   - Do NOT introduce utility-first CSS frameworks like Tailwind unless requested.

2. **State Management & Routing**:
   - Use Redux for global app state (`app/src/redux`).
   - New screens MUST be added to [Route.js](file:///Users/Boss/Desktop/workspace-ai/insurance/app/src/route/Route.js) wrapped with `<PrivateRoutes>` if protected.

3. **Environment Management**:
   - Use `yarn env:dev`, `yarn env:prod`, or `yarn env:docker` to switch environment configurations before building/running.

---

## 🧪 Verification & Testing Rules

When modifying or adding features:
1. Always test backend endpoints or run `yarn test` inside `service/`.
2. Ensure TypeScript compilation passes without errors (`npx tsc --noEmit` or `yarn build`).
3. Verify frontend route additions and component imports compile cleanly (`yarn build`).

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes_tool` or `query_graph_tool` instead of Grep
- **Understanding impact**: `get_impact_radius_tool` instead of manually tracing imports
- **Code review**: `detect_changes_tool` + `get_review_context_tool` instead of reading entire files
- **Finding relationships**: `query_graph_tool` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview_tool` + `list_communities_tool`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
| ------ | ---------- |
| `detect_changes_tool` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context_tool` | Need source snippets for review — token-efficient |
| `get_impact_radius_tool` | Understanding blast radius of a change |
| `get_affected_flows_tool` | Finding which execution paths are impacted |
| `query_graph_tool` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes_tool` | Finding functions/classes by name or keyword |
| `get_architecture_overview_tool` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes_tool` for code review.
3. Use `get_affected_flows_tool` to understand impact.
4. Use `query_graph_tool` pattern="tests_for" to check coverage.
