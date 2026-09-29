import Navbar from "../components/Navbar";
import Connexion from "../pages/Auth/Connexion";
import RandomInfos from "../components/RandomInfos";
import GenresList from "../components/GenresList";

function GenresPage() {
  return (
    <div className="header-connexion">
      <div className="aside-container">
        <Connexion />
        <RandomInfos />
      </div>
      <Navbar />
      <div className="genres-page">
        <h2>Punk Genres</h2>
        <GenresList />
      </div>
    </div>
  );
}

export default GenresPage;
