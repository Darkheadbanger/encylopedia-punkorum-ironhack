import { useEffect, useState } from "react";
import type { Band } from "./types";
import Routers from "./Routers"
import { getAllBands } from "./services/api";

function App() {
  const [bands, setBands] = useState<Band[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllBands()
      .then(({ bands: allBands, musicBrainzFailed }) => {
        setBands(allBands);
        if (musicBrainzFailed) {
          setError("MusicBrainz is unavailable — showing your own bands only.");
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading bands:', error);
        // The local server is the one that really matters: tell the user instead of
        // showing an empty site with no explanation.
        setError("Could not load the bands. Is the local server running?");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="app-loading">Loading Encyclopedia Punkorum...</div>;
  }

  return (
    <>
      {error && <p className="app-error" role="alert">{error}</p>}
      <Routers bands={bands} setBands={setBands}/>
    </>
  );
}

export default App;
