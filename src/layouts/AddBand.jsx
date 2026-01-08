import React from "react";
import Navbar from "../components/Navbar.jsx";
import Connexion from "../pages/Auth/Connexion.jsx";
import RandomInfos from "../components/RandomInfos.jsx";
import "../styles/AddBandForm.css"
import AddBandForm from "../components/AddBandForm.jsx";

function AddBand({bands, setBands}) {
  return (
    <>
      <div header className="header-connexion">
        <div className="aside-container">
          <Connexion />
          <RandomInfos />
        </div>
        <Navbar />
        <div className="main-page">
          <AddBandForm bands={bands} setBands={setBands}/>
        </div>
      </div>
    </>
  );
}

export default AddBand;
