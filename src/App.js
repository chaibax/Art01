import React from "react";
import { useAuth0 } from "./react-auth0-wrapper";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {socket} from "./components/Socket";
import Profile from "./components/Profile";
import Paint from "./components/Paint";
import PaintDev from "./components/PaintDev";
import Start from "./components/Start";
import ExternalApi from "./components/ExternalApi";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/Home";
import View from "./components/View";
import Privacy from "./components/Privacy";
import TermsOfService from "./components/TermsOfService";
import Livestamp from 'kuende-livestamp';

import './App.sass';
import './App.css';
require('dotenv').config();

 


socket.on('newpixel', (data) => {


    document.getElementById('notif').innerHTML = '> '+data.given_name+' added pixel #'+data.newpixel.position+ ' <span data-livestamp='+data.date+'></span> '   
    console.log(data);

    
    });


function App() {
    const { loading, user, isAuthenticated } = useAuth0();

  //  console.log('>>'+process.env.REACT_APP_API_BASE_URL);
  //  socket.on('news', (data) => {
  //  console.log(data);
  //  socket.emit('my other event', { my: 'data  from front :)' });
  //  });

    if (loading) {
        return (
            <div className="pageloader is-active shadowed blackbackground">
                <span className="title">Loading Art01 App.js</span>
            </div>
        );
    }

    const NoMatch = () => (
        <h1 className="title is-size-1 has-text-centered shadowed">
            Error 404<br />page not found :(
              <br />
            <br />
            <a href="/" style={{ textDeconration: 'none', color: '#f0fff8' }}> >> go to home page</a>
        </h1>
    )
  
    return (
        
        <div className="App">
            <section className="hero is-fullheight ">
                <div className="hero-body ">
                    <div className="column is-centered is-vcentered">
                        <div className="container">
                            <BrowserRouter>
                                <Switch>
                                    <Route path="/" exact={true} component={Home} />
                                    <Route path="/start" exact={true} component={Start} />
                                    <Route path="/ExternalApi" exact={true} component={ExternalApi} />
                                    <Route path="/privacy-policy" component={Privacy} />
                                    <Route path="/terms-of-service" component={TermsOfService} />
                                    <PrivateRoute path="/profile" component={Profile} />
                                    <PrivateRoute path="/paint" component={Paint} />
                                    <PrivateRoute path="/paintdev" component={PaintDev} />
                                    <Route path="/view/:id?" component={View}  />
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
