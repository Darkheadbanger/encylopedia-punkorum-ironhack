# Encyclopedia Punkorum

A comprehensive encyclopedia for punk rock bands, albums, and artists - inspired by Encyclopaedia Metallum but focused on the punk music scene.

## Project Overview

This project is a full-stack web application that serves as a database and resource for punk rock music. Users can browse, search, and discover information about punk bands, their discographies, members, and more.

## Tech Stack

### Frontend
- **React** - UI library for building the user interface
- **React Router** - For client-side routing
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** (planned) - Database for storing band and album information

## Project Structure

```
encylopedia-punkorum-ironhack/
├── frontend/           # React frontend application
│   ├── public/         # Static files
│   ├── src/            # Source files
│   └── package.json    # Frontend dependencies
├── backend/            # Node.js/Express backend
│   ├── src/            # Source files
│   ├── routes/         # API routes
│   ├── models/         # Database models
│   ├── controllers/    # Route controllers
│   └── package.json    # Backend dependencies
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for database)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Darkheadbanger/encylopedia-punkorum-ironhack.git
cd encylopedia-punkorum-ironhack
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

#### Backend
```bash
cd backend
npm start
```
The backend server will start on `http://localhost:5000`

#### Frontend
```bash
cd frontend
npm start
```
The frontend application will start on `http://localhost:3000`

## Features (Planned)

- 🎸 Browse punk bands by name, country, or genre
- 💿 Explore band discographies
- 👥 View band member information and lineups
- 🔍 Advanced search functionality
- 📝 User reviews and ratings (future)
- 🎵 Links to music streaming platforms (future)

## Development

### Code Style
- ESLint for JavaScript linting
- Prettier for code formatting

### API Endpoints (Planned)
- `GET /api/bands` - Get all bands
- `GET /api/bands/:id` - Get specific band
- `GET /api/albums` - Get all albums
- `GET /api/albums/:id` - Get specific album
- `POST /api/bands` - Create new band
- `PUT /api/bands/:id` - Update band
- `DELETE /api/bands/:id` - Delete band

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [Encyclopaedia Metallum](https://www.metal-archives.com/)
- Built as a learning project for Ironhack bootcamp

## Contact

For questions or suggestions, please open an issue on GitHub.