# Encyclopedia Punkorum - Frontend

React frontend application for the Encyclopedia Punkorum.

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure your environment variables:

```bash
cp .env.example .env.local
```

Required environment variables:
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)

### Running the Application

Development mode:
```bash
npm start
```
Opens on [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
```

Builds the app for production to the `build` folder.

### Testing

```bash
npm test
```

Launches the test runner in interactive watch mode.

### Linting

Check for linting errors:
```bash
npm run lint
```

Fix linting errors automatically:
```bash
npm run lint:fix
```

## Project Structure

```
frontend/
├── public/
│   ├── index.html          # HTML template
│   ├── favicon.ico         # Favicon
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # Reusable React components
│   │   ├── Navbar.jsx
│   │   ├── BandCard.jsx
│   │   ├── AlbumCard.jsx
│   │   └── SearchBar.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── BandList.jsx
│   │   ├── BandDetail.jsx
│   │   ├── AlbumList.jsx
│   │   └── AlbumDetail.jsx
│   ├── services/           # API service functions
│   │   ├── api.js
│   │   ├── bandService.js
│   │   └── albumService.js
│   ├── context/            # React Context for state management
│   │   └── AppContext.jsx
│   ├── utils/              # Utility functions
│   │   └── helpers.js
│   ├── styles/             # CSS/styling files
│   │   ├── App.css
│   │   └── index.css
│   ├── App.jsx             # Main App component
│   └── index.js            # Entry point
├── .env.example            # Environment variables template
├── .eslintrc.json          # ESLint configuration
└── package.json            # Dependencies and scripts
```

## Technologies

- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Scripts** - Build tooling
- **ESLint** - Code linting

## Features (Planned)

- Browse punk bands and albums
- Search functionality
- Band and album detail pages
- Responsive design
- Dark theme (punk aesthetic)

## Available Scripts

### `npm start`
Runs the app in development mode. The page will reload when you make changes.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time.

## Learn More

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://create-react-app.dev/)
- [React Router Documentation](https://reactrouter.com/)
