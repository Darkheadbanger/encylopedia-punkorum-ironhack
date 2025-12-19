# Encyclopedia Punkorum - Backend

Express.js backend API for the Encyclopedia Punkorum application.

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

Required environment variables:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `CORS_ORIGIN` - Allowed CORS origin (frontend URL)

### Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

### Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test:watch
```

### Linting

Check for linting errors:
```bash
npm run lint
```

Fix linting errors automatically:
```bash
npm run lint:fix
```

## API Structure

```
backend/
├── src/
│   ├── server.js           # Entry point
│   ├── routes/             # API routes
│   │   ├── bands.js        # Band-related routes
│   │   ├── albums.js       # Album-related routes
│   │   └── index.js        # Route aggregator
│   ├── controllers/        # Request handlers
│   │   ├── bandController.js
│   │   └── albumController.js
│   ├── models/             # Database models
│   │   ├── Band.js
│   │   └── Album.js
│   ├── middleware/         # Custom middleware
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── config/             # Configuration files
│   │   └── database.js
│   └── utils/              # Utility functions
│       └── helpers.js
├── .env.example            # Environment variables template
├── .eslintrc.json          # ESLint configuration
└── package.json            # Dependencies and scripts
```

## API Endpoints (Planned)

### Bands
- `GET /api/bands` - Get all bands
- `GET /api/bands/:id` - Get band by ID
- `POST /api/bands` - Create new band
- `PUT /api/bands/:id` - Update band
- `DELETE /api/bands/:id` - Delete band

### Albums
- `GET /api/albums` - Get all albums
- `GET /api/albums/:id` - Get album by ID
- `POST /api/albums` - Create new album
- `PUT /api/albums/:id` - Update album
- `DELETE /api/albums/:id` - Delete album

## Technologies

- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database and ODM
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Express Validator** - Input validation
- **Jest** - Testing framework
- **ESLint** - Code linting
