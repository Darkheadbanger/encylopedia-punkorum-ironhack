// import { useState } from 'react'
import Navbar from "./components/Navbar.jsx"
import Connexion from "./components/Connexion.jsx"

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <div header className="header-connexion">
      <Connexion></Connexion>
      <Navbar></Navbar>
    </div>
    </>
  )
}

export default App
