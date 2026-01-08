import React from "react";
import Navbar from "../components/Navbar.jsx";
import Connexion from "../pages/Auth/Connexion.jsx";
import RandomInfos from "../components/RandomInfos.jsx";
import "../styles/AddBandForm.css"
import UpdateBandForm from "../components/UpdateBandForm.jsx";

function UpdateBand({bands, setBands}) {
  return (
    <>
      <div header className="header-connexion">
        <div className="aside-container">
          <Connexion />
          <RandomInfos />
        </div>
        <Navbar />
        <div className="main-page">
          <UpdateBandForm bands={bands} setBands={setBands}/>
        </div>
      </div>
    </>
  );
}

export default UpdateBand;
