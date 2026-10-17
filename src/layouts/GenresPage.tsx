import Navbar from "../components/Navbar";
import LoginPanel from "../pages/Auth/LoginPanel";
import RandomInfos from "../components/RandomInfos";
import GenresList from "../components/GenresList";

function GenresPage() {
  return (
    <div className="header-login-panel">
      <div className="aside-container">
        <LoginPanel />
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
