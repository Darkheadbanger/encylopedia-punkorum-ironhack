import "../../styles/Connexion.css";

function Connexion() {
  // No authentication yet: stop the browser from reloading the whole app on submit
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <aside className="connexion-container">
      <form className="connexion-info" onSubmit={handleSubmit}>
        <label htmlFor="username">Username or email</label>
        <input type="text" name="username" id="username" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Login</button>
        {/* Not built yet: plain text rather than links that go nowhere */}
        <div className="connexion-links">
          <span>Register</span>
          <span>Forgot login?</span>
        </div>
      </form>
    </aside>
  );
}

export default Connexion;
