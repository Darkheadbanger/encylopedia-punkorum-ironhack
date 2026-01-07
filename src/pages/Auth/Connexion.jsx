import React from "react";
import "../../styles/Connexion.css";

function Connexion() {
  return (
    <aside className="connexion-container">
      <form className="connexion-info">
        <label htmlFor="username">Username or email</label>
        <input type="text" name="username" id="username" />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
        <button type="submit">Login</button>
        <div className="connexion-links">
          <a href="#">Register</a>
          <a href="#">Forgot login?</a>
        </div>
      </form>
    </aside>
  );
}

export default Connexion;
