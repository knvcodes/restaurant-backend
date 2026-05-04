# Restaurant Backend

Express + TypeScript backend for restaurant data, using MongoDB with Mongoose and `migrate-mongo` for database migrations.

## Tech Stack

- Node.js
- Express 5
- TypeScript
- MongoDB
- Mongoose
- migrate-mongo
- Pino logger
- CORS

## Project Structure

```text
.
├── migrations/                  # migrate-mongo migration files
├── scripts/                     # local utility scripts
│   ├── generate.ts              # module generator
│   ├── migrate.ts               # custom migration helper
│   └── migrations/              # custom migration functions
├── src/
│   ├── config/                  # app/database config
│   ├── modules/                 # feature modules
│   │   ├── dishes/
│   │   └── restaurants/
│   ├── utils/                   # helpers, logger, static data
│   ├── routes.ts                # API route registration
│   └── server.ts                # app entrypoint
├── env.example                  # environment variable example
├── migrate-mongo-config.js      # migrate-mongo config
├── package.json
└── tsconfig.json
```

## Prerequisites

Install these before running the project:

- Node.js 18 or newer
- npm or Yarn
- MongoDB running locally or a MongoDB connection string

## Environment Setup

Create a `.env` file in the project root:

```bash
cp env.example .env
```

Update `.env` with your MongoDB configuration:

```env
MONGO_URI=mongodb://127.0.0.1:27017
DB_NAME=restaurant_db
```

Environment variables:

| Variable      | Required | Description                                                   |
| ------------- | -------- | ------------------------------------------------------------- |
| `MONGO_URI`   | Yes      | MongoDB connection URL used by the app and migrations.        |
| `DB_NAME`     | Yes      | Database name used by `migrate-mongo`.                        |
| `MODULE_PATH` | No       | Custom path for generated modules. Defaults to `src/modules`. |

## Installation

Using npm:

```bash
npm install
```

Using Yarn:

```bash
yarn install
```

## Run the App

Start the development server with file watching:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:3000
```

Root health check:

```bash
curl http://localhost:3000
```

## Available Scripts

| Command                          | Description                                                               |
| -------------------------------- | ------------------------------------------------------------------------- |
| `npm run dev`                    | Starts the development server with `tsx watch src/server.ts`.             |
| `npm run build`                  | Runs the TypeScript compiler.                                             |
| `npm run start`                  | Runs `node dist/server.js`. Use after producing a compiled `dist` build.  |
| `npm run db:sync`                | Rolls the latest migration down and then runs migrations up again.        |
| `npm run generate <module-name>` | Generates a controller, service, routes file, and model for a new module. |

Yarn equivalents:

```bash
yarn dev
yarn build
yarn start
yarn db:sync
yarn generate <module-name>
```

## API Endpoints

Base URL:

```text
http://localhost:3000/api
```

## Database Migrations

This project uses `migrate-mongo`. The config file is:

```text
migrate-mongo-config.js
```

Migration files live in:

```text
migrations/
```

Useful migration commands:

```bash
npx migrate-mongo status
npx migrate-mongo up
npx migrate-mongo down
npx migrate-mongo create migration-name
```

Project shortcut:

```bash
npm run db:sync
```

`db:sync` runs:

```bash
npx migrate-mongo down && npx migrate-mongo up
```

Use this carefully because it rolls back the latest migration before applying migrations again.

## Generate a New Module

Generate a module under `src/modules`:

```bash
npm run generate dishes
```

This creates:

```text
src/modules/dishes/dishes.controller.ts
src/modules/dishes/dishes.service.ts
src/modules/dishes/dishes.routes.ts
src/modules/dishes/dishes.model.ts
```

If a module already exists, the generator stops to avoid overwriting files. To use a custom module path:

```bash
MODULE_PATH=src/modules npm run generate orders
```

After generating a module, register its routes in:

```text
src/routes.ts
```

## CORS

The server currently allows requests from:

```text
http://localhost:3001
http://127.0.0.1:3001
```

Allowed methods:

```text
GET, POST, PUT, DELETE, OPTIONS
```

## Development Notes

- The app listens on port `3000`.
- MongoDB indexes are synced on startup with `mongoose.connection.syncIndexes()`.
- Path aliases are configured from the project root with `baseUrl: "./"` and `paths: { "*": ["src/*"] }`.
- `npm run start` expects `dist/server.js`. The current TypeScript config has `noEmit: true`, so adjust the build config if you want to produce a production `dist` folder.

### Start minio server and install

docker run -p 9000:9000 -p 9001:9001 \
 --name minio \
 -v ~/minio-data:/data \
 -e "MINIO_ROOT_USER=admin" \
 -e "MINIO_ROOT_PASSWORD=password123" \
 quay.io/minio/minio server /data --console-address ":9001"

Access:
API: http://localhost:9000
Console: http://localhost:9001 (login: admin / password123)
Go create a bucket called my-bucket in the console before running code.

npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
