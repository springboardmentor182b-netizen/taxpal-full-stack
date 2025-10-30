# MEAN Stack Application

A full-stack web application built with the MEAN stack (MongoDB, Express.js, Angular, Node.js).

## Project Structure

```
mean-app/
├── client/                 # Angular Frontend
├── server/                 # Node + Express Backend
├── config/                 # Global configs (env, DB, etc.)
├── scripts/                # Deployment or automation scripts
├── docs/                   # Documentation, API specs
├── env.example             # Environment variables template
├── package.json            # Root-level scripts for convenience
└── README.md
```

## Prerequisites

- Node.js (>= 18.0.0)
- npm (>= 8.0.0)
- MongoDB (>= 4.4)
- Angular CLI (>= 17.0.0)

## Installation

1. Clone the repository
2. Install dependencies for all projects:
   ```bash
   npm run install:all
   ```

3. Copy environment variables:
   ```bash
   cp env.example .env
   ```

4. Update the `.env` file with your configuration

## Development

### Start both client and server:
```bash
npm start
```

### Start individually:
```bash
# Start server only
npm run server:dev

# Start client only
npm run client:start
```

## Building

```bash
# Build client for production
npm run build
```

## Testing

```bash
# Run all tests
npm test

# Run client tests only
npm run client:test

# Run server tests only
npm run server:test
```

## API Documentation

API documentation is available in the `docs/` folder.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT
