import {Routes, Route} from "react-router-dom"
import HomePage from "./layouts/HomePage.jsx";
import BandsPage from "./layouts/BandsPage.jsx";
import ErrorPage from "./layouts/ErrorPage.jsx"
import BandsIdPage from "./layouts/BandsIdPage.jsx";


function Routers({bands}: {bands: any}) {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/bands" element={<BandsPage bands={bands} />} />
        <Route path="/bands/:bandsId" element={<BandsIdPage bands={bands} />} />
        <Route path="*" element={<ErrorPage/>}/>
      </Routes>
    </>
  )
}

export default Routers
