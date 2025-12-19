# Getting Started with Encyclopedia Punkorum

Welcome to Encyclopedia Punkorum! This guide will help you get started with development.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- A code editor like **VS Code** - [Download](https://code.visualstudio.com/)

## Project Structure Overview

```
encylopedia-punkorum-ironhack/
├── frontend/           # React application
├── backend/            # Express API server
├── README.md           # Main documentation
├── ARCHITECTURE.md     # System design details
├── CONTRIBUTING.md     # Contribution guidelines
└── .gitignore          # Git ignore rules
```

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Darkheadbanger/encylopedia-punkorum-ironhack.git
cd encylopedia-punkorum-ironhack
```

### 2. Set Up the Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# Set MONGODB_URI to your MongoDB connection string
```

### 3. Set Up the Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local if needed (defaults should work)
```

### 4. Start MongoDB

If using local MongoDB:
```bash
# On macOS (with Homebrew)
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
# Start MongoDB from Services or run mongod.exe
```

Or use MongoDB Atlas (cloud) - update MONGODB_URI in backend/.env

### 5. Run the Application

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend will start on http://localhost:5000

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```
Frontend will start on http://localhost:3000

## Next Steps - Implementation

Now that the project structure is ready, here's what to implement next:

### Backend (Priority Order)

1. **Database Connection** (`backend/src/config/database.js`)
   - Set up Mongoose connection to MongoDB
   - Add connection error handling

2. **Models** (`backend/src/models/`)
   - Define Band schema
   - Define Album schema
   - Add validation rules

3. **Server Setup** (`backend/src/server.js`)
   - Initialize Express app
   - Configure middleware (helmet, cors, morgan)
   - Connect to database
   - Set up routes
   - Add error handling

4. **Controllers** (`backend/src/controllers/`)
   - Implement CRUD operations for bands
   - Implement CRUD operations for albums

5. **Routes** (`backend/src/routes/`)
   - Define band routes
   - Define album routes
   - Add validation middleware

### Frontend (Priority Order)

1. **Entry Point** (`frontend/src/index.js`)
   - Set up React root
   - Import styles

2. **Main App** (`frontend/src/App.jsx`)
   - Set up React Router
   - Create basic layout
   - Add navigation

3. **API Services** (`frontend/src/services/`)
   - Configure Axios instance
   - Create band service methods
   - Create album service methods

4. **Components**
   - Start with Navbar
   - Create BandCard for displaying band info
   - Create AlbumCard for displaying album info
   - Add SearchBar component

5. **Pages**
   - Home page (welcome + featured content)
   - Band list page
   - Band detail page
   - Album list page
   - Album detail page

## Development Workflow

### Making Changes

1. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Test your changes:
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

4. Lint your code:
```bash
# Backend
cd backend
npm run lint:fix

# Frontend
cd frontend
npm run lint:fix
```

5. Commit and push:
```bash
git add .
git commit -m "Add your descriptive message"
git push origin feature/your-feature-name
```

6. Create a Pull Request on GitHub

## Useful Commands

### Backend
```bash
npm start          # Start in production mode
npm run dev        # Start with nodemon (auto-reload)
npm test           # Run tests
npm run lint       # Check code style
npm run lint:fix   # Fix code style issues
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Check code style
npm run lint:fix   # Fix code style issues
```

## Recommended VS Code Extensions

- **ESLint** - For linting JavaScript
- **Prettier** - Code formatter
- **ES7+ React/Redux/React-Native snippets** - React code snippets
- **GitLens** - Git integration
- **MongoDB for VS Code** - MongoDB integration
- **Thunder Client** or **REST Client** - For testing API endpoints

## Debugging

### Backend Debugging
Add to VS Code `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/server.js",
      "envFile": "${workspaceFolder}/backend/.env"
    }
  ]
}
```

### Frontend Debugging
Use Chrome DevTools or React Developer Tools browser extension

## Common Issues

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Issues
- Check if MongoDB is running: `mongosh` or `mongo`
- Verify connection string in `.env`
- Check firewall settings
- For Atlas: verify IP whitelist and credentials

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Resources

### Learning Resources
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [MongoDB Tutorial](https://docs.mongodb.com/manual/tutorial/)

### Inspiration
- [Encyclopaedia Metallum](https://www.metal-archives.com/) - The metal music archive that inspired this project

## Getting Help

- Check the [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- Read [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
- Open an issue on GitHub for bugs or questions
- Review existing code and comments for guidance

## What's Next?

1. Start with implementing the backend database connection and models
2. Build the basic API endpoints
3. Test API with tools like Postman or Thunder Client
4. Create the React frontend components
5. Connect frontend to backend API
6. Add styling and improve UX
7. Add more features (search, filters, etc.)

Happy coding! 🎸🤘
