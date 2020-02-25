import React from 'react'
import Typewriter from 'typewriter-effect';
import { useHistory } from "react-router-dom";
import { useAuth0 } from "../react-auth0-wrapper";

const Home = () => {
  const isAuthenticated = useAuth0();
  const history = useHistory();

  document.onkeydown = function (evt) {
    evt = evt || window.event;
    if (evt.keyCode === 13) {
      history.push("/start");
    }
  };

  if (isAuthenticated) {
    //history.push("/paint");
    console.log('isAuthenticated > Paint !');
  }

  return (

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
         
  )
}

export default Home