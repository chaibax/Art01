import React from "react";
import NavBar from "./components/NavBar";
import { useAuth0 } from "./react-auth0-wrapper";
import './App.css';

import { BrowserRouter, Route, Switch } from "react-router-dom";
import Profile from "./components/Profile";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/Home";


function App() {

  const { loading } = useAuth0();

  if (loading) {
    return (
      <div>Loading App.js</div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <PrivateRoute path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
