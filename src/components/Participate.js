import React, { Fragment } from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import ViewColorFromIp from "./ViewColorFromIp"; // a degager
import Typewriter from 'typewriter-effect';
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga';




const Participate = () => {
  ReactGA.initialize('UA-179027037-1');
  ReactGA.pageview(window.location.pathname + window.location.search);
  ReactGA.event({
    category: "user_"+window.location.hostname,
    action: "view_participate",
  });
  const { t, i18n } = useTranslation();
  const { getTokenSilently, loading, user } = useAuth0();
  const history = useHistory();

  function sendpixel() {
    const axios = require('axios');
    const mypixelid = document.getElementById('mypixel');
    const pixelwaitid = document.getElementById('pixelwait');
    const waittext = document.getElementById('waittext');
    const addpixelid = document.getElementById('addpixel');
    const callApi = async () => {
      const token = await getTokenSilently();
      axios.interceptors.request.use(config => {
        // perform a task before the request is sent
        console.log('Request was sent...');
        addpixelid.classList.add("is-hidden");
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
          if (response.data.position > -1) {
            console.log(response.data.position);
            //history.push("/view/" + response.data.position);
             history.push("/merci/" + (response.data.position));

          } else {
            console.log("error adding pixel :( ");
            history.push("/participate");
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
  var given_name = user.given_name;
  if (given_name === undefined) { given_name = user.nickname }
  const picture_large = user.picture;
console.log('picture_large = '+picture_large);

  const color = FirstIP.split('.');
  const red = color[0];
  const green = color[1];
  const blue = color[2];
  const opacity = Math.round((color[3] / 255) * 100) / 100;
  const opct = color[3];


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

   //history.push("/merci.html?painter=" + (pixel_position));
   history.push("/merci/" + (pixel_position)+"&reconnected=1");
  }

  return (
    <h2 className="title is-size-4-mobile	is-size-3-desktop  has-text-centered shadowed cursor" onClick={sendpixel}  >
        <big>{t('Hello')} {given_name} </big><br/>

        {t('Do you want to share your profile picture, ip address, first name or nickname with artists?')}
      

      <Fragment>
        <div id="mypixel" >
       
          <img src={user.picture} style={{  height: "22vmin", width: "22vmin" }}  alt="Profile"/> <br/>
        </div>
        <div id="addpixel" className="" >
          <h2 className="title is-size-2 has-text-centered shadowed cursor has-margin-top-20">
          <a id="participatebutton" className="button is-large is-outlined">  {t('Yes I want to participate')} </a><br/>
        
          </h2>
        </div>

        <div id="pixelwait" className="is-hidden" >
        <img src={user.picture} style={{  height: "22vmin", width: "22vmin" }}  alt="Profile"/> <br/>

          <h2 id="waittext" className="title is-size-2 has-text-centered shadowed has-margin-top-20">
          <a id="participatebutton" className="button is-large is-outlined"> {t('Adding pixel: please wait...')} </a><br/>
           
               </h2>
        </div>
      </Fragment>
    </h2>
  );
};

export default Participate;