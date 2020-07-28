import React from "react";
import { useAuth0 } from "./react-auth0-wrapper";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { socket } from "./components/Socket";
import Profile from "./components/Profile";
import Paint from "./components/Paint";
import PaintDev from "./components/PaintDev";
import Start from "./components/Start";
import ExternalApi from "./components/ExternalApi";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/Home";
import View from "./components/View";
import Privacy from "./components/Privacy";
import Share from "./components/Share";
import About from "./components/About";
import TermsOfService from "./components/TermsOfService";
import './App.sass';
import './App.css';
require('dotenv').config();


socket.on('newpixel', (data) => {

    const opacity = Math.round((data.newpixel.alpha / 255) * 100) / 100;
    document.getElementById('notif').innerHTML = '> ' + data.given_name + ' added pixel #' + data.newpixel.position + ' <span style=""><span style="background-color:rgba(255, 255, 255, 1);color:rgba(' + data.newpixel.r + ', ' + data.newpixel.g + ', ' + data.newpixel.b + ', ' + opacity + ')">█</span> </span><span data-livestamp=' + data.date + '></span> '
});


function App() {
    const { loading } = useAuth0();

    if (loading) {
        return (
            <div className="pageloader is-active shadowed blackbackground">
                <span className="title">Loading 1000000000.art App.js</span>
            </div>
        );
    }

    const NoMatch = () => (
        <h1 className="title is-size-1 has-text-centered shadowed">
            Error 404<br />page not found :(
            <br />
            <br />
            <a href="/" style={{ textDeconration: 'none', color: '#f0fff8' }}>  go to home page</a>
        </h1>
    )


    return (

        <div className="App">
            <section className=" is-fullheight ">
                <div className=" ">
                    <div className="container">
                        <div className="column is-centered">
                            <BrowserRouter>
                                <Switch>
                                    <Route path="/" exact={true} component={Home} />
                                    <Route path="/start" exact={false} component={Start} />
                                    <Route path="/ExternalApi" exact={true} component={ExternalApi} />
                                    <Route path="/privacy-policy" component={Privacy} />
                                    <Route path="/terms-of-service" component={TermsOfService} />
                                    <PrivateRoute path="/profile" component={Profile} />
                                    <PrivateRoute path="/paint" component={Paint} />
                                    <PrivateRoute path="/paintdev" component={PaintDev} />
                                    <Route path="/view/:id?" component={View} />
                                    <PrivateRoute path="/share/:id?" component={Share} />
                                    <Route path="/about" component={About} />

                                    <Route component={NoMatch} />
                                </Switch>
                            </BrowserRouter>
                        </div>
                    </div>
                </div>
                <div id="notif" className="has-margin-left-5"></div>
            </section>

        </div>
    );

    // bar de navigation ici au besoin : <NavBar />
}

export default App;
