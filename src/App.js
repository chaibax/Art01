import React from "react";
import {useAuth0} from "./react-auth0-wrapper";
import './index.css';

import {BrowserRouter, Route, Switch} from "react-router-dom";
import Profile from "./components/Profile";
import Paint from "./components/Paint";
import Start from "./components/Start";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/Home";
import './App.sass';
import './App.css'; 
import NavBar from "./components/NavBar";

function App() {

    const {loading} = useAuth0();

    if (loading) {
        return (
            <div className="pageloader is-active">
                <span className="title">Loading Art01 App.js</span>
            </div>
        );
    }

    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact="exact" component={Home}/>
                    <Route path="/start" exact="exact" component={Start}/>
                    <PrivateRoute path="/profile" component={Profile} />
                    <PrivateRoute path="/paint" component={Paint}/>
                </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;
