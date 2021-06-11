import React, { Fragment } from 'react'
import Typewriter from 'typewriter-effect';
import { useHistory } from "react-router-dom";
import { useAuth0 } from "../react-auth0-wrapper";
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga';


const Home = () => {
  ReactGA.initialize('UA-179027037-1');
ReactGA.pageview(window.location.pathname + window.location.search);
ReactGA.event({
  category: "user_"+window.location.hostname,
  action: "view_home",
});

  const { t } = useTranslation();
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const history = useHistory();
  if (isAuthenticated) {
    //console.log('isAuthenticated');
    //console.log(user);
    var pixel_position = user['https://art01/pixel_position'];
    //console.log('>>>' + pixel_position);

    //console.log('👉');

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
      <h1 className="title is-size-2-mobile	is-size-1-desktop	 has-text-centered shadowed">


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
              .typeString(t('first massively participatory art project'))
              .pauseFor(200)
              .typeString('<br/>')
              .pauseFor(50)
              .typeString(t('welcome back painter #') + (pixel_position+1))
              .typeString('<br/>')
              .pauseFor(50)
              .typeString('<br/>')
              .pauseFor(50)
              .typeString('>> ')
              .typeString('<a href="/share/' + (pixel_position+1) + '" style="text-deconration:none;color:#f0fff8">' + t('View paiting') + '</a>')
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
          <h1 className="title is-size-2-mobile	is-size-1-desktop		 has-text-centered shadowed">
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
                  .typeString(t('first massively participatory art project'))
                  .pauseFor(2000)
                  .typeString('<br/>')
                  .pauseFor(500)
                  .typeString('<br/>')
                  .typeString('>> ')
                  .typeString('<big>' + t('participate') + '</big>')
                  .pauseFor(9100)
                  .start();
              }}
            />
          </h1>
        </a>
        <nav className="navbar is-fixed-bottom columns  blackbackground" role="navigation" aria-label="main navigation" style={{ zIndex: 0 }}>

          
          <div  className="is-hidden-mobile	 auth0badge has-text-left-desktop has-text-centered-mobile card column blackbackground">
            <a href="https://auth0.com/?utm_source=oss&utm_medium=gp&utm_campaign=oss" target="_blank" alt="Single Sign On & Token Based Authentication - Auth0"><img width={150} height={50} alt="JWT Auth for open source projects" src="//cdn.auth0.com/oss/badges/a0-badge-dark.png" /></a>
          </div>
          
          <div  className=" has-text-centered	 shadowed  card column blackbackground ">
            
            <a className="shadowed" style={{  opacity: "0.5", fontSize: "1em" }} href="?lng=en"  alt="in english please"> En - </a>
            <a className="shadowed" style={{ opacity: "0.5", fontSize: "1em" }} href="?lng=fr" alt="en Français merci">Fr - </a>
            <a className="shadowed " style={{ opacity: "0.5", fontSize: "1em" }} href="?lng=es" alt="en Castellano porfa">Es - </a>  
            <a  className="shadowed " style={{ opacity: "1", fontSize: "1em" }} onClick={() => loginWithRedirect({ appState: { targetUrl: window.location.origin + '/paint' } })} > Login </a>
            <a className=" shadowed " style={{ opacity: "0.5", fontSize: "1em" }}  href="https://twitter.com/chaibax" target="_blank"  alt="About">- About Painter #1  </a>  
        
          </div>
          <div  className="is-hidden-mobile	  card column blackbackground has-text-right">
            <a style={{ color: "white", opacity: "0.5", fontSize: "1.8em" }} href="https://github.com/chaibax/Art01" target="_blank" alt="First massively participatory art project"><i className="fab fa-github"></i></a>
          </div>
        </nav>

      </Fragment>
    )
  }
}

export default Home