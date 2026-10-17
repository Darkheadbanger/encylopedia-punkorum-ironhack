// The login panel, shown on every page.
//
// Two states: the form when logged out, the account and a logout button when in.

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/LoginPanel.css";

function LoginPanel() {
  const { user, isLoggedIn, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email, password);
    } catch {
      // Deliberately vague, like the API: naming the wrong field would tell a
      // stranger which accounts exist.
      setError("Incorrect email or password.");
    } finally {
      setBusy(false);
    }
  };

  if (isLoggedIn) {
    return (
      <aside className="login-panel-container">
        <div className="login-panel-info">
          <p className="login-panel-greeting">Logged in as <strong>{user?.username}</strong></p>
          <button type="button" onClick={logout}>Logout</button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="login-panel-container">
      <form className="login-panel-info" onSubmit={handleSubmit}>
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
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit" disabled={busy}>Login</button>
        {error && <p className="login-panel-error" role="alert">{error}</p>}
        <div className="login-panel-links">
          <Link to="/signup">Create an account</Link>
        </div>
      </form>
    </aside>
  );
}

export default LoginPanel;
