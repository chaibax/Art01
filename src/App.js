import React from "react";
import { useAuth0 } from "./react-auth0-wrapper";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
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
import Tmp from "./components/Tmp";
import TermsOfService from "./components/TermsOfService";
import './App2.sass';
import './App2.css';
import ReactGA from 'react-ga';
import Participate from "./components/Participate";

require('dotenv').config();


socket.on('newpixel', (data) => {

    const opacity = Math.round((data.newpixel.alpha / 255) * 100) / 100;
    document.getElementById('notif').innerHTML = '> ' + data.given_name + ' is the last participant (#' + data.newpixel.position + ' ) '
});



function App() {
    const { loading } = useAuth0();
    ReactGA.initialize('UA-179027037-1');
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
                                <Route path='/' exact={true}  component={() => { 
     window.location.href = '/participatory-art.html'; 
     return null;
}}/>

<Route path='/merci/:id?' exact={false}  component={(req) => { 
    
    //console.log(req.match.params.id);
    if(req.match.params.id) {
     window.location.href = '/merci.html?painter='+req.match.params.id;  }
     else {
        window.location.href = '/merci.html';
     }
     return null;
}}/>

                                    <Route path="/start" exact={false} component={Start} />
                                    <Route path="/ExternalApi" exact={true} component={ExternalApi} />
                                    <Route path="/privacy-policy" component={Privacy} />
                                    <Route path="/terms-of-service" component={TermsOfService} />
                                    <PrivateRoute path="/profile" component={Profile} />
                                    <PrivateRoute path="/paint" component={Paint} />
                                    <PrivateRoute path="/participate" component={Participate} />
                                    <PrivateRoute path="/paintdev" component={PaintDev} />
                                    <Route path="/tmp" component={Tmp} />
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
