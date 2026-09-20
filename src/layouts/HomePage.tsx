import type { Band } from "../types";
import Navbar from "../components/Navbar";
import Connexion from "../pages/Auth/Connexion";
import RandomInfos from "../components/RandomInfos";
import MainPage from "../components/MainPage";

function HomePage({bands}: { bands: Band[] }) {
  return (
    <>
      <div className="header-connexion">
        <div className="aside-container">
          <Connexion />
          <RandomInfos />
        </div>
        <Navbar />
        <div className="main-page">
          <MainPage bands={bands}/>
        </div>
      </div>
    </>
  );
}

export default HomePage;
