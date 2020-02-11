import React, { Fragment } from "react";
import {useAuth0} from "../react-auth0-wrapper";
import { useHistory } from "react-router-dom";


const Start = () => {
    
const {loginWithRedirect} = useAuth0();
const history = useHistory();

document.onkeydown = function(evt) {
  evt = evt || window.event;
  if (evt.keyCode === 8) {
      history.push("/");
  }
};
const os = require("os");
var  hostname = os.hostname();
if (hostname === 'localhost') {
    hostname = 'localhost:3000';
} 

console.log('hostname ='+hostname);

    return (
     
       <Fragment>
                        <h2 className="title is-size-2 has-text-centered shadowed">
                        THIS PAINTING REQUIRES A BILLION PARTICIPANTS TO BE COMPLETED

                        </h2>
                        <span className="shadowed">
                        <p>Art01 will be a painting having for size: 40,000 pixels wide and 25,000 pixels high.</p>
                        <p>Every pixel is added by one person, you for example. When you first signs in a colored dot corresponding to your IP address is added. </p>
                        <p>It's your pixel.</p>
                        <p>For the moment, -O- people have participated to this project since its beginning, 99999 days ago. 0.000000000% of the painting is complete
</p>
                        <p>At this rate, ART01 will never be finished.
</p></span>
<h2 className="title is-size-2 has-text-centered shadowed cursor has-margin-top-20" onClick={() => loginWithRedirect({ appState : {targetUrl: 'http://'+hostname+'/paint'}})}>
                        >> Participate
                 </h2>
        
                 </Fragment>
  
    );
};

export default Start;
