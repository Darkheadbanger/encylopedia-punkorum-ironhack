# Encyclopedia Punkorum — Front end

A collaborative encyclopedia of punk bands. Anyone can browse the bands, their albums,
members and genres. Members can add and edit bands, import a band from MusicBrainz, and
write reviews with a rating.

**Live site:** https://encyclopediapunkorum.netlify.app
**API (back end):** [encyclopedia-punkorum-ironhack-backend](https://github.com/Darkheadbanger/encyclopedia-punkorum-ironhack-backend)

> The API runs on Render's free plan and sleeps when nobody uses it. The first visit can
> take up to a minute while it wakes up; the page says so instead of staying blank.

## Tech stack

| Part | Tools |
|---|---|
| UI | React 19, TypeScript, plain CSS (one stylesheet per component) |
| Routing | React Router 7 |
| HTTP | axios |
| Build | Vite |
| Tests | Vitest, React Testing Library, user-event, MSW (fake API), jsdom |
| Quality | ESLint, `tsc` type checking |
| Hosting | Netlify |

## Run it locally

The back end must be running first (port 3001, see its README).

```bash
npm install
npm run dev        # http://localhost:5173
npm run test:run   # all the tests, once
npm test           # tests in watch mode
npm run typecheck  # TypeScript check, emits nothing
npm run lint       # ESLint
npm run build      # production build in dist/
```

## Configuration

Create a `.env` file at the root (it is never committed):

```bash
VITE_LOCAL_SERVER_URL=http://localhost:3001
```

| Variable | Role | Default |
|---|---|---|
| `VITE_LOCAL_SERVER_URL` | Address of the Express API | `http://localhost:3001` |

⚠️ Every `VITE_` variable is built into the JavaScript bundle, so **any visitor can read
it**. Only public values go here: never a password, a secret key or the MongoDB URI.
On Netlify, the variable is set to the Render URL of the API.

## Pages and routes

| Path | Page | Access |
|---|---|---|
| `/` | Home: number of bands, shortcuts | Public |
| `/bands` | All bands in a sortable table | Public |
| `/bands/:bandsId` | One band: details, discography, members, reviews | Public |
| `/genres` | Punk genres, with filtering | Public |
| `/reviews` | Latest and top rated reviews | Public |
| `/search` | Search the encyclopedia (bands, genres, albums, labels...) | Public |
| `/signup` | Create an account | Public |
| `/addBand` | Add a band | **Members only** |
| `/updateBand/:updateId` | Edit a band | **Members only** |
| `/help`, `/rules`, `/store`, `/forum` | Static pages | Public |
| `*` | 404 page | Public |

Members-only pages are wrapped in `PrivateRoute`: a visitor who is not logged in is
redirected to the home page. The API refuses the write anyway; the redirection only
spares the visitor a form that would fail.

## Authentication

- **Login / signup** go through `AuthContext` (`src/context/AuthContext.tsx`), which shares
  the logged-in user with the whole app.
- The **JWT** returned by the API is stored in `localStorage`, so a refresh does not log
  the user out.
- It is **never trusted on its own**: on startup the app asks the API (`GET /auth/verify`)
  who the token belongs to. A token the server refuses (expired, forged, deleted account)
  is thrown away.
- An **axios interceptor** (`src/services/api.ts`) adds `Authorization: Bearer <token>` to
  every request.
- Edit and Delete buttons on a review only appear for its author; the API checks it again
  and answers `403` otherwise.

## Project structure

```
src/
├── App.tsx              Loads the bands, shows a loading message while the API wakes up
├── Routers.tsx          All the routes
├── main.tsx             Entry point
├── types.ts             Shared TypeScript types (Band, Review, AuthUser...)
├── components/          Reusable pieces: Navbar, BandsList, BandReviews, forms, PrivateRoute...
├── layouts/             One file per page (HomePage, BandsPage, AddBand, ReviewsPage...)
├── pages/Auth/          Login panel and signup page
├── context/             AuthContext: who is logged in
├── services/            api.ts (every call to the API) and error messages
├── data/                Static data (punk genres)
├── styles/              One CSS file per component or page
└── test/                Test helpers: fake API server (MSW), fixtures, render helper
```

Each component has its test file next to it (`BandsList.tsx` → `BandsList.test.tsx`).

## Tests

```bash
npm run test:run
```

About 260 tests. Components are rendered in jsdom with React Testing Library, and MSW
answers the HTTP calls with fake data, so the tests never need the real API or a
database. They cover rendering, forms, routing, private routes, authentication and the
API service.

## Deployment

- Hosted on **Netlify**, rebuilt automatically on every push to `master`.
- Build command: `npm run build`, published folder: `dist`.
- `public/_redirects` sends every path to `index.html`, so a refresh on `/bands/123`
  works instead of returning a Netlify 404 (React Router handles the route in the browser).
- The API is on **Render** and the database on **MongoDB Atlas**; the API only accepts
  requests from the Netlify address (CORS).

## Accessibility

- Every form field has a `<label>` linked with `htmlFor`.
- Error messages use `role="alert"` so screen readers announce them.
- `aria-` attributes on interactive elements, tabs and regions.
- The bands list is a real `<table>` with headers.

Known issue: on the Reviews page, some band links have a low contrast once visited.

## Credits

- Signup page artwork: [Freepik](https://www.freepik.com/) — used under the Freepik Free License, attribution required.
- Band data and artwork: imported from [MusicBrainz](https://musicbrainz.org/).

## Author

David Bouhaben — Ironhack Web Development bootcamp (MERN), 2026.
