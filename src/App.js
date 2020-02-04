import React from "react";
import {useAuth0} from "./react-auth0-wrapper";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Profile from "./components/Profile";
import Paint from "./components/Paint";
import Start from "./components/Start";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/Home";
import './App.sass';
import './App.css'; 

function App() {

    const {loading} = useAuth0();

    if (loading) {
        return (
            <div className="pageloader is-active shadowed blackbackground">
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
