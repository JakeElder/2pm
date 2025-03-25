# 2pm

A monorepo for a full-stack application with Next.js frontend, NestJS API backend, and supporting services.

## Project Structure

- `apps/web`: Next.js frontend application
- `apps/api`: NestJS backend API
- `apps/character-engine`: Service for character interactions
- `apps/cli`: Command-line interface tools
- `apps/mailer`: Email service
- `packages/`: Shared libraries and modules

## Technologies

- **Frontend**: Next.js, React, TypeScript
- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time Communication**: Socket.IO
- **Package Management**: Bun

## Getting Started

### Prerequisites

- Node.js (recommended version in `.nvmrc`)
- Bun package manager
- PostgreSQL

### Installation

1. Install dependencies:

```bash
bun install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env` in each app directory
   - Update with your configuration

### Running the Project

Start the development server for all applications:

```bash
# Start the entire stack
./start

# Or use tmuxinator
tmuxinator start 2pm
```

To run individual applications:

```bash
# Web frontend
cd apps/web
bun dev

# API backend
cd apps/api
bun start:dev
```

## Development

### Code Generation

The project uses code generators to streamline development:

```bash
# Generate a new module
bun generate:module

# Generate API client from controllers
bun generate:api-client

# Watch for controller changes and auto-generate API client
bun watch:controllers
```

### API Documentation

API documentation is available when the API is running:
- Swagger UI: http://localhost:3001/docs

## Testing

Each application has its own testing configuration. Run tests from the individual app directories.

## Project Architecture

The system uses a microservices architecture with:
- NestJS modular backend services
- Socket.IO for real-time communication
- Messaging and event-driven architecture

## License

See the [LICENSE](LICENSE) file for details.
