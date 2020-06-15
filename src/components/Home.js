import React, { Fragment } from 'react'
import Typewriter from 'typewriter-effect';
import { useHistory } from "react-router-dom";
import { useAuth0 } from "../react-auth0-wrapper";

const Home = () => {
  const {isAuthenticated, user} = useAuth0();
  const history = useHistory();
  if (isAuthenticated ) {
    console.log('isAuthenticated');
    console.log(user);
    const pixel_position  = user['https://art01/pixel_position'];
    document.onkeydown = function (evt) {
      evt = evt || window.event;
      if (evt.keyCode === 13) {
        history.push("/view/"+pixel_position);
      }
    };
    return (          <Fragment>
       <h1 className="title is-size-1 has-text-centered shadowed">

1000000000.art</h1><h2 className="title is-size-2 has-text-centered shadowed">
              <Typewriter
                options={{
                  loop: false,
                  cursor: '<big>▮</big>',
                  delay: 75
                }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString('<br/>')
                    .pauseFor(50)
                    .typeString('first massively participatory art project')
                    .pauseFor(200)
                    .typeString('<br/>')
                    .pauseFor(50)
                    .typeString('welcome back painter')
                    .typeString('<br/>')
                    .pauseFor(50)
                    .typeString('<br/>')
                    .pauseFor(50)
                    .typeString('>> ')
                    .typeString('<a href="/view/' +pixel_position+ '" style="text-deconration:none;color:#f0fff8">' + 'View paiting' + '</a>')
                    .start();
                }}
              />
            </h2>
            </Fragment>
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
             <a href="/start" style={{ textDeconration: 'none', color: '#f0fff8' }}>
            <h1 className="title is-size-1 has-text-centered shadowed">
              <Typewriter
                options={{
                  loop: false,
                  cursor: '<big>▮</big>'
                }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString('<br/>')
                    .typeString('<big><a href="/start" style="text-deconration:none;color:#f0fff8">1000000000.art</big></a>')
                    .typeString('<br/>')
                    .typeString('<br/>')
                    .pauseFor(100)
                    .typeString('<a href="/start" style="text-deconration:none;color:#f0fff8">first massively participatory art project</a>')
                    .pauseFor(2000)
                    .typeString('<br/>')
                    .pauseFor(500)
                    .typeString('<br/>')
                    .typeString('>> ')
                    .typeString('<a href="/start" style="text-deconration:none;color:#f0fff8"><big>' + 'participate' + '</big></a>')
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
            </a>
            </Fragment>  
  )
}
}

export default Home