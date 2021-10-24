import './App.css';
import React, {useState, useEffect} from "react";
import Home from "./Home"
import {auth, provider} from "./firebase"
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

function App() {
  const [login, setLogin] = useState(null); // estado persistente

  useEffect(()=>{
    // Sistema de login persistente
    auth.onAuthStateChanged((val)=>{
      if(val){
        setLogin({
          nome: val.displayName,
          email: val.email,
          imagem: val.photoURL,
          uid:val.uid
        })
      };
    })
  }, [])


  function HandleLogin(e){
    e.preventDefault();
    auth.signInWithPopup(provider)
    .then((result)=>{
      if(result){
        setLogin(result.user.email)
        console.log(result.user.email)
      }
    })
}

  return (
    <div className="App">
      {(login)?(
            <Router>
              <Switch>

                <Route path="/home">
                  <Home login={login}/>
                </Route>
                <Route path="/">
                  <Home login={login}/>
                </Route>
              </Switch>
            </Router>
            ):
            <div><a onClick={(e)=>HandleLogin(e)} href="#">Fazer login</a></div>
            }
    </div>
  );
}

export default App;
