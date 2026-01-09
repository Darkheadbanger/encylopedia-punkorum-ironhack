import React from "react";
import "../styles/MainPage.css";
import { Link } from "react-router-dom";

function MainPage({bands}) {
  return (
    <main className="main-content">
      <section className="main-section-container">
          <p>There are currently {bands.length} bands in Encyclopaedia Punkorum.</p>
        <div className="main-choice">
         <Link to="/bands" ><button>Bands</button></Link> 
          <button>Genres</button>
        </div>
      </section>
    </main>
  );
}

export default MainPage;
