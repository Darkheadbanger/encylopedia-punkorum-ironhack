import React from "react";
import Navbar from "../components/Navbar.jsx";
import Connexion from "../pages/Auth/Connexion.jsx";
import RandomInfos from "../components/RandomInfos.jsx";
import BandsList from "../components/BandsList.jsx";
import "../styles/BandsPage.css"

function BandsPage({bands, setBands}) {
  return (
    <>
      <div className="header-connexion">
        <div className="aside-container">
          <Connexion />
          <RandomInfos />
        </div>
        <Navbar />
        <div className="bands-list-page">
          <p>There are currently {bands.length} bands in Encyclopaedia Punkorum.</p>
          <table className="bands-table">
            <thead>
              <tr className="band-list-container">
                <th scope="col" className="band-head-list">Bands</th>
                <th scope="col" className="band-head-list">Country</th>
                <th scope="col" className="band-head-list">Genre</th>
                <th scope="col" className="band-head-list">Status</th>
              </tr>
            </thead>
            <tbody>
              {bands && bands.map((band) => {
                return <BandsList key={band.id} band={band} setBands={setBands} />
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default BandsPage;
