import React from "react";
import "../styles/MainPage.css";

function MainPage() {
  return (
    <main className="main-content">
      <section className="main-section-container">
        <p>There are currently 194088 bands, in Encyclopaedia Punkorum.</p>
        <div className="main-choice">
          <button>Bands</button>
          <button>Genres</button>
        </div>
      </section>
    </main>
  );
}

export default MainPage;
