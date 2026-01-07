import { useEffect, useState } from "react";
import HomePage from "./layouts/HomePage.jsx";
import Routers from "./Routers.jsx"
import { getAllBands } from "./services/api.js";

function App() {
  const [bands, setBands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBands()
      .then(allBands => {
        setBands(allBands);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading bands:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{color: 'white', textAlign: 'center', marginTop: '2rem'}}>Loading Encyclopedia Punkorum...</div>;
  }

  return (
    <>
      {/* <HomePage /> */}
      <Routers bands={bands} />
    </>
  );
}

export default App;
