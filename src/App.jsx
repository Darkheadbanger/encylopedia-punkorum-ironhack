import { useEffect, useState } from "react";
import axios from "axios";
import HomePage from "./layouts/HomePage.jsx";
import Routers from "./Routers.jsx"

function App() {
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
      {/* <HomePage /> */}
      <Routers bands={bands} />
    </>
  );
}

export default App;
