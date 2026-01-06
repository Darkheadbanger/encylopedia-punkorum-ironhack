import React from "react";
// import "../styles/RandomInfo.css";

function MainPage() {
  // const [count, setCount] = useState(0)
  //  const [selectSearch, setSelectSearch] = useState("Bands");
  return (
    <>
        <main className="main-content">
            <section className="main-section-container">
                <p>There are currently {194088} bands, in Encyclopaedia Punkorum.</p>

                <div className="main-choice">
                    {/* Link */}
                    <div className="bands">Bands</div>
                    <div className="bands">Genres</div>
                </div>
            </section>
        </main>
    </>
  );
}

export default MainPage;
