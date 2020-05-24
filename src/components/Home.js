import React, { Fragment } from 'react'
import Typewriter from 'typewriter-effect';
import { useHistory } from "react-router-dom";
import { useAuth0 } from "../react-auth0-wrapper";

const Home = () => {
  const {isAuthenticated, loading, user} = useAuth0();


  const history = useHistory();

 

  if (isAuthenticated ) {
    console.log('isAuthenticated');
    const pixel_position  = user['https://art01/pixel_position'];
    document.onkeydown = function (evt) {
      evt = evt || window.event;
      if (evt.keyCode === 13) {
        history.push("/view/"+pixel_position);
      }
    };
    return (
       <h1 className="title is-size-1 has-text-centered shadowed">
              <Typewriter
                options={{
                  loop: false,
                  cursor: '<big>▮</big>',
                  delay: 75
                }}
                onInit={(typewriter) => {
                  typewriter.typeString('<big>ART01</big>')
                    .pauseFor(1000)
                    .callFunction(() => {
                      console.log('This is ART01 👋');
                    })
                    .typeString('<br/>')
                    .pauseFor(50)
                    .typeString('<br/>')
                    .pauseFor(50)
                    .typeString('first massively participatory art project')
                    .pauseFor(200)
                    .typeString('<br/>')
                    .pauseFor(50)
                    .typeString('<br/>')
                    .pauseFor(50)
                    .typeString('>> ')
                    .typeString('<a href="/view/' +pixel_position+ '" style="text-deconration:none;color:#f0fff8">' + 'View' + '</a>')
                    .start();
                }}
              />
            </h1>
    )
  } else {

    document.onkeydown = function (evt) {
      evt = evt || window.event;
      if (evt.keyCode === 13) {
        history.push("/start");
      }
    };
   
  
  return (
          <Fragment>
            <h1 className="title is-size-1 has-text-centered shadowed">
              <Typewriter
                options={{
                  loop: true,
                  cursor: '<big>▮</big>'
                }}
                onInit={(typewriter) => {
                  typewriter.typeString('<big>ART01</big>')
                    .pauseFor(2000)
                    .callFunction(() => {
                      console.log('This is ART01 👋');
                    })
                    .typeString('<br/>')
                    .pauseFor(500)
                    .typeString('<br/>')
                    .pauseFor(500)
                    .typeString('first massively participatory art project')
                    .pauseFor(2000)
                    .typeString('<br/>')
                    .pauseFor(500)
                    .typeString('<br/>')
                    .pauseFor(500)
                    .typeString('>> ')
                    .typeString('<a href="/start" style="text-deconration:none;color:#f0fff8">' + 'participate' + '</a>')
                    .pauseFor(9100)
                    .start();
                }}
              />
            </h1>
            <nav className="navbar is-fixed-bottom shadowed blackbackground" role="navigation" aria-label="main navigation" style={{zIndex: 0}}>
          
            <div id="card" className="auth0badge">
        <a width={150} height={50} href="https://auth0.com/?utm_source=oss&utm_medium=gp&utm_campaign=oss" target="_blank" alt="Single Sign On & Token Based Authentication - Auth0"><img width={150} height={50} alt="JWT Auth for open source projects" src="//cdn.auth0.com/oss/badges/a0-badge-dark.png" /></a>
      </div>

          
            </nav>
            </Fragment>  
  )
}
}

export default Home