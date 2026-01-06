// import { useState } from 'react'

import {Routes, Route} from "react-router-dom"
function Routers() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/bands" element={<BandsList/>} />
      </Routes>
    </>
  )
}

export default Routers
