import React, { Fragment } from 'react'
import Typewriter from 'typewriter-effect';
import { useHistory } from "react-router-dom";
import { useAuth0 } from "../react-auth0-wrapper";
import {InlineReactionButtons} from 'sharethis-reactjs';

const Home = () => {
  const { isAuthenticated, user } = useAuth0();
  const history = useHistory();
  if (isAuthenticated) {
    console.log('isAuthenticated');
    console.log(user);
    var pixel_position = user['https://art01/pixel_position'];
    console.log('>>>' + pixel_position);

    console.log('👉');

    if (pixel_position === undefined) {
      if (window.current_position) {
        pixel_position = window.current_position;
        console.log(window.current_position);
      }
    }


    document.onkeydown = function (evt) {
      evt = evt || window.event;
      if (evt.keyCode === 13) {
        history.push("/view/" + pixel_position);
      }
    };
    return (<Fragment>
      <h1 className="title is-size-1 has-text-centered shadowed">


        <Typewriter
          options={{
            loop: false,
            cursor: '<big>▮</big>',
            delay: '75'
          }}
          onInit={(typewriter) => {
            typewriter
              .typeString('<br/>')
              .typeString('<big>1000000000.art</big>')
              .typeString('<br/>')
              .pauseFor(50)
              .typeString('first massively participatory art project')
              .pauseFor(200)
              .typeString('<br/>')
              .pauseFor(50)
              .typeString('welcome back painter #' + pixel_position)
              .typeString('<br/>')
              .pauseFor(50)
              .typeString('<br/>')
              .pauseFor(50)
              .typeString('>> ')
              .typeString('<a href="/share/' + pixel_position + '" style="text-deconration:none;color:#f0fff8">' + 'View paiting' + '</a>')
              .start();
          }}
        />
      </h1>
    </Fragment>
    )
  } else {

    document.onkeydown = function (evt) {
      evt = evt || window.event;
      if (evt.keyCode === 13) {
        history.push("/start/");
      }
    };


    return (
      <Fragment>
        <a href="/start/" style={{ textDeconration: 'none', color: '#f0fff8' }}>
          <h1 className="title is-size-1 has-text-centered shadowed">
            <Typewriter
              options={{
                loop: false,
                cursor: '<big>▮</big>',
                delay: 150
              }}
              onInit={(typewriter) => {
                typewriter
                  .typeString('<br/>')
                  .typeString('<big>1000000000.art</big>')
                  .typeString('<br/>')
                  .pauseFor(250)
                  .typeString('<br/>')
                  .pauseFor(250)
                  .typeString('first massively participatory art project')
                  .pauseFor(2000)
                  .typeString('<br/>')
                  .pauseFor(500)
                  .typeString('<br/>')
                  .typeString('>> ')
                  .typeString('<big>' + 'participate' + '</big>')
                  .pauseFor(9100)
                  .start();
              }}
            />
          </h1>
        </a>
        <nav className="navbar is-fixed-bottom shadowed blackbackground" role="navigation" aria-label="main navigation" style={{ zIndex: 0 }}>
          <div id="card" className="auth0badge">
            <a href="https://auth0.com/?utm_source=oss&utm_medium=gp&utm_campaign=oss" target="_blank" alt="Single Sign On & Token Based Authentication - Auth0"><img width={150} height={50} alt="JWT Auth for open source projects" src="//cdn.auth0.com/oss/badges/a0-badge-dark.png" /></a>
          </div>
          <div id="card" className="githubbadge">
            <a style={{ color: "white", opacity: "0.5", fontSize: "1.8em" }} href="https://github.com/chaibax/Art01" target="_blank" alt="First massively participatory art project"><i className="fab fa-github"></i></a>
          </div>
        </nav>

      </Fragment>
    )
  }
}

export default Home