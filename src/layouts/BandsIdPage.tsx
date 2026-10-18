import { useParams } from "react-router-dom";
import type { Band, SetBands } from "../types";
import "../styles/BandsList.css";
import Navbar from "../components/Navbar";
import LoginPanel from "../pages/Auth/LoginPanel";
import RandomInfos from "../components/RandomInfos";
import BandsId from "../components/BandsId";

function BandsIdPage({bands, setBands}: { bands: Band[]; setBands: SetBands }) {
  // The key is what makes going from one band to another a fresh component rather
  // than the same one carrying the previous band's state. Without it, a band whose
  // sleeve failed to load left the NEXT band showing "Photos coming soon" over a
  // perfectly good image, and an open tab or a delete error carried over too.
  // Resetting each piece in an effect would work, but this is one line and cannot
  // forget a field.
  const { bandsId } = useParams();

  return (
    <>
      <div className="header-login-panel">
        <div className="aside-container">
          <LoginPanel />
          <RandomInfos />
        </div>
        <Navbar />
        <div className="main-page">
           <BandsId key={bandsId} bands={bands} setBands={setBands} />
        </div>
      </div>
    </>
  );
}

export default BandsIdPage;
