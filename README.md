# 2PM

2PM is an open source social platform designed to help people connect with their friends and family.

It uses a powerful framework that allows the use of AI bots to interact with data, play games and perform tasks

## Project Structure

- `apps/web`: Next.js frontend application
- `apps/api`: NestJS backend API
- `apps/cli`: Command-line interface tools
- `packages/ui`: Interface components built with Storybook
- `packages/core`: Shared libraries and modules

## Technologies

- **Frontend**: Next.js, React, TypeScript
- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time Communication**: Socket.IO
- **Package Management**: Bun

## Getting Started

This is a monorepo for a full-stack application with Next.js frontend, NestJS API backend, and supporting services.

There is a script in the root of the repo `./start` which loads each of the apps in it's own Tmux session, with the socket set to `2pm`

I switch between apps using `CTRL+B s`

NX can also be used for those that don't use Tmux, though I haven't configured this

### Prerequisites

- Node.js (recommended version in `.nvmrc`)
- Bun package manager
- PostgreSQL

### Installation

<img src="./assets/install.gif" width="600" />

1. Install dependencies:

```bash
bun install
```

2. Initialise library database

```bash
# Ensure Git LFS is installed
git lfs install

# Initialize LFS for the repo (if not already done)
git lfs install --local

# Pull the specific LFS file
git lfs pull --include="2pm_library.dump"
```

Then restore the [sql dump](./2pm_library.dump) to your Postgres instance

3. Initialise the app database

`cd packages/core` package and run either `bun setup`, or

```bash
bun niko db create
bun drizzle:app push
bun niko db seed
```

4. Set up environment variables:

   - Copy `.env.example` to `.env` in each app directory
   - Update with your configuration

### Running the Project

Start the development servers for all applications:

```bash
# Start the entire stack (from project root)
./start
```

## Development

### URLs

- Application: http://localhost:3000
- Storybook UI: http://localhost:3001
- Swagger UI (API documentation): http://localhost:3002/docs
- Bull Dashboard: http://localhost:3002/queues

## Testing

Each application has its own testing configuration. Run tests from the individual app directories.

## License

This project is open sourced under the MIT License, with a single provision that servers leave an attribution to the original project

See the [LICENSE](LICENSE) file for details.
