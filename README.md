# Welcome

This project is a React application built with Vite for the frontend and a Fastify server for the backend. The entire project is written in TypeScript. The backend does not use a database; instead, it stores all data in memory. This guide will help you set up and run the project on your local machine.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Apps](#running-the-apps)
- [Scripts](#scripts)
- [Testing](#testing)
- [Notes](#notes)

## Prerequisites
- Node.js >= 18.x
- pnpm package manager
 
## Installation
Follow these steps to install dependencies and set up your project:

Install dependencies using pnpm:

```bash
pnpm install
```

## Running the Apps

To start the project, you need to run both the frontend and backend development servers. Open two terminal windows or use a terminal multiplexer like tmux or screen.

### Frontend
1. Navigate to the project directory.
2. Start the frontend server:
```bash
pnpm dev
```
The frontend server will start on http://localhost:5173.

### Backend
1. Navigate to the project directory.
2. Start the backend server:
```bash
pnpm dev:api
```

The backend server will start on http://localhost:3000.

## Scripts
The project includes several npm scripts for common tasks:

- `pnpm dev`: Starts the frontend development server.
- `pnpm dev:api`: Starts the backend development server.
- `pnpm build`: Compiles TypeScript and builds the frontend for production.
- `pnpm lint`: Lints the codebase using ESLint.
- `pnpm format`: Formats the code using Prettier.
- `pnpm preview`: Previews the built frontend.
- `pnpm test`: Runs the tests using Playwright.

## Testing

To run the tests, ensure that both the frontend and backend servers are running. You can then run the test suite:

```bash
pnpm test
```

## Notes

- The backend does not use a database. All todos are stored in memory as `let todos = []`.
- To reset the todos state, you need to restart the backend development server.
- The project is set up using `pnpm` for package management to optimize the installation process and reduce disk space usage.