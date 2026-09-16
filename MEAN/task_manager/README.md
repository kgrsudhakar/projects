# MEAN Task Manager

A complete beginner-friendly MEAN stack CRUD application.

## Stack
- MongoDB
- Express.js
- Angular 19
- Node.js

## Requirements
- Node.js 20+
- MongoDB running locally on port 27017
- npm

## Run backend
```bash
cd server
copy .env.example .env
npm install
npm run dev
```
API: http://localhost:5000/api/tasks

## Run frontend
Open another terminal:
```bash
cd client
npm install
npm start
```
Open http://localhost:4200

## API
GET /api/tasks
POST /api/tasks { "title": "Learn MEAN", "description": "Build CRUD" }
PUT /api/tasks/:id { "completed": true }
DELETE /api/tasks/:id
GET /api/health

## Architecture
Angular UI -> HttpClient -> Express REST API -> Mongoose -> MongoDB
