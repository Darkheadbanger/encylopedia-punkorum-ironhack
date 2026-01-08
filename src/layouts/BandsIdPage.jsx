import React from "react";
import "../styles/BandsList.css";
import Navbar from "../components/Navbar.jsx";
import Connexion from "../pages/Auth/Connexion.jsx";
import RandomInfos from "../components/RandomInfos.jsx";
import BandsId from "../components/BandsId.jsx";

function BandsIdPage({bands, setBands}) {
  return (
    <>
      <div header className="header-connexion">
        <div className="aside-container">
          <Connexion />
          <RandomInfos />
        </div>
        <Navbar />
        <div className="main-page">
           <BandsId bands={bands} setBands={setBands}></BandsId>
        </div>
      </div>
    </>
  );
}

export default BandsIdPage;
