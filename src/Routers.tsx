import type { Band, SetBands } from "./types";
import {Routes, Route} from "react-router-dom"
import HomePage from "./layouts/HomePage";
import BandsPage from "./layouts/BandsPage";
import ErrorPage from "./layouts/ErrorPage"
import BandsIdPage from "./layouts/BandsIdPage";
import AddBand from "./layouts/AddBand"
import UpdateBand from "./layouts/UpdateBand";
import HelpPage from "./layouts/HelpPage";
import RulesPage from "./layouts/RulesPage";
import StorePage from "./layouts/StorePage";
import ForumPage from "./layouts/ForumPage";

function Routers({bands, setBands}: { bands: Band[]; setBands: SetBands }) {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage bands={bands}/> }/>
        <Route path="/bands" element={<BandsPage bands={bands} setBands={setBands}/>} />
        <Route path="/bands/:bandsId" element={<BandsIdPage bands={bands}/>} />
        <Route path="/addBand" element={<AddBand setBands={setBands}/>} />
        <Route path="/updateBand/:updateId" element={<UpdateBand bands={bands} setBands={setBands}/>} />
        <Route path="/help" element={<HelpPage/>} />
        <Route path="/rules" element={<RulesPage/>} />
        <Route path="/store" element={<StorePage/>} />
        <Route path="/forum" element={<ForumPage/>} />
        <Route path="*" element={<ErrorPage/>}/>
      </Routes>
    </>
  )
}

export default Routers
