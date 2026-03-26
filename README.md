MEAN Stack Application
A full-stack web application built with the MEAN stack (MongoDB, Express.js, Angular, Node.js).

Project Structure
mean-app/
├── client/                 # Angular Frontend
├── server/                 # Node + Express Backend
├── config/                 # Global configs (env, DB, etc.)
├── scripts/                # Deployment or automation scripts
├── docs/                   # Documentation, API specs
├── env.example             # Environment variables template
├── package.json            # Root-level scripts for convenience
└── README.md
Prerequisites
Node.js (>= 18.0.0)
npm (>= 8.0.0)
MongoDB (>= 4.4)
Angular CLI (>= 17.0.0)
Installation
Clone the repository

Install dependencies for all projects:

npm run install:all
Copy environment variables:

cp env.example .env
Update the .env file with your configuration

Development
Start both client and server:
npm start
Start individually:
# Start server only
npm run server:dev

# Start client only
npm run client:start
Building
# Build client for production
npm run build
Testing
# Run all tests
npm test

# Run client tests only
npm run client:test

# Run server tests only
npm run server:test
API Documentation
API documentation is available in the docs/ folder.

Contributing
Fork the repository
Create a feature branch
Make your changes
Add tests
Submit a pull request
License
MIT
