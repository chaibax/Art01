import React, { Fragment } from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import ViewColorFromIp from "./ViewColorFromIp"; // a degager
import Typewriter from 'typewriter-effect';
import { useHistory } from "react-router-dom";

function getRandomArbitrary(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const Paint = () => {


  const { getTokenSilently, loading, user } = useAuth0();
  const history = useHistory();

  function sendpixel() {
    const axios = require('axios');
    const mypixelid = document.getElementById('mypixel');
    const pixelwaitid = document.getElementById('pixelwait');
    const waittext = document.getElementById('waittext');
    const callApi = async () => {
      const token = await getTokenSilently();
      axios.interceptors.request.use(config => {
        // perform a task before the request is sent
        console.log('Request was sent...');
        mypixelid.classList.add("is-hidden");
        pixelwaitid.classList.remove("is-hidden");
        return config;
      }, error => {
        // handle the error
        return Promise.reject(error);
      });

      axios.post(process.env.REACT_APP_API_BASE_URL + '/pixels/add', {
        pixel: FirstIP,
        email: email,
        auth0Id: auth0Id,
        given_name: given_name,
        picture_large: picture_large

      }, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 10000,
      }
      )
        .then(function (response) {
          console.log(response);
          if ((response.data.position > -1) && !(process.env.REACT_APP_DEBUG_MODE == '1')) {
            console.log(response.data.position);
            history.push("/view/" + response.data.position);
          } else {
            console.log("error adding pixel :( ");
            history.push("/paint");
            pixelwaitid.classList.add("is-hidden");
            mypixelid.classList.remove("is-hidden");
          }
        })
        .catch(function (error) {
          console.log('Error calling ' + process.env.REACT_APP_API_BASE_URL + '/pixels/add');
          console.log(error);
          waittext.innerHTML = error + ' : please refresh or retry';

        })
        .then(function () {
          // always executed

          console.log('request finished');
        });

    };
    callApi();
  };


  var FirstIP = user['https://art01/FirstIP'];
  const email = user.email;
  const pixel_added = user['https://art01/pixel_added'];
  const pixel_position = user['https://art01/pixel_position'];
  const auth0Id = user['https://art01/user_id'];
  const given_name = user.given_name;
  const picture_large = user.picture;
  console.log('given_name = ' + given_name + ' picture = ' + picture_large);

  if (loading || !user) {
    return (
      <div className="pageloader is-active">
        <span className="title">Loading 1000000000.art</span>
      </div>
    );
  }


  //si le pixel a déja été déposé et qu'on est pas en mode debug, on affiche pas cette page
  if (pixel_added) {
    history.push("/view/" + pixel_position);
  }

  return (
    <h2 className="title is-size-3 has-text-centered shadowed">

      <Typewriter
        options={{
          loop: false,
          cursor: '<big>▮</big>'
        }}
        onInit={(typewriter) => {
          typewriter.typeString('<big>Hello ' + given_name + '</big>')
            .pauseFor(2)
            .pauseFor(1)
            .typeString('<br/>')
            .pauseFor(1)
            .typeString('your IP is: ' + FirstIP)
            .pauseFor(2)
            .typeString('<br/>')
            .typeString(' So, your pixel color is : ')
            .pauseFor(2)
            .callFunction(() => {
              const element = document.getElementById("mypixel");
              element.classList.remove("is-hidden");
            })
            .start();
        }}
      />

      <Fragment>
        <div id="mypixel" className="is-hidden" >
          <ViewColorFromIp ip={FirstIP} />
          <h2 onClick={sendpixel} className="title is-size-2 has-text-centered shadowed cursor has-margin-top-20">
            >> Add my pixel to the paint
               </h2>
        </div>
        <div id="pixelwait" className="is-hidden" >
          <ViewColorFromIp ip={FirstIP} />
          <h2 id="waittext" className="title is-size-2 has-text-centered shadowed has-margin-top-20">
            >> Adding pixel: please wait...
               </h2>
        </div>
      </Fragment>
    </h2>
  );
};

export default Paint;