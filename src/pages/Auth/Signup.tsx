// Creating an account. A successful signup logs the visitor straight in.

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Connexion.css";
import "../../styles/Signup.css";

const MIN_PASSWORD = 8; // must match the User schema on the backend

// The wall of a venue toilet, circa 1977. Names only: a band photo would be
// someone else's copyright, and a xeroxed name is what punk actually printed.
const FLYERS = [
  "Ramones", "Sex Pistols", "The Clash", "Dead Kennedys", "Black Flag",
  "Crass", "Buzzcocks", "Misfits", "Bad Brains", "The Damned",
  "X-Ray Spex", "The Slits", "Minor Threat", "Iggy & The Stooges",
  "Patti Smith", "Wire", "Germs", "Sham 69", "Stiff Little Fingers",
  "Richard Hell", "Television", "The Adverts", "Discharge", "The Exploited",
];

function Signup() {
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // The server checks this too; catching it here saves a pointless round trip.
    if (password.length < MIN_PASSWORD) {
      setError(`The password must be at least ${MIN_PASSWORD} characters.`);
      return;
    }

    setBusy(true);
    try {
      await signup(email, password, username);
    } catch (problem) {
      setError((problem as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="signup-page">
      <ul className="flyer-wall" aria-label="Punk flyer wall">
        {FLYERS.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>

      <aside className="connexion-container signup-card">
      <form className="connexion-info" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          autoComplete="nickname"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit" disabled={busy}>Create account</button>
        {error && <p className="connexion-error" role="alert">{error}</p>}
        <div className="connexion-links">
          <Link to="/">Already have an account?</Link>
        </div>
      </form>
      </aside>

      <p className="artwork-credit">
        Artwork by <a href="https://www.freepik.com/" target="_blank" rel="noreferrer">Freepik</a>
      </p>
    </div>
  );
}

export default Signup;
