import React from "react";
import Navbar from "../components/Navbar.jsx";
import Connexion from "../pages/Auth/Connexion.jsx";
import RandomInfos from "../components/RandomInfos.jsx";
import MainPage from "../components/MainPage.jsx";

function AddBand({bands}) {
  return (
    <>
      <div header className="header-connexion">
        <div className="aside-container">
          <Connexion />
          <RandomInfos />
        </div>
        <Navbar />
        <div className="main-page">
          {/* <MainPage bands={bands}/> */}
        </div>
      </div>
    </>
  );
}

export default AddBand;
