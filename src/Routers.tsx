import {Routes, Route} from "react-router-dom"
import HomePage from "./layouts/HomePage.jsx";
import BandsPage from "./layouts/BandsPage.jsx";
import ErrorPage from "./layouts/ErrorPage.jsx"
import BandsIdPage from "./layouts/BandsIdPage.jsx";
import AddBand from "./layouts/AddBand.jsx"
import UpdateBand from "./layouts/UpdateBand.jsx";

function Routers({bands, setBands}: {bands: any, setBands: any}) {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/bands" element={<BandsPage bands={bands} setBands={setBands}/>} />
        <Route path="/bands/:bandsId" element={<BandsIdPage bands={bands} setBands={setBands}/>} />
        <Route path="/addBand" element={<AddBand bands={bands} setBands={setBands}/>} />
        <Route path="/updateBand/:updateId" element={<UpdateBand bands={bands} setBands={setBands}/>} />
        <Route path="*" element={<ErrorPage/>}/>
      </Routes>
    </>
  )
}

export default Routers
