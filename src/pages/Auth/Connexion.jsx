import React from "react"
import '../../styles/Connexion.css'
 

function Connexion() {
  // const [count, setCount] = useState(0)
//  const [selectSearch, setSelectSearch] = useState("Bands");
  return (
    <aside className="connexion-container">
        <form className="connexion-info">
            <label htmlFor="username">Username or email</label>
            <input type="text" name="username" id="username"/>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password"/>
        </form>
    </aside>
  )
}

export default Connexion
