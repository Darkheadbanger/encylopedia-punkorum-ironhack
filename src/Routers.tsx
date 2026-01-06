import {Routes, Route} from "react-router-dom"
import HomePage from "./layouts/HomePage.jsx";
import BandsPage from "./layouts/BandsPage.jsx";
import ErrorPage from "./layouts/ErrorPage.jsx"

function Routers() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/bands" element={<BandsPage/>} />
        <Route path="*" element={<ErrorPage/>}/>
      </Routes>
    </>
  )
}

export default Routers
