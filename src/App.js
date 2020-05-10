import React from "react";
import { useAuth0 } from "./react-auth0-wrapper";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {socket} from "./components/Socket";
import Profile from "./components/Profile";
import Paint from "./components/Paint";
import Start from "./components/Start";
import ExternalApi from "./components/ExternalApi";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/Home";
import View from "./components/View";
import NavBar from "./components/NavBar";
import Privacy from "./components/Privacy";
import './App.sass';
import './App.css';
require('dotenv').config();


socket.on('newpixel', (data) => {
    document.getElementById('card').innerHTML = data.given_name+' added pixel #'+data.newpixel.position+ ' now';
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
            <section className="hero fullheight">
                <div className="hero-body">
                    <div className="columns is-centered">
                        <div className="container">
                            <BrowserRouter>
                                <Switch>
                                    <Route path="/" exact={true} component={Home} />
                                    <Route path="/start" exact={true} component={Start} />
                                    <Route path="/ExternalApi" exact={true} component={ExternalApi} />
                                    <Route path="/privacy-policy" component={Privacy} />

                                    <PrivateRoute path="/profile" component={Profile} />
                                    <PrivateRoute path="/paint" component={Paint} />
                                    <PrivateRoute path="/view/:id" component={View} />
                                    <Route component={NoMatch} />
                                </Switch>
                                <NavBar />
                            </BrowserRouter>
                        </div>
                    </div>
                </div>
            </section>
            <div id="card" className="auth0badge">
        <a width={150} height={50} href="https://auth0.com/?utm_source=oss&utm_medium=gp&utm_campaign=oss" target="_blank" alt="Single Sign On & Token Based Authentication - Auth0"><img width={150} height={50} alt="JWT Auth for open source projects" src="//cdn.auth0.com/oss/badges/a0-badge-dark.png" /></a>
      </div>
        </div>
    );

    // bar de navigation ici au besoin : <NavBar />
}

export default App;
