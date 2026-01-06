// import { useState } from 'react'
import Navbar from "./components/Navbar.jsx"
import Connexion from "./pages/Auth/Connexion.jsx"
import RandomInfos from "./components/RandomInfos.jsx"
function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <div header className="header-connexion">
      <div className="aside-container">
      <Connexion></Connexion>
      <RandomInfos></RandomInfos>
      </div>
      <Navbar></Navbar>
    </div>
    </>
  )
}

export default App
