import React from "react";
import Navbar from "../components/Navbar.jsx";
import Connexion from "../pages/Auth/Connexion.jsx";
import RandomInfos from "../components/RandomInfos.jsx";
// Imported under another name: calling it <ErrorPage /> here would render this layout itself, forever
import NotFound from "../components/ErrorPage.jsx";

function ErrorPage() {
  return (
    <>
      <div className="header-connexion">
        <div className="aside-container">
          <Connexion />
          <RandomInfos />
        </div>
        <Navbar />
        <div className="main-page">
          <NotFound />
        </div>
      </div>
    </>
  );
}

export default ErrorPage;
