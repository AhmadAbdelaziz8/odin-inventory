# Odin Inventory

A modern inventory management system for tracking swords and materials, built with React, TypeScript, and Express.

## Features

- 🗡️ Sword inventory management
- 🔧 Material tracking
- 🌓 Dark/Light mode
- 📱 Responsive design
- 🔄 Real-time updates

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Express + TypeScript + Prisma
- Database: PostgreSQL

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up the database:

   ```bash
   cd backend
   npx prisma migrate dev
   ```

4. Start the development servers:

   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory)
   npm run dev
   ```

5. Visit `http://localhost:5173` in your browser

## API Endpoints

- `GET /api/swords` - List all swords
- `POST /api/swords` - Create a new sword
- `GET /api/materials` - List all materials
- `POST /api/materials` - Create a new material

## License

MIT
