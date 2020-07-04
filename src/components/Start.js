import React, { Fragment } from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import { socket } from "./Socket";
import { useHistory } from "react-router-dom";
import Typewriter from 'typewriter-effect';

var moment = require('moment');


const Start = () => {

  const { loginWithRedirect } = useAuth0();
  const history = useHistory();
  const axios = require('axios');
  socket.on('newpixel', (data) => {
    console.log('+1');
  });

  var count2 = 0;

  axios.get(process.env.REACT_APP_API_BASE_URL + '/pixels/count')
    .then(function (response) {
      // handle success
      var given = moment("2020-04-01", "YYYY-MM-DD");
      var current = moment().startOf('day');
      //Difference in number of days
      var dif = moment.duration(given.diff(current)).asDays();
      count2 = response.data.count;

      document.getElementById("count").innerHTML = response.data.count;
      document.getElementById("since").innerHTML = moment("20200501", "YYYYMMDD").fromNow();
      let pourcentage = (response.data.count * 100) / 1000000000;
      document.getElementById("pourcentage").innerHTML = pourcentage.toFixed(7);

      let date_fin = ((-100 * dif) / pourcentage.toFixed(7)) / 365;
      document.getElementById("date_fin").innerHTML = date_fin.toFixed(0);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })

  document.onkeydown = function (evt) {
    evt = evt || window.event;
    if (evt.keyCode === 8) {
      history.push("/");
    }
  };

  return (
    <Fragment>
      <div className="cursor" onClick={() => loginWithRedirect({ appState: { targetUrl: window.location.origin + '/paint' } })}>
        <span className="shadowed is-size-4">
          <Typewriter
            options={{
              loop: false,
              initialText: 'toto',
              cursor: '<big id="curs">▮</big>',
              delay: 120
            }}
            onInit={(typewriter) => {
              typewriter.typeString('<big>LET\'S CREATE TOGETHER A PAINTING THAT NEEDS A BILLION PARTICIPANTS TO BE FINISHED</big>')
                .pauseFor(4000)
                .deleteChars(27)
                .typeString('<big>COLORED DOT</big>')
                .pauseFor(1000)
                .deleteChars(11)
                .typeString('<big>PIXEL TO BE COMPLETED</big>')
                .pauseFor(1000)
                .typeString('<br/>')
                .pauseFor(500)
                .pauseFor(500)
                .changeDelay(90)
                .typeString('Every colored dot (pixel) is added by one person, you for example. When you first signs in, a colored dot corresponding to your Internet address is added to the painting. ')
                .typeString('<br/>')
                .pauseFor(500)
                .typeString('It\'s your pixel.')
                .pauseFor(500)
                .deleteChars(6)
                .typeString('contribution.')
                .pauseFor(1500)
                .typeString('<br/>')
                .pauseFor(1000)
                .changeDeleteSpeed(10)
                .deleteChars(194)
                .callFunction(() => {
                  const nexttext = document.getElementById("nexttext");
                  const curs = document.getElementById("curs");
                  nexttext.classList.remove("is-hidden");
                  curs.classList.add("is-hidden");
                })
                .start()
            }}
          />

        </span>
        <div className="is-hidden" id="nexttext">

          <span className="shadowed is-size-4 ">
            <p>For the moment, <span id='count'>0</span> people have participated to this project since its beginning, <span id='since'>0</span>. <span id="pourcentage"></span>% of the painting is complete
</p>
            <p>At this rate, ART01 be finished in <span id="date_fin"></span> years.
</p></span>
          <h2 className="title is-size-2 has-text-centered shadowed cursor has-margin-top-20" onClick={() => loginWithRedirect({ appState: { targetUrl: window.location.origin + '/paint' } })}>
            <br /><big>  {'>>'} Participate</big><big className="blink">▮</big>

          </h2>
        </div>
      </div>
    </Fragment>

  );
};

export default Start;
