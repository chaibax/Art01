import React, { Fragment } from "react";
import {useAuth0} from "../react-auth0-wrapper";
import {socket} from "./Socket";
import { useHistory } from "react-router-dom";
import socketIOClient from "socket.io-client";
var moment = require('moment');


const Start = () => {
    
const {loginWithRedirect} = useAuth0();
const history = useHistory();
const axios = require('axios');


socket.on('newpixel', (data) => {
    console.log('+1');
    });



axios.get(process.env.REACT_APP_API_BASE_URL+'/pixels/count')
  .then(function (response) {
    // handle success
    var given = moment("2020-04-01", "YYYY-MM-DD");
    var current = moment().startOf('day');
    
    //Difference in number of days
    var dif = moment.duration(given.diff(current)).asDays();
    document.getElementById("count").innerHTML=response.data.count;
    document.getElementById("since").innerHTML = moment("20200501", "YYYYMMDD").fromNow();
    let pourcentage = (response.data.count*100)/1000000000;
    document.getElementById("pourcentage").innerHTML = pourcentage.toFixed(7);

    let date_fin = ((-100*dif)/pourcentage.toFixed(7))/365;
    document.getElementById("date_fin").innerHTML = date_fin.toFixed(0);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })

document.onkeydown = function(evt) {
  evt = evt || window.event;
  if (evt.keyCode === 8) {
      history.push("/");
  }
};

    return (
     
       <Fragment>
         <div  className="cursor" onClick={() => loginWithRedirect({ appState : {targetUrl: window.location.origin+'/paint'}})}>
           <br/>
                        <h2 className="title is-size-2 has-text-centered shadowed">
                        THIS PAINTING REQUIRES A BILLION PARTICIPANTS TO BE COMPLETED

                        </h2>
                        <span className="shadowed is-size-4">
                        <p>Art01 will be a painting. Its size will be 40,000 px wide by 25,000 pixel high. That is a 1 000 000 000 pixels.</p>
                        <p>Every pixel is added by one person, you for example. When you first signs in a colored dot corresponding to your IP address is added. </p>
                        <p>It's your pixel.</p>
                        <p>For the moment, <span id='count'>0</span> people have participated to this project since its beginning, <span id='since'>0</span>. <span id="pourcentage"></span>% of the painting is complete
</p>
                        <p>At this rate, ART01 be finished in <span id="date_fin"></span> years.
</p></span>
<h2 className="title is-size-2 has-text-centered shadowed cursor has-margin-top-20" onClick={() => loginWithRedirect({ appState : {targetUrl: window.location.origin+'/paint'}})}>
<big> Participate</big><big className="blink">▮</big>

                 </h2>
                 </div>
                 </Fragment>
  
    );
};

export default Start;
