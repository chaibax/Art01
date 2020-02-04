import React from 'react'
import Typewriter from 'typewriter-effect';
import { useHistory } from "react-router-dom";



const Home = () => {

  const history = useHistory();


  document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode === 13) {
        history.push("/start");

    }
};

    return (
        <section className="hero is-large">
            <div className="hero-body">

                <div className="columns is-centered">

                    <div className="container">

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

      })
      .pauseFor(1000)
      .callFunction(() => {
        console.log('This is ART01 👋');
      })
      .typeString('<br/>')
      .pauseFor(1000)
      .typeString('<br/>first massively participatory art project')
      .pauseFor(3500)
      .typeString('<br/>')
      .pauseFor(500)
      .typeString('<br/>')
      .typeString('>> ')
      .typeString('<a href="/start" style="text-deconration:none;color:#f0fff8">'+'participate'+'</a>')
      .pauseFor(9100)
      .start();
  }}
/>
                            
                        </h1>
                    
                    </div>
                </div>
            </div>

        </section>
    )
}

export default Home