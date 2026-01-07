import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Connexion from "../pages/Auth/Connexion.jsx";
import RandomInfos from "../components/RandomInfos.jsx";
import axios from "axios";
import BandsList from "../components/BandsList.jsx";
import "../styles/BandsPage.css"

function BandsPage() {
  const [bands, setBands] = useState([]);

  useEffect(() => {
    const urlMusicBrainzPunk = "https://musicbrainz.org/ws/2/artist?query=tag:%22hardcore%20punk%22%20AND%20tag:%22punk%22%20AND%20type:group&fmt=json&limit=100&offset=0";
    axios.get(urlMusicBrainzPunk)
    .then((response) => {
      setBands(response.data.artists);
    }).catch((error) => {
      console.error(error);
    })
    
  }, []);
  return (
    <>
      <div header className="header-connexion">
        <div className="aside-container">
          <Connexion />
          <RandomInfos />
        </div>
        <Navbar />
        <div className="bands-list-page">
          <p>There are currently {bands.length} bands in Encyclopaedia Punkorum.</p>
          {bands && bands.map((band) => {
            return <BandsList key={band.id} band={band} />
          })}
        </div>
      </div>
    </>
  );
}

export default BandsPage;
